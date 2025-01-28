// components/Sidebar.js
import React, { useState } from 'react';
import { Button, ListGroup, Collapse, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addTransmittedMessageReceiver } from '../features/message/messageSlice';

const Sidebar = () => {

  const [activeSection, setActiveSection] = useState(null);

  // Kullanıcılar ve Gruplar verisi
  const groups = ['Grup 1', 'Grup 2', 'Proje Ekibi', 'Yazılım Grubu'];
  const userSlice = useSelector((state)=>state.user)
  const dispatch = useDispatch();

  // Kullanıcılar veya Gruplar bölümünü aç/kapa
  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  console.log(userSlice.friends)
  return (
    <div
      style={{

        transition: 'width 0.3s',
        backgroundColor: '#343a40',
        color: 'white',
        padding: '10px',
      }}
    >
         <div>
              <Button
                variant="link"
                className="text-light"
                onClick={() => toggleSection('users')}
                style={{ textDecoration: 'none' }}
              >
                Kullanıcılar
              </Button>
              <Collapse in={activeSection === 'users'}>
                <div>
                  {
                    userSlice.friends.length>0 && 
                    <ListGroup variant="flush" className="mb-3">
                    {userSlice.friends.map((user, index) => (
                      <ListGroup.Item
                        key={index}
                        className='btn'
                        style={{ backgroundColor: '#495057', color: 'white' }}
                        onClick={()=> dispatch(addTransmittedMessageReceiver(user))}
                      >
                        {user.userName}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  }

                </div>
              </Collapse>
            </div>

            <div>
              <Button
                variant="link"
                className="text-light"
                onClick={() => toggleSection('groups')}
                style={{ textDecoration: 'none' }}
              >
                Gruplar
              </Button>
              <Collapse in={activeSection === 'groups'}>
                <div>
                  <ListGroup variant="flush">
                    {groups.map((group, index) => (
                      <ListGroup.Item
                        key={index}
                        style={{ backgroundColor: '#495057', color: 'white' }}
                      >
                        {group}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              </Collapse>
            </div>

    </div>
  );
};

export default Sidebar;
