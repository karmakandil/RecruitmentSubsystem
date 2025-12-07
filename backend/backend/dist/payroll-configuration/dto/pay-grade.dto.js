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
exports.UpdatePayGradeDto = exports.CreatePayGradeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePayGradeDto {
}
exports.CreatePayGradeDto = CreatePayGradeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pay grade level' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePayGradeDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Base salary amount', minimum: 6000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(6000),
    __metadata("design:type", Number)
], CreatePayGradeDto.prototype, "baseSalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Gross salary amount', minimum: 6000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(6000),
    __metadata("design:type", Number)
], CreatePayGradeDto.prototype, "grossSalary", void 0);
class UpdatePayGradeDto {
}
exports.UpdatePayGradeDto = UpdatePayGradeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Pay grade level' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePayGradeDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Base salary amount',
        minimum: 6000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(6000),
    __metadata("design:type", Number)
], UpdatePayGradeDto.prototype, "baseSalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Gross salary amount',
        minimum: 6000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(6000),
    __metadata("design:type", Number)
], UpdatePayGradeDto.prototype, "grossSalary", void 0);
//# sourceMappingURL=pay-grade.dto.js.map