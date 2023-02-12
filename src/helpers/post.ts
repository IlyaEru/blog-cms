import axios from 'redaxios';
import {
  ErrorPostResponse,
  Post,
  SuccessPostResponse,
} from '../types/post.types';
import { baseUrl, postWithAuth, putWithAuth } from './auth';

const getPosts = async (): Promise<Post[]> => {
  const { data } = await axios.get(`${baseUrl}/api/v1/posts`);
  return data.posts;
};

const getPostById = async (id: string): Promise<Post> => {
  const { data } = await axios.get(`${baseUrl}/api/v1/posts/${id}`);
  return data.post;
};

const updatePost = async (
  postId: string,
  title: string,
  body: string,
): Promise<SuccessPostResponse | ErrorPostResponse> => {
  try {
    const { data, status } = await putWithAuth(`/api/v1/posts/${postId}`, {
      title,
      body,
    });
    return { status: status, data: data };
  } catch (error: any) {
    return { status: error.status, data: error.data.message };
  }
};

const publishPost = async (
  postId: string,
): Promise<SuccessPostResponse | ErrorPostResponse> => {
  const updateResponse = await putWithAuth(`/api/v1/posts/${postId}/publish`);
  return { status: updateResponse.status, data: updateResponse.data.post };
};

const unpublishPost = async (
  postId: string,
): Promise<SuccessPostResponse | ErrorPostResponse> => {
  const updateResponse = await putWithAuth(`/api/v1/posts/${postId}/unpublish`);
  return { status: updateResponse.status, data: updateResponse.data.post };
};

const createPost = async (
  title: string,
  body: string,
): Promise<SuccessPostResponse | ErrorPostResponse> => {
  try {
    const { data, status } = await postWithAuth('/api/v1/posts', {
      title,
      body,
    });

    return { status: status, data: data };
  } catch (error: any) {
    return { status: error.status, data: error.data };
  }
};

const deletePost = async (postId: string) => {
  const deleteResponse = await axios.delete(
    `${baseUrl}/api/v1/posts/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    },
  );
  return { status: deleteResponse.status, data: deleteResponse.data.post };
};

const getPostsComments = async (postId: string) => {
  try {
    const { data, status } = await axios.get(
      `${baseUrl}/api/v1/comments?postId=${postId}`,
    );
    return { status, comments: data.comments };
  } catch (error: any) {
    return { status: error.status, comments: [] };
  }
};

const isSuccessfulResponse = (
  response: SuccessPostResponse | ErrorPostResponse,
): response is SuccessPostResponse => {
  return response.status === 200 || response.status === 201;
};
export {
  getPosts,
  getPostById,
  publishPost,
  unpublishPost,
  createPost,
  deletePost,
  updatePost,
  isSuccessfulResponse,
  getPostsComments,
};
