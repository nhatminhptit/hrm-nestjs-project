import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Status } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number) {
    const user = await this.prisma.employee.findUnique({
      where: { id: userId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        status: true,
        department_id: true,
        job_title_id: true,
        created_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin nhân viên');
    }
    return user;
  }

  async findAll() {
    return this.prisma.employee.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        status: true,
        department_id: true,
        job_title_id: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    return this.prisma.employee.update({
      where: { id },
      data: dto,
      select: { id: true, email: true, status: true, role: true },
    });
  }

  async remove(id: number) {
    return this.prisma.employee.update({
      where: { id },
      data: { status: Status.TERMINATED },
      select: { id: true, email: true, status: true },
    });
  }
}
