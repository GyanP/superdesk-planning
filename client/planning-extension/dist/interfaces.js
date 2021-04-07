"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JUMP_INTERVAL;
(function (JUMP_INTERVAL) {
    JUMP_INTERVAL["DAY"] = "DAY";
    JUMP_INTERVAL["WEEK"] = "WEEK";
    JUMP_INTERVAL["MONTH"] = "MONTH";
})(JUMP_INTERVAL = exports.JUMP_INTERVAL || (exports.JUMP_INTERVAL = {}));
var SEARCH_SPIKE_STATE;
(function (SEARCH_SPIKE_STATE) {
    SEARCH_SPIKE_STATE["SPIKED"] = "spiked";
    SEARCH_SPIKE_STATE["NOT_SPIKED"] = "draft";
    SEARCH_SPIKE_STATE["BOTH"] = "both";
})(SEARCH_SPIKE_STATE = exports.SEARCH_SPIKE_STATE || (exports.SEARCH_SPIKE_STATE = {}));
var FILTER_TYPE;
(function (FILTER_TYPE) {
    FILTER_TYPE["EVENTS"] = "events";
    FILTER_TYPE["PLANNING"] = "planning";
    FILTER_TYPE["COMBINED"] = "combined";
})(FILTER_TYPE = exports.FILTER_TYPE || (exports.FILTER_TYPE = {}));
var PLANNING_VIEW;
(function (PLANNING_VIEW) {
    PLANNING_VIEW["EVENTS"] = "EVENTS";
    PLANNING_VIEW["PLANNING"] = "PLANNING";
    PLANNING_VIEW["COMBINED"] = "COMBINED";
})(PLANNING_VIEW = exports.PLANNING_VIEW || (exports.PLANNING_VIEW = {}));
var PREVIEW_PANEL;
(function (PREVIEW_PANEL) {
    PREVIEW_PANEL["EVENT"] = "event";
    PREVIEW_PANEL["PLANNING"] = "planning";
    PREVIEW_PANEL["COVERAGE"] = "coverage";
    PREVIEW_PANEL["ASSOCIATED_EVENT"] = "associated_event";
})(PREVIEW_PANEL = exports.PREVIEW_PANEL || (exports.PREVIEW_PANEL = {}));
var DATE_RANGE;
(function (DATE_RANGE) {
    DATE_RANGE["TODAY"] = "today";
    DATE_RANGE["TOMORROW"] = "tomorrow";
    DATE_RANGE["THIS_WEEK"] = "this_week";
    DATE_RANGE["NEXT_WEEK"] = "next_week";
    DATE_RANGE["LAST_24"] = "last24";
    DATE_RANGE["FOR_DATE"] = "for_date";
})(DATE_RANGE = exports.DATE_RANGE || (exports.DATE_RANGE = {}));
var LOCK_STATE;
(function (LOCK_STATE) {
    LOCK_STATE["LOCKED"] = "locked";
    LOCK_STATE["UNLOCKED"] = "unlocked";
})(LOCK_STATE = exports.LOCK_STATE || (exports.LOCK_STATE = {}));
var SORT_ORDER;
(function (SORT_ORDER) {
    SORT_ORDER["ASCENDING"] = "ascending";
    SORT_ORDER["DESCENDING"] = "descending";
})(SORT_ORDER = exports.SORT_ORDER || (exports.SORT_ORDER = {}));
var SORT_FIELD;
(function (SORT_FIELD) {
    SORT_FIELD["SCHEDULE"] = "schedule";
    SORT_FIELD["CREATED"] = "created";
    SORT_FIELD["UPDATED"] = "updated";
})(SORT_FIELD = exports.SORT_FIELD || (exports.SORT_FIELD = {}));
var LIST_VIEW_TYPE;
(function (LIST_VIEW_TYPE) {
    LIST_VIEW_TYPE["SCHEDULE"] = "schedule";
    LIST_VIEW_TYPE["LIST"] = "list";
})(LIST_VIEW_TYPE = exports.LIST_VIEW_TYPE || (exports.LIST_VIEW_TYPE = {}));
var ASSIGNMENT_STATE;
(function (ASSIGNMENT_STATE) {
    ASSIGNMENT_STATE["DRAFT"] = "draft";
    ASSIGNMENT_STATE["ASSIGNED"] = "assigned";
    ASSIGNMENT_STATE["IN_PROGRESS"] = "in_progress";
    ASSIGNMENT_STATE["COMPLETED"] = "completed";
    ASSIGNMENT_STATE["SUBMITTED"] = "submitted";
    ASSIGNMENT_STATE["CANCELLED"] = "cancelled";
})(ASSIGNMENT_STATE = exports.ASSIGNMENT_STATE || (exports.ASSIGNMENT_STATE = {}));
var WEEK_DAY;
(function (WEEK_DAY) {
    WEEK_DAY["SUNDAY"] = "Sunday";
    WEEK_DAY["MONDAY"] = "Monday";
    WEEK_DAY["TUESDAY"] = "Tuesday";
    WEEK_DAY["WEDNESDAY"] = "Wednesday";
    WEEK_DAY["THURSDAY"] = "Thursday";
    WEEK_DAY["FRIDAY"] = "Friday";
    WEEK_DAY["SATURDAY"] = "Saturday";
})(WEEK_DAY = exports.WEEK_DAY || (exports.WEEK_DAY = {}));
var SCHEDULE_FREQUENCY;
(function (SCHEDULE_FREQUENCY) {
    SCHEDULE_FREQUENCY["HOURLY"] = "hourly";
    SCHEDULE_FREQUENCY["DAILY"] = "daily";
    SCHEDULE_FREQUENCY["WEEKLY"] = "weekly";
    SCHEDULE_FREQUENCY["MONTHLY"] = "monthly";
})(SCHEDULE_FREQUENCY = exports.SCHEDULE_FREQUENCY || (exports.SCHEDULE_FREQUENCY = {}));
