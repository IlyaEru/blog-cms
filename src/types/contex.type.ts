export interface LoginPayloadType {
  username: string;
  password: string;
}

export interface AuthContextType {
  //   login: (payload: LoginPayloadType) => void;
  //   logout: () => void;
  isAuthenticated: boolean;
  accessToken: string;
  refreshToken: string;
  setIsLoading: (isLoading: boolean) => void;
}
