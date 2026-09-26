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
      salary_range_min: 15000000,
      salary_range_max: 30000000,
    },
  });
  const manager = await prisma.employee.upsert({
    where: { email: 'manager@test.local' },
    update: {
      role: Role.MANAGER,
      department_id: department.id,
      job_title_id: title.id,
    },
    create: {
      first_name: 'Mai',
      last_name: 'Manager',
      email: 'manager@test.local',
      password: 'TEST_ONLY',
      role: Role.MANAGER,
      department_id: department.id,
      job_title_id: title.id,
    },
  });
  const employee = await prisma.employee.upsert({
    where: { email: 'employee@test.local' },
    update: {
      role: Role.USER,
      manager_id: manager.id,
      department_id: department.id,
      job_title_id: title.id,
    },
    create: {
      first_name: 'An',
      last_name: 'Employee',
      email: 'employee@test.local',
      password: 'TEST_ONLY',
      role: Role.USER,
      manager_id: manager.id,
      department_id: department.id,
      job_title_id: title.id,
    },
  });
  const hr = await prisma.employee.upsert({
    where: { email: 'hr@test.local' },
    update: {
      role: Role.HR_MANAGER,
      department_id: department.id,
      job_title_id: title.id,
    },
    create: {
      first_name: 'Hoa',
      last_name: 'HR',
      email: 'hr@test.local',
      password: 'TEST_ONLY',
      role: Role.HR_MANAGER,
      department_id: department.id,
      job_title_id: title.id,
    },
  });
  console.log({ employee: employee.id, manager: manager.id, hr: hr.id });
}
main().finally(() => prisma.$disconnect());
