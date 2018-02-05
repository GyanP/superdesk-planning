# -*- coding: utf-8; -*-
#
# This file is part of Superdesk.
#
# Copyright 2013, 2014, 2015, 2016, 2017, 2018 Sourcefabric z.u. and contributors.
#
# For the full copyright and license information, please see the
# AUTHORS and LICENSE files distributed with this source code, or
# at https://www.sourcefabric.org/superdesk/license

from superdesk.errors import SuperdeskApiError
from superdesk.services import BaseService
from superdesk.notification import push_notification
from superdesk.utc import utcnow
from apps.auth import get_user_id
from apps.archive.common import get_auth

from planning.common import UPDATE_SINGLE
from planning.item_lock import LOCK_USER, LOCK_SESSION, LOCK_ACTION

from eve.utils import config, ParsedRequest
from flask import json


class EventsBaseService(BaseService):
    """
    Base class for Event action endpoints

    Provides common functionality to be used for event actions.
    Implement `update_single_event` and `update_recurring_events` based on the
    type of event that is being actioned against.
    """

    ACTION = ''

    def on_update(self, updates, original):
        """
        Process the action on the event provided

        Automatically sets the `version_creator`, then calls the appropriate method
        for single event (`update_single_event`) or a series of events (`update_recurring_events`)
        """
        user_id = get_user_id()
        if user_id:
            updates['version_creator'] = user_id

        # If `skip_on_update` is provided in the updates
        # Then return here so no further processing is performed on this event.
        if 'skip_on_update' in updates:
            return

        # We only validate the original event,
        # not the events that are automatically updated by the system
        self._validate(updates, original)

        # Run the specific method based on if the original is a single or a series of recurring events
        # Or if the 'update_method' is 'UPDATE_SINGLE'
        update_method = updates.pop('update_method', UPDATE_SINGLE)
        if not original.get('dates', {}).get('recurring_rule', None) or update_method == UPDATE_SINGLE:
            self.update_single_event(updates, original)
        else:
            self.update_recurring_events(updates, original, update_method)

    def update(self, id, updates, original):
        """
        Save the changes to the backend.

        If `_deleted` is in the updates, then don't save the changes for this item.
        This is used when updating a series of events where the selected Event is
        deleted and a new series is generated
        """
        # If this Event has been deleted, then do not perform the update
        if '_deleted' in updates:
            return

        updates.pop('skip_on_update', None)
        return self.backend.update(self.datasource, id, updates, original)

    def on_updated(self, updates, original):
        # Because we require the original item being actioned against to be locked
        # then we can check the lock information of original and updates to check if this
        # event was the original event.
        if original.get('lock_user') and 'lock_user' in updates and updates.get('lock_user') is None:
            # when the event is unlocked by the patch.
            push_notification(
                'events:unlock',
                item=str(original.get(config.ID_FIELD)),
                user=str(get_user_id()),
                lock_session=str(get_auth().get('_id')),
                etag=updates.get('_etag')
            )

            self.push_notification(
                self.ACTION,
                updates,
                original
            )

    def update_single_event(self, updates, original):
        raise NotImplementedError('BaseService._update_single_event not implemented')

    def update_recurring_events(self, updates, original, update_method):
        raise NotImplementedError('BaseService._update_recurring_events not implemented')

    def _validate(self, updates, original):
        """
        Generic validation for event actions

        A lock must be held by the user in their current session
        As well as the lock must solely be for the action being processed,
        i.e. lock_action='update_time'
        """
        if not original:
            raise SuperdeskApiError.notFoundError()

        user_id = get_user_id()
        session_id = get_auth().get(config.ID_FIELD, None)

        lock_user = original.get(LOCK_USER, None)
        lock_session = original.get(LOCK_SESSION, None)
        lock_action = original.get(LOCK_ACTION, None)

        if not lock_user:
            raise SuperdeskApiError.forbiddenError(message='The event must be locked')
        elif str(lock_user) != str(user_id):
            raise SuperdeskApiError.forbiddenError(message='The event is locked by another user')
        elif str(lock_session) != str(session_id):
            raise SuperdeskApiError.forbiddenError(message='The event is locked by you in another session')
        elif str(lock_action) != self.ACTION:
            raise SuperdeskApiError.forbiddenError(
                message='The lock must be for the `{}` action'.format(self.ACTION.lower().replace('_', ' '))
            )

    @staticmethod
    def set_planning_schedule(event):
        if event and event.get('dates') and event['dates'].get('start'):
            event['_planning_schedule'] = [
                {'scheduled': event['dates']['start']}
            ]

    @staticmethod
    def push_notification(name, updates, original):
        session = get_auth().get(config.ID_FIELD, '')

        data = {
            'item': str(original.get(config.ID_FIELD)),
            'user': str(updates.get('version_creator', '')),
            'session': str(session)
        }

        if original.get('dates', {}).get('recurring_rule', None):
            data['recurrence_id'] = str(updates.get('recurrence_id', original.get('recurrence_id', '')))
            name += ':recurring'

        push_notification(
            'events:' + name,
            **data
        )

    def get_recurring_timeline(self, selected):
        """Utility method to get all events in the series

        This splits up the series of events into 3 separate arrays.
        Historic: event.dates.start < utcnow()
        Past: utcnow() < event.dates.start < selected.dates.start
        Future: event.dates.start > selected.dates.start
        """
        historic = []
        past = []
        future = []

        selected_start = selected.get('dates', {}).get('start', utcnow())

        req = ParsedRequest()
        req.sort = '[("dates.start", 1)]'
        req.where = json.dumps({
            '$and': [
                {'recurrence_id': selected['recurrence_id']},
                {'_id': {'$ne': selected[config.ID_FIELD]}}
            ]
        })

        for event in list(self.get_from_mongo(req, {})):
            end = event['dates']['end']
            start = event['dates']['start']
            if end < utcnow():
                historic.append(event)
            elif start < selected_start:
                past.append(event)
            elif start > selected_start:
                future.append(event)

        return historic, past, future
