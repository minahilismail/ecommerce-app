export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  roles?: Role[];
}

export interface Role {
  id: number;
  name: string;
}
