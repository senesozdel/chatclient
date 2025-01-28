import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, ListGroup, Card, CardHeader } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { addTransmittedMessageReceiver, setTransmittedMessage } from '../features/message/messageSlice';
import { getFriends } from '../dataRequests/userRequest';
import Cookies from "js-cookie";
import { message } from 'antd';
import { setFriends } from '../features/user/userSlice';
import axios from "axios";
import { FaUser, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Chat = ({ hubConnection }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const userSlice = useSelector((state) => state.user)

  const [selectedUser, setSelectedUSer] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const userCookie = Cookies.get('user');
  const loggedUser = userCookie ? JSON.parse(userCookie) : null;
  const dispatch = useDispatch();
  const messageSlice = useSelector((state) => state.message)
  const connectionSlice = useSelector((state) => state.connection)

  const filteredData = userSlice.friends.filter((item) =>
    item.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (connectionSlice.isConnected) {

      axios.get(`https://localhost:7288/api/User/friends/${loggedUser.email}`)
        .then((res) => {
          console.log(res.data)
          dispatch(setFriends(res.data))
        })
    }
  }, [dispatch])


  const determineReceiverUser = (par) => {
    dispatch(setTransmittedMessage({ sender: loggedUser.email, receivers: [par] }))

    setSelectedUSer(par)

  }


  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log(messageSlice.transmittedMessage)

    hubConnection.invoke("SendMessageAsync", messageSlice.transmittedMessage)
  };
  console.log(messageSlice.allMessages)

  return (
    <Container fluid className="h-100 p-0">
      <Row className="h-100 g-0">
        {/* Conversations Bölümü */}
        {!isCollapsed && (
          <Col md={3} className="h-100 border-end" style={{ overflowY: 'hidden' }}>
            <div className='p-3 d-flex flex-column h-100'>
              <div className='top-bar mb-4'>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className='title fw-bold mb-0'>Sohbetler</h4>
                  <Button
                    variant="light"
                    size="sm"
                    className="border-0"
                    onClick={() => setIsCollapsed(true)}
                  >
                    <FaChevronLeft />
                  </Button>
                </div>
                <Form.Group className='mb-3'>
                  <Form.Control
                    size="lg"
                    placeholder='Ara...'
                    className='shadow-sm'
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Form.Group>
              </div>

              <ListGroup className='friendsList flex-grow-1' style={{ overflowY: 'auto' }}>
                {filteredData.map((item, index) => (
                  <ListGroup.Item
                    key={index}
                    className='d-flex align-items-center p-3 border-bottom hover-bg-light'
                    action
                    onClick={() => determineReceiverUser(item)}
                  >
                    <div className='profile-icon me-3'>
                      <div className='rounded-circle p-2 bg-light text-secondary d-flex align-items-center justify-content-center shadow-sm' style={{ width: '40px', height: '40px' }}>
                        <FaUser className='fs-5' />
                      </div>
                    </div>
                    <div className='fs-5 text-dark'>
                      {item.userName}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>
        )}

        {/* Daraltılmış durumda gösterilecek genişletme butonu */}
        {isCollapsed && (
          <div
            className="position-fixed"
            style={{
              left: '90px',
              top: '10px',
              zIndex: 1000
            }}
          >
            <Button
              variant="light"
              size="sm"
              className="border-0"
              onClick={() => setIsCollapsed(false)}
            >
              <FaChevronRight />
            </Button>
          </div>
        )}

        {/* Chat Bölümü */}
        <Col md={isCollapsed ? 12 : 9} className="h-100 p-0">
          <Card className='h-100 border-0'>
            <CardHeader>
              <div
                className='d-flex align-items-center p-3  hover-bg-light'
              >
                <div className='profile-icon me-3'>
                  <div className='rounded-circle p-2 bg-light text-secondary d-flex align-items-center justify-content-center shadow-sm' style={{ width: '40px', height: '40px' }}>
                    <FaUser className='fs-5' />
                  </div>
                </div>
                <div className='fs-5 text-dark'>
                  {selectedUser?.userName}
                </div>
              </div>

            </CardHeader>
            <Card.Body className="d-flex flex-column h-100 p-3">

              <ListGroup variant="flush" className="flex-grow-1 overflow-auto mb-3">
                {selectedUser ? (
                  messageSlice.allMessages
                    .filter(
                      (item) =>
                        selectedUser.email === item.sender ||
                        selectedUser.email === item.receivers[0].email
                    )
                    .map((item, index) => (
                      <ListGroup.Item
                        key={index}
                        className={`border-0 d-flex ${item.sender === loggedUser.email
                            ? "justify-content-end"
                            : "justify-content-start"
                          } gap-2`}
                      >
                        <div
                          className={`${item.sender === loggedUser.email ? "text-end" : "text-start"
                            }`}
                          style={{
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                            maxWidth: "80%",
                          }}
                        >
                          {item.content}
                        </div>
                        <small className="text-muted align-self-end">{item.sendTime}</small>
                      </ListGroup.Item>
                    ))
                ) : (
                  <ListGroup.Item className="text-center text-muted">
                    Kullanıcı seçilmedi.
                  </ListGroup.Item>
                )}
              </ListGroup>


              <Form onSubmit={handleSendMessage} className="d-flex gap-2 mt-auto">
                <Form.Control
                  as="textarea"
                  rows={1}
                  placeholder="Mesajınızı yazın..."
                  style={{
                    resize: "none",
                  }}
                  onChange={(e) => dispatch(setTransmittedMessage({ content: e.target.value }))}
                />
                <Button

                  variant="primary"
                  type="submit"
                >
                  Gönder
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
