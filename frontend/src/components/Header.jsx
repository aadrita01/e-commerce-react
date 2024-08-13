import React from 'react'
import { Badge, Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import {FaShoppingCart, FaUser} from 'react-icons/fa'
import {LinkContainer} from 'react-router-bootstrap'
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import logo from '../assets/logo.png';

const Header = () => {

    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // const [logoutUser] = useLogoutMutation();

    const logoutHandler = () => {
        try{
          // await logoutUser().unwrap();
          dispatch(logout());
          navigate('/login');
        } catch(error){
          console.log(error);
        }
    }

  return (
    <header>
        <Navbar expand="lg" collapseOnSelect className="custom-navbar">
            <Container>
                <LinkContainer to='/'>
                <Navbar.Brand>
                <img src={logo} alt='TechTrove' style={{ width: '80px', height: '80px' }}/>
                TechTrove</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className='ms-auto'>

                    <LinkContainer to='/cart'>
                        <Nav.Link><FaShoppingCart/>Cart
                        {cartItems.length > 0 && (
                  <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </Badge>
                )}
                </Nav.Link>
                    </LinkContainer> 
                    
                    {userInfo ? (
                <>
                  <NavDropdown title={userInfo.name || userInfo.user.name} id='username'>
                    <NavDropdown.Item as={Link} to='/profile'>
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <Nav.Link as={Link} to='/login'>
                  <FaUser /> Sign In
                </Nav.Link>
              )}
  

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
}

export default Header