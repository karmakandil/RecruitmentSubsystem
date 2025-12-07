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
exports.UpdateSigningBonusDto = exports.CreateSigningBonusDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSigningBonusDto {
}
exports.CreateSigningBonusDto = CreateSigningBonusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Position name eligible for signing bonus' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSigningBonusDto.prototype, "positionName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Signing bonus amount', minimum: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateSigningBonusDto.prototype, "amount", void 0);
class UpdateSigningBonusDto {
}
exports.UpdateSigningBonusDto = UpdateSigningBonusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Position name eligible for signing bonus',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSigningBonusDto.prototype, "positionName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Signing bonus amount',
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateSigningBonusDto.prototype, "amount", void 0);
//# sourceMappingURL=signing-bonus.dto.js.map