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
var React = require("react");
var utils_1 = require("../../../utils");
var extension_bridge_1 = require("../extension_bridge");
var superdesk_1 = require("../superdesk");
var _a = superdesk_1.superdesk.components, ListItem = _a.ListItem, ListItemColumn = _a.ListItemColumn, ListItemRow = _a.ListItemRow;
var getAssignmentTypeInfo = extension_bridge_1.extensionBridge.assignments.utils.getAssignmentTypeInfo;
var _b = extension_bridge_1.extensionBridge.assignments.components, SluglineComponent = _b.SluglineComponent, DueDateComponent = _b.DueDateComponent, StateComponent = _b.StateComponent;
var AssignmentsOverviewListItem = /** @class */ (function (_super) {
    __extends(AssignmentsOverviewListItem, _super);
    function AssignmentsOverviewListItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AssignmentsOverviewListItem.prototype.render = function () {
        var _a = this.props, assignment = _a.assignment, contentTypes = _a.contentTypes, onClick = _a.onClick;
        var className = getAssignmentTypeInfo(assignment, contentTypes).className;
        return (React.createElement("button", { style: { display: 'block', width: '100%', paddingTop: 10, textAlign: 'left' }, title: utils_1.gettext('Open Assignment'), onClick: function () {
                onClick();
                superdesk_1.superdesk.browser.location.setPage("/workspace/assignments?assignment=" + assignment._id);
            } },
            React.createElement(ListItem, null,
                React.createElement(ListItemColumn, null,
                    React.createElement("i", { className: className })),
                React.createElement(ListItemColumn, null,
                    React.createElement(ListItemRow, null,
                        React.createElement(ListItemColumn, null,
                            React.createElement(SluglineComponent, { assignment: assignment }))),
                    React.createElement(ListItemRow, null,
                        React.createElement(ListItemColumn, { noBorder: true },
                            React.createElement(StateComponent, { assignment: assignment })),
                        React.createElement(ListItemColumn, null,
                            React.createElement(DueDateComponent, { assignment: assignment, showTooltip: false })))))));
    };
    return AssignmentsOverviewListItem;
}(React.PureComponent));
exports.AssignmentsOverviewListItem = AssignmentsOverviewListItem;
