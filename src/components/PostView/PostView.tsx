import Card from 'react-bootstrap/Card';
import { Post } from '../../types/post.types';
import moment from 'moment';
import { FaComment } from 'react-icons/fa';
import { Button, Modal } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { AuthContext } from '../../App';
import { NavLink } from 'react-router-dom';

interface PostViewProps extends Post {
  postCallbacks: {
    handlePostPublish: (postId: string) => void;
    handlePostUnpublish: (postId: string) => void;
    handlePostDelete: (postId: string) => void;
  };
}
export default function PostView(props: PostViewProps) {
  const { _id, title, body, createdAt, comments, published, postCallbacks } =
    props;

  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Card
      className="w-100 my-2 p-2 d-grid "
      style={{
        maxWidth: '660px',
        gridAutoFlow: 'column',
        gridGap: '1rem',
        gridTemplateColumns: '5fr 1fr',
      }}
    >
      <Card.Body>
        <NavLink
          className="border-bottom-0 text-decoration-none"
          to={`/posts/${_id}`}
        >
          <Card.Title className="text-capitalize fs-3 bd ">{title}</Card.Title>
        </NavLink>
        <Card.Subtitle className="mb-2 text-muted">
          {moment(createdAt).format('MMMM Do YYYY')}
        </Card.Subtitle>
        <Card.Text>{body}</Card.Text>
        {isAuthenticated && (
          <>
            <Button
              variant="danger"
              onClick={() => setIsDeleteModalShown(true)}
            >
              Delete Post
            </Button>
            <NavLink className="mx-3" to={`/edit-post/${_id}`}>
              <Button variant="info">Edit Post</Button>
            </NavLink>
          </>
        )}
      </Card.Body>
      <div className="post-feature d-flex flex-column align-items-center justify-content-end ">
        {isAuthenticated &&
          (published ? (
            <Button
              className="m-2"
              variant="secondary"
              onClick={() => postCallbacks.handlePostUnpublish(_id)}
            >
              Unpublish
            </Button>
          ) : (
            <Button
              className="my-2"
              variant="primary"
              onClick={() => postCallbacks.handlePostPublish(_id)}
            >
              Publish
            </Button>
          ))}
        <div className="post-feature__comments mb-2 p-2">
          <i className="fas fa-comment">
            <FaComment />
          </i>
          <span className="post-feature__comments-count p-1 ">
            {comments.length}
          </span>
        </div>
      </div>
      <Modal
        show={isDeleteModalShown}
        onHide={() => setIsDeleteModalShown(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Post {title}?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalShown(false)}
          >
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => postCallbacks.handlePostDelete(_id)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}
