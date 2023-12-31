import React, {useState, useEffect} from 'react'
import { Link, useLocation, useNavigate} from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { register } from '../actions/userActions'
import FormContainer from '../components/FormContainer'


function RegisterScreen() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('') 
    const [confirmPassword, setConfirmPassword] = useState('') 
    const [name, setName] = useState('') 
    const [message, setMessage] = useState('') 

    const location = useLocation()

    const dispatch = useDispatch()
    const redirect = location.search ? location.search.split('=')[1] : '/'


    const userRegister = useSelector(state => state.userRegister)
    const {error, loading, userInfo} = userRegister
    const navigate = useNavigate()
    useEffect(()=>{
        if(userInfo)
        {
            navigate(redirect)
        }
    }, [userInfo, redirect, navigate])
    const submitHandler= (e)=>{
        e.preventDefault()
        if(password !== confirmPassword)
        {
            setMessage('Passwords do not match')
        }
        else{
            dispatch(register(name, email, password))
        }
    }



  return (
    <FormContainer>
         <h1>
            Sign In
        </h1>
        {message && <Message variant='danger'>{message}</Message> }
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control 
                required
                type='name' 
                placeholder='Enter Name' 
                value={name} 
                onChange={(e)=> setName(e.target.value)}>

                </Form.Control>
            </Form.Group>

            <Form.Group controlId='email'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control 
                required
                type='email' 
                placeholder='enter email' 
                value={email} 
                onChange={(e)=> setEmail(e.target.value)}>

                </Form.Control>
            </Form.Group>

            <Form.Group controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control 
                required
                type='password' 
                placeholder='enter password' 
                value={password} 
                onChange={(e)=> setPassword(e.target.value)}>

                </Form.Control>
            </Form.Group>
            <Form.Group controlId='passwordConfirm'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control 
                required
                type='password' 
                placeholder='enter confirm password' 
                value={confirmPassword} 
                onChange={(e)=> setConfirmPassword(e.target.value)}>

                </Form.Control>
            </Form.Group>
            <Button type='submit' variant='primary'>Register</Button>
            <Row className='py-3'>
            <Col>
            Have an Account? <Link to={redirect ? `/register?redirect=${redirect}`: '/login'}>Sign In</Link>
            </Col>
        </Row>

        </Form>
    </FormContainer>
  )
}

export default RegisterScreen
