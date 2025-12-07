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
exports.GenerateAndDistributePayslipsDto = exports.PayslipDistributionMethod = void 0;
const class_validator_1 = require("class-validator");
var PayslipDistributionMethod;
(function (PayslipDistributionMethod) {
    PayslipDistributionMethod["PDF"] = "PDF";
    PayslipDistributionMethod["EMAIL"] = "EMAIL";
    PayslipDistributionMethod["PORTAL"] = "PORTAL";
})(PayslipDistributionMethod || (exports.PayslipDistributionMethod = PayslipDistributionMethod = {}));
class GenerateAndDistributePayslipsDto {
}
exports.GenerateAndDistributePayslipsDto = GenerateAndDistributePayslipsDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], GenerateAndDistributePayslipsDto.prototype, "payrollRunId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PayslipDistributionMethod),
    __metadata("design:type", String)
], GenerateAndDistributePayslipsDto.prototype, "distributionMethod", void 0);
//# sourceMappingURL=GenerateAndDistributePayslipsDto.dto.js.map