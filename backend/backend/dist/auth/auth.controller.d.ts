import { AuthService } from './auth.service';
import { RegisterCandidateDto } from '../employee-profile/dto/register-candidate.dto';
declare class LoginDto {
    employeeNumber: string;
    password: string;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterCandidateDto): Promise<{
        access_token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            candidateNumber: string;
            fullName: string;
            personalEmail: string;
            roles: import("../employee-profile/enums/employee-profile.enums").SystemRole[];
            userType: string;
        };
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
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
        message: string;
    }>;
}
export {};
