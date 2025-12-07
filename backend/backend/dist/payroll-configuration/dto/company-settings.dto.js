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
exports.UpdateCompanySettingsDto = exports.CreateCompanySettingsDto = exports.IsValidISODateConstraint = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
let IsValidISODateConstraint = class IsValidISODateConstraint {
    validate(value) {
        if (typeof value !== 'string')
            return false;
        const date = new Date(value);
        return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}/.test(value);
    }
    defaultMessage() {
        return 'payDate must be a valid ISO 8601 date string';
    }
};
exports.IsValidISODateConstraint = IsValidISODateConstraint;
exports.IsValidISODateConstraint = IsValidISODateConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isValidISODate', async: false })
], IsValidISODateConstraint);
class CreateCompanySettingsDto {
}
exports.CreateCompanySettingsDto = CreateCompanySettingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pay date (ISO string)' }),
    (0, class_validator_1.Validate)(IsValidISODateConstraint),
    __metadata("design:type", String)
], CreateCompanySettingsDto.prototype, "payDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Time zone (e.g., Africa/Cairo)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanySettingsDto.prototype, "timeZone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Currency code', enum: ['EGP'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['EGP']),
    __metadata("design:type", String)
], CreateCompanySettingsDto.prototype, "currency", void 0);
class UpdateCompanySettingsDto {
}
exports.UpdateCompanySettingsDto = UpdateCompanySettingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Pay date (ISO string)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Validate)(IsValidISODateConstraint),
    __metadata("design:type", String)
], UpdateCompanySettingsDto.prototype, "payDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Time zone (e.g., Africa/Cairo)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCompanySettingsDto.prototype, "timeZone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Currency code', enum: ['EGP'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['EGP']),
    __metadata("design:type", String)
], UpdateCompanySettingsDto.prototype, "currency", void 0);
//# sourceMappingURL=company-settings.dto.js.map