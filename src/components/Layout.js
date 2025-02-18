import React from 'react';
import { SiGooglemessages } from "react-icons/si";
import { MdOutlineWifiTethering, MdOutlineWorkspaces, MdLogout } from "react-icons/md";
import { FaGear } from "react-icons/fa6";
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import Cookies from 'js-cookie';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <SiGooglemessages />,
      path: '/chat',
      title: 'Sohbetler'
    },
    {
      icon: <MdOutlineWifiTethering />,
      path: '/userSettings',
      title: 'Bağlantılar'
    },
    // {
    //   icon: <MdOutlineWorkspaces />,
    //   path: '/workspace',
    //   title: 'Çalışma Alanı'
    // }
  ];

  const handleLogout = () => {
    // Cookie'leri temizle
    Cookies.remove('user');
    Cookies.remove('token');
    // Login sayfasına yönlendir
    navigate('/login');
  };

  return (
    <div className="d-flex vh-100">
      {/* Sol Menü */}
      <Nav className="flex-column justify-content-between bg-light py-3 sidebar">
        <div>
          {menuItems.map((item, index) => (
            <Nav.Item key={index}>
              <Nav.Link 
                as={Link} 
                to={item.path}
                className={`nav-link py-3 ${location.pathname === item.path ? 'active' : ''}`}
                title={item.title}
              >
                <span className="fs-4 d-block text-center">
                  {item.icon}
                </span>
              </Nav.Link>
            </Nav.Item>
          ))}
        </div>
        
       <div>
        <Nav.Item>
        <Nav.Link 
            as={Link} 
            to="/settings"
            className={`nav-link py-3 ${location.pathname === '/settings' ? 'active' : ''}`}
            title="Ayarlar"
          >
            <span className="fs-4 d-block text-center">
              <FaGear />
            </span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>

          <Nav.Link 
            onClick={handleLogout}
            className="nav-link py-3"
            title="Çıkış"
            role="button"
          >
            <span className="fs-4 d-block text-center">
              <MdLogout />
            </span>
          </Nav.Link>
        </Nav.Item>
       </div>
      </Nav>

      {/* Ana İçerik */}
      <div className="flex-grow-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
