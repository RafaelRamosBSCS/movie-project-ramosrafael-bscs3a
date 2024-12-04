import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';
import { useMovieContext } from '../../context/MovieContext';

function MainClient() {
  const { accessToken, userId } = useMovieContext();
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
            
            <h1 style={{ color: '#61dafb', margin: 0 }}>MovieApp</h1>
          </div>
          
          <ul>
            <li>
              <a onClick={() => navigate('/')}>
                🎬 Movies
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/categories')}>
                📂 Categories
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/watchlist')}>
                🔖 My List
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
                  ⟲ Logout
                </a>
              </li>
            ) : (
              <li className='login'> 
                <a onClick={() => navigate('/login')}>
                  👤 Login
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