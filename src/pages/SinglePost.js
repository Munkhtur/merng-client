import React, { useContext, useState, useRef } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Grid,
  Card,
  Image,
  Button,
  Icon,
  Label,
  Form,
} from 'semantic-ui-react';
import moment from 'moment';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import { AuthContext } from '../context/auth';
import Popup from '../util/Popup';

const SinglePost = (props) => {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState('');
  const commentRef = useRef(null);
  const postId = props.match.params.postId;

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });
  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
      commentRef.current.blur();
    },
    variables: { postId, body: comment },
  });

  const deletePostCallback = () => {
    props.history.push('/');
  };

  let postMarkup;
  if (!data) {
    postMarkup = <p>Loading...</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      commentCount,
      likeCount,
    } = data.getPost;
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width='2'>
            <Image
              floated='right'
              size='small'
              src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
            />
          </Grid.Column>
          <Grid.Column width='10'>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
                <hr />
                <Card.Content extra>
                  <LikeButton user={user} post={{ id, likes, likeCount }} />
                  <Popup content='Comment on post'>
                    <Button
                      as='div'
                      labelPosition='right'
                      onClick={() => console.log('comment on single post')}
                    >
                      <Button color='blue' basic>
                        <Icon name='comments' />
                      </Button>
                      <Label basic color='blue' pointing='left'>
                        {commentCount}
                      </Label>
                    </Button>
                  </Popup>
                  {user && user.username === username && (
                    <DeleteButton postId={id} callBack={deletePostCallback} />
                  )}
                </Card.Content>
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className='ui action input fluid'>
                      <input
                        type='text'
                        placeholder='comment..'
                        name='comment'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        ref={commentRef}
                      />
                      <button
                        type='submit'
                        className='ui button teal'
                        disabled={comment.trim() === ''}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
};

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
      likes {
        username
      }
    }
  }
`;

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

export default SinglePost;
