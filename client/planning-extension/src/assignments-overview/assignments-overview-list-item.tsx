import * as React from 'react';
import {IVocabularyItem} from 'superdesk-api';
import {gettext} from '../../../utils/gettext';
import {IAssignmentItem} from '../../../interfaces';
import {extensionBridge} from '../extension_bridge';
import {superdesk} from '../superdesk';

const {ListItem, ListItemColumn, ListItemRow} = superdesk.components;
const {getAssignmentTypeInfo} = extensionBridge.assignments.utils;
const {SluglineComponent, DueDateComponent, StateComponent} = extensionBridge.assignments.components;

interface IProps {
    assignment: IAssignmentItem;
    contentTypes: Array<IVocabularyItem>;
    onClick(): void;
}

export class AssignmentsOverviewListItem extends React.PureComponent<IProps> {
    render() {
        const {assignment, contentTypes, onClick} = this.props;
        const {className} = getAssignmentTypeInfo(assignment, contentTypes);

        return (
            <button
                style={{display: 'block', width: '100%', paddingTop: 10, textAlign: 'left'}}
                title={gettext('Open Assignment')}
                onClick={() => {
                    onClick();
                    superdesk.browser.location.setPage(`/workspace/assignments?assignment=${assignment._id}`);
                }}
            >
                <ListItem>
                    <ListItemColumn>
                        <i className={className} />
                    </ListItemColumn>

                    <ListItemColumn>
                        <ListItemRow>
                            <ListItemColumn>
                                <SluglineComponent assignment={assignment} />
                            </ListItemColumn>
                        </ListItemRow>

                        <ListItemRow>
                            <ListItemColumn noBorder>
                                <StateComponent assignment={assignment} />
                            </ListItemColumn>

                            <ListItemColumn>
                                <DueDateComponent assignment={assignment} showTooltip={false}/>
                            </ListItemColumn>
                        </ListItemRow>
                    </ListItemColumn>
                </ListItem>
            </button>
        );
    }
}