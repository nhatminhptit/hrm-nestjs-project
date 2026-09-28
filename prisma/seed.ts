import { PrismaClient, Role, Status } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Đang nạp dữ liệu mẫu...');

  // Mật khẩu chung cho tất cả tài khoản test để ông dễ login
  const defaultPassword = await bcrypt.hash('123456', 10);

  // --- 1. DEPARTMENTS (3 records) ---
  const deptBOD = await prisma.department.upsert({
    where: { name: 'Ban Giám Đốc' },
    update: {},
    create: { name: 'Ban Giám Đốc', location: 'Hà Nội', budget: 50000000 }, // Đã giảm xuống 50 triệu
  });
  const deptEng = await prisma.department.upsert({
    where: { name: 'Engineering' },
    update: {},
    create: { name: 'Engineering', location: 'Hồ Chí Minh', budget: 10000000 },
  });
  const deptHR = await prisma.department.upsert({
    where: { name: 'Human Resources' },
    update: {},
    create: { name: 'Human Resources', location: 'Đà Nẵng', budget: 5000000 },
  });

  // --- 2. JOB TITLES (3 records) ---
  const titleDirector = await prisma.jobTitle.upsert({
    where: { title: 'Director' },
    update: {},
    create: {
      title: 'Director',
      salary_range_min: 5000000,
      salary_range_max: 90000000,
    }, // Đã giảm xuống 90 triệu
  });
  const titleManager = await prisma.jobTitle.upsert({
    where: { title: 'Engineering Manager' },
    update: {},
    create: {
      title: 'Engineering Manager',
      salary_range_min: 3000000,
      salary_range_max: 6000000,
    },
  });
  const titleStaff = await prisma.jobTitle.upsert({
    where: { title: 'Software Engineer' },
    update: {},
    create: {
      title: 'Software Engineer',
      salary_range_min: 1500000,
      salary_range_max: 3000000,
    },
  });

  // --- 3. EMPLOYEES (5 records phục vụ test luồng duyệt) ---

  // Sếp tổng (ADMIN)
  const admin = await prisma.employee.upsert({
    where: { email: 'admin@test.local' },
    update: { password: defaultPassword }, // Cập nhật lại pass đã hash để test Login
    create: {
      first_name: 'Trần',
      last_name: 'Giám Đốc',
      email: 'admin@test.local',
      password: defaultPassword,
      role: Role.ADMIN,
      status: Status.ACTIVE,
      department_id: deptBOD.id,
      job_title_id: titleDirector.id,
    },
  });

  // Trưởng phòng HR
  const hr = await prisma.employee.upsert({
    where: { email: 'hr@test.local' },
    update: { password: defaultPassword, manager_id: admin.id },
    create: {
      first_name: 'Lê',
      last_name: 'Nhân Sự',
      email: 'hr@test.local',
      password: defaultPassword,
      role: Role.HR_MANAGER,
      status: Status.ACTIVE,
      department_id: deptHR.id,
      job_title_id: titleManager.id,
      manager_id: admin.id,
    },
  });

  // Trưởng phòng IT
  const manager = await prisma.employee.upsert({
    where: { email: 'manager@test.local' },
    update: { password: defaultPassword, manager_id: admin.id },
    create: {
      first_name: 'Phạm',
      last_name: 'Quản Lý',
      email: 'manager@test.local',
      password: defaultPassword,
      role: Role.MANAGER,
      status: Status.ACTIVE,
      department_id: deptEng.id,
      job_title_id: titleManager.id,
      manager_id: admin.id,
    },
  });

  // Nhân viên 1 (Báo cáo cho Trưởng phòng IT)
  const user1 = await prisma.employee.upsert({
    where: { email: 'employee1@test.local' },
    update: { password: defaultPassword, manager_id: manager.id },
    create: {
      first_name: 'Hoàng',
      last_name: 'Nhân Viên Một',
      email: 'employee1@test.local',
      password: defaultPassword,
      role: Role.USER,
      status: Status.ACTIVE,
      department_id: deptEng.id,
      job_title_id: titleStaff.id,
      manager_id: manager.id,
    },
  });

  // Nhân viên 2
  const user2 = await prisma.employee.upsert({
    where: { email: 'employee2@test.local' },
    update: { password: defaultPassword, manager_id: manager.id },
    create: {
      first_name: 'Đinh',
      last_name: 'Nhân Viên Hai',
      email: 'employee2@test.local',
      password: defaultPassword,
      role: Role.USER,
      status: Status.ACTIVE,
      department_id: deptEng.id,
      job_title_id: titleStaff.id,
      manager_id: manager.id,
    },
  });

  console.log('✅ Chạy Seed thành công! Test Login với mật khẩu: 123456');
  console.log({
    admin: admin.email,
    hr: hr.email,
    manager: manager.email,
    users: [user1.email, user2.email],
  });
}

main().finally(() => prisma.$disconnect());
