import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PayrollsController } from './payrolls.controller.js';
import { PayrollsService } from './payrolls.service.js';
@Module({ controllers: [PayrollsController], providers: [PayrollsService, PrismaService] })
export class PayrollsModule {}
