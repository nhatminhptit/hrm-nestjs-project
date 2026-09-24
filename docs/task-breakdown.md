# Danh sách công việc chi tiết (Task Breakdown)

Dự án được chia thành các phase độc lập để hai thành viên có thể làm việc song song mà không bị conflict code. Đánh dấu `[x]` khi hoàn thành một đầu việc.

## 1. Nhật Minh (Core, Security & Module Auth/Users)

**Phase 1: Khởi tạo hệ thống & Môi trường**

- [ ] Thiết lập dự án NestJS cơ bản, xóa các file không cần thiết.
- [ ] Cấu hình `docker-compose.yml` chạy PostgreSQL 15.
- [ ] Thiết lập biến môi trường `.env`.
- [ ] Cài đặt Prisma ORM, khởi tạo `schema.prisma`.
- [ ] Dựng Schema cho 3 bảng: `departments`, `job_titles`, `employees` (Chuẩn 3NF).

**Phase 2: Xây dựng Middleware, Guard & Pipe (Dùng chung)**

- [ ] Kích hoạt Helmet và cấu hình CORS trong `main.ts`.
- [ ] Cấu hình `ValidationPipe` toàn cục (`whitelist: true`, `forbidNonWhitelisted: true`).
- [ ] Viết Custom `HttpExceptionFilter` đồng nhất format JSON lỗi.
- [ ] Viết Response `Interceptor` đồng nhất format JSON thành công (`success`, `statusCode`, `data`, `timestamp`).

**Phase 3: Module Auth & Phân quyền**

- [ ] Cài đặt `@nestjs/jwt`, `passport-jwt`, `bcrypt`.
- [ ] Viết API `/auth/register` (Tự động hash password).
- [ ] Viết API `/auth/login` (Trả về access_token & refresh_token).
- [ ] Viết `JwtAuthGuard` để bảo vệ toàn bộ API hệ thống.
- [ ] Tạo custom decorator `@CurrentUser()` và `@Public()`.
- [ ] Xây dựng `RolesGuard` và `@Roles()` xử lý RBAC (USER, MANAGER, HR_MANAGER, ADMIN).

**Phase 4: Module Quản lý nhân sự (Employees)**

- [ ] Viết API GET `/profile` cho user tự xem thông tin.
- [ ] Viết các API CRUD Quản lý nhân sự (Chỉ dành cho HR_MANAGER & ADMIN).
- [ ] Xử lý logic DELETE employee (Chỉ chuyển status sang 'TERMINATED', không xóa vật lý).
- [ ] Test toàn bộ API Auth và Users trên API Dog.

---

## 2. Đức Tài (Business Logic, Database Advanced)

**Phase 1: Mở rộng Database (Prisma)**

- [ ] Dựng Schema cho bảng `leave_requests` (Quan hệ với employees).
- [ ] Dựng Schema cho bảng `payrolls` (Tính toán tự động).
- [ ] Dựng Schema cho bảng `audit_logs` (Lưu lịch sử hệ thống).

**Phase 2: Module Quản lý Nghỉ phép (Dual-Approval Leave)**

- [ ] Viết API POST `/leave-requests` (Nhân viên nộp đơn phép, validate ngày hợp lệ).
- [ ] Viết API PATCH `/leave-requests/:id/approve-manager` (Duyệt cấp 1 - Dành cho báo cáo trực tiếp/Manager).
- [ ] Viết API PATCH `/leave-requests/:id/approve-hr` (Duyệt cấp 2 - Dành cho HR_MANAGER).

**Phase 3: Module Tiền lương (Automated Payroll)**

- [ ] Viết API POST `/payrolls/process` (Khởi tạo bảng lương tháng - Chỉ HR_MANAGER).
- [ ] Viết thuật toán lấy danh sách nhân viên 'ACTIVE'.
- [ ] Viết thuật toán đếm ngày phép không hợp lệ/vượt mức để tính tiền khấu trừ (`deductions`).
- [ ] Cập nhật lương thực nhận (`total_salary`) = lương cơ bản + thưởng - khấu trừ.
- [ ] Viết API GET xem chi tiết phiếu lương (User tự xem của mình, HR xem được tất cả).

**Phase 4: Tích hợp Database Trigger (PostgreSQL PL/pgSQL)**

- [ ] Viết script SQL tạo Trigger function cho sự kiện `AFTER INSERT OR UPDATE OR DELETE` trên bảng `employees` và `payrolls`.
- [ ] Cấu hình Trigger bắt thay đổi và lưu dữ liệu (old_value, new_value, action) vào bảng `audit_logs`.
- [ ] Phối hợp với Minh để truyền context (ID người dùng hiện tại) từ NestJS xuống Database khi thực hiện query cập nhật.
- [ ] Test toàn bộ API Leave và Payroll trên API Dog.
