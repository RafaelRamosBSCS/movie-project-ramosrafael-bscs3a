import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';

function Main() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  useEffect(() => {
    if (
      accessToken === undefined ||
      accessToken === '' ||
      accessToken === null
    ) {
      handleLogout();
    }
  }, []);

  return (
    <div className='Main'>
      <div className='container'>
        <div className={`navigation ${isMinimized ? 'minimized' : ''}`}>
          <div className="brand">
            MovieApp
          </div>
          <ul>
            <li>
              <a onClick={() => navigate('/main/movies')}>
                <span>Movies</span>
              </a>
            </li>
            <li className='logout'>
              <a onClick={handleLogout}>
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </div>
        <div className='outlet'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;