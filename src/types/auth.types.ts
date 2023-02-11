export interface LoginSuccessResponse {
  status: number;
  data: LoginSuccessResponseData;
}
export interface IUser {
  _id: string;
  username: string;
  password: string;
}
export interface LoginSuccessResponseData {
  user: {
    _id: string;
  };
  tokens: {
    access: {
      token: string;
      expires: Date;
    };
    refresh: {
      token: string;
      expires: Date;
    };
  };
}

export interface LoginErrorResponse {
  status: number;
  data: {
    message: string;
  };
}

export interface RefreshResponseData {
  user: IUser;
  tokens: {
    access: {
      token: string;
      expires: Date;
    };
    refresh: {
      token: string;
      expires: Date;
    };
  };
}
