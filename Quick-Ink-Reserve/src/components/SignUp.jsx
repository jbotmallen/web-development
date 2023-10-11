import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import '../index.css'

function SignUp() {
  const nav = useNavigate();

  const [values, setValues] = useState({
    userName: '',
    email: '',
    password: '',
    profilePicture: null
  });
  const [errors, setErrors] = useState({
    error: '',
    emailError: '',
    passwordError: ''
  });
  const [loginStatus, setLoginStatus] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    let passwordError = '';
  
    if (!/(?=.*[a-z])/.test(password)) {
      passwordError = 'Password must contain at least one lowercase letter. ';
      return passwordError.trim();
    }
  
    if (!/(?=.*[A-Z])/.test(password)) {
      passwordError = 'Password must contain at least one uppercase letter. ';
      return passwordError.trim();
    }
  
    if (!/(?=.*\W)/.test(password)) {
      passwordError = 'Password must contain at least one special character. ';
      return passwordError.trim();
    }
  
    if (password.length < 8) {
      passwordError = 'Password must be at least 8 characters long. ';
      return passwordError.trim();
    }
  
    return passwordError.trim();
  };

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:5000/login').then((response) => {
        if(response.data.loggedIn == true) {
            setLoginStatus(response.data.user.userName)
            nav('/');
        }
    });
  }, []);

  function handleFileInputChange(event) {
    const fileInput = event.target;
    
    if (fileInput.files && fileInput.files[0]) {
      const selectedFile = fileInput.files[0];
      console.log(`Selected file: ${selectedFile.name}`);
      
      setValues({ ...values, profilePicture: selectedFile });
    }
  }  
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(values.email)) {
      return setErrors({ ...errors, emailError: 'Invalid email format' });
    }

    const pError = validatePassword(values.password);
    if (pError) {
      return setErrors({ ...errors, passwordError: pError });
    }

    const formData = new FormData();
    formData.append('userName', values.userName);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('profilePicture', values.profilePicture);

    axios.post('http://localhost:5000/signup', formData)
      .then(res => {
          console.log(res.data.Message);
          nav('/login');
      })
      .catch(err => {
          console.log(err);
          if (err.response && err.response.data && err.response.data.Message) {
              console.log(err.response.data.Message);
              setErrors({ ...errors, emailError: err.response.data.Message });
            }
      });
  };

  return (
    <div className='bg-[url("https://images.unsplash.com/photo-1477346611705-65d1883cee1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")] h-full w-full flex align-items-center justify-center'>
      <div className='w-1/2 h-2/3 bg-white rounded-2xl m-auto flex'>
        <div className='m-auto bg-white w-1/2 h-full rounded-md bg-[url("https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")] bg-fixed bg-contain bg-center'></div>
        <div className='m-auto bg-white w-1/2 rounded-md flex gap-5 flex-col'>
          <h1 className='text-gray-500 font-mono'>Register</h1>

            <form onSubmit={handleSubmit} className='flex gap-5 flex-col'>
                <div className='flex flex-col align-items-center justify-center gap-x-4'>
                    <label htmlFor="" className='text-gray-500'>Username</label>
                    <input type="text" maxLength='50' placeholder='Enter your user name...' name='userName' required
                    onChange={e => setValues({...values, userName: e.target.value})}
                    className={`p-2 rounded-md w-2/3 bg-gray-300 m-auto ${
                      values.userName ? 'text-black' : ''
                  }`}/>
                </div>

                <div className='flex flex-col align-items-center justify-center gap-x-4'>
                    <label htmlFor="" className='text-gray-500'>Email</label>
                    <input
                        type="email"
                        maxLength='50'
                        placeholder='Enter your email...'
                        name='email'
                        required
                        onChange={e => setValues({...values, email: e.target.value}, {...errors, emailError: ''})}
                        className={`p-2 rounded-md w-2/3 bg-gray-300 m-auto ${
                            values.email ? 'text-black' : ''
                        }`}
                    />
                    {errors.emailError && (
                        <div className="text-red-600 text-sm">
                            {errors.emailError}
                        </div>
                    )}
                </div>

                <div className='flex flex-col align-items-center justify-center gap-x-4'>
                      <label htmlFor="" className='text-gray-500'>Password</label>
                      <input
                          className={`p-2 rounded-md w-2/3 bg-gray-300 m-auto ${
                            values.password ? 'text-black' : ''
                        }`}
                          type="password"
                          placeholder='Enter your password...'
                          name='password'
                          required
                          onChange={e => setValues({ ...values, password: e.target.value })}
                      />
                   {errors.passwordError && <div className="text-red-600 text-sm">{errors.passwordError}</div>}
                </div>
                <div className='m-auto flex flex-col gap-5 justify-center items-center outline-dashed outline-black outline-offset-2 h-32 w-2/3'>
                  {!values.profilePicture && (
                    <label htmlFor="" className='text-gray-500'>
                      Upload your profile picture
                    </label>
                  )}
                  {values.profilePicture && (
                    <img
                      src={URL.createObjectURL(values.profilePicture)}
                      alt="Profile Preview"
                      className="max-w-[45%] max-h-[50%] rounded-full"
                    />
                  )}
                  <div className='w-[70%] flex justify-center items-center'>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      name="profilePicture"
                      className='text-black cursor-pointer'
                    />
                  </div>
                </div>
                <button className='target:shadow-lg text-black hover:text-white w-1/2 mx-auto p-3 bg-green-400 hover:bg-green-800 hover:border-transparent transition duration-500 ease-in-out'>Sign Up</button>
                <div>
                  <span className='text-gray-500 text-sm'>Already have an account? </span><Link to='/login' className='text-sm'>Login</Link>
                </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp;