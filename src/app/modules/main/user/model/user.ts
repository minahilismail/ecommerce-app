export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  roles?: string[];
  roleIds?: number[];
}
export interface Role {
  id: number;
  name: string;
}
