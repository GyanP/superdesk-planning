"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var React = require("react");
var superdesk_1 = require("../superdesk");
var superdesk_ui_framework_1 = require("superdesk-ui-framework");
var assignments_overview_list_item_1 = require("./assignments-overview-list-item");
var addWebsocketMessageListener = superdesk_1.superdesk.addWebsocketMessageListener;
var DropdownTree = superdesk_1.superdesk.components.getDropdownTree();
var _a = superdesk_1.superdesk.dataApi, queryRawJson = _a.queryRawJson, findOne = _a.findOne;
var _b = superdesk_1.superdesk.components, GroupLabel = _b.GroupLabel, IconBig = _b.IconBig, TopMenuDropdownButton = _b.TopMenuDropdownButton;
function fetchDesks() {
    return queryRawJson('desks').then(function (desksResponse) {
        var desks = desksResponse._items.reduce(function (acc, item) {
            acc[item._id] = item;
            return acc;
        }, {});
        return desks;
    });
}
function fetchContentTypes() {
    return findOne('vocabularies', 'g2_content_type').then(function (_a) {
        var items = _a.items;
        return (items);
    });
}
function fetchAssignments(userId) {
    return queryRawJson('assignments', {
        page: '1',
        sort: '[("planning.scheduled", 1)]',
        source: JSON.stringify({
            query: {
                bool: {
                    must: [
                        { term: { 'assigned_to.user': userId } },
                        { terms: { 'assigned_to.state': ['assigned', 'submitted', 'in_progress'] } },
                    ],
                },
            },
        }),
    }).then(function (_a) {
        var _items = _a._items;
        return _items;
    });
}
var AssignmentsList = /** @class */ (function (_super) {
    __extends(AssignmentsList, _super);
    function AssignmentsList(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { loading: true };
        _this.eventListenersToRemoveBeforeUnmounting = [];
        _this.handleContentChanges = _this.handleContentChanges.bind(_this);
        _this.eventListenersToRemoveBeforeUnmounting.push(addWebsocketMessageListener('resource:created', function (event) {
            var _a = event.detail.extra, resource = _a.resource, _id = _a._id;
            _this.handleContentChanges([{ changeType: 'created', resource: resource, itemId: _id }]);
        }));
        _this.eventListenersToRemoveBeforeUnmounting.push(addWebsocketMessageListener('resource:updated', function (event) {
            var _a = event.detail.extra, resource = _a.resource, _id = _a._id, fields = _a.fields;
            _this.handleContentChanges([{
                    changeType: 'updated',
                    resource: resource,
                    itemId: _id,
                    fields: fields,
                }]);
        }));
        _this.eventListenersToRemoveBeforeUnmounting.push(addWebsocketMessageListener('resource:deleted', function (event) {
            var _a = event.detail.extra, resource = _a.resource, _id = _a._id;
            _this.handleContentChanges([{ changeType: 'deleted', resource: resource, itemId: _id }]);
        }));
        return _this;
    }
    AssignmentsList.prototype.handleContentChanges = function (changes) {
        var _this = this;
        var state = this.state;
        if (state.loading === true) {
            return;
        }
        var assignments = state.assignments;
        var refetchDesks = changes.find(function (_a) {
            var resource = _a.resource;
            return resource === 'desks';
        });
        var refetchContentTypes = changes.find(function (_a) {
            var resource = _a.resource, itemId = _a.itemId;
            return resource === 'vocabularies' && itemId === 'g2_content_type';
        });
        var refetchAssignments = changes.find(function (_a) {
            var changeType = _a.changeType, resource = _a.resource, itemId = _a.itemId;
            return (resource === 'assignments' && (changeType === 'created' || changeType === 'deleted'))
                || (resource === 'assignments'
                    && changeType === 'updated'
                    && assignments.find(function (_a) {
                        var _id = _a._id;
                        return _id === itemId;
                    }) != null);
        });
        Promise.all([
            refetchDesks ? fetchDesks() : Promise.resolve(state.desks),
            refetchContentTypes ? fetchContentTypes() : Promise.resolve(state.contentTypes),
            refetchAssignments ? fetchAssignments(state.currentUser._id) : Promise.resolve(state.assignments),
        ]).then(function (_a) {
            var desks = _a[0], contentTypes = _a[1], assignments = _a[2];
            _this.setState({
                loading: false,
                desks: desks,
                contentTypes: contentTypes,
                assignments: assignments,
            });
        });
    };
    AssignmentsList.prototype.componentDidMount = function () {
        var _this = this;
        superdesk_1.superdesk.session.getCurrentUser()
            .then(function (currentUser) {
            return Promise.all([
                fetchDesks(),
                fetchContentTypes(),
                fetchAssignments(currentUser._id),
            ]).then(function (_a) {
                var desks = _a[0], contentTypes = _a[1], assignments = _a[2];
                _this.setState({
                    loading: false,
                    currentUser: currentUser,
                    desks: desks,
                    contentTypes: contentTypes,
                    assignments: assignments,
                });
            });
        });
    };
    AssignmentsList.prototype.componentWillUnmount = function () {
        this.eventListenersToRemoveBeforeUnmounting.forEach(function (removeListener) {
            removeListener();
        });
    };
    AssignmentsList.prototype.render = function () {
        if (this.state.loading === true) {
            return null;
        }
        var _a = this.state, assignments = _a.assignments, desks = _a.desks, contentTypes = _a.contentTypes;
        var itemsCount = assignments.length;
        var grouped = lodash_1.groupBy(assignments, function (item) { return item.assigned_to.desk; });
        return (React.createElement(DropdownTree, { groups: Object.keys(grouped).map(function (deskId) { return ({
                render: function () { return (React.createElement(GroupLabel, null,
                    React.createElement(superdesk_ui_framework_1.Badge, { type: "highlight", text: grouped[deskId].length.toString() }),
                    React.createElement("span", { style: { marginLeft: 6 } }, desks[deskId].name))); },
                items: grouped[deskId],
            }); }), getToggleElement: function (isOpen, onClick) { return (React.createElement(TopMenuDropdownButton, { onClick: function () {
                    if (itemsCount > 0) {
                        onClick();
                    }
                }, active: isOpen, disabled: itemsCount < 1, pulsate: false, "data-test-id": "toggle-button" },
                React.createElement(superdesk_ui_framework_1.Badge, { type: "highlight", text: itemsCount.toString() },
                    React.createElement("span", { style: { color: isOpen ? '#3783A2' : 'white' } },
                        React.createElement(IconBig, { name: "tasks" }))))); }, renderItem: function (key, assignment, closeDropdown) { return (React.createElement(assignments_overview_list_item_1.AssignmentsOverviewListItem, { key: key, assignment: assignment, contentTypes: contentTypes, onClick: closeDropdown })); }, wrapperStyles: { whiteSpace: 'nowrap', padding: 15, paddingTop: 0 } }));
    };
    return AssignmentsList;
}(React.PureComponent));
exports.AssignmentsList = AssignmentsList;
