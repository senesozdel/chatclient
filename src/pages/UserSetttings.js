import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from "js-cookie";
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import { addNewRelation, createNewRelationRequests, deleteFriendRequests, getFriendRequests } from '../dataRequests/userRequest';
import { addFriendRequestsToArray, addreceivedFriendRequestsToArray, removeFriendRequestFromArray, setFriendRequests } from '../features/user/userSlice';
const UserSettings = ({hubConnection}) => {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [selectedSection, setSelectedSection] = useState('addFriend');

  const userCookie = Cookies.get('user');
  const loggedUser = userCookie ? JSON.parse(userCookie) : null;
  const dispatch = useDispatch();
  const userSlice = useSelector((state)=>state.user);

  const handleFriendSubmit = async(e) => {
    e.preventDefault();

    const payload = {
      mainUserMail:loggedUser.email,
      relatedUserMail:email
    }
      const result = await createNewRelationRequests(payload);
          
      if (result) {
        
        message.success("Başarılı Bir Şekilde İstek Gönderildi")
      } else {
        message.error("İstek Gönderilemedi");
      }

  }



  const approveRequest = async(request)=>{


    const payload = {
        mainUserMail:request.email,
        relatedUserMail:loggedUser.email
    }

      console.log(payload)

      const result = await addNewRelation(payload);
      await deleteFriendRequests(payload);
          
      if (result) {
        
        message.success("Başarılı Bir Şekilde Arkadaşınzı Eklendi")
        dispatch(removeFriendRequestFromArray(request.email))
      } else {
        message.error("Arkadaş EKleme Hatalı.");
      }


  }

  
  const denyRequest = async(request)=>{
    message.info("Arkadaş Ekleme İşlemi Reddedildi")

    const payload = {
      mainUserMail:loggedUser.email,
      relatedUserMail:request.email
    }
   
    const result = await deleteFriendRequests(payload);
          
    if (result) {
      
      message.success("İstek İptal Edildi")
      dispatch(removeFriendRequestFromArray(request.email))
    } else {
      message.error("İstek İptal Edilirken Hata Oluştu");
    }
    
  }

  const getRequests = async(loggedUser)=>{
    const result = await getFriendRequests(loggedUser.email);
    dispatch(setFriendRequests(result.data))

  }

  useEffect(()=>{
      getRequests(loggedUser);

  },[dispatch])


  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-3">
          <div className="list-group">
            <button
              className={`list-group-item list-group-item-action ${selectedSection === 'addFriend' ? 'active' : ''}`}
              onClick={() => setSelectedSection('addFriend')}
            >
              Arkadaş Ekle
            </button>

            <button
              className={`list-group-item list-group-item-action ${selectedSection === 'requests' ? 'active' : ''}`}
              onClick={() => setSelectedSection('requests')}
            >
             Bekleyen İstekler
            </button>
          </div>
        </div>

        <div className="col-md-9">
        {selectedSection === 'addFriend' && (
  <div className="card border-0 shadow-sm">
    <div className="card-body p-4">
      <div className="text-center mb-4">
        <div className="mb-3">
          <i className="fas fa-user-plus" style={{
            fontSize: '2.5rem',
            color: '#0d6efd',
            opacity: '0.8'
          }}></i>
        </div>
        <h5 className="card-title mb-1">Arkadaş Ekle</h5>
        <p className="text-muted small">
          Arkadaşınızın e-posta adresini girerek arkadaşlık isteği gönderebilirsiniz
        </p>
      </div>

      <form onSubmit={handleFriendSubmit} className="add-friend-form">
        <div className="mb-4">
          <div className="form-floating">
            <input
              type="email"
              id="email"
              className="form-control border-0 bg-light"
              placeholder="E-posta adresini girin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email" className="text-muted">
              <i className="far fa-envelope me-2"></i>
              E-posta Adresi
            </label>
          </div>
        </div>

        <div className="d-grid">
          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
          >
            <i className="fas fa-paper-plane me-2"></i>
            İstek Gönder
          </button>
        </div>
      </form>

     
    </div>
  </div>
)}



{selectedSection === 'requests' && (
  <div className="card">
    <div className="card-body">
      <h5 className="card-title mb-4">Arkadaşlık İstekleri</h5>

      {userSlice.friendRequests.length > 0 ? (
        <div className='d-flex flex-column gap-3'>
          {userSlice.friendRequests.map((item, index) => (
            <div 
              className='d-flex justify-content-between align-items-center p-3 border rounded shadow-sm hover-bg-light' 
              key={index}
            >
              <div className='d-flex align-items-center'>
                <div className='me-3'>
                  <div className='rounded-circle bg-light p-2'>
                    <i className="fas fa-user text-secondary"></i>
                  </div>
                </div>
                <div>
                  <strong>{item.userName}</strong>
                  <div className='text-muted small'>Arkadaşlık isteği gönderdi</div>
                </div>
              </div>
              <div className='d-flex gap-2'>
                <button 
                  className='btn btn-success btn-sm px-3'
                  onClick={() => approveRequest(item)}
                >
                  Onayla
                </button>
                <button className='btn btn-light btn-sm px-3' onClick={() => denyRequest(item)}>
                  Reddet
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="empty-state mb-4">
            <div className="empty-state-icon mb-3">
              <i className="fas fa-user-friends" style={{ 
                fontSize: '3rem',
                color: '#6c757d',
                opacity: '0.5'
              }}></i>
            </div>
            <h6 className="text-muted fw-normal">Bekleyen İstek Bulunmuyor</h6>
            <p className="text-muted small mb-0">
              Yeni arkadaşlık istekleri aldığınızda burada görünecektir.
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default UserSettings;
