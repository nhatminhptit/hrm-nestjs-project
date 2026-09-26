import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProcessPayrollDto } from './dto/payrolls.dto.js';
import { PayrollsService } from './payrolls.service.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Role } from '@prisma/client';

@Controller('payrolls')
export class PayrollsController {
  constructor(private readonly service: PayrollsService) {}
  @Post('process') process(
    @CurrentUser() user: { id: number; role: Role },
    @Body() dto: ProcessPayrollDto,
  ) {
    return this.service.process(user, dto);
  }
  @Get() list(@CurrentUser() user: { id: number; role: Role }) {
    return this.service.list(user);
  }
}
