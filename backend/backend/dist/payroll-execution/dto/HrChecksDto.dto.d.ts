export declare const ALLOWED_HR_EVENTS: readonly ["normal", "new_hire", "resignation", "termination", "probation_end"];
export type HREventType = (typeof ALLOWED_HR_EVENTS)[number];
export declare class HrChecksDto {
    employeeId: string;
    eventType: HREventType;
    eventDate: string;
    eventDescription?: string;
}
