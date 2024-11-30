import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';

function MainClient() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // Optional: Call backend logout endpoint if needed
      // axios.post('/logout', {}, {
      //   headers: { Authorization: `Bearer ${accessToken}` }
      // });

      // Remove tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole');

      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  useEffect(() => {
    // Check if token exists, if not redirect to login
    if (!accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  return (
    <div className='Main'>
      <div className='container'>
        <div className='navigation'>
          <ul>
            <li>
              <a onClick={() => navigate('/')}>Movies</a>
            </li>
            {accessToken ? (
              <li className='logout'>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default link behavior
                    handleLogout();
                  }}
                >
                  Logout
                </a>
              </li>
            ) : (
              <li className='login'> 
                <a onClick={() => navigate('/login')}>Login</a>
              </li>
            )}
          </ul>
        </div>
        <div className='outlet'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainClient;
