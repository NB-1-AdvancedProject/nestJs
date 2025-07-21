import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    const id = authHeader?.split(' ')[1];

    if (!id) throw new Error('Missing userId in Authorization header');

    request.user = { id };
    return true;
  }
}
