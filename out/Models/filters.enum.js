"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentFilters = exports.StatusFilters = exports.SeverityFilters = void 0;
var SeverityFilters;
(function (SeverityFilters) {
    SeverityFilters[SeverityFilters["High"] = 0] = "High";
    SeverityFilters[SeverityFilters["Medium"] = 1] = "Medium";
    SeverityFilters[SeverityFilters["Low"] = 2] = "Low";
})(SeverityFilters = exports.SeverityFilters || (exports.SeverityFilters = {}));
var StatusFilters;
(function (StatusFilters) {
    StatusFilters[StatusFilters["Completed"] = 0] = "Completed";
    StatusFilters[StatusFilters["Unassigned"] = 1] = "Unassigned";
})(StatusFilters = exports.StatusFilters || (exports.StatusFilters = {}));
var EnvironmentFilters;
(function (EnvironmentFilters) {
    EnvironmentFilters[EnvironmentFilters["AWS"] = 0] = "AWS";
    EnvironmentFilters[EnvironmentFilters["Azure"] = 1] = "Azure";
    EnvironmentFilters[EnvironmentFilters["GCP"] = 2] = "GCP";
})(EnvironmentFilters = exports.EnvironmentFilters || (exports.EnvironmentFilters = {}));
//# sourceMappingURL=filters.enum.js.map