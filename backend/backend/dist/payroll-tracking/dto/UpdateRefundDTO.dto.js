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
exports.UpdateRefundDTO = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const payroll_tracking_enum_1 = require("../enums/payroll-tracking-enum");
class RefundDetailsDTO {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5, {
        message: 'Refund description must be at least 5 characters long',
    }),
    __metadata("design:type", String)
], RefundDetailsDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0.01, { message: 'Refund amount must be greater than 0' }),
    __metadata("design:type", Number)
], RefundDetailsDTO.prototype, "amount", void 0);
class UpdateRefundDTO {
}
exports.UpdateRefundDTO = UpdateRefundDTO;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RefundDetailsDTO),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", RefundDetailsDTO)
], UpdateRefundDTO.prototype, "refundDetails", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], UpdateRefundDTO.prototype, "financeStaffId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], UpdateRefundDTO.prototype, "claimId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], UpdateRefundDTO.prototype, "disputeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], UpdateRefundDTO.prototype, "paidInPayrollRunId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(payroll_tracking_enum_1.RefundStatus),
    __metadata("design:type", String)
], UpdateRefundDTO.prototype, "status", void 0);
//# sourceMappingURL=UpdateRefundDTO.dto.js.map