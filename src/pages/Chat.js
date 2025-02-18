import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, ListGroup, Card, CardHeader } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {  clearTransmittedMessage, setAllMessages, setTransmittedMessage } from '../features/message/messageSlice';
import Cookies from "js-cookie";
import { setFriends } from '../features/user/userSlice';
import axios from "axios";
import { dateFormatter } from '../utils/dateFormatter';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { APP_CONFIG } from "../config/config";

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
  const BASE_URL = APP_CONFIG.API_URL;


  const filteredData = userSlice.friends?.filter((item) =>
    item.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );


  useEffect(() => {
    if (connectionSlice.isConnected) {
      axios.get(`${BASE_URL}/User/GetFriends/${loggedUser.email}`)
        .then((res) => {
          console.log(res.data)
          dispatch(setFriends(res.data))
        })
    }
  }, [dispatch])


  useEffect(()=>{

    if(selectedUser && loggedUser) {

      axios.get(`${BASE_URL}/Message/GetDesiredMessages`,{
        params:{
          receiverMail : selectedUser.email,
          senderMail: loggedUser.email
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
      })
      .then((res) => {
        console.log(res.data)

        let newMessages = res.data.filter((existingMessage) => {
          return !messageSlice.allMessages.some((newMessage) => {
              const existingTime = new Date(existingMessage.sendTime)
                  .setMilliseconds(0); 
              const newTime = new Date(newMessage.sendTime)
                  .setMilliseconds(0);
              
              return existingTime === newTime && 
                     existingMessage.content === newMessage.content;
          });
      });
        dispatch(setAllMessages(newMessages))
      })

    }

  },[selectedUser])



  const determineReceiverUser = (par) => {
    dispatch(setTransmittedMessage({ sender: loggedUser.email, receivers: [par] }))
    setSelectedUSer(par)
  }


  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log(messageSlice.transmittedMessage)
    const key = uuidv4();

    const willSendMessage = {
      ...messageSlice.transmittedMessage,
      sendTime: dateFormatter.toISOString(),
      key:key,
      status:true
  };
    hubConnection.invoke("SendMessageAsync", willSendMessage)
    dispatch(clearTransmittedMessage())
  };


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
                {filteredData?.map((item, index) => ( 
                  <ListGroup.Item
                    key={index}
                    className='d-flex align-items-center p-3 border-bottom hover-bg-light'
                    action
                    onClick={() => determineReceiverUser(item)}
                  >
                    <div className='profile-icon me-3'>
                      <div className='rounded-circle  bg-light text-secondary d-flex align-items-center justify-content-center shadow-sm' style={{ width: '40px', height: '40px' }}>
                        {/* <FaUser className='fs-5' /> */}
                        <img
                      src={item.image ? `${BASE_URL}${item.image}` : '/images/emptyuser.png'}
                      alt="Profil Resmi"
                      className="rounded-circle"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
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
                  <div className='rounded-circle bg-light text-secondary d-flex align-items-center justify-content-center shadow-sm' style={{ width: '40px', height: '40px' }}>
                  <img
                      src={selectedUser?.image ? `${BASE_URL}${selectedUser.image}` : '/images/emptyuser.png'}
                      alt="Profil Resmi"
                      className="rounded-circle"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>
                <div className='fs-5 text-dark'>
                  {selectedUser?.userName}
                </div>
              </div>

            </CardHeader>
            <Card.Body className="d-flex flex-column h-75 p-3">

              <ListGroup variant="flush" className="flex-grow-1 overflow-auto mb-3">
                {selectedUser ? (
                  messageSlice.allMessages
                    .filter(
                      (item) =>
                        selectedUser.email === item.sender ||
                        selectedUser.email === item.receivers[0].email
                    )
                    .sort((a, b) => {
                      return parseISO(a.sendTime).getTime() - parseISO(b.sendTime).getTime();
                    })
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
                        <small className="text-muted align-self-end">{dateFormatter.toTimeDay(item.sendTime)}</small>
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
                  value={messageSlice.transmittedMessage.content}
                  placeholder="Mesajınızı yazın..."
                  style={{
                    resize: "none",
                  }}
                  onChange={(e) => dispatch(setTransmittedMessage({ content: e.target.value }))}
                />
                {
                  connectionSlice.isConnected && messageSlice.transmittedMessage.content ? 
                  <Button

                  variant="primary"
                  type="submit"
                >
                  Gönder
                </Button>
                :
                <Button
                disabled
                variant="primary"
                type="submit"
              >
                Gönder
              </Button>
                }

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
