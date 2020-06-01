import React from 'react';
import App from './App';
import {
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloClient,
} from '@apollo/client';
import { setContext } from 'apollo-link-context';
// import ApolloClient from 'apollo-client';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { createHttpLink } from 'apollo-link-http';
// import { ApolloProvider } from '@apollo/react-hooks';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000',
});
const AuthLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: AuthLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const Provider = () => {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};

export default Provider;
