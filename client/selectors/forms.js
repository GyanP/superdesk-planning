import {createSelector} from 'reselect';
import {get} from 'lodash';
import {ITEM_TYPE} from '../constants';

/** Profiles **/
export const profiles = (state) => get(state, 'forms.profiles', {});
export const coverageProfile = createSelector([profiles], (p) => get(p, 'coverage', {}));
export const eventProfile = createSelector([profiles], (p) => get(p, 'events', {}));
export const planningProfile = createSelector([profiles], (p) => get(p, 'planning', {}));


/** Autosaves **/
export const autosaves = (state) => get(state, 'forms.autosaves', {});
export const eventAutosaves = createSelector([autosaves], (a) => get(a, 'events', {}));
export const planningAutosaves = createSelector([autosaves], (a) => get(a, 'planning', {}));

/** Forms */
export const currentItemId = (state) => get(state, 'forms.itemId', null);
export const currentItemType = (state) => get(state, 'forms.itemType', null);

const storedEvents = (state) => get(state, 'events.events', {});
const storedPlannings = (state) => get(state, 'planning.plannings', {});

export const currentItem = createSelector(
    [currentItemId, currentItemType, storedEvents, storedPlannings],
    (itemId, itemType, events, plannings) => {
        if (itemId === null) {
            return null;
        } else if (itemType === ITEM_TYPE.EVENT) {
            return get(events, itemId);
        } else if (itemType === ITEM_TYPE.PLANNING) {
            return get(plannings, itemId);
        }

        return null;
    }
);
