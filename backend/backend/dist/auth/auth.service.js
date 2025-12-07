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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcrypt"));
const employee_profile_schema_1 = require("../employee-profile/models/employee-profile.schema");
const employee_system_role_schema_1 = require("../employee-profile/models/employee-system-role.schema");
const candidate_schema_1 = require("../employee-profile/models/candidate.schema");
const employee_profile_enums_1 = require("../employee-profile/enums/employee-profile.enums");
let AuthService = class AuthService {
    constructor(employeeModel, candidateModel, systemRoleModel, jwtService) {
        this.employeeModel = employeeModel;
        this.candidateModel = candidateModel;
        this.systemRoleModel = systemRoleModel;
        this.jwtService = jwtService;
    }
    async validateUser(employeeNumber, password) {
        const employee = await this.employeeModel
            .findOne({ employeeNumber })
            .exec();
        if (employee && employee.password) {
            return await this.validateEmployee(employee, password);
        }
        const candidate = await this.candidateModel
            .findOne({
            $or: [
                { candidateNumber: employeeNumber },
                { personalEmail: employeeNumber },
            ],
        })
            .exec();
        if (candidate && candidate.password) {
            return await this.validateCandidate(candidate, password);
        }
        throw new common_1.UnauthorizedException('Invalid credentials');
    }
    async validateEmployee(employee, password) {
        const isPasswordValid = await bcrypt.compare(password, employee.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const systemRole = await this.systemRoleModel
            .findOne({ employeeProfileId: employee._id })
            .exec();
        const { password: _, ...result } = employee.toObject();
        return {
            ...result,
            userType: 'employee',
            identifier: employee.employeeNumber,
            roles: systemRole?.roles || [],
            permissions: systemRole?.permissions || [],
        };
    }
    async validateCandidate(candidate, password) {
        const isPasswordValid = await bcrypt.compare(password, candidate.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const systemRole = await this.systemRoleModel
            .findOne({ employeeProfileId: candidate._id })
            .exec();
        const { password: _, ...result } = candidate.toObject();
        return {
            ...result,
            userType: 'candidate',
            identifier: candidate.candidateNumber,
            roles: systemRole?.roles || [],
            permissions: systemRole?.permissions || [],
        };
    }
    async login(user) {
        const payload = {
            username: user.employeeNumber || user.candidateNumber || user.personalEmail,
            sub: user._id,
            roles: user.roles,
            permissions: user.permissions,
            userType: user.userType || (user.employeeNumber ? 'employee' : 'candidate'),
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                employeeNumber: user.employeeNumber,
                candidateNumber: user.candidateNumber,
                fullName: user.fullName,
                workEmail: user.workEmail,
                personalEmail: user.personalEmail,
                roles: user.roles,
                userType: user.userType || (user.employeeNumber ? 'employee' : 'candidate'),
            },
        };
    }
    async registerCandidate(registerDto) {
        const existingCandidateByNationalId = await this.candidateModel
            .findOne({ nationalId: registerDto.nationalId })
            .exec();
        if (existingCandidateByNationalId) {
            throw new common_1.ConflictException('Candidate with this National ID already exists');
        }
        const existingEmployeeByNationalId = await this.employeeModel
            .findOne({ nationalId: registerDto.nationalId })
            .exec();
        if (existingEmployeeByNationalId) {
            throw new common_1.ConflictException('Employee with this National ID already exists');
        }
        const existingCandidateByEmail = await this.candidateModel
            .findOne({ personalEmail: registerDto.personalEmail })
            .exec();
        if (existingCandidateByEmail) {
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
            permissions: [],
            isActive: true,
        });
        const payload = {
            username: savedCandidate.candidateNumber,
            sub: savedCandidate._id.toString(),
            roles: [employee_profile_enums_1.SystemRole.JOB_CANDIDATE],
            permissions: [],
            userType: 'candidate',
        };
        const accessToken = this.jwtService.sign(payload);
        const { password: _, ...candidateWithoutPassword } = savedCandidate.toObject();
        return {
            access_token: accessToken,
            user: {
                id: candidateWithoutPassword._id,
                candidateNumber: candidateWithoutPassword.candidateNumber,
                fullName: candidateWithoutPassword.fullName,
                personalEmail: candidateWithoutPassword.personalEmail,
                roles: [employee_profile_enums_1.SystemRole.JOB_CANDIDATE],
                userType: 'candidate',
            },
        };
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(employee_profile_schema_1.EmployeeProfile.name)),
    __param(1, (0, mongoose_1.InjectModel)(candidate_schema_1.Candidate.name)),
    __param(2, (0, mongoose_1.InjectModel)(employee_system_role_schema_1.EmployeeSystemRole.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map