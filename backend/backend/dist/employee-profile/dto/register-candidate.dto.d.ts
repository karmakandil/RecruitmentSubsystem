import { Gender, MaritalStatus } from '../enums/employee-profile.enums';
declare class AddressDto {
    city?: string;
    streetAddress?: string;
    country?: string;
}
export declare class RegisterCandidateDto {
    firstName: string;
    middleName?: string;
    lastName: string;
    nationalId: string;
    password: string;
    gender?: Gender;
    maritalStatus?: MaritalStatus;
    dateOfBirth?: string;
    personalEmail: string;
    mobilePhone?: string;
    homePhone?: string;
    address?: AddressDto;
}
export {};
