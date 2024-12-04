import { Outlet } from 'react-router-dom';
import './Movie.css';

const Movie = () => {
  return (
    <div className="movie-page-container">
      <header className="movie-page-header">
        <h1 className="movie-page-title">Movie List</h1>
      </header>
      
      <main className="movie-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Movie;