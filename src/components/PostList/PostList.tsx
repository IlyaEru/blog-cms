import { Suspense, useContext, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { deletePost, getPosts } from '../../helpers/post';
import { Post } from '../../types/post.types';
import PostView from '../PostView/PostView';
import { publishPost, unpublishPost } from '../../helpers/post';
import { AuthContext } from '../../App';

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  const { setIsLoading } = useContext(AuthContext);

  const postCallbacks = {
    handlePostPublish: async (postId: string) => {
      setIsLoading(true);
      const resp = await publishPost(postId);

      if (resp.status === 200) {
        const updatedPosts = posts.map((post) =>
          post._id === postId ? { ...post, published: true } : post,
        );

        setPosts(updatedPosts);
      }
      setIsLoading(false);
    },

    handlePostUnpublish: async (postId: string) => {
      setIsLoading(true);
      const resp = await unpublishPost(postId);

      if (resp.status === 200) {
        const updatedPosts = posts.map((post) =>
          post._id === postId ? { ...post, published: false } : post,
        );
        console.log(updatedPosts);

        setPosts(updatedPosts);
      }
      setIsLoading(false);
    },
    handlePostDelete: async (postId: string) => {
      setIsLoading(true);
      try {
        const resp = await deletePost(postId);
        if (resp.status === 204) {
          const updatedPosts = posts.filter((post) => post._id !== postId);
          setPosts(updatedPosts);
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    },
  };
  useEffect(() => {
    const fetchPosts = async () => {
      const postsData = await getPosts();
      setIsLoadingPosts(false);
      setPosts(postsData);
    };
    fetchPosts();
  }, []);

  return (
    <main className="d-flex flex-column align-items-center mb-5">
      <h1 className="my-4">Posts</h1>
      {isLoadingPosts ? (
        <Spinner animation="grow" variant="primary" />
      ) : (
        posts.map((post) => (
          <PostView postCallbacks={postCallbacks} key={post._id} {...post} />
        ))
      )}
    </main>
  );
}
