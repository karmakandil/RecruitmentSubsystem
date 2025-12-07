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
exports.LinkVacationPackageToScheduleDto = exports.ValidateHolidayBeforeShiftAssignmentDto = exports.LinkShiftToVacationAndHolidaysDto = exports.ApplyFlexibleScheduleRulesDto = exports.ValidateScheduleRuleDto = exports.CreateShiftTypeWithDatesDto = exports.DefineFlexibleSchedulingRulesDto = exports.AssignScheduleRuleToEmployeeDto = exports.GetScheduleRulesDto = exports.CreateScheduleRuleDto = exports.GetShiftAssignmentStatusDto = exports.GetEmployeeShiftAssignmentsDto = exports.PostponeShiftAssignmentDto = exports.CancelShiftAssignmentDto = exports.RenewShiftAssignmentDto = exports.UpdateShiftAssignmentDto = exports.AssignShiftToPositionDto = exports.AssignShiftToDepartmentDto = exports.AssignShiftToEmployeeDto = exports.GetShiftsByTypeDto = exports.UpdateShiftDto = exports.CreateShiftDto = exports.GetShiftTypesDto = exports.UpdateShiftTypeDto = exports.CreateShiftTypeDto = exports.IsEndDateAfterStartDateConstraint = exports.IsValidCalendarDateConstraint = exports.IsValidDateConstraint = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../models/enums");
let IsValidDateConstraint = class IsValidDateConstraint {
    validate(date, args) {
        if (!date)
            return true;
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime()))
            return false;
        if (typeof date === 'string') {
            const originalDate = new Date(date);
            const dateStr = date.split('T')[0];
            const [year, month, day] = dateStr.split('-').map(Number);
            if (year && month && day) {
                const expectedDate = new Date(year, month - 1, day);
                if (expectedDate.getFullYear() !== originalDate.getFullYear() ||
                    expectedDate.getMonth() !== originalDate.getMonth() ||
                    expectedDate.getDate() !== originalDate.getDate()) {
                    return false;
                }
            }
        }
        return true;
    }
    defaultMessage(args) {
        return 'Invalid date. Please provide a valid calendar date.';
    }
};
exports.IsValidDateConstraint = IsValidDateConstraint;
exports.IsValidDateConstraint = IsValidDateConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isValidDate', async: false })
], IsValidDateConstraint);
function isValidCalendarDateString(dateStr) {
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length !== 3)
        return false;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    if (isNaN(year) || isNaN(month) || isNaN(day))
        return false;
    const constructedDate = new Date(year, month - 1, day);
    const parsedDate = new Date(dateStr);
    return (constructedDate.getFullYear() === parsedDate.getFullYear() &&
        constructedDate.getMonth() === parsedDate.getMonth() &&
        constructedDate.getDate() === parsedDate.getDate());
}
let IsValidCalendarDateConstraint = class IsValidCalendarDateConstraint {
    validate(date, args) {
        if (!date)
            return true;
        if (typeof date === 'string') {
            return isValidCalendarDateString(date);
        }
        if (date instanceof Date) {
            return !isNaN(date.getTime());
        }
        return true;
    }
    defaultMessage(args) {
        return 'Invalid calendar date. Please provide a valid date (e.g., November has only 30 days).';
    }
};
exports.IsValidCalendarDateConstraint = IsValidCalendarDateConstraint;
exports.IsValidCalendarDateConstraint = IsValidCalendarDateConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isValidCalendarDate', async: false })
], IsValidCalendarDateConstraint);
let IsEndDateAfterStartDateConstraint = class IsEndDateAfterStartDateConstraint {
    validate(endDate, args) {
        const obj = args.object;
        const startDate = obj.startDate;
        if (!startDate || !endDate)
            return true;
        return new Date(endDate).getTime() >= new Date(startDate).getTime();
    }
    defaultMessage(args) {
        return 'endDate must be greater than or equal to startDate';
    }
};
exports.IsEndDateAfterStartDateConstraint = IsEndDateAfterStartDateConstraint;
exports.IsEndDateAfterStartDateConstraint = IsEndDateAfterStartDateConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isEndDateAfterStartDate', async: false })
], IsEndDateAfterStartDateConstraint);
class CreateShiftTypeDto {
}
exports.CreateShiftTypeDto = CreateShiftTypeDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShiftTypeDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateShiftTypeDto.prototype, "active", void 0);
class UpdateShiftTypeDto {
}
exports.UpdateShiftTypeDto = UpdateShiftTypeDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShiftTypeDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateShiftTypeDto.prototype, "active", void 0);
class GetShiftTypesDto {
}
exports.GetShiftTypesDto = GetShiftTypesDto;
class CreateShiftDto {
}
exports.CreateShiftDto = CreateShiftDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShiftDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShiftDto.prototype, "shiftType", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShiftDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShiftDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(enums_1.PunchPolicy),
    __metadata("design:type", String)
], CreateShiftDto.prototype, "punchPolicy", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateShiftDto.prototype, "graceInMinutes", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateShiftDto.prototype, "graceOutMinutes", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateShiftDto.prototype, "requiresApprovalForOvertime", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateShiftDto.prototype, "active", void 0);
class UpdateShiftDto {
}
exports.UpdateShiftDto = UpdateShiftDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "shiftType", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(enums_1.PunchPolicy),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "punchPolicy", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateShiftDto.prototype, "graceInMinutes", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateShiftDto.prototype, "graceOutMinutes", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateShiftDto.prototype, "requiresApprovalForOvertime", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateShiftDto.prototype, "active", void 0);
class GetShiftsByTypeDto {
}
exports.GetShiftsByTypeDto = GetShiftsByTypeDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetShiftsByTypeDto.prototype, "shiftType", void 0);
class AssignShiftToEmployeeDto {
}
exports.AssignShiftToEmployeeDto = AssignShiftToEmployeeDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignShiftToEmployeeDto.prototype, "employeeId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignShiftToEmployeeDto.prototype, "shiftId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AssignShiftToEmployeeDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AssignShiftToEmployeeDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(enums_1.ShiftAssignmentStatus),
    __metadata("design:type", String)
], AssignShiftToEmployeeDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignShiftToEmployeeDto.prototype, "departmentId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignShiftToEmployeeDto.prototype, "positionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignShiftToEmployeeDto.prototype, "scheduleRuleId", void 0);
class AssignShiftToDepartmentDto {
}
exports.AssignShiftToDepartmentDto = AssignShiftToDepartmentDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignShiftToDepartmentDto.prototype, "departmentId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignShiftToDepartmentDto.prototype, "shiftId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AssignShiftToDepartmentDto.prototype, "includePositions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], AssignShiftToDepartmentDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.Validate)(IsEndDateAfterStartDateConstraint),
    __metadata("design:type", Date)
], AssignShiftToDepartmentDto.prototype, "endDate", void 0);
class AssignShiftToPositionDto {
}
exports.AssignShiftToPositionDto = AssignShiftToPositionDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignShiftToPositionDto.prototype, "positionId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignShiftToPositionDto.prototype, "shiftId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], AssignShiftToPositionDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.Validate)(IsEndDateAfterStartDateConstraint),
    __metadata("design:type", Date)
], AssignShiftToPositionDto.prototype, "endDate", void 0);
class UpdateShiftAssignmentDto {
}
exports.UpdateShiftAssignmentDto = UpdateShiftAssignmentDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(enums_1.ShiftAssignmentStatus),
    __metadata("design:type", String)
], UpdateShiftAssignmentDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], UpdateShiftAssignmentDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.Validate)(IsEndDateAfterStartDateConstraint),
    __metadata("design:type", Date)
], UpdateShiftAssignmentDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShiftAssignmentDto.prototype, "employeeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShiftAssignmentDto.prototype, "departmentId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShiftAssignmentDto.prototype, "positionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShiftAssignmentDto.prototype, "shiftId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShiftAssignmentDto.prototype, "scheduleRuleId", void 0);
class RenewShiftAssignmentDto {
}
exports.RenewShiftAssignmentDto = RenewShiftAssignmentDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RenewShiftAssignmentDto.prototype, "assignmentId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], RenewShiftAssignmentDto.prototype, "newEndDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RenewShiftAssignmentDto.prototype, "note", void 0);
class CancelShiftAssignmentDto {
}
exports.CancelShiftAssignmentDto = CancelShiftAssignmentDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelShiftAssignmentDto.prototype, "assignmentId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelShiftAssignmentDto.prototype, "reason", void 0);
class PostponeShiftAssignmentDto {
}
exports.PostponeShiftAssignmentDto = PostponeShiftAssignmentDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PostponeShiftAssignmentDto.prototype, "assignmentId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], PostponeShiftAssignmentDto.prototype, "postponeUntil", void 0);
class GetEmployeeShiftAssignmentsDto {
}
exports.GetEmployeeShiftAssignmentsDto = GetEmployeeShiftAssignmentsDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetEmployeeShiftAssignmentsDto.prototype, "employeeId", void 0);
class GetShiftAssignmentStatusDto {
}
exports.GetShiftAssignmentStatusDto = GetShiftAssignmentStatusDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetShiftAssignmentStatusDto.prototype, "shiftAssignmentId", void 0);
class CreateScheduleRuleDto {
}
exports.CreateScheduleRuleDto = CreateScheduleRuleDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduleRuleDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduleRuleDto.prototype, "pattern", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateScheduleRuleDto.prototype, "active", void 0);
class GetScheduleRulesDto {
}
exports.GetScheduleRulesDto = GetScheduleRulesDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetScheduleRulesDto.prototype, "active", void 0);
class AssignScheduleRuleToEmployeeDto {
}
exports.AssignScheduleRuleToEmployeeDto = AssignScheduleRuleToEmployeeDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignScheduleRuleToEmployeeDto.prototype, "employeeId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssignScheduleRuleToEmployeeDto.prototype, "scheduleRuleId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], AssignScheduleRuleToEmployeeDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.Validate)(IsEndDateAfterStartDateConstraint),
    __metadata("design:type", Date)
], AssignScheduleRuleToEmployeeDto.prototype, "endDate", void 0);
class DefineFlexibleSchedulingRulesDto {
}
exports.DefineFlexibleSchedulingRulesDto = DefineFlexibleSchedulingRulesDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DefineFlexibleSchedulingRulesDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DefineFlexibleSchedulingRulesDto.prototype, "pattern", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DefineFlexibleSchedulingRulesDto.prototype, "active", void 0);
class CreateShiftTypeWithDatesDto {
}
exports.CreateShiftTypeWithDatesDto = CreateShiftTypeWithDatesDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShiftTypeWithDatesDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShiftTypeWithDatesDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateShiftTypeWithDatesDto.prototype, "effectiveStart", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.Validate)(IsEndDateAfterStartDateConstraint),
    __metadata("design:type", Date)
], CreateShiftTypeWithDatesDto.prototype, "effectiveEnd", void 0);
class ValidateScheduleRuleDto {
}
exports.ValidateScheduleRuleDto = ValidateScheduleRuleDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidateScheduleRuleDto.prototype, "scheduleRuleId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], ValidateScheduleRuleDto.prototype, "assignmentDate", void 0);
class ApplyFlexibleScheduleRulesDto {
}
exports.ApplyFlexibleScheduleRulesDto = ApplyFlexibleScheduleRulesDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], ApplyFlexibleScheduleRulesDto.prototype, "targetDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ApplyFlexibleScheduleRulesDto.prototype, "scheduleRuleIds", void 0);
class LinkShiftToVacationAndHolidaysDto {
}
exports.LinkShiftToVacationAndHolidaysDto = LinkShiftToVacationAndHolidaysDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LinkShiftToVacationAndHolidaysDto.prototype, "shiftId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], LinkShiftToVacationAndHolidaysDto.prototype, "holidayIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LinkShiftToVacationAndHolidaysDto.prototype, "vacationPackageId", void 0);
class ValidateHolidayBeforeShiftAssignmentDto {
}
exports.ValidateHolidayBeforeShiftAssignmentDto = ValidateHolidayBeforeShiftAssignmentDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidateHolidayBeforeShiftAssignmentDto.prototype, "shiftId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidateHolidayBeforeShiftAssignmentDto.prototype, "employeeId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], ValidateHolidayBeforeShiftAssignmentDto.prototype, "assignmentDate", void 0);
class LinkVacationPackageToScheduleDto {
}
exports.LinkVacationPackageToScheduleDto = LinkVacationPackageToScheduleDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LinkVacationPackageToScheduleDto.prototype, "scheduleRuleId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LinkVacationPackageToScheduleDto.prototype, "vacationPackageId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], LinkVacationPackageToScheduleDto.prototype, "effectiveStart", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.Validate)(IsEndDateAfterStartDateConstraint),
    __metadata("design:type", Date)
], LinkVacationPackageToScheduleDto.prototype, "effectiveEnd", void 0);
//# sourceMappingURL=shift.dtos.js.map