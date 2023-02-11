import { useContext, useEffect, useState } from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../App';
import { postWithAuth } from '../../helpers/auth';
import {
  createPost,
  getPostById,
  isSuccessfulResponse,
  updatePost,
} from '../../helpers/post';
import { SuccessPostResponse } from '../../types/post.types';
import { validateNewPostForm } from './NewPost.validation';

export default function NewPost() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const [isLoadingPostData, setIsLoadingPostData] = useState(true);

  const { postId } = useParams();

  const { setIsLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchPost = async (postId: string) => {
      const post = await getPostById(postId);
      if (post) {
        setTitle(post.title);
        setBody(post.body);
        setIsLoadingPostData(false);
      }
    };
    if (postId && typeof postId === 'string') {
      fetchPost(postId);
    } else {
      setTitle('');
      setBody('');
      setIsLoadingPostData(false);
    }
  }, [postId]);

  const [newPostFormError, setNewPostFormError] = useState<string[]>([]);

  const navigate = useNavigate();

  const handleNewPostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const error = validateNewPostForm(title, body);
    if (error) {
      setNewPostFormError(error.details.map((detail) => detail.message));

      return;
    }
    if (postId) {
      const updatePostResponse = await updatePost(postId, title, body);

      if (isSuccessfulResponse(updatePostResponse)) {
        if (updatePostResponse.status === 200) {
          navigate(`/posts/${postId}`);
        }
      } else {
        setNewPostFormError([updatePostResponse.data.message]);
      }
      setIsLoading(false);
      return;
    }
    const newPostResponse = await createPost(title, body);

    if (isSuccessfulResponse(newPostResponse)) {
      if (newPostResponse.status === 201) {
        const newPostId = newPostResponse.data._id;
        navigate(`/posts/${newPostId}`);
      }
    } else {
      setNewPostFormError([newPostResponse.data.message]);
    }
    setIsLoading(false);
  };
  if (isLoadingPostData) {
    return (
      <main
        style={{ minHeight: '80vh' }}
        className="d-flex align-items-center justify-content-center h-100"
      >
        <Spinner animation="grow" variant="primary" />
      </main>
    );
  }

  return (
    <Container className="mt-2">
      <Row>
        <Col className="col-md-8 offset-md-2">
          <legend>{postId ? 'Update Post' : 'New Post'}</legend>
          <form onSubmit={handleNewPostSubmit}>
            <Form.Group className="mb-3" controlId="formUserName">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                autoComplete="off"
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="new-post-form__Content-textarea">
                Content
              </Form.Label>
              <textarea
                className="form-control"
                onChange={(e) => setBody(e.target.value)}
                id="new-post-form__Content-textarea"
                value={body}
                rows={3}
              ></textarea>
            </Form.Group>
            {newPostFormError.length > 0 &&
              newPostFormError.map((error, index) => (
                <div key={index} className="alert alert-danger mt-3 mb-4">
                  {error}
                </div>
              ))}
            <div className="d-flex justify-content-center">
              <Button variant="primary" type="submit">
                Submit Post
              </Button>
            </div>
          </form>
        </Col>
      </Row>
    </Container>
  );
}
