import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../UI/Navbar';
import { BsBoxArrowLeft } from 'react-icons/bs';
import { FaCircleUser } from 'react-icons/fa6';
import { BsFillShieldLockFill } from 'react-icons/bs';
import { AiFillUnlock, AiFillLock } from 'react-icons/ai'

function Edit() {
  const nav = useNavigate();
  const [user, setUser] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [values, setValues] = useState({
    email: '',
    newUsername: '',
    currPassword: '',
    newPassword: '',
    confirmPassword: '',
    newProfilePicture: '',
  });
  const [error, setError] = useState('');
  const [currPassError, setCurrPassError] = useState('');
  const [success, setSuccess] = useState('');

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:5000/profile')
      .then((response) => {
        if (response.data.loggedIn === true) {
          setUser(response.data.user);
          console.log(response.data.user.userEmail);
          setValues((prevValues) => ({
            ...prevValues,
            email: response.data.user.userEmail,
            newUsername: response.data.user.userName,
            newProfilePicture: response.data.user.profilePicture,
          }));
          setLoginStatus(response.data.loggedIn);
        } else {
          nav('/login');
        }
      })
      .catch((error) => {
        nav('/login');
      });
  }, [nav]);
  
  function clearError() {
    setError('');
    setCurrPassError('');
  };

  function checkNewPassword(confirmPassword, newPassword) {
    return (confirmPassword === newPassword);
  }

  const handleEditSubmit = (e) => {
    e.preventDefault();

    if(!checkNewPassword(values.confirmPassword, values.newPassword)) {
      return setError('Passwords do not match! Please input same values.');
    }

    axios
      .put('http://localhost:5000/reset', values)
      .then((response) => {
        const form = document.getElementById('editForm');
        form.style.display = "none";
        setSuccess(response.data.Message);
        setTimeout(() =>{
          window.location.href = '/profile'
        }, 3000);
      })
      .catch((error) => {
        if(error.response) {
          if(error.response.data.passMessage) {
            setCurrPassError(error.response.data.passMessage);
          } else {
            setError(error.response.data.Message);
          }
        }
      });
  };

  return (
    <>
      <div className='flex w-full m-auto h-full bg-gray-700'>
        <Navbar 
          profilePicture={user.profilePicture} 
          nav={nav} user={user} 
          loginStatus={loginStatus}
          name={'edit'}
        />
        <div className='w-2/3 m-auto flex flex-col justify-center items-center gap-10'>
          <h1>Edit Profile Information</h1>
          <div className='m-auto w-full'>
            <form method="post" onSubmit={handleEditSubmit} id='editForm' className='m-auto flex flex-col gap-5 w-2/3 items-center justify-start'>
              <div className='w-full flex gap-2 items-baseline justify-center'>
                <div className='w-1/2 flex flex-col justify-start'>
                  <h1 className='text-left text-3xl mb-3 flex items-center gap-3'><FaCircleUser /> Username</h1>
                  <input
                    type="text"
                    className={`bg-gray-900 p-5 w-[95%] rounded-md  ${
                      values.newUsername ? 'text-white' : ''
                    }`}
                    value={values.newUsername}
                    onChange={(e) => setValues({ ...values, newUsername: e.target.value })}
                    name="newUsername"
                    placeholder="Enter new username..."
                  />
                </div>
              <div className='w-1/2'>
                <h1 className='text-left text-3xl mb-3 flex items-center gap-3'><BsFillShieldLockFill /> Current Password</h1>
                <input
                  type='password'
                  className={`bg-gray-900 p-5 w-full rounded-md  ${
                    values.currPassword ? 'text-white' : ''
                  }`}
                  value={values.currPassword}
                  onChange={(e) => {
                    setValues({ ...values, currPassword: e.target.value })
                    clearError()
                  }}
                  name='currPassword'
                  placeholder='Enter current password...'
                />
                <h3 className='text-sm text-red-500'>{currPassError && <div className="text-red-600 text-sm">{currPassError}</div>}</h3>
              </div>
            </div>
            <div className='w-full flex gap-2 items-baseline justify-center'>
              <div className='w-1/2 flex flex-col justify-start'>
                <h1 className='text-left text-3xl mb-3 flex items-center gap-3'><AiFillUnlock /> New Password</h1>
                <input
                  type='password'
                  className={`bg-gray-900 p-5 w-[95%] rounded-md  ${
                    values.newPassword ? 'text-white' : ''
                  }`}
                  value={values.newPassword}
                  onChange={(e) => setValues({ ...values, newPassword: e.target.value })}
                  name='newPassword'
                  placeholder='Enter new password...'
                />
              </div>
              <div className='w-1/2'>
                <h1 className='text-left text-3xl mb-3 flex items-center gap-3'><AiFillLock /> Confirm Password</h1>
                <input
                  type='password'
                  className={`bg-gray-900 p-5 w-full rounded-md  ${
                    values.confirmPassword ? 'text-white' : ''
                  }`}
                  value={values.confirmPassword}
                  onChange={(e) => {
                    setValues({ ...values, confirmPassword: e.target.value })
                    clearError()
                  }}
                  name='confirmPassword'
                  placeholder='Enter confirm password...'
                />
                <h3 className='text-sm text-red-500'>{error && <div className="text-red-600 text-sm">{error}</div>}</h3>
              </div>
            </div>
              <div className='w-full flex justify-around'>
                <button type='submit' className='transition w-1/4 ease-in-out delay-150 bg-blue-400 hover:-translate-y-1 hover:scale-100 hover:bg-blue-600 hover:text-white duration-300 p-5 rounded-lg text-gray-900'>Submit</button>
                <div className='flex justify-end w-2/3'>
                <Link
                  to='/'
                  className='flex gap-2 items-center justify-end transition ease-in-out delay-150 bg-green-400 hover:-translate-y-1 hover:scale-100 hover:bg-green-600 hover:text-white duration-300 p-5 rounded-lg text-gray-900'
                >
                  <BsBoxArrowLeft />Back to Dashboard
                </Link>
              </div>
              </div>
            </form>
            <h1 className='m-auto text-3xl'>{success && <div className='text-3xl' id='success'>{success}</div>}</h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default Edit;
