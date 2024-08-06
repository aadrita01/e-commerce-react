import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useLoginMutation, useGetUserQuery } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const LoginScreen = () => {

    const [userName, setEmail] = useState('');
    const [userPassword, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();
    const { refetch } = useGetUserQuery();

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

    useEffect(() => {
        const updateFormValidity = () => {
          const isEmailValid = validateEmail(userName);
          setIsFormValid(isEmailValid);
        };
    
        updateFormValidity();
      }, [userName]);

    const submitHandler = async(e) => {
        e.preventDefault();
        if (!validateEmail(userName)) {
            return;
        }
        try{
            const res= await login({userName, userPassword}).unwrap();
            dispatch(setCredentials({...res})); //change point
            refetch();
        } catch(error){
            if (error?.status === 401) {
                toast.error('Invalid username or password');
              } else {
                toast.error(error?.data?.message || error.error);
              } 
        }
    }

  return (
    <FormContainer>
        <h1>Sign In</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group controlId='email' className='my-3'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                    type='email'
                    placeholder='Enter email'
                    value={userName}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => validateEmail(userName)}
                ></Form.Control>
                {emailError && <small className="text-danger">{emailError}</small>}
            </Form.Group>

            <Form.Group controlId='password' className='my-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type='password'
                    placeholder='Enter password'
                    value={userPassword}
                    onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' className='mt-2' disabled={!isFormValid || isLoading}>
                Sign In
            </Button>
            {isLoading && <Loader />}
        </Form>

        <Row className='py-3'>
            <Col>
                New Customer? <Link to={redirect?`/register?redirect=${redirect}`:'/register'}>Register</Link>
            </Col>
        </Row>
    </FormContainer>
  )
}

export default LoginScreen