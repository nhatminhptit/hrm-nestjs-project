# Hệ thống quản lý nhân sự (HRM Web Application)

## 1. Tổng quan

Dự án Human Resource Management (HRM) Web Application mô phỏng một hệ thống quản lý nhân sự thực tế trong doanh nghiệp. Hệ thống yêu cầu tính toàn vẹn dữ liệu nghiêm ngặt, bảo mật nhiều lớp và quy trình quản lý chặt chẽ.

## 2. Chức năng chính

- **Xác thực & Phân quyền:** Đăng ký, đăng nhập cấp phát token JWT, mã hóa mật khẩu Bcrypt và phân quyền RBAC (USER, MANAGER, HR_MANAGER, ADMIN).
- **Quản lý nhân sự:** Thêm, sửa, đổi trạng thái làm việc của nhân viên, bảo vệ chống nhồi nhét dữ liệu (Mass Assignment).
- **Duyệt phép 2 cấp (Dual-Approval):** Nhân viên nộp đơn; Quản lý trực tiếp phê duyệt cấp 1; HR Manager phê duyệt cấp 2.
- **Tính lương tự động:** Khởi tạo bảng lương tự động tính toán tổng lương từ lương cơ bản, thưởng và các khoản khấu trừ.
- **Nhật ký hệ thống (Audit Logs):** Tự động ghi lại lịch sử thay đổi dữ liệu bảng nhân sự và bảng lương bằng PostgreSQL Trigger.

## 3. Kiến trúc & Công nghệ

- **Framework & Database:** NestJS (TypeScript), PostgreSQL (v15+), Prisma ORM.
- **Bảo mật:** Passport.js, JWT, Bcrypt, Helmet, CORS, ValidationPipe.
- **Môi trường:** Docker, Docker Compose.

## 4. Cấu trúc thư mục dự kiến

```text
hrm-backend/
├── docs/
│   └── task-breakdown.md      # Chi tiết phân công công việc
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/                # Chứa Guard, Interceptor, Pipe, Filter dùng chung
│   ├── modules/
│   │   ├── auth/              # Xử lý xác thực
│   │   ├── users/             # Quản lý nhân sự
│   │   ├── leaves/            # Quản lý nghỉ phép
│   │   └── payrolls/          # Quản lý tiền lương
│   └── prisma/
│       └── schema.prisma      # Định nghĩa các bảng Database
├── docker-compose.yml
├── .env
└── README.md
```

## 5. Phân công nhiệm vụ

| Vai trò              | Phụ trách           | Nhiệm vụ chính                                                                                                                                                            |
| -------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cấu trúc & Bảo mật   | Nhật Minh           | Thiết lập base project, Docker, Cấu hình Prisma. Xây dựng `JwtAuthGuard`, `RolesGuard`, Custom Exception Filter, Interceptor, `ValidationPipe`. Code Module Auth & Users. |
| Phát triển Nghiệp vụ | [Tên bạn cùng nhóm] | Thiết kế Schema Prisma cho Leave, Payroll, Audit. Phát triển Module Leave (Duyệt phép 2 cấp), Module Payroll (Tính lương tự động). Viết PL/pgSQL Trigger.                 |

Xem chi tiết các đầu việc cụ thể tại docs/task-breakdown.md.

## 6. Git workflow

- Clone dự án và tạo nhánh mới từ nhánh chính để làm việc: `git checkout -b feature/[tên-tính-năng]`.
- Commit convention: `feat:` (thêm tính năng), `fix:` (sửa lỗi), `refactor:` (tối ưu code), `docs:` (viết tài liệu).
- Mọi nhánh tính năng sau khi hoàn thành cần tạo Pull Request (PR) để review và test qua API Dog trước khi merge.
