import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash';
import {StateLabel} from '../..';
import {EventScheduleSummary} from '../';
import {ItemIcon} from '../../index';
import {Item, Column, Row, ActionMenu, Border} from '../../UI/List';
import {Row as PreviewRow} from '../../UI/Preview';
import {CollapseBox} from '../../UI/CollapseBox';
import {eventUtils, gettext, onEventCapture} from '../../../utils';
import {Location} from '../../Location';

export const EventMetadata = (
    {
        event,
        dateFormat,
        timeFormat,
        dateOnly,
        scrollInView,
        tabEnabled,
        streetMapUrl,
        lockedItems,
        onEditEvent
    }
) => {
    const dateStr = eventUtils.getDateStringForEvent(event, dateFormat, timeFormat, dateOnly);
    const isItemLocked = eventUtils.isEventLocked(event, lockedItems);
    const editEventComponent = onEditEvent ?
        (<button data-sd-tooltip="Edit Event"
            data-flow="left"
            onClick={(event) => {
                onEventCapture(event);
                onEditEvent();
            }}>
            <icon className="icon-pencil" />
        </button>) : null;

    const eventListView = (
        <Item noBg={true}>
            {isItemLocked && <Border state="locked" />}
            <div className="sd-list-item__border" />
            <Column><ItemIcon item={event} /></Column>
            <Column grow={true} border={false}>
                <Row>
                    <StateLabel item={event} verbose={true}/>
                    <span className="sd-overflow-ellipsis sd-list-item--element-grow">
                        <span className="sd-list-item__text-strong">{event.name}</span>
                    </span>
                    <time>{dateStr}</time>
                </Row>
            </Column>
            {editEventComponent && <ActionMenu>{editEventComponent}</ActionMenu>}
        </Item>
    );

    const eventInDetailTopBar = (
        <Item noBg={true} noHover={true}>
            <Column border={false}>
                <ItemIcon item={event} big={true} />
            </Column>
            <Column border={false} grow={true}>
                {get(event, 'location.name') ? (
                    <div>
                        <Row>
                            <span className="sd-overflow-ellipsis sd-list-item--element-grow">
                                <span className="sd-list-item__text-strong">{event.name}</span>
                            </span>
                        </Row>
                        <Row>
                            <span className="sd-overflow-ellipsis sd-list-item--element-grow">
                                <Location
                                    name={get(event, 'location.name')}
                                    address={get(event, 'location.formatted_address')}
                                    mapUrl={streetMapUrl}
                                />
                            </span>
                            <time>{dateStr}</time>
                        </Row>
                    </div>
                ) : (
                    <Row>
                        <span className="sd-overflow-ellipsis sd-list-item--element-grow">
                            <span className="sd-list-item__text-strong">{event.name}</span>
                        </span>
                        <time>{dateStr}</time>
                    </Row>
                )}
            </Column>
        </Item>
    );

    const eventInDetail = (
        <div>
            <PreviewRow>
                <StateLabel item={event} verbose={true}/>
            </PreviewRow>
            <PreviewRow label={gettext('Name')} value={event.name} />
            <EventScheduleSummary schedule={event.dates}
                dateFormat={dateFormat}
                timeFormat={timeFormat} />
            <PreviewRow label={gettext('Location')}>
                <div>
                    <Location
                        name={get(event, 'location.name')}
                        address={get(event, 'location.formatted_address')}
                        multiLine={true}
                    />
                </div>
            </PreviewRow>
            <PreviewRow label={gettext('Occurrence Status')}
                value={get(event, 'occur_status.name', '')} />
            <PreviewRow label={gettext('Description')}
                value={event.definition_short || ''} />
        </div>
    );

    return (<CollapseBox
        collapsedItem={eventListView}
        openItemTopBar={eventInDetailTopBar}
        openItem={eventInDetail}
        scrollInView={scrollInView}
        tabEnabled={tabEnabled}
        tools={editEventComponent}
    />);
};

EventMetadata.propTypes = {
    event: PropTypes.object,
    dateOnly: PropTypes.bool,
    dateFormat: PropTypes.string,
    timeFormat: PropTypes.string,
    scrollInView: PropTypes.bool,
    tabEnabled: PropTypes.bool,
    streetMapUrl: PropTypes.string,
    onEditEvent: PropTypes.func,
    lockedItems: PropTypes.object,
};


EventMetadata.defaultProps = {
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    scrollInView: true,
};
