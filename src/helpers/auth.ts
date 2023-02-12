import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import axios from 'redaxios';
import { RefreshResponseData } from '../types/auth.types';

export const baseUrl = 'https://ilya-blog-api.up.railway.app';

const login = async (payload: { username: string; password: string }) => {
  try {
    const { data, status } = await axios.post(
      `${baseUrl}/api/v1/auth/login`,
      payload,
    );

    return {
      status,
      data,
    };
  } catch (error: any) {
    return {
      status: error.status,
      data: error.data.message,
    };
  }
};

const refreshTokens = async (): Promise<any> => {
  console.log('Refreshing tokens');

  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    return {
      status: 401,
      data: {
        message: 'Unauthorized: No refresh token found',
      },
    };
  }
  const refreshResponse = await axios.post(
    `${baseUrl}/api/v1/auth/refresh-tokens`,
    {
      refreshToken,
    },
  );
  if (refreshResponse.status === 200) {
    const refreshResponseData: RefreshResponseData = refreshResponse.data;
    localStorage.setItem(
      'accessToken',
      refreshResponseData.tokens.access.token,
    );
    localStorage.setItem(
      'accessTokenExp',
      moment(refreshResponseData.tokens.access.expires).unix().toString(),
    );
    localStorage.setItem(
      'refreshToken',
      refreshResponseData.tokens.refresh.token,
    );
    localStorage.setItem(
      'refreshTokenExp',
      moment(refreshResponseData.tokens.refresh.expires).unix().toString(),
    );
    return {
      status: 200,
      data: {
        message: 'Refreshed tokens',
      },
    };
  }
  return {
    status: 401,
    data: {
      message: 'Unauthorized: Refresh token expired',
    },
  };
};

const getAccessToken = async (): Promise<string | null> => {
  let accessToken = localStorage.getItem('accessToken') || null;
  const accessTokenExpires = localStorage.getItem('accessTokenExp');
  const refreshToken = localStorage.getItem('refreshToken');
  const refreshTokenExpires = localStorage.getItem('refreshTokenExp');

  if (!accessToken || !refreshToken) {
    return null;
  }

  if (moment().unix() > Number(accessTokenExpires)) {
    console.log('Access token expired');

    if (moment().unix() > Number(refreshTokenExpires)) {
      console.log('Refresh token expired');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      return null;
    }
    await refreshTokens();
    accessToken = localStorage.getItem('accessToken');
    return accessToken;
  }
  return accessToken;
};

const postWithAuth = async (path: string, payload: any = {}): Promise<any> => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return {
      status: 401,
      data: {
        message: 'Unauthorized: No access or refresh token found',
      },
    };
  }

  try {
    const { data, status } = await axios.post(`${baseUrl}${path}`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return {
      status,
      data,
    };
  } catch (error: any) {
    return {
      status: error.status,
      data: error.data,
    };
  }
};
const putWithAuth = async (path: string, payload: any = {}): Promise<any> => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return {
      status: 401,
      data: {
        message: 'Unauthorized: No access or refresh token found',
      },
    };
  }

  try {
    const { data, status } = await axios.put(`${baseUrl}${path}`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return {
      status,
      data,
    };
  } catch (error: any) {
    return {
      status: error.status,
      data: error.data.message,
    };
  }
};

const logout = async (): Promise<void> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    if (localStorage.getItem('accessToken')) {
      localStorage.removeItem('accessToken');
    }
    return;
  }
  try {
    const logoutResponse = await postWithAuth('/api/v1/auth/logout', {
      refreshToken,
    });

    if (logoutResponse.status === 204) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      const customKey = 'accessToken';
      const storageEvent = new StorageEvent('storage', { key: customKey });
      window.dispatchEvent(storageEvent);
    } else {
      console.log('logout failed');
    }
  } catch (error) {
    // handle network errors
    // e.g. display an error message to the user
    console.log(error);
  }
};

const decryptToken = (token: string): any => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
};

export {
  login,
  logout,
  postWithAuth,
  decryptToken,
  putWithAuth,
  getAccessToken,
};
