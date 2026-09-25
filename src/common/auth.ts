import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  createParamDecorator,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';

export type CurrentUserPayload = { id: number; role: Role };
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload =>
    ctx.switchToHttp().getRequest().user,
);

/** Remove this adapter when the shared JwtAuthGuard is implemented. */
@Injectable()
export class RequestUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: CurrentUserPayload }>();
    if (process.env.AUTH_MODE === 'test' && !request.user) {
      const id = Number(request.header('x-test-user-id'));
      const role = request.header('x-test-user-role') as Role | undefined;
      if (
        Number.isInteger(id) &&
        id > 0 &&
        role &&
        Object.values(Role).includes(role)
      )
        request.user = { id, role };
    }
    if (!request.user)
      throw new ForbiddenException(
        'JWT user is required (or use test headers with AUTH_MODE=test)',
      );
    return true;
  }
}
export function requireRole(user: CurrentUserPayload, roles: Role[]) {
  if (!roles.includes(user.role))
    throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này');
}
