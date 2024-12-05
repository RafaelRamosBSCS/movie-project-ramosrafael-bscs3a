import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './MainClient.css';

function MainClient() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  return (
    <div className='Main'>
      <div className='container'>
        <div className='navigation'>
          <div className="brand">
            <h1>Lumina</h1>
          </div>
          <ul>
            <li>
              <a onClick={() => navigate('/')}>
                
                <span>Movies</span>
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/categories')}>
                
                <span>Categories</span>
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/watchlist')}>
                
                <span>My List</span>
              </a>
            </li>
            {accessToken ? (
              <li className='logout'>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                >
                  
                  <span>Logout</span>
                </a>
              </li>
            ) : (
              <li className='login'> 
                <a onClick={() => navigate('/login')}>
                  
                  <span>Login</span>
                </a>
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