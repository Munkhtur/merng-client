import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Button, Icon, Confirm } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../util/graphqlQuery';
import Popup from '../util/Popup';

const DeleteButton = ({ postId, commentId, callBack }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const mutation = commentId ? DELETE_COMMENT_MITATION : DELETE_POST_MUTATION;
  const [deleteCommentOrPost] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      // remove post from cache
      if (!commentId) {
        let data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        data = { getPosts: data.getPosts.filter((post) => post.id !== postId) };
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      }
      if (callBack) callBack();
    },
    variables: { postId, commentId },
  });
  return (
    <>
      <Popup content={commentId ? 'Delete comment' : 'Delete post'}>
        <Button
          as='div'
          color='red'
          floated='right'
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name='trash' style={{ margin: 0 }} />
        </Button>
      </Popup>

      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deleteCommentOrPost}
      />
    </>
  );
};

const DELETE_POST_MUTATION = gql`
  mutation deltePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
const DELETE_COMMENT_MITATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        body
        createdAt
      }
      commentCount
    }
  }
`;

export default DeleteButton;
