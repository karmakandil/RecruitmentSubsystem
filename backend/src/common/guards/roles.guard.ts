import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { SystemRole } from '../../employee-profile/enums/employee-profile.enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<SystemRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.roles) {
      console.log('RolesGuard: No user or roles found', { userId: user?.userId, hasRoles: !!user?.roles });
      return false;
    }

    // Ensure roles is an array
    const userRoles = Array.isArray(user.roles) ? user.roles : [];
    
    // Check if any required role matches user roles (case-insensitive comparison)
    const hasRole = requiredRoles.some((requiredRole) => {
      return userRoles.some((userRole) => {
        // Handle both string and object roles
        const userRoleStr = typeof userRole === 'string' ? userRole : userRole?.toString() || '';
        return userRoleStr.toLowerCase().trim() === requiredRole.toLowerCase().trim();
      });
    });

    if (!hasRole) {
      console.log('RolesGuard: Access denied', {
        requiredRoles,
        userRoles,
        userId: user.userId,
        username: user.username,
      });
    }

    return hasRole;
  }
}
