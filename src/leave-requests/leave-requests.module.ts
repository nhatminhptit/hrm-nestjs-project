import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { LeaveRequestsController } from './leave-requests.controller.js';
import { LeaveRequestsService } from './leave-requests.service.js';

@Module({
  controllers: [LeaveRequestsController],
  providers: [LeaveRequestsService, PrismaService],
})
export class LeaveRequestsModule {}
