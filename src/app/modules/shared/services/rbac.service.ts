// import { Injectable } from '@angular/core';
// import { Role, User } from '../../main/user/model/user';

// @Injectable({
//   providedIn: 'root',
// })
// export class RbacService {
//   private _roles = new Map();
//   private _authenticatedUser!: User;

//   setAuthenticatedUser(user: User) {
//     this._authenticatedUser = user;
//   }

//   isGranted(roleOrPermission: string, user?: User): boolean {

//     if (!user) {
//       user = this._authenticatedUser;
//     }

//     if (!user) {
//       return false;
//     }

//     return this._roles.get(user.).includes(roleOrPermission);
//   }
// }
