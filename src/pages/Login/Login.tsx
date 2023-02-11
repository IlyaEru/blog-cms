import { useContext, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';

import { decryptToken, login } from '../../helpers/auth';
import { LoginSuccessResponseData } from '../../types/auth.types';
import { validateLoginForm } from './Login.validation';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { setIsLoading } = useContext(AuthContext);

  const [loginErrors, setLoginErrors] = useState<string[]>([]);

  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(username, password);
    if (validationErrors) {
      setLoginErrors(validationErrors.details.map((detail) => detail.message));
      return;
    }
    setIsLoading(true);
    const response = await login({ username, password });

    if (response.status === 200) {
      const responseData = response.data as LoginSuccessResponseData;
      const decodedAccessToken = decryptToken(responseData.tokens.access.token);
      const decodedRefreshToken = decryptToken(
        responseData.tokens.refresh.token,
      );
      localStorage.setItem('accessToken', responseData.tokens.access.token);
      localStorage.setItem('accessTokenExp', decodedAccessToken.exp);
      localStorage.setItem('refreshToken', responseData.tokens.refresh.token);
      localStorage.setItem('refreshTokenExp', decodedRefreshToken.exp);

      navigate('/');
      const customKey = 'accessToken';
      const storageEvent = new StorageEvent('storage', { key: customKey });
      window.dispatchEvent(storageEvent);
    } else {
      setLoginErrors([response.data]);
    }
    setIsLoading(false);
  };
  return (
    <>
      <Container className="mt-2">
        <Row>
          <Col className="col-md-8 offset-md-2">
            <legend>Login Form</legend>
            <form onSubmit={handleLoginSubmit}>
              <Form.Group className="mb-3" controlId="formUserName">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              {loginErrors.length > 0 &&
                loginErrors.map((error, index) => (
                  <div key={index} className="alert alert-danger mt-3 mb-4">
                    {error}
                  </div>
                ))}
              <Button variant="primary" type="submit">
                Login
              </Button>
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default Login;
