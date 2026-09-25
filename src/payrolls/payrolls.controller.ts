import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, RequestUserGuard } from '../common/auth.js';
import type { CurrentUserPayload } from '../common/auth.js';
import { ProcessPayrollDto } from './dto.js';
import { PayrollsService } from './payrolls.service.js';

@UseGuards(RequestUserGuard)
@Controller('payrolls')
export class PayrollsController {
  constructor(private readonly service: PayrollsService) {}
  @Post('process') process(@CurrentUser() user: CurrentUserPayload, @Body() dto: ProcessPayrollDto) { return this.service.process(user, dto); }
  @Get() list(@CurrentUser() user: CurrentUserPayload) { return this.service.list(user); }
}
