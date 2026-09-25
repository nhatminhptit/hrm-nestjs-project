import { BadRequestException, Injectable } from '@nestjs/common';
import { EmployeeStatus, LeaveStatus, Role } from '@prisma/client';
import { CurrentUserPayload, requireRole } from '../common/auth.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProcessPayrollDto } from './dto.js';

const DAY = 86_400_000;
const utcDate = (value: Date) => new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
const overlapDays = (start: Date, end: Date, periodStart: Date, periodEnd: Date) => {
  const first = Math.max(utcDate(start).getTime(), periodStart.getTime());
  const last = Math.min(utcDate(end).getTime(), periodEnd.getTime());
  return last < first ? 0 : Math.floor((last - first) / DAY) + 1;
};

@Injectable()
export class PayrollsService {
  constructor(private readonly prisma: PrismaService) {}
  async process(user: CurrentUserPayload, dto: ProcessPayrollDto) {
    requireRole(user, [Role.HR_MANAGER]);
    const start = utcDate(new Date(dto.payPeriodStart)); const end = utcDate(new Date(dto.payPeriodEnd));
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) throw new BadRequestException('Kỳ lương không hợp lệ');
    const employees = await this.prisma.employee.findMany({ where: { status: EmployeeStatus.ACTIVE }, include: { jobTitle: true, leaveRequests: { where: { startDate: { lte: end }, endDate: { gte: start } } } } });
    const daysInPeriod = Math.floor((end.getTime() - start.getTime()) / DAY) + 1;
    return this.prisma.$transaction(async (tx) => {
      const processed = [];
      for (const employee of employees) {
        const baseSalary = employee.jobTitle?.salaryRangeMin;
        if (!baseSalary) continue;
        const invalidDays = employee.leaveRequests.filter((leave) => leave.status !== LeaveStatus.APPROVED_BY_HR).reduce((sum, leave) => sum + overlapDays(leave.startDate, leave.endDate, start, end), 0);
        const deductions = baseSalary.mul(invalidDays).div(daysInPeriod);
        processed.push(await tx.payroll.upsert({
          where: { employeeId_payPeriodStart_payPeriodEnd: { employeeId: employee.id, payPeriodStart: start, payPeriodEnd: end } },
          create: { employeeId: employee.id, baseSalary, deductions, totalSalary: baseSalary.minus(deductions), payPeriodStart: start, payPeriodEnd: end },
          update: { baseSalary, deductions, totalSalary: baseSalary.minus(deductions) },
        }));
      }
      return processed;
    });
  }
  async list(user: CurrentUserPayload) {
    const privileged: Role[] = [Role.HR_MANAGER, Role.ADMIN];
    const where = privileged.includes(user.role) ? {} : { employeeId: user.id };
    return this.prisma.payroll.findMany({ where, orderBy: [{ payPeriodStart: 'desc' }, { id: 'desc' }] });
  }
}
