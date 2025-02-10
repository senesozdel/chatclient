import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaPencilAlt } from "react-icons/fa";
import axios from 'axios';
import Cookies from "js-cookie";
import { message } from 'antd';

const Settings = () => {
  const userCookie = Cookies.get('user');
  const loggedUser = userCookie ? JSON.parse(userCookie) : null;
  const backendAddress = "https://localhost:7288";

  const [user, setUser] = useState({
    username: loggedUser?.username || '',
    email: loggedUser?.email || '',
    profileImage: loggedUser?.image ? `${backendAddress}${loggedUser.image}` : '/images/emptyuser.png',
    previewImage: loggedUser?.image ? `${backendAddress}${loggedUser.image}` : '/images/emptyuser.png',
    selectedFile: null
  });

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (user.previewImage && user.previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(user.previewImage);
      }
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Mevcut blob URL'i temizle
      if (user.previewImage && user.previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(user.previewImage);
      }

      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        message.error('Dosya boyutu 5MB\'dan küçük olmalıdır!');
        return;
      }

      // Dosya tipi kontrolü
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        message.error('Sadece JPG, PNG ve GIF formatları kabul edilir!');
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      
      setUser(prevState => ({
        ...prevState,
        selectedFile: file,
        previewImage: imageUrl
      }));
    } catch (error) {
      console.error('Resim seçme hatası:', error);
      message.error('Resim seçilirken bir hata oluştu!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user.selectedFile) {
      message.warning('Lütfen bir resim seçin!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', user.selectedFile); // 'file' yerine 'image' kullanıyoruz

      const response = await axios.post(
        `${backendAddress}/api/User/upload-image/${user.email}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          }
        }
      );

      if (response.data) {
        message.success('Profil resmi başarıyla güncellendi!');
        
        const updatedUser = { ...loggedUser, image: response.data.imagePath };
        Cookies.set('user', JSON.stringify(updatedUser));

        setUser(prevState => ({
          ...prevState,
          profileImage: `${backendAddress}${response.data.imagePath}`,
          previewImage: `${backendAddress}${response.data.imagePath}`,
          selectedFile: null
        }));

        if (user.previewImage && user.previewImage.startsWith('blob:')) {
          URL.revokeObjectURL(user.previewImage);
        }
      }
    } catch (error) {
      console.error('Resim yükleme hatası:', error);
      message.error('Resim yüklenirken bir hata oluştu!');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* Profil Resmi Bölümü */}
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block">
                    <img
                      src={user.previewImage || user.profileImage || '/images/emptyuser.png'}
                      alt="Profil Resmi"
                      className="rounded-circle"
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute bottom-0 end-0">
                      <Form.Label htmlFor="profileImage" className="btn btn-sm btn-primary rounded-circle">
                        <FaPencilAlt />
                        <Form.Control
                          type="file"
                          id="profileImage"
                          className="d-none"
                          accept="image/jpeg,image/png,image/gif"
                          onChange={handleImageChange}
                        />
                      </Form.Label>
                    </div>
                  </div>
                </div>

                {/* Kullanıcı Adı */}
                <Form.Group className="mb-3">
                  <Form.Label>Kullanıcı Adım</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={user.username}
                    disabled
                  />
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label>E-posta Adresim</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={user.email}
                    disabled
                  />
                </Form.Group>

                {/* Kaydet Butonu */}
                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={!user.selectedFile}
                  >
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
