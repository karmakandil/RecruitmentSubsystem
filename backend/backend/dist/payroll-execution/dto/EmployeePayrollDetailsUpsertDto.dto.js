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
exports.EmployeePayrollDetailsUpsertDto = void 0;
const class_validator_1 = require("class-validator");
const payroll_execution_enum_1 = require("../enums/payroll-execution-enum");
class EmployeePayrollDetailsUpsertDto {
}
exports.EmployeePayrollDetailsUpsertDto = EmployeePayrollDetailsUpsertDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], EmployeePayrollDetailsUpsertDto.prototype, "employeeId", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], EmployeePayrollDetailsUpsertDto.prototype, "payrollRunId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EmployeePayrollDetailsUpsertDto.prototype, "baseSalary", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EmployeePayrollDetailsUpsertDto.prototype, "allowances", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EmployeePayrollDetailsUpsertDto.prototype, "deductions", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EmployeePayrollDetailsUpsertDto.prototype, "netSalary", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EmployeePayrollDetailsUpsertDto.prototype, "netPay", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(payroll_execution_enum_1.BankStatus),
    __metadata("design:type", String)
], EmployeePayrollDetailsUpsertDto.prototype, "bankStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmployeePayrollDetailsUpsertDto.prototype, "exceptions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EmployeePayrollDetailsUpsertDto.prototype, "bonus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EmployeePayrollDetailsUpsertDto.prototype, "benefit", void 0);
//# sourceMappingURL=EmployeePayrollDetailsUpsertDto.dto.js.map