import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { LeaveType } from '@prisma/client';

export class CreateLeaveRequestDto {
  @IsDateString() startDate!: string;
  @IsDateString() endDate!: string;
  @IsEnum(LeaveType) type!: LeaveType;
  @IsOptional() @IsString() @MaxLength(2000) reason?: string;
}
