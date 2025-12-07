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
exports.UpdateInsuranceBracketDto = exports.CreateInsuranceBracketDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const min_less_than_max_validator_1 = require("../common/validators/min-less-than-max.validator");
class CreateInsuranceBracketDto {
}
exports.CreateInsuranceBracketDto = CreateInsuranceBracketDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Insurance bracket name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInsuranceBracketDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Fixed insurance amount', minimum: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInsuranceBracketDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Minimum salary for bracket', minimum: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Validate)(min_less_than_max_validator_1.MinLessThanMax, ['maxSalary']),
    __metadata("design:type", Number)
], CreateInsuranceBracketDto.prototype, "minSalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum salary for bracket' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateInsuranceBracketDto.prototype, "maxSalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Employee contribution rate (%)',
        minimum: 0,
        maximum: 100,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateInsuranceBracketDto.prototype, "employeeRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Employer contribution rate (%)',
        minimum: 0,
        maximum: 100,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateInsuranceBracketDto.prototype, "employerRate", void 0);
class UpdateInsuranceBracketDto {
}
exports.UpdateInsuranceBracketDto = UpdateInsuranceBracketDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Insurance bracket name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateInsuranceBracketDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Fixed insurance amount',
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateInsuranceBracketDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Minimum salary for bracket',
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Validate)(min_less_than_max_validator_1.MinLessThanMax, ['maxSalary']),
    __metadata("design:type", Number)
], UpdateInsuranceBracketDto.prototype, "minSalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Maximum salary for bracket' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateInsuranceBracketDto.prototype, "maxSalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Employee contribution rate (%)',
        minimum: 0,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateInsuranceBracketDto.prototype, "employeeRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Employer contribution rate (%)',
        minimum: 0,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateInsuranceBracketDto.prototype, "employerRate", void 0);
//# sourceMappingURL=insurance-bracket.dto.js.map