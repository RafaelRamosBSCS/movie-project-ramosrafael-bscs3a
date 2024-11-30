import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstname] = useState('');
  const [middleName, setMidname] = useState('');
  const [lastName, setLastname] = useState('');
  const [contactNo, setContactnum] = useState('');
  const [role, setRole] = useState('user'); // Default role set to 'user'
  const [status, setStatus] = useState('idle'); 
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); 

  const handleRegister = async () => {
    const data = { 
      email, 
      password, 
      firstName, 
      middleName, 
      lastName, 
      contactNo,
      role // Include role in registration data
    };

    setStatus('loading');
    console.log(data);
 
    await axios({
      method: 'post',
      url: '/admin/register',
      data,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
      .then((res) => {
        console.log(res);
        localStorage.setItem('accessToken', res.data.access_token);
        navigate('/login');
        setStatus('idle');
      })
      .catch((e) => {
        console.log(e);
        setErrorMessage(e.response.data.message || 'Please fill necessary text fields');
        setStatus('idle');
      });
  };
 
  return (
    <div className='Register'>
      <h1>Register</h1>
      <form>
        <div>
          <label>Email:</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type={showPassword ? 'text' : 'password'} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)} 
              className="show-hide-password"
              style={{ marginLeft: '10px' }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <div>
          <label>First Name:</label>
          <input
            type='text'
            value={firstName}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Middle Name:</label>
          <input
            type='text'
            value={middleName}
            onChange={(e) => setMidname(e.target.value)}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type='text'
            value={lastName}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contact Number:</label>
          <input
            type='tel'
            value={contactNo}
            onChange={(e) => setContactnum(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {errorMessage && <div className='error-message'>{errorMessage}</div>}
        <div>
          <button 
            type='button' 
            disabled={status === 'loading'} 
            onClick={handleRegister} 
            className="register" 
          >
            {status === 'loading' ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          type='button' 
          onClick={() => navigate('/login')} 
          style={{ border: 'none', background: 'none', color: '#007BFF', cursor: 'pointer' }}
        >
          Go Back to Login
        </button>
      </div>
    </div>
  );
}
 
export default Register;