import React from 'react'
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import { setPassword, setUsername } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { login } from '../dataRequests/userRequest';
import { message } from 'antd';
import {  setConnectionState } from '../features/connection/connectionSlice';

const Login = ({hubConnection}) => {

    const dispatch = useDispatch();
    const userSlice = useSelector((state) => state.user);
    const navigate = useNavigate()
    const handleLogin =async(e)=>{
      e.preventDefault();
        
            const payload = {
              userName:userSlice.userName,
              password:userSlice.password
          }
      
          const result = await login(payload);
      
          if (result) {
            message.success("Login successfully!").then(()=>{

              dispatch(setConnectionState(true))
            
            }
            ).then(()=> navigate("/chat"));
    
          } else {
            message.error("Failed to login.");
          }


      }


  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
    <Row>
      <Col>
        <Card style={{ width: '24rem', padding: '20px' }}>
          <Card.Body>
            <Card.Title className="text-center mb-4">SeS</Card.Title>
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formUsername" className="mb-3">
                <Form.Label>Kullanıcı Adı</Form.Label>
                <Form.Control type="text" placeholder="Kullanıcı adınızı girin" value={userSlice.userName} onChange={(e)=>dispatch(setUsername(e.target.value))} />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Şifre</Form.Label>
                <Form.Control type="password" placeholder="Şifrenizi girin" value={userSlice.password}   onChange={(e)=>dispatch(setPassword(e.target.value))} />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100" >
                Giriş Yap
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
  )
}

export default Login