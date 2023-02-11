import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { Button, Card, ListGroup, Modal, Spinner } from 'react-bootstrap';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../App';
import {
  deletePost,
  getPostById,
  publishPost,
  unpublishPost,
} from '../../helpers/post';
import { Post } from '../../types/post.types';

export default function PostDetails() {
  const { postId } = useParams();
  const [postData, setPostData] = useState<Post | null>(null);
  const [isLoadingPostData, setIsLoadingPostData] = useState(true);
  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, setIsLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchPost = async (postId: string) => {
      const post = await getPostById(postId);
      if (post) {
        setPostData(post);
        setIsLoadingPostData(false);
      }
    };
    if (postId && typeof postId === 'string') {
      fetchPost(postId);
    } else {
      navigate('/');
    }
  }, []);

  if (isLoadingPostData || !postData) {
    return (
      <main
        style={{ minHeight: '80vh' }}
        className="d-flex align-items-center justify-content-center h-100"
      >
        <Spinner animation="grow" variant="primary" />
      </main>
    );
  }

  const handlePostPublish = async () => {
    setIsLoading(true);
    const resp = await publishPost(postData._id);
    if (resp.status === 200) {
      setPostData({ ...postData, published: true });
    }
    setIsLoading(false);
  };

  const handlePostUnpublish = async () => {
    setIsLoading(true);
    const resp = await unpublishPost(postData._id);
    if (resp.status === 200) {
      setPostData({ ...postData, published: false });
    }
    setIsLoading(false);
  };

  const handlePostDelete = async () => {
    setIsLoading(true);
    try {
      const deleteResponse = await deletePost(postData._id);
      if (deleteResponse.status === 204) {
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <main className="d-flex flex-column align-items-center">
      <Card className="m-5" style={{ maxWidth: '660px' }}>
        <Card.Header className="fs-2 bg-light">
          <span className="text-transform-uppercase">Title:</span>{' '}
          {postData.title}
          <Card.Subtitle className="my-2 text-muted">
            <>
              Created at:{' '}
              {moment(postData.createdAt).format(
                'dddd, MMMM Do YYYY, h:mm:ss a',
              )}
            </>
          </Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <span className="text-transform-uppercase">Body: </span>
            {postData.body}
          </Card.Text>

          {isAuthenticated && (
            <>
              {postData.published ? (
                <Button
                  className="m-2"
                  variant="secondary"
                  onClick={handlePostUnpublish}
                >
                  Unpublish
                </Button>
              ) : (
                <Button
                  className="m-2"
                  variant="primary"
                  onClick={handlePostPublish}
                >
                  Publish
                </Button>
              )}
              <>
                <Button
                  variant="danger"
                  onClick={() => setIsDeleteModalShown(true)}
                >
                  Delete Post
                </Button>
                <NavLink className="mx-3" to={`/edit-post/${postData._id}`}>
                  <Button variant="info">Edit Post</Button>
                </NavLink>
              </>
            </>
          )}
          <Card.Title className="mt-3 ">Comment</Card.Title>
          <ListGroup className="list-group-flush">
            {postData.comments.length > 0 ? (
              postData.comments.map((comment, index) => (
                <ListGroup.Item key={index}>
                  <span className="text-transform-uppercase">Comment: </span>
                  {comment}
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No comments</ListGroup.Item>
            )}
          </ListGroup>
        </Card.Body>
        <Modal
          show={isDeleteModalShown}
          onHide={() => setIsDeleteModalShown(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Post {postData.title}?</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalShown(false)}
            >
              Close
            </Button>
            <Button variant="danger" onClick={handlePostDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    </main>
  );
}
