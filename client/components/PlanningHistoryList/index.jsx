import React from 'react'
import PropTypes from 'prop-types'
import { AbsoluteDate } from '../../components'
import { includes } from 'lodash'

export const PlanningHistoryList = ({ planningHistoryItems, users }) => {
    const displayUser = (recievedUserId) => {
        return users.find((u) => (u._id === recievedUserId)).display_name
    }

    return (
        <div>
            <ul className="history-list">
                {planningHistoryItems.map((historyItem) => (
                    <li className="item" key={historyItem._id}>
                        {
                            users &&
                            includes(['create', 'update', 'spiked', 'unspiked'], historyItem.operation)
                            &&
                            <div>
                                <strong>
                                    {historyItem.operation === 'create' && 'Created by '}
                                    {historyItem.operation === 'update' && 'Updated by '}
                                    {historyItem.operation === 'spiked' && 'Spiked by '}
                                    {historyItem.operation === 'unspiked' && 'Unspiked by '}
                                </strong>

                                <span className="user-name">{displayUser(historyItem.user_id)}</span>
                                <em> <AbsoluteDate date={historyItem._created} /> </em>
                                <div>
                                    {historyItem.operation === 'update' &&
                                        <div className="more-description">
                                            Updated Fields:
                                            {   // List updated fields as comma separated
                                                <span>&nbsp;{Object.keys(historyItem.update).map((field) => field).join(', ')}</span>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </li>
                ))}
            </ul>
        </div>
    )
}

PlanningHistoryList.propTypes = {
    planningHistoryItems: PropTypes.array.isRequired,
    users: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
}
