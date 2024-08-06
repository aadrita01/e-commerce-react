import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constants';

const authHeader = () => {
  const authData = JSON.parse(localStorage.getItem('userInfo'));
  const token = authData ? authData.jwtToken : null;
  console.log(token)
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const userApiSlice = apiSlice.injectEndpoints({
  
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/authenticate`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/registerNewUser`,
        method: 'POST',
        body: data,
      }),
    }),
    getUser: builder.query({
      query: () => ({
        url: `${USERS_URL}/forUser`,
        method: 'GET',
        headers: authHeader(),
      }),
    }),
    }),
  })

export const { useLoginMutation, useRegisterMutation, useGetUserQuery } = userApiSlice