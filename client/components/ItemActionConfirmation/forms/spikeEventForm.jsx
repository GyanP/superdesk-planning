import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import '../style.scss';
import {UpdateMethodSelection} from '../UpdateMethodSelection';
import {RelatedEvents} from '../../index';
import {EventScheduleSummary, EventUpdateMethods} from '../../Events';
import {getDateFormat, getTimeFormat} from '../../../selectors/config';
import {get} from 'lodash';
import {eventUtils, gettext} from '../../../utils';
import {Row} from '../../UI/Preview';

export class SpikeEventComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventUpdateMethod: EventUpdateMethods[0],
            relatedEvents: [],
            relatedPlannings: [],
        };

        this.onEventUpdateMethodChange = this.onEventUpdateMethodChange.bind(this);
    }

    componentWillMount() {
        const event = eventUtils.getRelatedEventsForRecurringEvent(
            this.props.original,
            EventUpdateMethods[0]
        );

        this.setState({
            relatedEvents: event._events,
            relatedPlannings: event._relatedPlannings.filter((p) => !p.pubstatus),
        });

        // Enable save so that the user can action on this event.
        this.props.enableSaveInModal();
    }

    onEventUpdateMethodChange(field, option) {
        const event = eventUtils.getRelatedEventsForRecurringEvent(
            this.props.original,
            option
        );

        this.setState({
            eventUpdateMethod: option,
            relatedEvents: event._events,
            relatedPlannings: event._relatedPlannings.filter((p) => !p.pubstatus),
        });
    }

    submit() {
        return this.props.onSubmit({
            ...this.props.original,
            update_method: this.state.eventUpdateMethod,
        });
    }

    render() {
        const {original, dateFormat, timeFormat, submitting} = this.props;
        const isRecurring = !!original.recurrence_id;
        const eventsInUse = this.state.relatedEvents.filter((e) => (
            get(e, 'planning_ids.length', 0) > 0 || 'pubstatus' in e
        ));
        const numEvents = this.state.relatedEvents.length + 1 - eventsInUse.length;

        return (
            <div className="MetadataView">
                <Row
                    enabled={!!original.slugline}
                    label={gettext('Slugline')}
                    value={original.slugline || ''}
                    className="slugline"
                    noPadding={true}
                />

                <Row
                    label={gettext('Name')}
                    value={original.name || ''}
                    className="strong"
                    noPadding={true}
                />

                <EventScheduleSummary
                    schedule={original.dates}
                    timeFormat={timeFormat}
                    dateFormat={dateFormat}
                />

                <Row
                    enabled={isRecurring}
                    label={gettext('No. of Events')}
                    value={numEvents}
                    noPadding={true}
                />

                <UpdateMethodSelection
                    value={this.state.eventUpdateMethod}
                    onChange={this.onEventUpdateMethodChange}
                    showMethodSelection={isRecurring}
                    updateMethodLabel={gettext('Spike all recurring events or just this one?')}
                    showSpace={false}
                    readOnly={submitting}
                    action="spike"
                    relatedPlannings={this.state.relatedPlannings} />

                {eventsInUse.length > 0 &&
                    <div className="sd-alert sd-alert--hollow sd-alert--alert sd-alert--flex-direction">
                        <strong>{gettext('The following Events are in use and will not be spiked:')}</strong>
                        <RelatedEvents
                            events={eventsInUse}
                            dateFormat={dateFormat}
                        />
                    </div>
                }
            </div>
        );
    }
}

SpikeEventComponent.propTypes = {
    original: PropTypes.object.isRequired,
    dateFormat: PropTypes.string,
    timeFormat: PropTypes.string,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func,
    enableSaveInModal: PropTypes.func,
};


const mapStateToProps = (state) => ({
    timeFormat: getTimeFormat(state),
    dateFormat: getDateFormat(state),
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (event) => dispatch(actions.events.ui.spike(event)),
    onHide: (event, modalProps) => {
        if (get(modalProps, 'onCloseModal')) {
            modalProps.onCloseModal(event);
        }
        return Promise.resolve(event);
    },
});

export const SpikeEventForm = connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {withRef: true})(SpikeEventComponent);
