export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  role: Role;
}

export enum Roles {
  ADMINISTRATOR = 'ADMINISTRATOR',
  SELLER = 'SELLER',
  USER = 'USER',
}

export interface Role {
  id: number;
  name: string;
  uid: string; // ADMINISTRATOR, SELLER, USER
  extends?: number | null; // id of the role to be extended
}
