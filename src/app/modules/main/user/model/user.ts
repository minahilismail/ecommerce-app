export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  roles?: Role[];
}

export enum Roles {
  Administrator = 'Administrator',
  Seller = 'Seller',
  User = 'User',
}

export interface Role {
  id: number;
  name: string;
}
