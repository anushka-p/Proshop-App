import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { NavLink } from 'react-router-dom'

function CheckoutSteps({step1, step2, step3, step4}) {
    const disabledStyle = { pointerEvents: 'none', color: '#6c757d', textDecoration: 'none' };
  return (
    <Nav className='justify-content-center mb-4'>
        <Nav.Item>
            {step1 ? (
                <LinkContainer to='/login'>
                <NavLink>Login</NavLink>
            </LinkContainer>
            ):
            (
                <NavLink style={disabledStyle}>
                    Login
                </NavLink>
            )}
            
        </Nav.Item>

        <Nav.Item>
            {step2 ? (
                <LinkContainer to='/shipping'>
                <NavLink>Shipping</NavLink>
            </LinkContainer>
            ):
            (
                <NavLink style={disabledStyle}>
                    Shipping
                </NavLink>
            )}
        </Nav.Item>

        <Nav.Item>
            {step3 ? (
                <LinkContainer to='/payment'>
                <NavLink>Payment</NavLink>
            </LinkContainer>
            ):
            (
                <NavLink style={disabledStyle}>
                    Payment
                </NavLink>
            )}
        </Nav.Item>

        <Nav.Item>
            {step4 ? (
                <LinkContainer to='/placeorder'>
                <NavLink>Placeorder</NavLink>
            </LinkContainer>
            ):
            (
                <NavLink style={disabledStyle}>
                    Placeorder
                </NavLink>
            )}
            
        </Nav.Item>
    </Nav>
  )
}

export default CheckoutSteps
