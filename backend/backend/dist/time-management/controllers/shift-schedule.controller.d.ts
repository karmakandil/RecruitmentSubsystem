import { ShiftScheduleService } from '../services/shift-schedule.service';
import { ShiftAssignmentStatus } from '../models/enums';
import { CreateShiftTypeDto, CreateShiftDto, AssignShiftToEmployeeDto, AssignShiftToDepartmentDto, AssignShiftToPositionDto, UpdateShiftDto, UpdateShiftAssignmentDto, RenewShiftAssignmentDto, CancelShiftAssignmentDto, PostponeShiftAssignmentDto, CreateScheduleRuleDto, DefineFlexibleSchedulingRulesDto } from '../DTOs/shift.dtos';
export declare class ShiftAndScheduleController {
    private readonly shiftScheduleService;
    constructor(shiftScheduleService: ShiftScheduleService);
    createShiftType(createShiftTypeDto: CreateShiftTypeDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/shift-type.schema").ShiftType, {}, {}> & import("../models/shift-type.schema").ShiftType & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getShiftTypes(active?: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/shift-type.schema").ShiftType, {}, {}> & import("../models/shift-type.schema").ShiftType & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getShiftTypeById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../models/shift-type.schema").ShiftType, {}, {}> & import("../models/shift-type.schema").ShiftType & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateShiftType(id: string, updateShiftTypeDto: CreateShiftTypeDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/shift-type.schema").ShiftType, {}, {}> & import("../models/shift-type.schema").ShiftType & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteShiftType(id: string): Promise<{
        message: string;
    }>;
    createShift(createShiftDto: CreateShiftDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/shift.schema").Shift, {}, {}> & import("../models/shift.schema").Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getShifts(active?: string, shiftType?: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/shift.schema").Shift, {}, {}> & import("../models/shift.schema").Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getShiftById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../models/shift.schema").Shift, {}, {}> & import("../models/shift.schema").Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateShift(id: string, updateShiftDto: UpdateShiftDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/shift.schema").Shift, {}, {}> & import("../models/shift.schema").Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteShift(id: string): Promise<{
        message: string;
    }>;
    getShiftsByType(shiftTypeId: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/shift.schema").Shift, {}, {}> & import("../models/shift.schema").Shift & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    assignShiftToEmployee(assignShiftToEmployeeDto: AssignShiftToEmployeeDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/shift-assignment.schema").ShiftAssignment, {}, {}> & import("../models/shift-assignment.schema").ShiftAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    assignShiftToDepartment(dto: AssignShiftToDepartmentDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/shift-assignment.schema").ShiftAssignment, {}, {}> & import("../models/shift-assignment.schema").ShiftAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    assignShiftToPosition(dto: AssignShiftToPositionDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/shift-assignment.schema").ShiftAssignment, {}, {}> & import("../models/shift-assignment.schema").ShiftAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateShiftAssignment(id: string, dto: UpdateShiftAssignmentDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/shift-assignment.schema").ShiftAssignment, {}, {}> & import("../models/shift-assignment.schema").ShiftAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAllShiftAssignments(status?: ShiftAssignmentStatus, employeeId?: string, departmentId?: string, positionId?: string, shiftId?: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/shift-assignment.schema").ShiftAssignment, {}, {}> & import("../models/shift-assignment.schema").ShiftAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getShiftAssignmentById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../models/shift-assignment.schema").ShiftAssignment, {}, {}> & import("../models/shift-assignment.schema").ShiftAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getEmployeeShiftAssignments(employeeId: string, user: any): Promise<(import("mongoose").Document<unknown, {}, import("../models/shift-assignment.schema").ShiftAssignment, {}, {}> & import("../models/shift-assignment.schema").ShiftAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getDepartmentShiftAssignments(departmentId: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/shift-assignment.schema").ShiftAssignment, {}, {}> & import("../models/shift-assignment.schema").ShiftAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getPositionShiftAssignments(positionId: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/shift-assignment.schema").ShiftAssignment, {}, {}> & import("../models/shift-assignment.schema").ShiftAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getShiftAssignmentStatus(id: string, user: any): Promise<{
        assignmentId: string;
        status: ShiftAssignmentStatus;
        startDate: Date;
        endDate: Date;
    }>;
    renewShiftAssignment(dto: RenewShiftAssignmentDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/shift-assignment.schema").ShiftAssignment, {}, {}> & import("../models/shift-assignment.schema").ShiftAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    cancelShiftAssignment(dto: CancelShiftAssignmentDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/shift-assignment.schema").ShiftAssignment, {}, {}> & import("../models/shift-assignment.schema").ShiftAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    postponeShiftAssignment(dto: PostponeShiftAssignmentDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/shift-assignment.schema").ShiftAssignment, {}, {}> & import("../models/shift-assignment.schema").ShiftAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    checkExpiredAssignments(): Promise<{
        message: string;
        modifiedCount: number;
    }>;
    createScheduleRule(createScheduleRuleDto: CreateScheduleRuleDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/schedule-rule.schema").ScheduleRule, {}, {}> & import("../models/schedule-rule.schema").ScheduleRule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getScheduleRules(active?: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/schedule-rule.schema").ScheduleRule, {}, {}> & import("../models/schedule-rule.schema").ScheduleRule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getScheduleRuleById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../models/schedule-rule.schema").ScheduleRule, {}, {}> & import("../models/schedule-rule.schema").ScheduleRule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateScheduleRule(id: string, updateScheduleRuleDto: CreateScheduleRuleDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/schedule-rule.schema").ScheduleRule, {}, {}> & import("../models/schedule-rule.schema").ScheduleRule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteScheduleRule(id: string): Promise<{
        message: string;
    }>;
    defineFlexibleSchedulingRules(defineFlexibleSchedulingRulesDto: DefineFlexibleSchedulingRulesDto, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/schedule-rule.schema").ScheduleRule, {}, {}> & import("../models/schedule-rule.schema").ScheduleRule & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    validateScheduleRule(body: {
        scheduleRuleId: string;
        assignmentDate?: Date;
    }): Promise<{
        scheduleRuleId: string;
        ruleName: string;
        pattern: string;
        isActive: boolean;
        isValid: boolean;
        checkDate: Date;
        patternType: string;
        message: string;
    }>;
    applyScheduleRuleToShiftAssignment(body: {
        shiftAssignmentId: string;
        scheduleRuleId: string;
    }, user: any): Promise<import("mongoose").Document<unknown, {}, import("../models/shift-assignment.schema").ShiftAssignment, {}, {}> & import("../models/shift-assignment.schema").ShiftAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getShiftAssignmentsByScheduleRule(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/shift-assignment.schema").ShiftAssignment, {}, {}> & import("../models/shift-assignment.schema").ShiftAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    isWorkingDayPerScheduleRule(body: {
        scheduleRuleId: string;
        checkDate: Date;
        cycleStartDate?: Date;
    }): Promise<{
        isWorkingDay: boolean;
        reason: string;
    }>;
}
