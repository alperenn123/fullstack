import { Box, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { useState } from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';


const ForgotPassword: React.FC<{}> = ({ }) => {
  const [complete,setComplate] = useState(false);
  const [,forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant="small">
    <Formik
      initialValues={{ email: "" }}
      onSubmit={async (values, { setErrors }) => {
        await forgotPassword(values);
        setComplate(true);
      }}
    >
      {({ isSubmitting }) => complete ? (
        <Box>If an account with that email exists,we will send you an mail</Box>
      ):(
        <Form>
          <Box mt={4}>
            <InputField
              name="email"
              placeholder="email"
              label="Email"
              type="email"
            />
          </Box>
          <Button
            mt={4}
            type="submit"
            isLoading={isSubmitting}
            variantColor="teal"
          >
            forgot password
          </Button>
        </Form>
      )}
    </Formik>
  </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(ForgotPassword);