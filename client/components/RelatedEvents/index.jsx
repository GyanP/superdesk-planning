import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

export const RelatedEvents = ({ events, dateFormat }) => (
    <ul className="related-events">
        {events.map(({
            _id,
            slugline,
            name,
            dates,
            state,
        }) => {
            let startStr = moment(dates.start).format(dateFormat)
            return (
            <li key={_id}>
                <i className="icon-list-alt"/>&nbsp;
                {state && state === 'spiked' &&
                    <span className="label label--alert">spiked</span>
                }

                <a>{slugline || name} {startStr}</a>
            </li>
            )
        })}
    </ul>
)

RelatedEvents.propTypes = {
    events: PropTypes.array.isRequired,
    dateFormat: PropTypes.string.isRequired,
}
