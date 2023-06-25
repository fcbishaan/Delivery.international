import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { GlobalContext } from './components/globalContext';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [birth, setBirth] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = localStorage.getItem('token');
  const { isLogin } = useContext(GlobalContext);
  useEffect(() => {
    getUserData();
  }, [isLogin]); // eslint-disable-line react-hooks/exhaustive-deps

  function getUserData() {
    if (token) {
      axios
        .get('https://food-delivery.kreosoft.ru/api/account/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data) {
            setName(response.data.fullName);
            setAddress(response.data.address);
            setBirth(response.data.birthDate.substr(0, 10));
            setGender(response.data.gender);
            setPhone(response.data.phoneNumber);
            setEmail(response.data.email);
            setUserData(response.data);
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          // Handle the error here
          if (error.response) {
            if (error.response.status === 401) {
              localStorage.removeItem('token');
              window.location.href = window.location.origin + '/login';
            }
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log('Error', error.message);
          }
        });
    } else {
      window.location.href = window.location.origin + '/login';
    }
  }

  const handleSaveChanges = (event) => {
    event.preventDefault();
    if (token) {
      axios
        .put(
          'https://food-delivery.kreosoft.ru/api/account/profile',
          {
            fullName: name,
            birthDate: birth,
            gender: gender,
            address: address,
            phoneNumber: phone,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          // Handle the API response data here
          if (response.status === 200) {
            setSuccess('Profile Changed');
            setErr(null);
            getUserData();
          } else {
            setErr(
              'An error occurred while saving changes. Please try again later.'
            );
            setSuccess(null);
          }
        })
        .catch((error) => {
          setErr(
            'An error occurred while saving changes. Please try again later.'
          );
          if (error.response.status === 401) {
            window.location.href = window.location.origin + '/login';
          }
          setSuccess(null);
          // Handle any errors that occur during the API call here
        });
    } else {
      setErr('User is not loged in');
      window.location.href = window.location.origin + '/login';
    }
  };
  const phoneMask = (event) => {
    let phone = event.target.value;
    const formattedPhone = phone
      .replace(/\D/g, '')
      .replace(/^7/, '')
      .replace(
        /(\d{3})(\d{1,3})?(\d{1,2})?(\d{1,2})?/,
        function (match, p1, p2, p3, p4) {
          if (p2 === undefined) {
            return '+7(' + p1 + ')';
          } else {
            return (
              '+7(' +
              p1 +
              ')' +
              ' ' +
              p2 +
              (p3 ? '-' + p3 : '') +
              (p4 ? '-' + p4 : '')
            );
          }
        }
      );
    let value = formattedPhone;
    if (value.length > 17) {
      value = value.substring(0, 17);
    }
    setPhone(value);
  };
  return (
    <div>
      {userData && (
        <div
          className="container w-100"
          style={{
            maxWidth: '80%',
            padding: 10,
            boxShadow: '0px 4px 14px 9px rgba(0, 0, 0, 0.07)',
            WebkitBoxShadow: '0px 4px 14px 9px rgba(0, 0, 0, 0.07)',
            MozBoxShadow: '0px 4px 14px 9px rgba(0, 0, 0, 0.07)',
          }}
        >
          <div className="row justify-content-center">
            <div className="col ">
              <form id="profile-form">
                <div className="mb-3">
                  <h1>Profile</h1>
                </div>

                <div className="form-group row mb-2">
                  <label htmlFor="name" className="col-sm-2 col-form-label">
                    Name
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder={userData.fullName}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onClick={(e) => (e.target.value = '')}
                    />
                  </div>
                </div>
                <div className="form-group row mb-2">
                  <label htmlFor="email" className="col-sm-2 col-form-label">
                    Email
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext"
                      id="email"
                      placeholder={email}
                    />
                  </div>
                </div>
                <div className="form-group row mb-2">
                  <label htmlFor="date" className="col-sm-2 col-form-label">
                    Date of Birth
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      id="date"
                      placeholder={birth}
                      value={birth}
                      onChange={(e) => setBirth(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group row mb-2">
                  <label htmlFor="gender" className="col-sm-2 col-form-label">
                    Gender
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext"
                      id="gender"
                      placeholder={gender}
                    />
                  </div>
                </div>
                <div className="form-group row mb-2">
                  <label htmlFor="address" className="col-sm-2 col-form-label">
                    Home Address
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      placeholder={userData.address}
                      value={address}
                      onClick={(e) => (e.target.value = '')}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group row mb-2">
                  <label htmlFor="phone" className="col-sm-2 col-form-label">
                    Phone Number
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      value={phone}
                      placeholder={userData.phoneNumber}
                      onChange={(e) => phoneMask(e)}
                      onClick={(e) => (e.target.value = '')}
                    />
                  </div>
                </div>
                <button
                  type="click"
                  className="btn btn-primary ml-auto"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>

                {err && (
                  <div
                    className="alert alert-danger mt-2"
                    role="alert"
                    id="error_alert"
                  >
                    {err}
                  </div>
                )}
                {success && (
                  <div
                    className="alert alert-success mt-2"
                    role="alert"
                    id="success_box"
                  >
                    {success}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
