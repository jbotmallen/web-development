import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const nav = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('');
    const [errors, setErrors] = useState({
        error: '',
        emailError: '',
        passwordError: ''
    });

    const clearErrors = () => {
        setErrors({
            error: '',
            emailError: '',
            passwordError: ''
        });
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setErrors({ ...errors, emailError: '' });
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setErrors({ ...errors, passwordError: '' });
    };

    const validateEmail = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:5000/login').then((response) => {
            console.log(response.data.Message);
            if(response.data.loggedIn == true) {
                setLoginStatus(response.data.user.userName)
                nav('/');
            }
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();

        const validationErrors = {};
        if (!validateEmail(email)) {
            return setErrors({ ...errors, emailError: 'Invalid email format' });
        }

        if (Object.keys(validationErrors).length === 0) {
            axios.post('http://localhost:5000/login', { email, password })
                .then(res => {
                    console.log(res);
                    nav('/');
                })
                .catch(err => {
                    console.log(err);
                    if (err.response.data.Message) {
                        console.log(err.response.data.Message);
                        setErrors({ ...errors, error: err.response.data.Message });
                    } else if (err.response.data.errorEmailMessage) {
                        console.log(err.response.data.errorEmailMessage);
                        setErrors({ ...errors, emailError: err.response.data.errorEmailMessage });
                    } else if (err.response.data.errorPasswordMessage) {
                        console.log(err.response.data.errorPasswordMessage);
                        setErrors({ ...errors, passwordError: err.response.data.errorPasswordMessage });
                    }
                });
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className='bg-[url("https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2103&q=80")] bg-cover bg-no-repeat h-full w-full flex align-items-center'>
            <div className='bg-gray-500 bg-cover'></div>
            <div className='m-auto bg-white w-full md:w-2/3 lg:w-1/2 h-2/3 rounded-md flex'>
                <div className='m-auto bg-white w-full md:w-1/2 rounded-md flex gap-5 flex-col'>
                    <h1 className='text-gray-500 font-mono'>Login</h1>

                    <form action="" method="post" className='flex gap-5 flex-col'>

                        <div className='flex flex-col align-items-center justify-center gap-x-4'>
                            <label htmlFor="email" className='text-gray-500'>Email</label>
                            <input
                                type="email"
                                placeholder='Enter your email...'
                                name='email'
                                required
                                className={`p-2 rounded-md w-2/3 bg-gray-300 m-auto ${
                                    email ? 'text-black' : ''
                                }`}
                                value={email}
                                onChange={handleEmailChange}
                            />
                            {errors.emailError && (
                                <div className='text-red-600 text-center text-sm'>
                                    {errors.emailError}
                                </div>
                            )}
                        </div>
                        <div className='flex flex-col align-items-center justify-center gap-x-4'>
                            <label htmlFor="password" className='text-gray-500'>Password</label>
                            <input
                                type="password"
                                placeholder='Enter your password...'
                                name='password'
                                required
                                className={`p-2 rounded-md w-2/3 bg-gray-300 m-auto ${
                                    password ? 'text-black' : ''
                                }`}
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            {errors.passwordError && (
                                <div className='text-red-600 text-center text-sm'>
                                    {errors.passwordError}
                                </div>
                            )}
                        </div>
                        <button className='target:shadow-lg text-black hover:text-white w-1/2 mx-auto p-3 bg-blue-400 hover:bg-blue-800 hover:border-transparent transition duration-500 ease-in-out' onClick={handleSubmit}>
                            Sign In
                        </button>
                        <h3 className='text-gray-500 text-sm'>
                            Don't have an account yet? <Link to='/signUp'>Register</Link>
                        </h3>
                    </form>
                </div>
                <div className='hidden lg:block m-auto bg-white w-full md:w-1/2 h-full rounded-md bg-[url("https://plus.unsplash.com/premium_photo-1682145873665-e196ffa72b97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")] bg-fixed bg-cover'></div>
            </div>
        </div>
    );
}

export default Login;
