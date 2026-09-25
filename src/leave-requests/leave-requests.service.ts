import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LeaveStatus, Role } from '@prisma/client';
import { CurrentUserPayload, requireRole } from '../common/auth.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateLeaveRequestDto } from './dto.js';

@Injectable()
export class LeaveRequestsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(user: CurrentUserPayload, dto: CreateLeaveRequestDto) {
    const startDate = new Date(dto.startDate); const endDate = new Date(dto.endDate);
    if (endDate < startDate) throw new BadRequestException('Ngày kết thúc phải từ ngày bắt đầu trở đi');
    return this.prisma.leaveRequest.create({ data: { employeeId: user.id, startDate, endDate, type: dto.type, reason: dto.reason } });
  }
  async list(user: CurrentUserPayload) {
    const privileged: Role[] = [Role.HR_MANAGER, Role.ADMIN];
    const where = privileged.includes(user.role) ? {} : { employeeId: user.id };
    return this.prisma.leaveRequest.findMany({ where, orderBy: { id: 'desc' } });
  }
  async approveByManager(user: CurrentUserPayload, id: number) {
    requireRole(user, [Role.MANAGER]);
    const leave = await this.prisma.leaveRequest.findUnique({ where: { id }, include: { employee: true } });
    if (!leave) throw new NotFoundException('Không tìm thấy đơn nghỉ phép');
    if (leave.employee.managerId !== user.id) throw new ForbiddenException('Bạn không phải quản lý trực tiếp');
    if (leave.status !== LeaveStatus.PENDING) throw new BadRequestException('Đơn không ở trạng thái chờ quản lý duyệt');
    return this.prisma.leaveRequest.update({ where: { id }, data: { status: LeaveStatus.APPROVED_BY_MANAGER, approvedByManagerId: user.id } });
  }
  async approveByHr(user: CurrentUserPayload, id: number) {
    requireRole(user, [Role.HR_MANAGER]);
    const leave = await this.prisma.leaveRequest.findUnique({ where: { id } });
    if (!leave) throw new NotFoundException('Không tìm thấy đơn nghỉ phép');
    if (leave.status !== LeaveStatus.APPROVED_BY_MANAGER) throw new BadRequestException('Đơn phải được quản lý duyệt trước');
    return this.prisma.leaveRequest.update({ where: { id }, data: { status: LeaveStatus.APPROVED_BY_HR, approvedByHrId: user.id } });
  }
}
