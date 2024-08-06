import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';

import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from 'react-icons/fa';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userPassword, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [isFormValid, setIsFormValid] = useState(false); 


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const validateEmail = (email) => {
    const emailRegex = /^[a-z]+.*@gmail\.com$/;
    if (email === '') {
      setEmailError('');
      return true;
    }
    if (!emailRegex.test(email)) {
        setEmailError('Enter a valid email address');
        return false;
    }
    setEmailError('');
    return true;
};

const validatePassword = (password) => {
  const errors = {
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
  };
  setPasswordErrors(errors);
  return Object.values(errors).every(Boolean);
};

useEffect(() => { 
  const updateFormValidity = () => { 
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(userPassword);
    setIsFormValid(isEmailValid && isPasswordValid);
  };

  updateFormValidity();
}, [email, userPassword]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
  }

    if (!validatePassword(userPassword)) {
      toast.error('Password does not meet criteria');
      return;
    }

    if (userPassword !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await register({ name, email, userPassword }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <FormContainer>
      <h1>Register</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateEmail(email)}
            ></Form.Control>
            {emailError && <small className="text-danger">{emailError}</small>}
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={userPassword}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
          ></Form.Control>
          <small className="text-muted">
            <ul>
              <li>
                {passwordErrors.hasUpperCase ? (
                  <FaCheck className="text-success" />
                ) : (
                  <FaTimes className="text-danger" />
                )}{' '}
                At least one uppercase letter
              </li>
              <li>
                {passwordErrors.hasLowerCase ? (
                  <FaCheck className="text-success" />
                ) : (
                  <FaTimes className="text-danger" />
                )}{' '}
                At least one lowercase letter
              </li>
              <li>
                {passwordErrors.hasNumber ? (
                  <FaCheck className="text-success" />
                ) : (
                  <FaTimes className="text-danger" />
                )}{' '}
                At least one number
              </li>
              <li>
                {passwordErrors.hasSpecialChar ? (
                  <FaCheck className="text-success" />
                ) : (
                  <FaTimes className="text-danger" />
                )}{' '}
                At least one special character
              </li>
            </ul>
          </small>
        </Form.Group>
        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button disabled={!isFormValid || isLoading} type='submit' variant='primary'> 
          Register
        </Button>
        {isLoading && <Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
          Already have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;