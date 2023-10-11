import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logo.png';
import '../../App.css'

function Home() {
    const [user, setUser] = useState('');

    axios.defaults.withCredentials = true;

    useEffect(() => {
      axios.get('http://localhost:5000/').then((response) => {
          if(response.data.loggedIn == true) {
              setUser(response.data.user);
              console.log(response);
          }
      });
    }, []);

    return (
          <div className='flex h-full w-full bg-[#000122] overflow-x-hidden'>
            <div className='flex h-full w-1.5/6 bg-blue-500 rounded-lg m-2'>
              <div className='h-2/3 w-full'>
                <img src={logo} alt="Logo" className='h-[10%] w-[90%] m-auto my-5'/>
                <div className='h-[50%]'>
                  <ul className='flex flex-col gap-6 w-full mt-3'>
                    <li><a className='text-gray-200 hover:text-white bg-sky-400 bg-contain p-2 rounded-lg flex-grow' href='/'>Dashboard</a></li>
                    <li><Link className='text-gray-200 hover:text-white w-2'>Materials</Link></li>
                    <li><Link className='text-gray-200 hover:text-white w-2'>Services</Link></li>
                    <li><Link className='text-gray-200 hover:text-white w-2'>Featured</Link></li>
                    <li><Link className='text-gray-200 hover:text-white w-2'>Analytics</Link></li>
                    <li><Link className='text-gray-200 hover:text-white w-2'>Notifications</Link></li>
                  </ul>
                </div>
              </div>
              <div>
            </div>
          </div>
          <div className='h-full w-5/6'>
            {user ?
              <>
                <div className={`flex justify-end align-baseline mt-5 mr-5 max-h-[10%] ${user ? 'hide-on-mobile' : 'show-on-mobile'}`}>
                  <div className={`flex align-end justify-end w-[25%] border-b-2 border-white gap-3`}>                
                        <Link to="/profile" className='w-1/3 m-auto h-full'>
                          <img
                            src={'http://localhost:5000/' + user.profilePicture}
                            alt="Profile Picture"
                            className='h-[90%] w-[70%] rounded-full m-auto'
                          />
                        </Link>
                      <div className='my-auto hidden sm:block flex-grow'>
                          <h1 className='text-2xl text-left' style={{fontFamily: 'Inder'}}>{user.userName}</h1>
                          <h2 className='text-sm text-left' style={{fontFamily: 'Inder'}}>{user.userRole.toLowerCase()}: {user.userEmail}</h2>
                      </div>
                  </div>
                </div>
              </>
              :
              <>
                <div>Hello</div>
                <Link to='/login'>Login</Link>
                <Link to='/signup'>Register</Link>
              </>
            }
          </div>
        </div>
    );
}

export default Home;
