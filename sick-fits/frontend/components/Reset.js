import Form from './styles/Form';
import { useForm } from '../lib/useForm';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';
import DisplayError from './ErrorMessage';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($email: String!, $token: String!, $password: String!) {
    redeemUserPasswordResetToken(email: $email, token: $token, password: $password) {
      code
      message
    }
  }
`;

export default function Reset({ token }) {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token: token,
  });

  const [reset, { data, loading, error }] = useMutation(RESET_MUTATION, {
    variables: inputs,
    // refetch the currently logged in user
    // refetchQueries: [
    //   {
    //     query: CURRENT_USER_QUERY,
    //   },
    // ],
  });

  const successfuleError = data?.redeemUserPasswordResetToken?.code ? data?.redeemUserPasswordResetToken : undefined;
  console.log(successfuleError);

  async function handleSubmit(e) {
    e.preventDefault(); // stop the form from submitting

    console.log(inputs);
    //send the email and password to the graphql api
    const res = await reset().catch(console.error);
    console.log(res);
    resetForm();
  }

  //   const error =
  //     data?.authenticateUserWithPassword.__typename === 'UserAuthenticationWithPasswordFailure'
  //       ? data?.authenticateUserWithPassword
  //       : undefined;

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Reset your password</h2>
      <DisplayError error={error || successfuleError} />
      <fieldset>
        {data?.redeemUserPasswordResetToken === null && <p>Success!, You can now sign in</p>}

        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="YourEmail@email.com"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Request Reset!</button>
      </fieldset>
    </Form>
  );
}
