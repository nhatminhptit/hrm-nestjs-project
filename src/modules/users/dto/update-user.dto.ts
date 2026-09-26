import { IsOptional, IsString, IsEmail, IsInt, IsEnum } from 'class-validator';
import { Role, Status } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional() @IsString() first_name?: string;
  @IsOptional() @IsString() last_name?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsInt() department_id?: number;
  @IsOptional() @IsInt() job_title_id?: number;
  @IsOptional() @IsInt() manager_id?: number;
  @IsOptional() @IsEnum(Role) role?: Role;
  @IsOptional() @IsEnum(Status) status?: Status;
}
