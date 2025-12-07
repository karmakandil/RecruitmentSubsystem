import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
export declare class MinLessThanMax implements ValidatorConstraintInterface {
    validate(value: number, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
