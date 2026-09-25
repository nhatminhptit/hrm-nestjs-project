import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';
import { LeaveRequestsModule } from './leave-requests/leave-requests.module.js';
import { PayrollsModule } from './payrolls/payrolls.module.js';

@Module({
  imports: [LeaveRequestsModule, PayrollsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
