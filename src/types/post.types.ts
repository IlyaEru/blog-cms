export interface Post {
  _id: string;
  title: string;
  body: string;
  createdAt: Date;
  comments: string[];
  published: boolean;
}

export interface SuccessPostResponse {
  status: number;
  data: Post;
}

export interface ErrorPostResponse {
  status: number;
  data: {
    message: string;
  };
}
