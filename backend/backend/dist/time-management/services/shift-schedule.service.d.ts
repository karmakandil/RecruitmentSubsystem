import { Model, Types } from 'mongoose';
import { ShiftType } from '../models/shift-type.schema';
import { Shift } from '../models/shift.schema';
import { ShiftAssignment } from '../models/shift-assignment.schema';
import { ScheduleRule } from '../models/schedule-rule.schema';
import { ShiftAssignmentStatus } from '../models/enums';
import { AssignShiftToEmployeeDto, AssignShiftToDepartmentDto, AssignShiftToPositionDto, UpdateShiftAssignmentDto, RenewShiftAssignmentDto, CancelShiftAssignmentDto, PostponeShiftAssignmentDto } from '../DTOs/shift.dtos';
export declare class ShiftScheduleService {
    private shiftTypeModel;
    private shiftModel;
    private shiftAssignmentModel;
    private scheduleRuleModel;
    constructor(shiftTypeModel: Model<ShiftType>, shiftModel: Model<Shift>, shiftAssignmentModel: Model<ShiftAssignment>, scheduleRuleModel: Model<ScheduleRule>);
    createShiftType(createShiftTypeDto: any, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, ShiftType, {}, {}> & ShiftType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateShiftType(id: string, updateShiftTypeDto: any, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, ShiftType, {}, {}> & ShiftType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getShiftTypes(filters?: {
        active?: boolean;
    }): Promise<(import("mongoose").Document<unknown, {}, ShiftType, {}, {}> & ShiftType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getShiftTypeById(id: string): Promise<import("mongoose").Document<unknown, {}, ShiftType, {}, {}> & ShiftType & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteShiftType(id: string): Promise<{
        message: string;
    }>;
    createShift(createShiftDto: any, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, Shift, {}, {}> & Shift & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateShift(id: string, updateShiftDto: any, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, Shift, {}, {}> & Shift & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getShifts(filters?: {
        active?: boolean;
        shiftType?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, Shift, {}, {}> & Shift & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getShiftById(id: string): Promise<import("mongoose").Document<unknown, {}, Shift, {}, {}> & Shift & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getShiftsByType(shiftTypeId: string): Promise<(import("mongoose").Document<unknown, {}, Shift, {}, {}> & Shift & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    deleteShift(id: string): Promise<{
        message: string;
    }>;
    assignShiftToEmployee(assignShiftToEmployeeDto: AssignShiftToEmployeeDto, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, ShiftAssignment, {}, {}> & ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    assignShiftToDepartment(dto: AssignShiftToDepartmentDto, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, ShiftAssignment, {}, {}> & ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    assignShiftToPosition(dto: AssignShiftToPositionDto, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, ShiftAssignment, {}, {}> & ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateShiftAssignment(id: string, updateShiftAssignmentDto: UpdateShiftAssignmentDto, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, ShiftAssignment, {}, {}> & ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getEmployeeShiftAssignments(employeeId: string, currentUserId: string): Promise<(import("mongoose").Document<unknown, {}, ShiftAssignment, {}, {}> & ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getDepartmentShiftAssignments(departmentId: string): Promise<(import("mongoose").Document<unknown, {}, ShiftAssignment, {}, {}> & ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getPositionShiftAssignments(positionId: string): Promise<(import("mongoose").Document<unknown, {}, ShiftAssignment, {}, {}> & ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getShiftAssignmentStatus(shiftAssignmentId: string, currentUserId: string): Promise<{
        assignmentId: string;
        status: ShiftAssignmentStatus;
        startDate: Date;
        endDate: Date;
    }>;
    renewShiftAssignment(dto: RenewShiftAssignmentDto, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, ShiftAssignment, {}, {}> & ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    cancelShiftAssignment(dto: CancelShiftAssignmentDto, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, ShiftAssignment, {}, {}> & ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    postponeShiftAssignment(dto: PostponeShiftAssignmentDto, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, ShiftAssignment, {}, {}> & ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    checkExpiredAssignments(): Promise<{
        message: string;
        modifiedCount: number;
    }>;
    getAllShiftAssignments(filters: {
        status?: ShiftAssignmentStatus;
        employeeId?: string;
        departmentId?: string;
        positionId?: string;
        shiftId?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, ShiftAssignment, {}, {}> & ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getShiftAssignmentById(id: string): Promise<import("mongoose").Document<unknown, {}, ShiftAssignment, {}, {}> & ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    createScheduleRule(createScheduleRuleDto: any, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, ScheduleRule, {}, {}> & ScheduleRule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getScheduleRules(filters?: {
        active?: boolean;
    }): Promise<(import("mongoose").Document<unknown, {}, ScheduleRule, {}, {}> & ScheduleRule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getScheduleRuleById(id: string): Promise<import("mongoose").Document<unknown, {}, ScheduleRule, {}, {}> & ScheduleRule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateScheduleRule(id: string, updateScheduleRuleDto: any, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, ScheduleRule, {}, {}> & ScheduleRule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteScheduleRule(id: string): Promise<{
        message: string;
    }>;
    defineFlexibleSchedulingRules(defineFlexibleSchedulingRulesDto: any, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, ScheduleRule, {}, {}> & ScheduleRule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    validateScheduleRule(scheduleRuleId: string, assignmentDate?: Date): Promise<{
        scheduleRuleId: string;
        ruleName: string;
        pattern: string;
        isActive: boolean;
        isValid: boolean;
        checkDate: Date;
        patternType: string;
        message: string;
    }>;
    applyScheduleRuleToShiftAssignment(shiftAssignmentId: string, scheduleRuleId: string, currentUserId: string): Promise<import("mongoose").Document<unknown, {}, ShiftAssignment, {}, {}> & ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getShiftAssignmentsByScheduleRule(scheduleRuleId: string): Promise<(import("mongoose").Document<unknown, {}, ShiftAssignment, {}, {}> & ShiftAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    isWorkingDayPerScheduleRule(scheduleRuleId: string, checkDate: Date, cycleStartDate?: Date): Promise<{
        isWorkingDay: boolean;
        reason: string;
    }>;
}
