import { Role, Status } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsInt,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Họ không được để trống' })
  first_name: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  last_name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải từ 6 ký tự trở lên' })
  password: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Quyền không hợp lệ' })
  role?: Role;

  @IsOptional()
  @IsEnum(Status, { message: 'Trạng thái không hợp lệ' })
  status?: Status;

  @IsInt({ message: 'ID Phòng ban phải là số nguyên' })
  @IsNotEmpty({ message: 'Phòng ban không được để trống' })
  department_id: number;

  @IsInt({ message: 'ID Chức danh phải là số nguyên' })
  @IsNotEmpty({ message: 'Chức danh không được để trống' })
  job_title_id: number;

  @IsOptional()
  manager_id?: number;
}
