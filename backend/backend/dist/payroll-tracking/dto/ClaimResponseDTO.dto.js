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
exports.ClaimResponseDTO = void 0;
const class_validator_1 = require("class-validator");
const payroll_tracking_enum_1 = require("../enums/payroll-tracking-enum");
class ClaimResponseDTO {
}
exports.ClaimResponseDTO = ClaimResponseDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClaimResponseDTO.prototype, "claimId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClaimResponseDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClaimResponseDTO.prototype, "claimType", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], ClaimResponseDTO.prototype, "employeeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], ClaimResponseDTO.prototype, "financeStaffId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01, { message: 'Claim amount must be greater than 0' }),
    __metadata("design:type", Number)
], ClaimResponseDTO.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01, { message: 'Approved amount must be greater than 0' }),
    (0, class_validator_1.Max)(1000000, { message: 'Approved amount cannot exceed the claimed amount' }),
    __metadata("design:type", Number)
], ClaimResponseDTO.prototype, "approvedAmount", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(payroll_tracking_enum_1.ClaimStatus),
    __metadata("design:type", String)
], ClaimResponseDTO.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClaimResponseDTO.prototype, "rejectionReason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClaimResponseDTO.prototype, "resolutionComment", void 0);
//# sourceMappingURL=ClaimResponseDTO.dto.js.map