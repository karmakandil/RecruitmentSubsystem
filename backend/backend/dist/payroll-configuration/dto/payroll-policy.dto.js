"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePayrollPolicyDto = exports.CreatePayrollPolicyDto = exports.IsValidISODateConstraint = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const payroll_configuration_enums_1 = require("../enums/payroll-configuration-enums");
let IsValidISODateConstraint = class IsValidISODateConstraint {
    validate(value) {
        if (typeof value !== 'string')
            return false;
        const date = new Date(value);
        return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}/.test(value);
    }
    defaultMessage() {
        return 'effectiveDate must be a valid ISO 8601 date string';
    }
};
exports.IsValidISODateConstraint = IsValidISODateConstraint;
exports.IsValidISODateConstraint = IsValidISODateConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isValidISODate', async: false })
], IsValidISODateConstraint);
class RuleDefinitionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Percentage value', minimum: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], RuleDefinitionDto.prototype, "percentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fixed amount', minimum: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], RuleDefinitionDto.prototype, "fixedAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Threshold amount', minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], RuleDefinitionDto.prototype, "thresholdAmount", void 0);
class CreatePayrollPolicyDto {
}
exports.CreatePayrollPolicyDto = CreatePayrollPolicyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePayrollPolicyDto.prototype, "policyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy type', enum: payroll_configuration_enums_1.PolicyType }),
    (0, class_validator_1.IsEnum)(payroll_configuration_enums_1.PolicyType),
    __metadata("design:type", String)
], CreatePayrollPolicyDto.prototype, "policyType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Policy description' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePayrollPolicyDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Effective date (ISO string)' }),
    (0, class_validator_1.Validate)(IsValidISODateConstraint),
    __metadata("design:type", String)
], CreatePayrollPolicyDto.prototype, "effectiveDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rule definition' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RuleDefinitionDto),
    __metadata("design:type", RuleDefinitionDto)
], CreatePayrollPolicyDto.prototype, "ruleDefinition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applicability', enum: payroll_configuration_enums_1.Applicability }),
    (0, class_validator_1.IsEnum)(payroll_configuration_enums_1.Applicability),
    __metadata("design:type", String)
], CreatePayrollPolicyDto.prototype, "applicability", void 0);
class UpdatePayrollPolicyDto {
}
exports.UpdatePayrollPolicyDto = UpdatePayrollPolicyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Policy name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePayrollPolicyDto.prototype, "policyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Policy type',
        enum: payroll_configuration_enums_1.PolicyType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(payroll_configuration_enums_1.PolicyType),
    __metadata("design:type", String)
], UpdatePayrollPolicyDto.prototype, "policyType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Policy description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePayrollPolicyDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Effective date (ISO string)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Validate)(IsValidISODateConstraint),
    __metadata("design:type", String)
], UpdatePayrollPolicyDto.prototype, "effectiveDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Rule definition' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RuleDefinitionDto),
    __metadata("design:type", RuleDefinitionDto)
], UpdatePayrollPolicyDto.prototype, "ruleDefinition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Applicability',
        enum: payroll_configuration_enums_1.Applicability,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(payroll_configuration_enums_1.Applicability),
    __metadata("design:type", String)
], UpdatePayrollPolicyDto.prototype, "applicability", void 0);
//# sourceMappingURL=payroll-policy.dto.js.map