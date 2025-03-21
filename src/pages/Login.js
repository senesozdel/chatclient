import React from 'react'
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import { setPassword, setUsername,setEmail ,setLoading} from '../features/user/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../dataRequests/userRequest';
import { message } from 'antd';
import {  setConnectionState } from '../features/connection/connectionSlice';

const Login = ({hubConnection}) => {

    const dispatch = useDispatch();
    const userSlice = useSelector((state) => state.user);
    const navigate = useNavigate()
    const handleLogin =async(e)=>{
      e.preventDefault();
      dispatch(setLoading(true)); 

         try {
        const payload = {
          userName: userSlice.userName,
          password: userSlice.password
        }
    
        const result = await login(payload);
    
        if (result) {
          message.success("Login successfully!").then(() => {
            dispatch(setConnectionState(true))
            dispatch(setUsername(""));
            dispatch(setPassword(""));
            dispatch(setEmail(""));
            navigate("/chat");
          });
        } 
        else {
          message.error("Failed to login.");
        }
      } 
      catch (error) {
        message.error("An error occurred during login.");
      } 
      finally {
        dispatch(setLoading(false)); 
      }

      }


  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
    <Row>
      <Col>
        <Card style={{ width: '24rem', padding: '20px' }}>
          <Card.Body>
            <Card.Title className="text-center mb-4">
            <img src="/images/logo.png" /> 
            </Card.Title>
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formUsername" className="mb-3">
                <Form.Label>Kullanıcı Adı</Form.Label>
                <Form.Control type="text" placeholder="Kullanıcı adınızı girin" value={userSlice.userName} onChange={(e)=>dispatch(setUsername(e.target.value))} />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Şifre</Form.Label>
                <Form.Control type="password" placeholder="Şifrenizi girin" value={userSlice.password}   onChange={(e)=>dispatch(setPassword(e.target.value))} />
              </Form.Group>

              <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 mb-2"
                    disabled={userSlice.isLoading}
                  >
                    {userSlice.isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Giriş Yapılıyor...
                      </>
                    ) : (
                      'Giriş Yap'
                    )}
                  </Button>
              <p >Henüz Kayıtlı Değil Misin? <span><Link to={"/register"}>Yeni Hesap</Link></span></p>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
  )
}

export default Login