import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { EmployeeProfileDocument } from '../employee-profile/models/employee-profile.schema';
import { EmployeeSystemRoleDocument } from '../employee-profile/models/employee-system-role.schema';
import { CandidateDocument } from '../employee-profile/models/candidate.schema';
import { RegisterCandidateDto } from '../employee-profile/dto/register-candidate.dto';
import { SystemRole } from '../employee-profile/enums/employee-profile.enums';
export declare class AuthService {
    private employeeModel;
    private candidateModel;
    private systemRoleModel;
    private jwtService;
    constructor(employeeModel: Model<EmployeeProfileDocument>, candidateModel: Model<CandidateDocument>, systemRoleModel: Model<EmployeeSystemRoleDocument>, jwtService: JwtService);
    validateUser(employeeNumber: string, password: string): Promise<any>;
    private validateEmployee;
    private validateCandidate;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            employeeNumber: any;
            candidateNumber: any;
            fullName: any;
            workEmail: any;
            personalEmail: any;
            roles: any;
            userType: any;
        };
    }>;
    registerCandidate(registerDto: RegisterCandidateDto): Promise<{
        access_token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            candidateNumber: string;
            fullName: string;
            personalEmail: string;
            roles: SystemRole[];
            userType: string;
        };
    }>;
    private generateCandidateNumber;
}
