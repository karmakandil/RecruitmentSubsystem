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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftScheduleService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shift_type_schema_1 = require("../models/shift-type.schema");
const shift_schema_1 = require("../models/shift.schema");
const shift_assignment_schema_1 = require("../models/shift-assignment.schema");
const schedule_rule_schema_1 = require("../models/schedule-rule.schema");
const enums_1 = require("../models/enums");
let ShiftScheduleService = class ShiftScheduleService {
    constructor(shiftTypeModel, shiftModel, shiftAssignmentModel, scheduleRuleModel) {
        this.shiftTypeModel = shiftTypeModel;
        this.shiftModel = shiftModel;
        this.shiftAssignmentModel = shiftAssignmentModel;
        this.scheduleRuleModel = scheduleRuleModel;
    }
    async createShiftType(createShiftTypeDto, currentUserId) {
        const newShiftType = new this.shiftTypeModel({
            ...createShiftTypeDto,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        return newShiftType.save();
    }
    async updateShiftType(id, updateShiftTypeDto, currentUserId) {
        const shiftType = await this.shiftTypeModel.findById(id);
        if (!shiftType) {
            throw new common_1.NotFoundException('Shift type not found');
        }
        return this.shiftTypeModel.findByIdAndUpdate(id, {
            ...updateShiftTypeDto,
            updatedBy: currentUserId,
        }, { new: true });
    }
    async getShiftTypes(filters) {
        const query = {};
        if (filters?.active !== undefined) {
            query.active = filters.active;
        }
        return this.shiftTypeModel.find(query).exec();
    }
    async getShiftTypeById(id) {
        const shiftType = await this.shiftTypeModel.findById(id).exec();
        if (!shiftType) {
            throw new common_1.NotFoundException('Shift type not found');
        }
        return shiftType;
    }
    async deleteShiftType(id) {
        const shiftType = await this.shiftTypeModel.findById(id);
        if (!shiftType) {
            throw new common_1.NotFoundException('Shift type not found');
        }
        const shiftsUsingType = await this.shiftModel.countDocuments({ shiftType: new mongoose_2.Types.ObjectId(id) });
        if (shiftsUsingType > 0) {
            throw new common_1.BadRequestException(`Cannot delete shift type. ${shiftsUsingType} shift(s) are using this type.`);
        }
        await this.shiftTypeModel.findByIdAndDelete(id);
        return { message: 'Shift type deleted successfully' };
    }
    async createShift(createShiftDto, currentUserId) {
        const shiftType = await this.shiftTypeModel.findById(createShiftDto.shiftType);
        if (!shiftType) {
            throw new common_1.NotFoundException('Shift type not found');
        }
        const newShift = new this.shiftModel({
            ...createShiftDto,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        return newShift.save();
    }
    async updateShift(id, updateShiftDto, currentUserId) {
        const shift = await this.shiftModel.findById(id);
        if (!shift) {
            throw new common_1.NotFoundException('Shift not found');
        }
        return this.shiftModel.findByIdAndUpdate(id, {
            ...updateShiftDto,
            updatedBy: currentUserId,
        }, { new: true });
    }
    async getShifts(filters) {
        const query = {};
        if (filters?.active !== undefined) {
            query.active = filters.active;
        }
        if (filters?.shiftType) {
            query.shiftType = new mongoose_2.Types.ObjectId(filters.shiftType);
        }
        return this.shiftModel.find(query).populate('shiftType').exec();
    }
    async getShiftById(id) {
        const shift = await this.shiftModel.findById(id).populate('shiftType').exec();
        if (!shift) {
            throw new common_1.NotFoundException('Shift not found');
        }
        return shift;
    }
    async getShiftsByType(shiftTypeId) {
        return this.shiftModel.find({ shiftType: new mongoose_2.Types.ObjectId(shiftTypeId) }).exec();
    }
    async deleteShift(id) {
        const shift = await this.shiftModel.findById(id);
        if (!shift) {
            throw new common_1.NotFoundException('Shift not found');
        }
        const assignmentsUsingShift = await this.shiftAssignmentModel.countDocuments({
            shiftId: new mongoose_2.Types.ObjectId(id),
            status: { $nin: [enums_1.ShiftAssignmentStatus.CANCELLED, enums_1.ShiftAssignmentStatus.EXPIRED] }
        });
        if (assignmentsUsingShift > 0) {
            throw new common_1.BadRequestException(`Cannot delete shift. ${assignmentsUsingShift} active assignment(s) are using this shift.`);
        }
        await this.shiftModel.findByIdAndDelete(id);
        return { message: 'Shift deleted successfully' };
    }
    async assignShiftToEmployee(assignShiftToEmployeeDto, currentUserId) {
        const shift = await this.shiftModel.findById(assignShiftToEmployeeDto.shiftId);
        if (!shift) {
            throw new common_1.NotFoundException('Shift not found');
        }
        const newShiftAssignment = new this.shiftAssignmentModel({
            employeeId: new mongoose_2.Types.ObjectId(assignShiftToEmployeeDto.employeeId),
            shiftId: new mongoose_2.Types.ObjectId(assignShiftToEmployeeDto.shiftId),
            departmentId: assignShiftToEmployeeDto.departmentId
                ? new mongoose_2.Types.ObjectId(assignShiftToEmployeeDto.departmentId)
                : undefined,
            positionId: assignShiftToEmployeeDto.positionId
                ? new mongoose_2.Types.ObjectId(assignShiftToEmployeeDto.positionId)
                : undefined,
            scheduleRuleId: assignShiftToEmployeeDto.scheduleRuleId
                ? new mongoose_2.Types.ObjectId(assignShiftToEmployeeDto.scheduleRuleId)
                : undefined,
            startDate: assignShiftToEmployeeDto.startDate,
            endDate: assignShiftToEmployeeDto.endDate,
            status: assignShiftToEmployeeDto.status || enums_1.ShiftAssignmentStatus.PENDING,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        return newShiftAssignment.save();
    }
    async assignShiftToDepartment(dto, currentUserId) {
        const shift = await this.shiftModel.findById(dto.shiftId);
        if (!shift) {
            throw new common_1.NotFoundException('Shift not found');
        }
        const assignment = new this.shiftAssignmentModel({
            departmentId: new mongoose_2.Types.ObjectId(dto.departmentId),
            shiftId: new mongoose_2.Types.ObjectId(dto.shiftId),
            startDate: dto.startDate || new Date(),
            endDate: dto.endDate,
            status: enums_1.ShiftAssignmentStatus.APPROVED,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        return assignment.save();
    }
    async assignShiftToPosition(dto, currentUserId) {
        const shift = await this.shiftModel.findById(dto.shiftId);
        if (!shift) {
            throw new common_1.NotFoundException('Shift not found');
        }
        const assignment = new this.shiftAssignmentModel({
            positionId: new mongoose_2.Types.ObjectId(dto.positionId),
            shiftId: new mongoose_2.Types.ObjectId(dto.shiftId),
            startDate: dto.startDate || new Date(),
            endDate: dto.endDate,
            status: enums_1.ShiftAssignmentStatus.APPROVED,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        return assignment.save();
    }
    async updateShiftAssignment(id, updateShiftAssignmentDto, currentUserId) {
        const assignment = await this.shiftAssignmentModel.findById(id);
        if (!assignment) {
            throw new common_1.NotFoundException('Shift assignment not found');
        }
        return this.shiftAssignmentModel.findByIdAndUpdate(id, {
            ...updateShiftAssignmentDto,
            updatedBy: currentUserId,
        }, { new: true });
    }
    async getEmployeeShiftAssignments(employeeId, currentUserId) {
        return this.shiftAssignmentModel
            .find({ employeeId: new mongoose_2.Types.ObjectId(employeeId) })
            .populate('shiftId')
            .populate('scheduleRuleId')
            .exec();
    }
    async getDepartmentShiftAssignments(departmentId) {
        return this.shiftAssignmentModel
            .find({ departmentId: new mongoose_2.Types.ObjectId(departmentId) })
            .populate('shiftId')
            .exec();
    }
    async getPositionShiftAssignments(positionId) {
        return this.shiftAssignmentModel
            .find({ positionId: new mongoose_2.Types.ObjectId(positionId) })
            .populate('shiftId')
            .exec();
    }
    async getShiftAssignmentStatus(shiftAssignmentId, currentUserId) {
        const assignment = await this.shiftAssignmentModel.findById(shiftAssignmentId).exec();
        if (!assignment) {
            throw new common_1.NotFoundException('Shift assignment not found');
        }
        return {
            assignmentId: shiftAssignmentId,
            status: assignment.status,
            startDate: assignment.startDate,
            endDate: assignment.endDate,
        };
    }
    async renewShiftAssignment(dto, currentUserId) {
        const assignment = await this.shiftAssignmentModel.findById(dto.assignmentId);
        if (!assignment) {
            throw new common_1.NotFoundException('Shift assignment not found');
        }
        const newEndDate = dto.newEndDate || new Date((assignment.endDate || new Date()).getTime() + 30 * 24 * 60 * 60 * 1000);
        return this.shiftAssignmentModel.findByIdAndUpdate(dto.assignmentId, {
            endDate: newEndDate,
            status: enums_1.ShiftAssignmentStatus.APPROVED,
            updatedBy: currentUserId,
        }, { new: true });
    }
    async cancelShiftAssignment(dto, currentUserId) {
        const assignment = await this.shiftAssignmentModel.findById(dto.assignmentId);
        if (!assignment) {
            throw new common_1.NotFoundException('Shift assignment not found');
        }
        return this.shiftAssignmentModel.findByIdAndUpdate(dto.assignmentId, {
            status: enums_1.ShiftAssignmentStatus.CANCELLED,
            updatedBy: currentUserId,
        }, { new: true });
    }
    async postponeShiftAssignment(dto, currentUserId) {
        const assignment = await this.shiftAssignmentModel.findById(dto.assignmentId);
        if (!assignment) {
            throw new common_1.NotFoundException('Shift assignment not found');
        }
        return this.shiftAssignmentModel.findByIdAndUpdate(dto.assignmentId, {
            startDate: dto.postponeUntil,
            status: enums_1.ShiftAssignmentStatus.PENDING,
            updatedBy: currentUserId,
        }, { new: true });
    }
    async checkExpiredAssignments() {
        const now = new Date();
        const result = await this.shiftAssignmentModel.updateMany({
            endDate: { $lt: now },
            status: { $nin: [enums_1.ShiftAssignmentStatus.CANCELLED, enums_1.ShiftAssignmentStatus.EXPIRED] },
        }, {
            $set: { status: enums_1.ShiftAssignmentStatus.EXPIRED },
        });
        return {
            message: 'Expired assignments updated',
            modifiedCount: result.modifiedCount,
        };
    }
    async getAllShiftAssignments(filters) {
        const query = {};
        if (filters.status) {
            query.status = filters.status;
        }
        if (filters.employeeId) {
            query.employeeId = new mongoose_2.Types.ObjectId(filters.employeeId);
        }
        if (filters.departmentId) {
            query.departmentId = new mongoose_2.Types.ObjectId(filters.departmentId);
        }
        if (filters.positionId) {
            query.positionId = new mongoose_2.Types.ObjectId(filters.positionId);
        }
        if (filters.shiftId) {
            query.shiftId = new mongoose_2.Types.ObjectId(filters.shiftId);
        }
        return this.shiftAssignmentModel
            .find(query)
            .populate('shiftId')
            .populate('employeeId')
            .populate('departmentId')
            .populate('positionId')
            .exec();
    }
    async getShiftAssignmentById(id) {
        const assignment = await this.shiftAssignmentModel
            .findById(id)
            .populate('shiftId')
            .populate('employeeId')
            .populate('departmentId')
            .populate('positionId')
            .exec();
        if (!assignment) {
            throw new common_1.NotFoundException('Shift assignment not found');
        }
        return assignment;
    }
    async createScheduleRule(createScheduleRuleDto, currentUserId) {
        const validPatterns = [
            'STANDARD',
            'FLEXIBLE',
            'ROTATIONAL',
            'COMPRESSED',
            'SPLIT',
            /^(\d+)-ON\/(\d+)-OFF$/,
            /^FLEX:([\d:]+)-([\d:]+)$/,
        ];
        const pattern = createScheduleRuleDto.pattern?.toUpperCase();
        const isValidPattern = validPatterns.some(p => typeof p === 'string' ? p === pattern : p.test(pattern));
        if (!isValidPattern && pattern) {
            console.warn(`Custom pattern used: ${pattern}. Ensure it's properly validated in attendance.`);
        }
        const newScheduleRule = new this.scheduleRuleModel({
            ...createScheduleRuleDto,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        return newScheduleRule.save();
    }
    async getScheduleRules(filters) {
        const query = {};
        if (filters?.active !== undefined) {
            query.active = filters.active;
        }
        return this.scheduleRuleModel.find(query).exec();
    }
    async getScheduleRuleById(id) {
        const scheduleRule = await this.scheduleRuleModel.findById(id).exec();
        if (!scheduleRule) {
            throw new common_1.NotFoundException('Schedule rule not found');
        }
        return scheduleRule;
    }
    async updateScheduleRule(id, updateScheduleRuleDto, currentUserId) {
        const scheduleRule = await this.scheduleRuleModel.findById(id);
        if (!scheduleRule) {
            throw new common_1.NotFoundException('Schedule rule not found');
        }
        return this.scheduleRuleModel.findByIdAndUpdate(id, {
            ...updateScheduleRuleDto,
            updatedBy: currentUserId,
        }, { new: true });
    }
    async deleteScheduleRule(id) {
        const scheduleRule = await this.scheduleRuleModel.findById(id);
        if (!scheduleRule) {
            throw new common_1.NotFoundException('Schedule rule not found');
        }
        const assignmentsUsingRule = await this.shiftAssignmentModel.countDocuments({
            scheduleRuleId: new mongoose_2.Types.ObjectId(id),
            status: { $nin: [enums_1.ShiftAssignmentStatus.CANCELLED, enums_1.ShiftAssignmentStatus.EXPIRED] },
        });
        if (assignmentsUsingRule > 0) {
            throw new common_1.BadRequestException(`Cannot delete schedule rule. ${assignmentsUsingRule} active shift assignment(s) are using this rule.`);
        }
        await this.scheduleRuleModel.findByIdAndDelete(id);
        return { message: 'Schedule rule deleted successfully' };
    }
    async defineFlexibleSchedulingRules(defineFlexibleSchedulingRulesDto, currentUserId) {
        const pattern = defineFlexibleSchedulingRulesDto.pattern?.toUpperCase();
        const flexiblePatterns = ['FLEXIBLE', 'COMPRESSED', 'ROTATIONAL'];
        const isFlexPattern = flexiblePatterns.some(p => pattern?.includes(p)) ||
            /^(\d+)-ON\/(\d+)-OFF$/.test(pattern) ||
            /^FLEX:/.test(pattern);
        if (!isFlexPattern) {
            console.warn(`Pattern "${pattern}" may not be a flexible scheduling pattern.`);
        }
        const newFlexibleSchedule = new this.scheduleRuleModel({
            ...defineFlexibleSchedulingRulesDto,
            createdBy: currentUserId,
            updatedBy: currentUserId,
        });
        return newFlexibleSchedule.save();
    }
    async validateScheduleRule(scheduleRuleId, assignmentDate) {
        const scheduleRule = await this.scheduleRuleModel.findById(scheduleRuleId);
        if (!scheduleRule) {
            throw new common_1.NotFoundException('Schedule rule not found');
        }
        const pattern = scheduleRule.pattern?.toUpperCase();
        const checkDate = assignmentDate || new Date();
        const validationResult = {
            scheduleRuleId,
            ruleName: scheduleRule.name,
            pattern: scheduleRule.pattern,
            isActive: scheduleRule.active,
            isValid: true,
            checkDate,
            patternType: 'UNKNOWN',
            message: '',
        };
        if (pattern === 'STANDARD') {
            validationResult.patternType = 'STANDARD';
            validationResult.message = 'Standard 5-day work week (Mon-Fri)';
        }
        else if (pattern === 'FLEXIBLE') {
            validationResult.patternType = 'FLEXIBLE';
            validationResult.message = 'Flexible hours with core hours compliance';
        }
        else if (pattern === 'ROTATIONAL') {
            validationResult.patternType = 'ROTATIONAL';
            validationResult.message = 'Rotating shift pattern';
        }
        else if (pattern === 'COMPRESSED') {
            validationResult.patternType = 'COMPRESSED';
            validationResult.message = 'Compressed work week (e.g., 4x10 hours)';
        }
        else if (pattern === 'SPLIT') {
            validationResult.patternType = 'SPLIT';
            validationResult.message = 'Split shift pattern';
        }
        else if (/^(\d+)-ON\/(\d+)-OFF$/.test(pattern)) {
            const match = pattern.match(/^(\d+)-ON\/(\d+)-OFF$/);
            validationResult.patternType = 'CUSTOM_ROTATION';
            validationResult.message = `Custom rotation: ${match[1]} days on, ${match[2]} days off`;
        }
        else if (/^FLEX:/.test(pattern)) {
            validationResult.patternType = 'FLEX_WINDOW';
            validationResult.message = 'Flexible start/end time window';
        }
        else {
            validationResult.patternType = 'CUSTOM';
            validationResult.message = 'Custom pattern - manual validation required';
        }
        if (!scheduleRule.active) {
            validationResult.isValid = false;
            validationResult.message = 'Schedule rule is inactive';
        }
        return validationResult;
    }
    async applyScheduleRuleToShiftAssignment(shiftAssignmentId, scheduleRuleId, currentUserId) {
        const assignment = await this.shiftAssignmentModel.findById(shiftAssignmentId);
        if (!assignment) {
            throw new common_1.NotFoundException('Shift assignment not found');
        }
        const scheduleRule = await this.scheduleRuleModel.findById(scheduleRuleId);
        if (!scheduleRule) {
            throw new common_1.NotFoundException('Schedule rule not found');
        }
        if (!scheduleRule.active) {
            throw new common_1.BadRequestException('Cannot apply inactive schedule rule');
        }
        return this.shiftAssignmentModel.findByIdAndUpdate(shiftAssignmentId, {
            scheduleRuleId: new mongoose_2.Types.ObjectId(scheduleRuleId),
            updatedBy: currentUserId,
        }, { new: true }).populate('scheduleRuleId');
    }
    async getShiftAssignmentsByScheduleRule(scheduleRuleId) {
        return this.shiftAssignmentModel
            .find({
            scheduleRuleId: new mongoose_2.Types.ObjectId(scheduleRuleId),
            status: { $nin: [enums_1.ShiftAssignmentStatus.CANCELLED, enums_1.ShiftAssignmentStatus.EXPIRED] },
        })
            .populate('shiftId')
            .populate('employeeId')
            .populate('departmentId')
            .populate('positionId')
            .exec();
    }
    async isWorkingDayPerScheduleRule(scheduleRuleId, checkDate, cycleStartDate) {
        const scheduleRule = await this.scheduleRuleModel.findById(scheduleRuleId);
        if (!scheduleRule) {
            throw new common_1.NotFoundException('Schedule rule not found');
        }
        const pattern = scheduleRule.pattern?.toUpperCase();
        const dayOfWeek = checkDate.getDay();
        if (pattern === 'STANDARD') {
            const isWorkingDay = dayOfWeek >= 1 && dayOfWeek <= 5;
            return {
                isWorkingDay,
                reason: isWorkingDay ? 'Weekday (Mon-Fri)' : 'Weekend',
            };
        }
        if (/^(\d+)-ON\/(\d+)-OFF$/.test(pattern)) {
            const match = pattern.match(/^(\d+)-ON\/(\d+)-OFF$/);
            const daysOn = parseInt(match[1], 10);
            const daysOff = parseInt(match[2], 10);
            const cycleLength = daysOn + daysOff;
            const startDate = cycleStartDate || new Date(checkDate.getFullYear(), 0, 1);
            const daysSinceStart = Math.floor((checkDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            const dayInCycle = daysSinceStart % cycleLength;
            const isWorkingDay = dayInCycle < daysOn;
            return {
                isWorkingDay,
                reason: isWorkingDay
                    ? `Day ${dayInCycle + 1} of ${daysOn} working days`
                    : `Day ${dayInCycle - daysOn + 1} of ${daysOff} off days`,
            };
        }
        if (pattern === 'COMPRESSED') {
            const isWorkingDay = dayOfWeek >= 1 && dayOfWeek <= 4;
            return {
                isWorkingDay,
                reason: isWorkingDay ? 'Compressed week day (Mon-Thu)' : 'Off day (Fri-Sun)',
            };
        }
        return {
            isWorkingDay: true,
            reason: 'Custom pattern - assumed working day',
        };
    }
};
exports.ShiftScheduleService = ShiftScheduleService;
exports.ShiftScheduleService = ShiftScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(shift_type_schema_1.ShiftType.name)),
    __param(1, (0, mongoose_1.InjectModel)(shift_schema_1.Shift.name)),
    __param(2, (0, mongoose_1.InjectModel)(shift_assignment_schema_1.ShiftAssignment.name)),
    __param(3, (0, mongoose_1.InjectModel)(schedule_rule_schema_1.ScheduleRule.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ShiftScheduleService);
//# sourceMappingURL=shift-schedule.service.js.map