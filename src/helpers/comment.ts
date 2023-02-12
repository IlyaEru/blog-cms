import axios from 'redaxios';
import { baseUrl, getAccessToken } from './auth';

const deleteComment = async (postId: string) => {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return {
      status: 401,
      data: {
        message: 'Unauthorized: No access or refresh token found',
      },
    };
  }
  const deleteResponse = await axios.delete(
    `${baseUrl}/api/v1/comments/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return { status: deleteResponse.status, data: deleteResponse.data.post };
};

export { deleteComment };
