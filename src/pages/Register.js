import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setEmail, setPassword, setUsername } from "../features/user/userSlice";
import { addNewUser } from "../dataRequests/userRequest";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {

 const userSlice = useSelector((state) => state.user);
 const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();

  const handleRegister = async(e) => {
    e.preventDefault();
    
    if (userSlice.password !== confirmPassword) {
      message.error("Şifreler Eşleşmiyor");
      return;
    }

    dispatch(setLoading(true));

    try {
      const payload = {
        name: userSlice.userName,
        email: userSlice.email,
        password: userSlice.password
      }

      const result = await addNewUser(payload);

      if (result) {
        message.success("Kayıt işlemi başarılı!").then(() => {
          dispatch(setUsername(""));
          dispatch(setPassword(""));
          dispatch(setEmail(""));
          setConfirmPassword("");
          navigate("/login");
        });
      } else {
        message.error("Kayıt işlemi başarısız.");
      }
    } catch (error) {
      message.error("Kayıt sırasında bir hata oluştu.");
    } finally {
      dispatch(setLoading(false));
    }

  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row>
        <Col>
          <Card style={{ width: "24rem", padding: "20px" }}>
            <Card.Body>
              <Card.Title className="text-center mb-4">
                <img src="/images/logo.png" /> 
              </Card.Title>
              <Form onSubmit={handleRegister}>
                <Form.Group controlId="formUsername" className="mb-3">
                  <Form.Label>Kullanıcı Adı</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Type Username"
                    value={userSlice.userName}
                    onChange={(e) => dispatch(setUsername(e.target.value))}
                  />
                </Form.Group>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email Adresinizi Giriniz"
                    value={userSlice.email}
                    onChange={(e) => dispatch(setEmail(e.target.value))}
                  />
                </Form.Group>
                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>Şifre</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Şifrenizi girin"
                    value={userSlice.password}
                    onChange={(e) => dispatch(setPassword(e.target.value))}
                  />
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mb-3">
                  <Form.Label>Şifreyi Doğrula</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Şifrenizi yeniden girin"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
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
                      Kayıt Yapılıyor...
                    </>
                  ) : (
                    'Kayıt Ol'
                  )}
                </Button>
                <p >Zaten Üye Misin? <span><Link to={"/login"}>Giriş Yap</Link></span></p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
