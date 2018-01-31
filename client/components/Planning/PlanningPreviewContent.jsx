import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {gettext, getCreator, getItemInArrayById} from '../../utils';
import * as selectors from '../../selectors';
import * as actions from '../../actions';
import {get} from 'lodash';
import {Row} from '../UI/Preview';
import {
    AuditInformation,
    StateLabel
} from '../index';
import {ToggleBox} from '../UI';
import {ColouredValueInput} from '../UI/Form';
import {CoveragePreview} from '../Coverages';
import {ContentBlock} from '../UI/SidePanel';
import {EventMetadata} from '../Events';

export class PlanningPreviewContentComponent extends React.Component {
    render() {
        const {item,
            users,
            formProfile,
            agendas,
            event,
            dateFormat,
            timeFormat,
            desks,
            newsCoverageStatus,
            urgencies,
        } = this.props;
        const createdBy = getCreator(item, 'original_creator', users);
        const updatedBy = getCreator(item, 'version_creator', users);
        const creationDate = get(item, '_created');
        const updatedDate = get(item, '_updated');
        const versionCreator = get(updatedBy, 'display_name') ? updatedBy :
            users.find((user) => user._id === updatedBy);

        const agendaText = get(item, 'agendas.length', 0) === 0 ? '' :
            item.agendas.map((a) => getItemInArrayById(agendas, a).name).join(', ');
        const categoryText = get(item, 'anpa_category.length', 0) === 0 ? '' :
            item.anpa_category.map((c) => c.name).join(', ');
        const subjectText = get(item, 'subject.length', 0) === 0 ? '' :
            item.subject.map((s) => s.name).join(', ');

        const hasCoverage = get(item, 'coverages.length', 0) > 0;
        const urgency = getItemInArrayById(urgencies, item.urgency, 'qcode');

        return (
            <ContentBlock>
                <div className="side-panel__content-block--flex">
                    <div className="side-panel__content-block-inner side-panel__content-block-inner--grow">
                        <AuditInformation
                            createdBy={createdBy}
                            updatedBy={versionCreator}
                            createdAt={creationDate}
                            updatedAt={updatedDate}
                        />
                    </div>
                    <div className="side-panel__content-block-inner side-panel__content-block-inner--right">
                        <StateLabel item={item} verbose={true}/>
                    </div>
                </div>
                {get(formProfile, 'planning.editor.slugline.enabled') && <Row
                    label={gettext('Slugline')}
                    value={item.slugline || ''}
                    className="slugline"
                />}
                {get(formProfile, 'planning.editor.description_text.enabled') && <Row
                    label={gettext('Description')}
                    value={item.description_text || ''}
                />}
                {get(formProfile, 'planning.editor.internal_note.enabled') && <Row
                    label={gettext('Internal Note')}
                    value={item.internal_note || ''}
                />}
                {get(formProfile, 'planning.editor.agendas.enabled') && <Row
                    label={gettext('Agenda')}
                    value={agendaText}
                />}
                <ToggleBox title={gettext('Details')} isOpen={false}>
                    {get(formProfile, 'planning.editor.ednote.enabled') && <Row
                        label={gettext('Ed Note')}
                        value={item.ednote || ''}
                    />}
                    {get(formProfile, 'planning.editor.anpa_category.enabled') && <Row
                        label={gettext('Category')}
                        value={categoryText || ''}
                    />}
                    {get(formProfile, 'planning.editor.subject.enabled') && <Row
                        label={gettext('Subject')}
                        value={subjectText || ''}
                    />}
                    {get(formProfile, 'planning.editor.urgency.enabled') &&
                    <Row>
                        <ColouredValueInput
                            value={urgency}
                            label="Urgency"
                            iconName="urgency-label"
                            readOnly={true}
                            options={urgencies}
                            row={true}
                            borderBottom={false}
                        />

                    </Row>}
                    {get(formProfile, 'planning.editor.flags') &&
                        get(item, 'flags.marked_for_not_publication', false) && <Row>
                            <span className="state-label not-for-publication">{gettext('Not for Publication')}</span>
                        </Row>}
                </ToggleBox>
                {event && <h3 className="side-panel__heading--big">{gettext('Associated Event')}</h3>}
                {event && <EventMetadata event={event}
                    dateFormat={dateFormat}
                    timeFormat={timeFormat}
                    dateOnly={true}
                />}
                {hasCoverage &&
                    (<h3 className="side-panel__heading--big">{gettext('Coverages')}</h3>)}
                {hasCoverage && (
                    item.coverages.map((c, index) => <CoveragePreview
                        key={index}
                        coverage={c}
                        users= {users}
                        desks= {desks}
                        newsCoverageStatus={newsCoverageStatus}
                        dateFormat={dateFormat}
                        timeFormat={timeFormat}
                        formProfile={formProfile.coverage} />)
                )}
            </ContentBlock>
        );
    }
}

PlanningPreviewContentComponent.propTypes = {
    item: PropTypes.object,
    users: PropTypes.array,
    desks: PropTypes.array,
    agendas: PropTypes.array,
    session: PropTypes.object,
    lockedItems: PropTypes.object,
    formProfile: PropTypes.object,
    event: PropTypes.object,
    dateFormat: PropTypes.string,
    timeFormat: PropTypes.string,
    newsCoverageStatus: PropTypes.array,
    urgencies: PropTypes.array,
};

const mapStateToProps = (state, ownProps) => ({
    item: selectors.planning.currentPlanning(state),
    event: selectors.events.planningWithEventDetails(state),
    session: selectors.getSessionDetails(state),
    privileges: selectors.getPrivileges(state),
    users: selectors.getUsers(state),
    desks: selectors.getDesks(state),
    lockedItems: selectors.locks.getLockedItems(state),
    agendas: selectors.general.agendas(state),
    dateFormat: selectors.config.getDateFormat(state),
    timeFormat: selectors.config.getTimeFormat(state),
    formProfile: selectors.forms.profiles(state),
    newsCoverageStatus: selectors.getNewsCoverageStatus(state),
    urgencies: selectors.getUrgencies(state),
});

const mapDispatchToProps = (dispatch) => ({
    onDuplicate: (planning) => (dispatch(actions.planning.ui.duplicate(planning))),
    onUnlock: (planning) => (dispatch(actions.planning.ui.unlockAndOpenEditor(planning))),
});

export const PlanningPreviewContent = connect(mapStateToProps, mapDispatchToProps)(PlanningPreviewContentComponent);
