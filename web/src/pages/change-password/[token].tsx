import { Box, Button, Flex,Link } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import React, { useState } from 'react';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import {useRouter} from 'next/router'
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import NextLink from 'next/link';

const ChangePassword:NextPage<{token:string}> = ({token}) => {
  const [,changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const [tokenError,setTokenError] = useState("");
  return(
    <Wrapper variant="small">
    <Formik
      initialValues={{ newPassword:"" }}
      onSubmit={async (values, { setErrors }) => {
        const response = await changePassword({
          newPassword:values.newPassword,
          token:token
        });
        if(response.data?.changePassword.errors){
          const errorMap  = toErrorMap(response.data.changePassword.errors);
          if('token' in errorMap){
            setTokenError(errorMap.token)
          }
          setErrors(errorMap);
        }else if (response.data?.changePassword.user){
          router.push('/');
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <InputField
            name="newPassword"
            placeholder="new password"
            label="New Password"
            type='password'
          />
          {tokenError ? (
          <Flex>
            <Box mr={2} style={{color:'red'}}>{tokenError}</Box>
            <NextLink href='/forgot-password'>
              <Link>Go Forgot Password Again</Link>
            </NextLink>
          </Flex>
          
          )
          
          :null}
          <Button
            mt={4}
            type="submit"
            isLoading={isSubmitting}
            variantColor="teal"
          >
            change password
          </Button>
        </Form>
      )}
    </Formik>
  </Wrapper>
  );
}

ChangePassword.getInitialProps = ({query}) => {
  return {
    token:query.token as string
  }
}
export default withUrqlClient(createUrqlClient)(ChangePassword);