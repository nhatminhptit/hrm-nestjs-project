import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, RequestUserGuard } from '../common/auth.js';
import type { CurrentUserPayload } from '../common/auth.js';
import { CreateLeaveRequestDto } from './dto.js';
import { LeaveRequestsService } from './leave-requests.service.js';

@UseGuards(RequestUserGuard)
@Controller('leave-requests')
export class LeaveRequestsController {
  constructor(private readonly service: LeaveRequestsService) {}
  @Post() create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateLeaveRequestDto) { return this.service.create(user, dto); }
  @Get() list(@CurrentUser() user: CurrentUserPayload) { return this.service.list(user); }
  @Patch(':id/approve-manager') approveManager(@CurrentUser() user: CurrentUserPayload, @Param('id', ParseIntPipe) id: number) { return this.service.approveByManager(user, id); }
  @Patch(':id/approve-hr') approveHr(@CurrentUser() user: CurrentUserPayload, @Param('id', ParseIntPipe) id: number) { return this.service.approveByHr(user, id); }
}
