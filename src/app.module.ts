import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { RolesGuard } from './common/guards/roles.guard.js';
import { UsersModule } from './modules/users/users.module.js';
import { LeaveRequestsModule } from './leave-requests/leave-requests.module.js';
import { PayrollsModule } from './payrolls/payrolls.module.js';

@Module({
  imports: [AuthModule, UsersModule, LeaveRequestsModule, PayrollsModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
