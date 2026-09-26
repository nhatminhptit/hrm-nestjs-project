import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '@prisma/client';
import { CreateLeaveRequestDto } from './dto/leave-requests.dto.js';
import { LeaveRequestsService } from './leave-requests.service.js';

@Controller('leave-requests')
export class LeaveRequestsController {
  constructor(private readonly service: LeaveRequestsService) {}
  @Post() create(
    @CurrentUser() user: { id: number; role: Role },
    @Body() dto: CreateLeaveRequestDto,
  ) {
    return this.service.create(user, dto);
  }
  @Get() list(@CurrentUser() user: { id: number, role: Role }) {
    return this.service.list(user);
  }
  @Patch(':id/approve-manager') approveManager(
    @CurrentUser() user: { id: number, role: Role },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.approveByManager(user, id);
  }
  @Patch(':id/approve-hr') approveHr(
    @CurrentUser() user: { id: number, role: Role },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.approveByHr(user, id);
  }
}
