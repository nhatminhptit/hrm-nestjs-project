import {
  Controller,
  Post,
  HttpCode,
  Body,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Role } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('test-admin')
  @Roles(Role.ADMIN, Role.HR_MANAGER)
  testAdminAccess(@CurrentUser() user: any) {
    return {
      message:
        'Chào sếp! Sếp đã lọt qua được lớp bảo vệ RolesGuard thành công.',
      thong_tin_token: user,
    };
  }
}
