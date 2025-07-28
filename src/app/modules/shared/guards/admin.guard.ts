import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { RbacService } from '../services/rbac.service';
import { Roles } from '../../main/user/model/user';

export const adminGuard: CanActivateFn = (route, state) => {
  return inject(RbacService).isGranted(Roles.ADMINISTRATOR);
};
