import { PipeTransform } from '@nestjs/common';
export declare class ObjectIdPipe implements PipeTransform<string, string> {
    transform(value: string): string;
}
