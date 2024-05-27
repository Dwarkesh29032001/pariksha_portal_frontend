import React, { useState } from 'react';
import '../../Style/WebsiteHomePageStyle/StyleSignup.css'
import axios from 'axios';
import { useOwnerAuth } from '../OwnerAuth';
import BASE_URL from '../ApiConfig';
const SignupForm = () => {
  const [adminName, setName] = useState('');
  const [adminUserName, setUsername] = useState('');
  const [adminEmail, setEmail] = useState('');
  const [adminPassword, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { isLoggedIn} = useOwnerAuth();
  const [message,setmessage]=useState("");
  if (!isLoggedIn) {
    return null;
  }

const token=localStorage.getItem('jwtToken');
const config = {
  headers: { Authorization: `Bearer ${token}` }
};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      adminName,
      adminUserName,
      adminEmail,
      adminPassword,
    };

    try {
    const response = await axios.post(`${BASE_URL}/adminSignup`, formData,config);
      setName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setmessage("added succesfully");
      setTimeout(()=>{
        setmessage("");
      },3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setmessage("some Error");
      setTimeout(()=>{
        setmessage("");
      },3000);
    }

  };

  return (
    <form className='signupForm' onSubmit={handleSubmit} >
{message}
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        value={adminName}
        placeholder='Name'
        onChange={(e) => setName(e.target.value)}
        required
      />

      <br />
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        value={adminUserName}
        placeholder='Username'
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <br />
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={adminEmail}
        placeholder='Email'
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <br />
      <label htmlFor="password">Password:</label>
      <div style={{ display: 'flex' }}>
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          value={adminPassword}
          placeholder='Password'
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <span
          style={{ cursor: 'pointer', marginLeft: '5px' }}
          onClick={togglePasswordVisibility}
        >
          {showPassword ? '🔓' : '🔒'}
        </span>
      </div>
      <br />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;