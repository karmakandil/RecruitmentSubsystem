"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeProfileService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcrypt"));
const ExcelJS = __importStar(require("exceljs"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const employee_profile_schema_1 = require("./models/employee-profile.schema");
const ep_change_request_schema_1 = require("./models/ep-change-request.schema");
const candidate_schema_1 = require("./models/candidate.schema");
const employee_system_role_schema_1 = require("./models/employee-system-role.schema");
const qualification_schema_1 = require("./models/qualification.schema");
const employee_profile_enums_1 = require("./enums/employee-profile.enums");
let EmployeeProfileService = class EmployeeProfileService {
    constructor(employeeModel, candidateModel, changeRequestModel, systemRoleModel, qualificationModel) {
        this.employeeModel = employeeModel;
        this.candidateModel = candidateModel;
        this.changeRequestModel = changeRequestModel;
        this.systemRoleModel = systemRoleModel;
        this.qualificationModel = qualificationModel;
    }
    async create(createEmployeeDto) {
        const existingEmployee = await this.employeeModel
            .findOne({ nationalId: createEmployeeDto.nationalId })
            .exec();
        if (existingEmployee) {
            throw new common_1.ConflictException('Employee with this National ID already exists');
        }
        const employeeNumber = await this.generateEmployeeNumber();
        let hashedPassword;
        if (createEmployeeDto.password) {
            hashedPassword = await bcrypt.hash(createEmployeeDto.password, 10);
        }
        const fullName = [
            createEmployeeDto.firstName,
            createEmployeeDto.middleName,
            createEmployeeDto.lastName,
        ]
            .filter(Boolean)
            .join(' ');
        const employee = new this.employeeModel({
            ...createEmployeeDto,
            employeeNumber,
            fullName,
            password: hashedPassword,
            status: createEmployeeDto.status || employee_profile_enums_1.EmployeeStatus.PROBATION,
            statusEffectiveFrom: new Date(),
        });
        const savedEmployee = await employee.save();
        await this.systemRoleModel.create({
            employeeProfileId: savedEmployee._id,
            roles: [employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE],
            isActive: true,
        });
        return savedEmployee;
    }
    async findAll(query, currentUserId) {
        const { search, departmentId, positionId, status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', } = query;
        const filter = {};
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { employeeNumber: { $regex: search, $options: 'i' } },
                { workEmail: { $regex: search, $options: 'i' } },
            ];
        }
        if (departmentId) {
            filter.primaryDepartmentId = new mongoose_2.Types.ObjectId(departmentId);
        }
        if (positionId) {
            filter.primaryPositionId = new mongoose_2.Types.ObjectId(positionId);
        }
        if (status) {
            filter.status = status;
        }
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const skip = (page - 1) * limit;
        const [employees, total] = await Promise.all([
            this.employeeModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('primaryDepartmentId', 'name code')
                .populate('primaryPositionId', 'title code')
                .populate('supervisorPositionId', 'title code')
                .populate('payGradeId', 'grade grossSalary')
                .select('-password')
                .lean()
                .exec(),
            this.employeeModel.countDocuments(filter).exec(),
        ]);
        return {
            data: employees,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid employee ID');
        }
        const employee = await this.employeeModel
            .findById(id)
            .populate('primaryDepartmentId', 'name code description')
            .populate('primaryPositionId', 'title code description')
            .populate('supervisorPositionId', 'title code')
            .populate('payGradeId', 'grade baseSalary grossSalary')
            .populate('lastAppraisalRecordId')
            .populate('accessProfileId')
            .select('-password')
            .exec();
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
        }
        return employee;
    }
    async findByEmployeeNumber(employeeNumber) {
        const employee = await this.employeeModel
            .findOne({ employeeNumber })
            .select('-password')
            .exec();
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with number ${employeeNumber} not found`);
        }
        return employee;
    }
    async findByNationalId(nationalId) {
        const employee = await this.employeeModel
            .findOne({ nationalId })
            .select('-password')
            .exec();
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with national ID ${nationalId} not found`);
        }
        return employee;
    }
    async update(id, updateEmployeeDto) {
        const employee = await this.findOne(id);
        if (updateEmployeeDto.firstName ||
            updateEmployeeDto.middleName ||
            updateEmployeeDto.lastName) {
            const fullName = [
                updateEmployeeDto.firstName || employee.firstName,
                updateEmployeeDto.middleName || employee.middleName,
                updateEmployeeDto.lastName || employee.lastName,
            ]
                .filter(Boolean)
                .join(' ');
            updateEmployeeDto['fullName'] = fullName;
        }
        if (updateEmployeeDto.status &&
            updateEmployeeDto.status !== employee.status) {
            updateEmployeeDto['statusEffectiveFrom'] = new Date();
        }
        const updatedEmployee = await this.employeeModel
            .findByIdAndUpdate(id, { $set: updateEmployeeDto }, { new: true })
            .select('-password')
            .exec();
        return updatedEmployee;
    }
    async updateSelfService(id, updateDto) {
        await this.findOne(id);
        const updatedEmployee = await this.employeeModel
            .findByIdAndUpdate(id, { $set: updateDto }, { new: true })
            .select('-password')
            .exec();
        return updatedEmployee;
    }
    async updateBankingInfo(id, bankingData) {
        await this.findOne(id);
        const updatedEmployee = await this.employeeModel
            .findByIdAndUpdate(id, { $set: bankingData }, { new: true })
            .select('-password')
            .exec();
        return updatedEmployee;
    }
    async updateBiography(id, biography) {
        await this.findOne(id);
        const updatedEmployee = await this.employeeModel
            .findByIdAndUpdate(id, { $set: { biography } }, { new: true })
            .select('-password')
            .exec();
        return updatedEmployee;
    }
    async uploadProfilePhoto(id, photo) {
        await this.findOne(id);
        const profilePictureUrl = `https://storage.example.com/profiles/${id}/photo.jpg`;
        await this.employeeModel
            .findByIdAndUpdate(id, { $set: { profilePictureUrl } }, { new: true })
            .exec();
        return profilePictureUrl;
    }
    async remove(id) {
        const employee = await this.findOne(id);
        await this.employeeModel
            .findByIdAndUpdate(id, {
            $set: {
                status: employee_profile_enums_1.EmployeeStatus.TERMINATED,
                statusEffectiveFrom: new Date(),
            },
        }, { new: true })
            .exec();
    }
    async assignSystemRoles(employeeId, roles, permissions = []) {
        await this.findOne(employeeId);
        const existingRole = await this.systemRoleModel
            .findOne({ employeeProfileId: new mongoose_2.Types.ObjectId(employeeId) })
            .exec();
        if (existingRole) {
            existingRole.roles = roles;
            existingRole.permissions = permissions;
            existingRole.isActive = true;
            return existingRole.save();
        }
        return this.systemRoleModel.create({
            employeeProfileId: new mongoose_2.Types.ObjectId(employeeId),
            roles,
            permissions,
            isActive: true,
        });
    }
    async getSystemRoles(employeeId) {
        return this.systemRoleModel
            .findOne({ employeeProfileId: new mongoose_2.Types.ObjectId(employeeId) })
            .exec();
    }
    async updateSystemRoles(employeeId, roles, permissions) {
        await this.findOne(employeeId);
        const existingRole = await this.systemRoleModel
            .findOne({ employeeProfileId: new mongoose_2.Types.ObjectId(employeeId) })
            .exec();
        if (!existingRole) {
            throw new common_1.NotFoundException('System roles not found for employee');
        }
        const updateData = {};
        if (roles)
            updateData.roles = roles;
        if (permissions)
            updateData.permissions = permissions;
        const updatedRole = await this.systemRoleModel
            .findOneAndUpdate({ employeeProfileId: new mongoose_2.Types.ObjectId(employeeId) }, { $set: updateData }, { new: true })
            .exec();
        if (!updatedRole) {
            throw new common_1.NotFoundException('Failed to update system roles');
        }
        return updatedRole;
    }
    async deactivateSystemRoles(employeeId) {
        await this.findOne(employeeId);
        const result = await this.systemRoleModel
            .updateOne({ employeeProfileId: new mongoose_2.Types.ObjectId(employeeId) }, { $set: { isActive: false } })
            .exec();
        if (result.modifiedCount === 0) {
            throw new common_1.NotFoundException('System roles not found for employee');
        }
    }
    async createCandidate(createCandidateDto) {
        const existingCandidate = await this.candidateModel
            .findOne({ nationalId: createCandidateDto.nationalId })
            .exec();
        if (existingCandidate) {
            throw new common_1.ConflictException('Candidate with this National ID already exists');
        }
        const candidateNumber = await this.generateCandidateNumber();
        const fullName = [
            createCandidateDto.firstName,
            createCandidateDto.middleName,
            createCandidateDto.lastName,
        ]
            .filter(Boolean)
            .join(' ');
        const candidate = new this.candidateModel({
            ...createCandidateDto,
            candidateNumber,
            fullName,
            status: employee_profile_enums_1.CandidateStatus.APPLIED,
            applicationDate: new Date(),
        });
        return candidate.save();
    }
    async findAllCandidates() {
        return this.candidateModel
            .find()
            .populate('departmentId', 'name code')
            .populate('positionId', 'title code')
            .exec();
    }
    async findAllCandidatesWithFilters(query) {
        const filter = {};
        if (query.status) {
            filter.status = query.status;
        }
        if (query.departmentId) {
            filter.departmentId = new mongoose_2.Types.ObjectId(query.departmentId);
        }
        if (query.positionId) {
            filter.positionId = new mongoose_2.Types.ObjectId(query.positionId);
        }
        if (query.search) {
            filter.$or = [
                { firstName: { $regex: query.search, $options: 'i' } },
                { lastName: { $regex: query.search, $options: 'i' } },
                { candidateNumber: { $regex: query.search, $options: 'i' } },
                { personalEmail: { $regex: query.search, $options: 'i' } },
            ];
        }
        return this.candidateModel
            .find(filter)
            .populate('departmentId', 'name code')
            .populate('positionId', 'title code')
            .exec();
    }
    async findCandidateById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid candidate ID');
        }
        const candidate = await this.candidateModel
            .findById(id)
            .populate('departmentId', 'name code')
            .populate('positionId', 'title code')
            .exec();
        if (!candidate) {
            throw new common_1.NotFoundException(`Candidate with ID ${id} not found`);
        }
        return candidate;
    }
    async findCandidatesByStatus(status) {
        return this.candidateModel
            .find({ status })
            .populate('departmentId', 'name code')
            .populate('positionId', 'title code')
            .exec();
    }
    async updateCandidate(id, updateCandidateDto) {
        const candidate = await this.findCandidateById(id);
        if (updateCandidateDto.firstName ||
            updateCandidateDto.middleName ||
            updateCandidateDto.lastName) {
            const fullName = [
                updateCandidateDto.firstName || candidate.firstName,
                updateCandidateDto.middleName || candidate.middleName,
                updateCandidateDto.lastName || candidate.lastName,
            ]
                .filter(Boolean)
                .join(' ');
            updateCandidateDto['fullName'] = fullName;
        }
        const updatedCandidate = await this.candidateModel
            .findByIdAndUpdate(id, { $set: updateCandidateDto }, { new: true })
            .exec();
        return updatedCandidate;
    }
    async updateCandidateStatus(id, status) {
        const candidate = await this.findCandidateById(id);
        const updatedCandidate = await this.candidateModel
            .findByIdAndUpdate(id, { $set: { status } }, { new: true })
            .exec();
        return updatedCandidate;
    }
    async removeCandidate(id) {
        const candidate = await this.findCandidateById(id);
        await this.candidateModel.findByIdAndDelete(id).exec();
    }
    async convertCandidateToEmployee(candidateId, employeeData) {
        if (!employeeData?.workEmail) {
            throw new common_1.BadRequestException('workEmail is required in request body');
        }
        if (!employeeData?.dateOfHire) {
            throw new common_1.BadRequestException('dateOfHire is required in request body');
        }
        if (!employeeData?.contractType) {
            throw new common_1.BadRequestException('contractType is required in request body');
        }
        if (!employeeData?.workType) {
            throw new common_1.BadRequestException('workType is required in request body');
        }
        const candidate = await this.findCandidateById(candidateId);
        const createEmployeeDto = {
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            middleName: candidate.middleName,
            nationalId: candidate.nationalId,
            gender: candidate.gender,
            dateOfBirth: candidate.dateOfBirth,
            personalEmail: candidate.personalEmail,
            mobilePhone: candidate.mobilePhone,
            workEmail: employeeData.workEmail,
            dateOfHire: employeeData.dateOfHire,
            contractType: employeeData.contractType,
            workType: employeeData.workType,
            status: employee_profile_enums_1.EmployeeStatus.PROBATION,
            primaryDepartmentId: employeeData.primaryDepartmentId || candidate.departmentId?.toString(),
            primaryPositionId: employeeData.primaryPositionId || candidate.positionId?.toString(),
            password: employeeData.password,
        };
        const employee = await this.create(createEmployeeDto);
        await this.candidateModel
            .findByIdAndUpdate(candidateId, {
            $set: {
                status: employee_profile_enums_1.CandidateStatus.HIRED,
            },
        })
            .exec();
        return employee;
    }
    async createProfileChangeRequest(employeeId, createRequestDto) {
        await this.findOne(employeeId);
        const requestId = await this.generateChangeRequestId();
        const changeRequest = new this.changeRequestModel({
            requestId,
            employeeProfileId: new mongoose_2.Types.ObjectId(employeeId),
            requestDescription: createRequestDto.requestDescription,
            reason: createRequestDto.reason,
            status: employee_profile_enums_1.ProfileChangeStatus.PENDING,
            submittedAt: new Date(),
        });
        return changeRequest.save();
    }
    async getProfileChangeRequestsByEmployee(employeeId) {
        return this.changeRequestModel
            .find({ employeeProfileId: new mongoose_2.Types.ObjectId(employeeId) })
            .sort({ submittedAt: -1 })
            .exec();
    }
    async getAllProfileChangeRequests(status) {
        const filter = {};
        if (status) {
            filter.status = status;
        }
        return this.changeRequestModel
            .find(filter)
            .populate('employeeProfileId', 'firstName lastName employeeNumber')
            .sort({ submittedAt: -1 })
            .exec();
    }
    async getAllProfileChangeRequestsWithFilters(query) {
        const filter = {};
        if (query.status) {
            filter.status = query.status;
        }
        if (query.employeeId) {
            filter.employeeProfileId = new mongoose_2.Types.ObjectId(query.employeeId);
        }
        if (query.startDate) {
            filter.submittedAt = { $gte: new Date(query.startDate) };
        }
        if (query.endDate) {
            filter.submittedAt = {
                ...filter.submittedAt,
                $lte: new Date(query.endDate),
            };
        }
        return this.changeRequestModel
            .find(filter)
            .populate('employeeProfileId', 'firstName lastName employeeNumber')
            .sort({ submittedAt: -1 })
            .exec();
    }
    async getProfileChangeRequestById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid change request ID');
        }
        const request = await this.changeRequestModel
            .findById(id)
            .populate('employeeProfileId', 'firstName lastName employeeNumber')
            .exec();
        if (!request) {
            throw new common_1.NotFoundException(`Change request with ID ${id} not found`);
        }
        return request;
    }
    async processProfileChangeRequest(id, processDto) {
        const request = await this.getProfileChangeRequestById(id);
        if (request.status !== employee_profile_enums_1.ProfileChangeStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending change requests can be processed');
        }
        const updatedRequest = await this.changeRequestModel
            .findByIdAndUpdate(id, {
            $set: {
                status: processDto.status,
                reason: processDto.reason,
                processedAt: new Date(),
            },
        }, { new: true })
            .populate('employeeProfileId', 'firstName lastName employeeNumber')
            .exec();
        if (!updatedRequest) {
            throw new common_1.NotFoundException('Change request not found after update');
        }
        return updatedRequest;
    }
    async cancelProfileChangeRequest(id, employeeId) {
        const request = await this.getProfileChangeRequestById(id);
        if (request.employeeProfileId.toString() !== employeeId.toString()) {
            throw new common_1.ForbiddenException('You are not authorized to cancel this change request');
        }
        if (request.status !== employee_profile_enums_1.ProfileChangeStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending change requests can be cancelled');
        }
        const updatedRequest = await this.changeRequestModel
            .findByIdAndUpdate(id, {
            $set: {
                status: employee_profile_enums_1.ProfileChangeStatus.CANCELED,
                processedAt: new Date(),
            },
        }, { new: true })
            .exec();
        if (!updatedRequest) {
            throw new common_1.NotFoundException('Change request not found after update');
        }
        return updatedRequest;
    }
    async addQualification(employeeId, qualificationData) {
        await this.findOne(employeeId);
        const qualification = new this.qualificationModel({
            employeeProfileId: new mongoose_2.Types.ObjectId(employeeId),
            establishmentName: qualificationData.establishmentName,
            graduationType: qualificationData.graduationType,
        });
        return qualification.save();
    }
    async getQualificationsByEmployee(employeeId) {
        return this.qualificationModel
            .find({ employeeProfileId: new mongoose_2.Types.ObjectId(employeeId) })
            .exec();
    }
    async updateQualification(qualificationId, employeeId, qualificationData) {
        const qualification = await this.qualificationModel.findById(qualificationId);
        if (!qualification) {
            throw new common_1.NotFoundException(`Qualification with ID ${qualificationId} not found`);
        }
        if (qualification.employeeProfileId.toString() !== employeeId.toString()) {
            throw new common_1.ForbiddenException('You are not authorized to update this qualification');
        }
        const updatedQualification = await this.qualificationModel
            .findByIdAndUpdate(qualificationId, { $set: qualificationData }, { new: true })
            .exec();
        if (!updatedQualification) {
            throw new common_1.NotFoundException('Qualification not found after update');
        }
        return updatedQualification;
    }
    async removeQualification(qualificationId, employeeId) {
        const qualification = await this.qualificationModel.findById(qualificationId);
        if (!qualification) {
            throw new common_1.NotFoundException(`Qualification with ID ${qualificationId} not found`);
        }
        if (qualification.employeeProfileId.toString() !== employeeId.toString()) {
            throw new common_1.ForbiddenException('You are not authorized to delete this qualification');
        }
        await this.qualificationModel.findByIdAndDelete(qualificationId).exec();
    }
    async advancedSearch(searchCriteria) {
        const { firstName, lastName, employeeNumber, departmentId, positionId, status, dateOfHireFrom, dateOfHireTo, } = searchCriteria;
        const filter = {};
        if (firstName) {
            filter.firstName = { $regex: firstName, $options: 'i' };
        }
        if (lastName) {
            filter.lastName = { $regex: lastName, $options: 'i' };
        }
        if (employeeNumber) {
            filter.employeeNumber = { $regex: employeeNumber, $options: 'i' };
        }
        if (departmentId) {
            filter.primaryDepartmentId = new mongoose_2.Types.ObjectId(departmentId);
        }
        if (positionId) {
            filter.primaryPositionId = new mongoose_2.Types.ObjectId(positionId);
        }
        if (status) {
            filter.status = status;
        }
        if (dateOfHireFrom || dateOfHireTo) {
            filter.dateOfHire = {};
            if (dateOfHireFrom)
                filter.dateOfHire.$gte = new Date(dateOfHireFrom);
            if (dateOfHireTo)
                filter.dateOfHire.$lte = new Date(dateOfHireTo);
        }
        return this.employeeModel
            .find(filter)
            .populate('primaryDepartmentId', 'name code')
            .populate('primaryPositionId', 'title code')
            .select('-password')
            .limit(100)
            .exec();
    }
    async exportToExcel(query) {
        const { data: employees } = await this.findAll(query);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Employees');
        worksheet.columns = [
            { header: 'Employee Number', key: 'employeeNumber', width: 20 },
            { header: 'Full Name', key: 'fullName', width: 30 },
            { header: 'Work Email', key: 'workEmail', width: 25 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Department', key: 'department', width: 25 },
            { header: 'Position', key: 'position', width: 25 },
            { header: 'Date of Hire', key: 'dateOfHire', width: 15 },
            { header: 'Contract Type', key: 'contractType', width: 15 },
        ];
        employees.forEach((employee) => {
            worksheet.addRow({
                employeeNumber: employee.employeeNumber,
                fullName: employee.fullName,
                workEmail: employee.workEmail,
                status: employee.status,
                department: employee.primaryDepartmentId?.name || 'N/A',
                position: employee.primaryPositionId?.title || 'N/A',
                dateOfHire: employee.dateOfHire
                    ? new Date(employee.dateOfHire).toLocaleDateString()
                    : 'N/A',
                contractType: employee.contractType || 'N/A',
            });
        });
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' },
        };
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    async exportToPdf(employeeId) {
        const employee = await this.findOne(employeeId);
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ margin: 50 });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            doc.fontSize(20).text('Employee Profile', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Employee Number: ${employee.employeeNumber}`);
            doc.text(`Full Name: ${employee.fullName}`);
            doc.text(`Work Email: ${employee.workEmail || 'N/A'}`);
            doc.text(`Status: ${employee.status}`);
            doc.text(`Date of Hire: ${employee.dateOfHire.toLocaleDateString()}`);
            if (employee.primaryDepartmentId &&
                typeof employee.primaryDepartmentId !== 'string') {
                const department = employee.primaryDepartmentId;
                doc.text(`Department: ${department.name || 'N/A'}`);
            }
            if (employee.primaryPositionId &&
                typeof employee.primaryPositionId !== 'string') {
                const position = employee.primaryPositionId;
                doc.text(`Position: ${position.title || 'N/A'}`);
            }
            doc.moveDown();
            doc.text('Contact Information:');
            doc.text(`Personal Email: ${employee.personalEmail || 'N/A'}`);
            doc.text(`Mobile Phone: ${employee.mobilePhone || 'N/A'}`);
            if (employee.address) {
                doc.text(`Address: ${employee.address.streetAddress || ''}, ${employee.address.city || ''}, ${employee.address.country || ''}`);
            }
            doc.end();
        });
    }
    async getTeamMembers(managerId) {
        const manager = await this.findOne(managerId);
        if (!manager.primaryPositionId) {
            return [];
        }
        return this.employeeModel
            .find({
            supervisorPositionId: manager.primaryPositionId,
            status: { $in: [employee_profile_enums_1.EmployeeStatus.ACTIVE, employee_profile_enums_1.EmployeeStatus.PROBATION] },
        })
            .populate('primaryDepartmentId', 'name code')
            .populate('primaryPositionId', 'title code')
            .select('-password')
            .exec();
    }
    async getTeamStatistics(managerId) {
        const teamMembers = await this.getTeamMembers(managerId);
        const stats = {
            totalMembers: teamMembers.length,
            byStatus: teamMembers.reduce((acc, member) => {
                acc[member.status] = (acc[member.status] || 0) + 1;
                return acc;
            }, {}),
            byDepartment: teamMembers.reduce((acc, member) => {
                const deptName = member.primaryDepartmentId?.name || 'Unknown';
                acc[deptName] = (acc[deptName] || 0) + 1;
                return acc;
            }, {}),
        };
        return stats;
    }
    async generateEmployeeNumber() {
        const year = new Date().getFullYear();
        const prefix = `EMP-${year}`;
        const lastEmployee = await this.employeeModel
            .findOne({ employeeNumber: { $regex: `^${prefix}` } })
            .sort({ employeeNumber: -1 })
            .exec();
        let sequence = 1;
        if (lastEmployee) {
            const lastSequence = parseInt(lastEmployee.employeeNumber.split('-')[2], 10);
            sequence = lastSequence + 1;
        }
        return `${prefix}-${sequence.toString().padStart(4, '0')}`;
    }
    async generateCandidateNumber() {
        const year = new Date().getFullYear();
        const prefix = `CAN-${year}`;
        const lastCandidate = await this.candidateModel
            .findOne({ candidateNumber: { $regex: `^${prefix}` } })
            .sort({ candidateNumber: -1 })
            .exec();
        let sequence = 1;
        if (lastCandidate) {
            const lastSequence = parseInt(lastCandidate.candidateNumber.split('-')[2], 10);
            sequence = lastSequence + 1;
        }
        return `${prefix}-${sequence.toString().padStart(4, '0')}`;
    }
    async generateChangeRequestId() {
        const year = new Date().getFullYear();
        const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
        const prefix = `CHR-${year}${month}`;
        const lastRequest = await this.changeRequestModel
            .findOne({ requestId: { $regex: `^${prefix}` } })
            .sort({ requestId: -1 })
            .exec();
        let sequence = 1;
        if (lastRequest) {
            const lastSequence = parseInt(lastRequest.requestId.split('-')[2], 10);
            sequence = lastSequence + 1;
        }
        return `${prefix}-${sequence.toString().padStart(4, '0')}`;
    }
    async updateLastAppraisal(employeeId, appraisalData) {
        await this.employeeModel
            .findByIdAndUpdate(employeeId, { $set: appraisalData })
            .exec();
    }
    async findByDepartment(departmentId) {
        if (!mongoose_2.Types.ObjectId.isValid(departmentId)) {
            throw new common_1.BadRequestException('Invalid department ID');
        }
        return this.employeeModel
            .find({ primaryDepartmentId: new mongoose_2.Types.ObjectId(departmentId) })
            .select('-password')
            .exec();
    }
    async findByPosition(positionId) {
        return this.employeeModel
            .find({ primaryPositionId: new mongoose_2.Types.ObjectId(positionId) })
            .select('-password')
            .exec();
    }
    async findBySupervisor(supervisorPositionId) {
        return this.employeeModel
            .find({ supervisorPositionId: new mongoose_2.Types.ObjectId(supervisorPositionId) })
            .select('-password')
            .exec();
    }
    async getEmployeeStats() {
        const stats = await this.employeeModel.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);
        const total = await this.employeeModel.countDocuments();
        return {
            total,
            byStatus: stats.reduce((acc, stat) => {
                acc[stat._id] = stat.count;
                return acc;
            }, {}),
        };
    }
    async registerCandidate(registerDto) {
        const existingCandidate = await this.candidateModel
            .findOne({ nationalId: registerDto.nationalId })
            .exec();
        if (existingCandidate) {
            throw new common_1.ConflictException('Candidate with this National ID already exists');
        }
        const existingEmail = await this.candidateModel
            .findOne({ personalEmail: registerDto.personalEmail })
            .exec();
        if (existingEmail) {
            throw new common_1.ConflictException('Candidate with this email already exists');
        }
        const candidateNumber = await this.generateCandidateNumber();
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const fullName = [
            registerDto.firstName,
            registerDto.middleName,
            registerDto.lastName,
        ]
            .filter(Boolean)
            .join(' ');
        const dateOfBirth = registerDto.dateOfBirth
            ? new Date(registerDto.dateOfBirth)
            : undefined;
        const candidate = new this.candidateModel({
            firstName: registerDto.firstName,
            middleName: registerDto.middleName,
            lastName: registerDto.lastName,
            nationalId: registerDto.nationalId,
            password: hashedPassword,
            gender: registerDto.gender,
            maritalStatus: registerDto.maritalStatus,
            dateOfBirth: dateOfBirth,
            personalEmail: registerDto.personalEmail,
            mobilePhone: registerDto.mobilePhone,
            homePhone: registerDto.homePhone,
            address: registerDto.address,
            candidateNumber,
            fullName,
            status: employee_profile_enums_1.CandidateStatus.APPLIED,
            applicationDate: new Date(),
        });
        const savedCandidate = await candidate.save();
        await this.systemRoleModel.create({
            employeeProfileId: savedCandidate._id,
            roles: [employee_profile_enums_1.SystemRole.JOB_CANDIDATE],
            isActive: true,
        });
        return savedCandidate.toObject();
    }
};
exports.EmployeeProfileService = EmployeeProfileService;
exports.EmployeeProfileService = EmployeeProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(employee_profile_schema_1.EmployeeProfile.name)),
    __param(1, (0, mongoose_1.InjectModel)(candidate_schema_1.Candidate.name)),
    __param(2, (0, mongoose_1.InjectModel)(ep_change_request_schema_1.EmployeeProfileChangeRequest.name)),
    __param(3, (0, mongoose_1.InjectModel)(employee_system_role_schema_1.EmployeeSystemRole.name)),
    __param(4, (0, mongoose_1.InjectModel)(qualification_schema_1.EmployeeQualification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], EmployeeProfileService);
//# sourceMappingURL=employee-profile.service.js.map