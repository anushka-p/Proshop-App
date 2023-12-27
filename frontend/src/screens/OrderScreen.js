import React, {useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Row,Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import {  Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { PayPalButton } from "react-paypal-button-v2";
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'

//client id
// AW8KRlsmSJeX4mYiBunpI-w2Q4igS8v-XPanw1r76-9P0wASSIS3XeMAtvX4bJkiLUZOwU_Z0SRfKRPG   
function OrderScreen() {
    const recOrder = useParams();
    const orderId = recOrder.id;

    const dispatch = useDispatch()
    const [sdkReady, setSdkReady] = useState(false)

    const orderDetails = useSelector(state => state.orderDetails)
    const {order, error, loading} = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading:loadingPay, success:successPay} = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading:loadingDeliver, success:successDeliver} = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo} = userLogin

    const navigate = useNavigate()
    
    if(!loading && !error)
    {
        order.itemsPrice = order.orderItems.reduce((acc,item)=> acc+ item.price * item.qty, 0).toFixed(2)
    }
    
    const addPayPalScript = () => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://www.paypal.com/sdk/js?client-id=AX-AlDqXyt3cPywFm-t-PS4oulpQ2iwmccb8AR-w2JEWDQh80uGGaRBBC2uZCoHrhq1MPD-jMbyAFykX';
        script.defer = true;  
        script.onload = () => {
            setSdkReady(true);
        };
        document.body.appendChild(script);
    };
    
   
    useEffect(()=>{
        if(!order || successPay ||order.id !== Number(orderId) || successDeliver)
        {
            dispatch({type: ORDER_PAY_RESET})
            dispatch({ORDER_DELIVER_RESET})
            dispatch(getOrderDetails(orderId))
        }
        else if(!order.isPaid)
        {
            if(!window.paypal){
                addPayPalScript()
            }else{
                setSdkReady(true)
            }
        }
      
    },[order, orderId, dispatch, successPay, successDeliver])

   const successPaymentHandler = (paymentResult)=>{
    console.log("hiiii");
        dispatch(payOrder(orderId, paymentResult))
   }

   const deliverHandler = ()=>{
    dispatch(deliverOrder(order))
   }

  return loading ?  (
  <Loader />
  ) : 
  error ? (
    <Message variant='danger'>{error}</Message>
  ):
   (
    <div>
        <h1>Order: {order.id}</h1>
      <Row>
        <Col md={8}>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h2>Shipping</h2>
                    <p><strong> Name: </strong> {order.user.name}</p>
                    <p><strong> Email: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                    <p>
                        <strong>Shipping:</strong>
                        {order.shippingAddress.address},
                        {order.shippingAddress.city},
                        {' '}
                        {order.shippingAddress.postalCode},
                        {' '}
                        {order.shippingAddress.country}
                    </p>

                    {order.isDelivered ? (
                        <Message variant='success'>Delivered On {order.deliveredAt}</Message>
                    ):
                    (
                        <Message variant='warning'>Not Delivered Yet</Message>
                    )}
                </ListGroup.Item>

                <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <p>
                        <strong>Method:</strong>
                        {order.paymentMethod}
                    </p>

                    {order.isPaid ? (
                        <Message variant='success'>Paid On {order.paidAt}</Message>
                    ):
                    (
                        <Message variant='warning'>Not Paid</Message>
                    )}
                </ListGroup.Item>

                <ListGroup.Item>
                    <h2>Oder Items</h2>
                    {order.orderItems.length === 0 ? <Message variant='info'>
                         Order is Empty!
                    </Message>
                    :
                    (
                        <ListGroup variant='flush'>
                            {order.orderItems.map((item, index) =>(
                                <ListGroup.Item key={index}> 
                                    <Row>
                                        <Col md={1}>
                                         <Image src={item.image} alt={item.name} fluid rounded/>
                                        </Col>
                                        <Col>
                                            <Link to={`/product/${item.product}`}>
                                                {item.name}
                                            </Link>
                                        </Col>
                                        <Col md={4}>
                                            {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </ListGroup.Item>
            </ListGroup>
        </Col>
        <Col md={4}>
            <Card>
                <ListGroup variant='flush'>
                     <ListGroup.Item>
                        <h2>
                            Order Summary
                        </h2>
                     </ListGroup.Item>
                     <ListGroup.Item>
                       <Row>
                        <Col>
                           Item:
                        </Col>
                        <Col>
                        ${order.itemsPrice}</Col>
                       </Row>
                     </ListGroup.Item>
                     <ListGroup.Item>
                       <Row>
                        <Col>
                           Shipping
                        </Col>
                        <Col>
                        ${order.shippingPrice}</Col>
                       </Row>
                     </ListGroup.Item>
                     <ListGroup.Item>
                       <Row>
                        <Col>
                           Tax:
                        </Col>
                        <Col>
                        ${order.taxPrice}</Col>
                       </Row>
                     </ListGroup.Item>
                     <ListGroup.Item>
                       <Row>
                        <Col>
                           Total:
                        </Col>
                        <Col>
                        ${order.totalPrice}</Col>
                       </Row>
                     </ListGroup.Item>
                    
                    {!order.isPaid && (
                        <ListGroup.Item>
                            {loadingPay && <Loader />}
                            {!sdkReady ? (
                                <Loader />
                            ): (
                                <PayPalButton 
                                amount={order.totalPrice}
                                onSuccess={successPaymentHandler}
                                />
                            )}
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Card>
        </Col>
      </Row>
    </div>
  )
}

export default OrderScreen

