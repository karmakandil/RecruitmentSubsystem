"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollTrackingModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const payroll_tracking_controller_1 = require("./payroll-tracking.controller");
const payroll_tracking_service_1 = require("./payroll-tracking.service");
const claims_schema_1 = require("./models/claims.schema");
const disputes_schema_1 = require("./models/disputes.schema");
const refunds_schema_1 = require("./models/refunds.schema");
const payroll_configuration_module_1 = require("../payroll-configuration/payroll-configuration.module");
const payroll_execution_module_1 = require("../payroll-execution/payroll-execution.module");
const employee_profile_module_1 = require("../employee-profile/employee-profile.module");
const leaves_module_1 = require("../leaves/leaves.module");
const time_management_module_1 = require("../time-management/time-management.module");
const organization_structure_module_1 = require("../organization-structure/organization-structure.module");
const employee_profile_schema_1 = require("../employee-profile/models/employee-profile.schema");
const payslip_schema_1 = require("../payroll-execution/models/payslip.schema");
const payrollRuns_schema_1 = require("../payroll-execution/models/payrollRuns.schema");
const leave_entitlement_schema_1 = require("../leaves/models/leave-entitlement.schema");
const leave_request_schema_1 = require("../leaves/models/leave-request.schema");
const attendance_record_schema_1 = require("../time-management/models/attendance-record.schema");
const time_exception_schema_1 = require("../time-management/models/time-exception.schema");
const department_schema_1 = require("../organization-structure/models/department.schema");
const position_schema_1 = require("../organization-structure/models/position.schema");
const position_assignment_schema_1 = require("../organization-structure/models/position-assignment.schema");
const employee_system_role_schema_1 = require("../employee-profile/models/employee-system-role.schema");
let PayrollTrackingModule = class PayrollTrackingModule {
};
exports.PayrollTrackingModule = PayrollTrackingModule;
exports.PayrollTrackingModule = PayrollTrackingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            payroll_configuration_module_1.PayrollConfigurationModule,
            employee_profile_module_1.EmployeeProfileModule,
            leaves_module_1.LeavesModule,
            time_management_module_1.TimeManagementModule,
            organization_structure_module_1.OrganizationStructureModule,
            (0, common_1.forwardRef)(() => payroll_execution_module_1.PayrollExecutionModule),
            mongoose_1.MongooseModule.forFeature([
                { name: claims_schema_1.claims.name, schema: claims_schema_1.claimsSchema },
                { name: disputes_schema_1.disputes.name, schema: disputes_schema_1.disputesSchema },
                { name: refunds_schema_1.refunds.name, schema: refunds_schema_1.refundsSchema },
                { name: employee_profile_schema_1.EmployeeProfile.name, schema: employee_profile_schema_1.EmployeeProfileSchema },
                { name: payslip_schema_1.paySlip.name, schema: payslip_schema_1.paySlipSchema },
                { name: payrollRuns_schema_1.payrollRuns.name, schema: payrollRuns_schema_1.payrollRunsSchema },
                { name: leave_entitlement_schema_1.LeaveEntitlement.name, schema: leave_entitlement_schema_1.LeaveEntitlementSchema },
                { name: leave_request_schema_1.LeaveRequest.name, schema: leave_request_schema_1.LeaveRequestSchema },
                { name: attendance_record_schema_1.AttendanceRecord.name, schema: attendance_record_schema_1.AttendanceRecordSchema },
                { name: time_exception_schema_1.TimeException.name, schema: time_exception_schema_1.TimeExceptionSchema },
                { name: department_schema_1.Department.name, schema: department_schema_1.DepartmentSchema },
                { name: position_schema_1.Position.name, schema: position_schema_1.PositionSchema },
                { name: position_assignment_schema_1.PositionAssignment.name, schema: position_assignment_schema_1.PositionAssignmentSchema },
                { name: employee_system_role_schema_1.EmployeeSystemRole.name, schema: employee_system_role_schema_1.EmployeeSystemRoleSchema },
            ]),
        ],
        controllers: [payroll_tracking_controller_1.PayrollTrackingController],
        providers: [payroll_tracking_service_1.PayrollTrackingService],
        exports: [payroll_tracking_service_1.PayrollTrackingService],
    })
], PayrollTrackingModule);
//# sourceMappingURL=payroll-tracking.module.js.map