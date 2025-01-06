export class GenericResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;

  constructor(obj: GenericResponse<T>) {
    this.success = obj.success;
    this.message = obj.message;
    this.data = obj.data;
  }
}

export class UserResponse {
  email!: string;
  token!: string;

  constructor(email: string, token: string) {
    this.email = email;
    this.token = token;
  }
}

export class RefreshToken {
  email: string;
  refreshToken: string

  constructor(obj: RefreshToken) {
    this.email = obj.email
    this.refreshToken = obj.refreshToken
  }
}