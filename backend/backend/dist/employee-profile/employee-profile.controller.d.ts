import { EmployeeProfileService } from './employee-profile.service';
import { CreateEmployeeDto, UpdateEmployeeDto, UpdateEmployeeSelfServiceDto, QueryEmployeeDto, AssignSystemRoleDto, CreateCandidateDto, UpdateCandidateDto, CreateProfileChangeRequestDto, ProcessProfileChangeRequestDto } from './dto';
import { SystemRole, CandidateStatus } from './enums/employee-profile.enums';
import { RegisterCandidateDto } from './dto/register-candidate.dto';
export declare class EmployeeProfileController {
    private readonly employeeProfileService;
    constructor(employeeProfileService: EmployeeProfileService);
    create(createEmployeeDto: CreateEmployeeDto): Promise<{
        message: string;
        data: import("./models/employee-profile.schema").EmployeeProfile;
    }>;
    findAll(query: QueryEmployeeDto, user: any): Promise<{
        data: (import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("./models/employee-profile.schema").EmployeeProfile, {}, {}> & import("./models/employee-profile.schema").EmployeeProfile & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        message: string;
    }>;
    getMyProfile(user: any): Promise<{
        message: string;
        data: import("./models/employee-profile.schema").EmployeeProfile;
    }>;
    updateMyProfile(user: any, updateDto: UpdateEmployeeSelfServiceDto): Promise<{
        message: string;
        data: import("./models/employee-profile.schema").EmployeeProfile;
    }>;
    updateMyContact(user: any, contactData: {
        personalEmail?: string;
        mobilePhone?: string;
        homePhone?: string;
        address?: {
            city?: string;
            streetAddress?: string;
            country?: string;
        };
    }): Promise<{
        message: string;
        data: import("./models/employee-profile.schema").EmployeeProfile;
    }>;
    updateMyBanking(user: any, bankingData: {
        bankName?: string;
        bankAccountNumber?: string;
    }): Promise<{
        message: string;
        data: import("./models/employee-profile.schema").EmployeeProfile;
    }>;
    updateMyBiography(user: any, biographyData: {
        biography?: string;
    }): Promise<{
        message: string;
        data: import("./models/employee-profile.schema").EmployeeProfile;
    }>;
    uploadProfilePhoto(user: any, photo: Express.Multer.File): Promise<{
        message: string;
        data: {
            profilePictureUrl: string;
        };
    }>;
    getStats(): Promise<{
        message: string;
        data: {
            total: number;
            byStatus: any;
        };
    }>;
    findByDepartment(departmentId: string): Promise<{
        message: string;
        data: import("./models/employee-profile.schema").EmployeeProfile[];
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: import("./models/employee-profile.schema").EmployeeProfile;
    }>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<{
        message: string;
        data: import("./models/employee-profile.schema").EmployeeProfile;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    exportToPdf(id: string): Promise<{
        message: string;
        data: string;
    }>;
    exportToExcel(query: QueryEmployeeDto): Promise<{
        message: string;
        data: string;
    }>;
    assignRoles(assignRoleDto: AssignSystemRoleDto): Promise<{
        message: string;
        data: import("./models/employee-system-role.schema").EmployeeSystemRole;
    }>;
    assignRolesToEmployee(employeeId: string, assignRoleDto: Omit<AssignSystemRoleDto, 'employeeProfileId'>): Promise<{
        message: string;
        data: import("./models/employee-system-role.schema").EmployeeSystemRole;
    }>;
    getEmployeeRoles(employeeId: string): Promise<{
        message: string;
        data: import("./models/employee-system-role.schema").EmployeeSystemRole;
    }>;
    updateEmployeeRoles(employeeId: string, updateRoleDto: {
        roles?: SystemRole[];
        permissions?: string[];
    }): Promise<{
        message: string;
        data: import("./models/employee-system-role.schema").EmployeeSystemRole;
    }>;
    deactivateEmployeeRoles(employeeId: string): Promise<{
        message: string;
    }>;
    createCandidate(createCandidateDto: CreateCandidateDto): Promise<{
        message: string;
        data: import("./models/candidate.schema").Candidate;
    }>;
    findAllCandidates(query: any): Promise<{
        message: string;
        data: import("./models/candidate.schema").Candidate[];
    }>;
    findCandidateById(id: string): Promise<{
        message: string;
        data: import("./models/candidate.schema").Candidate;
    }>;
    updateCandidate(id: string, updateCandidateDto: UpdateCandidateDto): Promise<{
        message: string;
        data: import("./models/candidate.schema").Candidate;
    }>;
    removeCandidate(id: string): Promise<{
        message: string;
    }>;
    convertCandidateToEmployee(candidateId: string, employeeData: {
        workEmail: string;
        dateOfHire: Date;
        contractType: string;
        workType: string;
        password?: string;
        primaryDepartmentId?: string;
        primaryPositionId?: string;
    }): Promise<{
        message: string;
        data: import("./models/employee-profile.schema").EmployeeProfile;
    }>;
    updateCandidateStatus(id: string, statusData: {
        status: CandidateStatus;
    }): Promise<{
        message: string;
        data: import("./models/candidate.schema").Candidate;
    }>;
    findCandidatesByStatus(status: string): Promise<{
        message: string;
        data: import("./models/candidate.schema").Candidate[];
    }>;
    createProfileChangeRequest(user: any, createRequestDto: CreateProfileChangeRequestDto): Promise<{
        message: string;
        data: import("./models/ep-change-request.schema").EmployeeProfileChangeRequest;
    }>;
    getMyChangeRequests(user: any): Promise<{
        message: string;
        data: import("./models/ep-change-request.schema").EmployeeProfileChangeRequest[];
    }>;
    getAllChangeRequests(query: any): Promise<{
        message: string;
        data: import("./models/ep-change-request.schema").EmployeeProfileChangeRequest[];
    }>;
    getChangeRequestById(id: string): Promise<{
        message: string;
        data: import("./models/ep-change-request.schema").EmployeeProfileChangeRequest;
    }>;
    processChangeRequest(id: string, processDto: ProcessProfileChangeRequestDto): Promise<{
        message: string;
        data: import("./models/ep-change-request.schema").EmployeeProfileChangeRequest;
    }>;
    approveChangeRequest(id: string, approveDto: {
        reason?: string;
    }): Promise<{
        message: string;
        data: import("./models/ep-change-request.schema").EmployeeProfileChangeRequest;
    }>;
    rejectChangeRequest(id: string, rejectDto: {
        reason?: string;
    }): Promise<{
        message: string;
        data: import("./models/ep-change-request.schema").EmployeeProfileChangeRequest;
    }>;
    cancelChangeRequest(id: string, user: any): Promise<{
        message: string;
        data: import("./models/ep-change-request.schema").EmployeeProfileChangeRequest;
    }>;
    addQualification(user: any, qualificationData: {
        establishmentName: string;
        graduationType: string;
    }): Promise<{
        message: string;
        data: import("./models/qualification.schema").EmployeeQualification;
    }>;
    addQualificationForEmployee(employeeId: string, qualificationData: {
        establishmentName: string;
        graduationType: string;
    }): Promise<{
        message: string;
        data: import("./models/qualification.schema").EmployeeQualification;
    }>;
    getMyQualifications(user: any): Promise<{
        message: string;
        data: import("./models/qualification.schema").EmployeeQualification[];
    }>;
    getEmployeeQualifications(employeeId: string): Promise<{
        message: string;
        data: import("./models/qualification.schema").EmployeeQualification[];
    }>;
    updateQualification(qualificationId: string, user: any, qualificationData: {
        establishmentName?: string;
        graduationType?: string;
    }): Promise<{
        message: string;
        data: import("./models/qualification.schema").EmployeeQualification;
    }>;
    removeQualification(qualificationId: string, user: any): Promise<{
        message: string;
    }>;
    advancedSearch(searchCriteria: any): Promise<{
        message: string;
        data: any[];
    }>;
    findByEmployeeNumber(employeeNumber: string): Promise<{
        message: string;
        data: import("./models/employee-profile.schema").EmployeeProfile;
    }>;
    findByNationalId(nationalId: string): Promise<{
        message: string;
        data: import("./models/employee-profile.schema").EmployeeProfile;
    }>;
    getTeamMembers(user: any): Promise<{
        message: string;
        data: import("./models/employee-profile.schema").EmployeeProfile[];
    }>;
    getTeamStatistics(user: any): Promise<{
        message: string;
        data: any;
    }>;
    registerCandidate(registerDto: RegisterCandidateDto): Promise<{
        message: string;
        data: {
            candidateNumber: string;
            departmentId?: import("mongoose").Types.ObjectId;
            positionId?: import("mongoose").Types.ObjectId;
            applicationDate?: Date;
            status: CandidateStatus;
            resumeUrl?: string;
            notes?: string;
            firstName: string;
            middleName?: string;
            lastName: string;
            fullName?: string;
            nationalId: string;
            gender?: import("./enums/employee-profile.enums").Gender;
            maritalStatus?: import("./enums/employee-profile.enums").MaritalStatus;
            dateOfBirth?: Date;
            personalEmail?: string;
            mobilePhone?: string;
            homePhone?: string;
            address?: import("./models/user-schema").Address;
            profilePictureUrl?: string;
            accessProfileId?: import("mongoose").Types.ObjectId;
        };
    }>;
}
