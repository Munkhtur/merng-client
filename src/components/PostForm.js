import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';
import { FETCH_POSTS_QUERY } from '../util/graphqlQuery';

import { useForm } from '../util/hooks';

const PostForm = () => {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: '',
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      let data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      data = { getPosts: [result.data.createPost, ...data.getPosts] };
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      values.body = '';
    },
    onError(error) {
      console.log(error);
    },
  });
  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder='Hi world'
            name='body'
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type='submit' color='teal'>
            Post
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className='ui error message' style={{ marginBottom: 20 }}>
          <ul className='list'>
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
};

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
