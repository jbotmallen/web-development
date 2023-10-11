import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { BiSolidUser } from 'react-icons/bi';
import { AiTwotoneEdit } from 'react-icons/ai';
import { FaFileInvoiceDollar } from 'react-icons/fa6';
import { BsFillDoorOpenFill } from 'react-icons/bs';

function Navbar(props) {
    const [profPic, setProfPic] = useState('');

    const handleLogout = (e) => {
        e.preventDefault();

        axios.post('http://localhost:5000/logout')
            .then((response) => {
                if (response.status === 200) {
                    props.nav('/');
                } else {
                    console.error('Logout error:', response);
                }
            })
            .catch((error) => {
                console.error('Logout error:', error);
            });
    };

    return (
        <>
            <div className='w-1/3 flex flex-col items-center justify-center m-auto mb-[300px]'>
                <div className='flex justify-end items-end w-2/3'>
                    <img
                        src={(props.profilePicture == null) ? `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${props.user.userName}` : `http://localhost:5000/${props.profilePicture}`}
                        alt="Profile Picture"
                        className='h-20 w-20 lg:h-40 lg:w-40 rounded-full m-auto lg:mr-3'
                    />
                </div>
                <nav className='h-2/3 w-full flex flex-col m-auto justify-center items-center lg:items-end gap-5'>
                    <ul className='flex flex-col bg-white align-top rounded-lg mt-7 w-2/3'>
                        <li className={`p-5 border-b-blue-500 border-b-2 ${props.name === 'profile' ? 'bg-blue-500 rounded-lg' : ''}`}>
                            <Link to='/profile' className='flex items-center justify-center'>
                                <BiSolidUser className={`w-6 h-6 text-blue-500 lg:mr-2 ${props.name === 'profile' ? 'text-white' : ''}`} />
                                <h1 className={`text-base text-blue-500 hidden lg:block ${props.name === 'profile' ? 'text-white' : ''}`}>Profile Information</h1>
                            </Link>
                        </li>
                        <li className={`p-5 border-b-blue-500 border-b-2 ${props.name === 'edit' ? 'bg-blue-500' : ''} `}>
                            <Link to='/edit' className='flex items-center justify-center'>
                                <AiTwotoneEdit className={`w-6 h-6 text-blue-500 lg:mr-2 ${props.name === 'edit' ? 'text-white' : ''}`} />
                                <h1 className={`text-base text-blue-500 hidden lg:block ${props.name === 'edit' ? 'text-white' : ''}`}>Edit Profile</h1>
                            </Link>
                        </li>   
                        <li className={`p-5 ${props.name === 'orders' ? 'bg-blue-300' : ''} `}>
                            <Link to='/profile' className='flex items-center justify-center'>
                                <FaFileInvoiceDollar className='w-6 h-6 text-blue-500 lg:mr-2' />
                                <h1 className='text-base text-blue-500 hidden lg:block'>View Orders</h1>
                            </Link>
                        </li>
                    </ul>
                    <button onClick={handleLogout} 
                        className='flex justify-center items-center gap-2 transition ease-in-out delay-150 bg-red-500 hover:-translate-y-1 hover:scale-100 hover:bg-red-800 duration-300 w-2/3'>
                        <BsFillDoorOpenFill />
                        Logout
                    </button>
                </nav>
            </div>
        </>
    );
}

export default Navbar;
