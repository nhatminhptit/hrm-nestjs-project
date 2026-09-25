import { PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const department = await prisma.department.upsert({
    where: { name: 'Engineering' },
    update: {},
    create: {
      name: 'Engineering',
      location: 'Ho Chi Minh City',
      budget: 100000000,
    },
  });
  const title = await prisma.jobTitle.upsert({
    where: { title: 'Software Engineer' },
    update: {},
    create: {
      title: 'Software Engineer',
      salaryRangeMin: 15000000,
      salaryRangeMax: 30000000,
    },
  });
  const manager = await prisma.employee.upsert({
    where: { email: 'manager@test.local' },
    update: {
      role: Role.MANAGER,
      departmentId: department.id,
      jobTitleId: title.id,
    },
    create: {
      firstName: 'Mai',
      lastName: 'Manager',
      email: 'manager@test.local',
      password: 'TEST_ONLY',
      role: Role.MANAGER,
      departmentId: department.id,
      jobTitleId: title.id,
    },
  });
  const employee = await prisma.employee.upsert({
    where: { email: 'employee@test.local' },
    update: {
      role: Role.USER,
      managerId: manager.id,
      departmentId: department.id,
      jobTitleId: title.id,
    },
    create: {
      firstName: 'An',
      lastName: 'Employee',
      email: 'employee@test.local',
      password: 'TEST_ONLY',
      role: Role.USER,
      managerId: manager.id,
      departmentId: department.id,
      jobTitleId: title.id,
    },
  });
  const hr = await prisma.employee.upsert({
    where: { email: 'hr@test.local' },
    update: {
      role: Role.HR_MANAGER,
      departmentId: department.id,
      jobTitleId: title.id,
    },
    create: {
      firstName: 'Hoa',
      lastName: 'HR',
      email: 'hr@test.local',
      password: 'TEST_ONLY',
      role: Role.HR_MANAGER,
      departmentId: department.id,
      jobTitleId: title.id,
    },
  });
  console.log({ employee: employee.id, manager: manager.id, hr: hr.id });
}
main().finally(() => prisma.$disconnect());
