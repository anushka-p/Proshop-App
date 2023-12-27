import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import {logout} from '../actions/userActions'
function Header() {

  const userLogin = useSelector(state => state.userLogin)
  const {userInfo}= userLogin 
  const dispatch = useDispatch()
  const logoutHandler = ()=>{
    dispatch(logout())
  }
  return (
    <div>
      <header>
      <Navbar bg="dark" variant='dark' expand="lg" className="bg-body-tertiary" collapseOnSelect>
      <Container fluid>
        <LinkContainer to='/'>
        <Navbar.Brand >ProShop</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <LinkContainer to='/cart'>
            <Nav.Link> <i className='fas fa-shopping-cart'></i> Cart</Nav.Link>
            </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.username} id='username'>
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>
                        Profile
                      </NavDropdown.Item>
                    </LinkContainer>

                    <NavDropdown.Item onClick={logoutHandler}>
                        Logout
                      </NavDropdown.Item>
                </NavDropdown>
              ):
              (
                <LinkContainer to='/login'>
                <Nav.Link><i className='fas fa-user'></i>Login</Nav.Link>
                </LinkContainer>
              )}

                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title= 'Admin' id='adminmenu'>
                  <LinkContainer to='/admin/userList'>
                    <NavDropdown.Item>
                      Users
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to='/admin/productList'>
                    <NavDropdown.Item>
                      Products
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to='/admin/orderList'>
                    <NavDropdown.Item>
                      Orders
                    </NavDropdown.Item>
                  </LinkContainer>
              </NavDropdown>
                )}
           
          </Nav>
         
        </Navbar.Collapse>
      </Container>
    </Navbar>
        
      </header>
    </div>
  )
}

export default Header
