"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollConfigurationModule = void 0;
const common_1 = require("@nestjs/common");
const roles_guard_1 = require("../common/guards/roles.guard");
const mongoose_1 = require("@nestjs/mongoose");
const payroll_configuration_controller_1 = require("./payroll-configuration.controller");
const payroll_configuration_service_1 = require("./payroll-configuration.service");
const object_id_pipe_1 = require("./common/pipes/object-id.pipe");
const payGrades_schema_1 = require("./models/payGrades.schema");
const payrollPolicies_schema_1 = require("./models/payrollPolicies.schema");
const allowance_schema_1 = require("./models/allowance.schema");
const payType_schema_1 = require("./models/payType.schema");
const taxRules_schema_1 = require("./models/taxRules.schema");
const insuranceBrackets_schema_1 = require("./models/insuranceBrackets.schema");
const signingBonus_schema_1 = require("./models/signingBonus.schema");
const terminationAndResignationBenefits_1 = require("./models/terminationAndResignationBenefits");
const CompanyWideSettings_schema_1 = require("./models/CompanyWideSettings.schema");
let PayrollConfigurationModule = class PayrollConfigurationModule {
};
exports.PayrollConfigurationModule = PayrollConfigurationModule;
exports.PayrollConfigurationModule = PayrollConfigurationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: payGrades_schema_1.payGrade.name, schema: payGrades_schema_1.payGradeSchema },
                { name: payrollPolicies_schema_1.payrollPolicies.name, schema: payrollPolicies_schema_1.payrollPoliciesSchema },
                { name: allowance_schema_1.allowance.name, schema: allowance_schema_1.allowanceSchema },
                { name: payType_schema_1.payType.name, schema: payType_schema_1.payTypeSchema },
                { name: taxRules_schema_1.taxRules.name, schema: taxRules_schema_1.taxRulesSchema },
                { name: insuranceBrackets_schema_1.insuranceBrackets.name, schema: insuranceBrackets_schema_1.insuranceBracketsSchema },
                { name: signingBonus_schema_1.signingBonus.name, schema: signingBonus_schema_1.signingBonusSchema },
                {
                    name: terminationAndResignationBenefits_1.terminationAndResignationBenefits.name,
                    schema: terminationAndResignationBenefits_1.terminationAndResignationBenefitsSchema,
                },
                { name: CompanyWideSettings_schema_1.CompanyWideSettings.name, schema: CompanyWideSettings_schema_1.CompanyWideSettingsSchema },
            ]),
        ],
        controllers: [payroll_configuration_controller_1.PayrollConfigurationController],
        providers: [payroll_configuration_service_1.PayrollConfigurationService, object_id_pipe_1.ObjectIdPipe, roles_guard_1.RolesGuard],
        exports: [payroll_configuration_service_1.PayrollConfigurationService],
    })
], PayrollConfigurationModule);
//# sourceMappingURL=payroll-configuration.module.js.map