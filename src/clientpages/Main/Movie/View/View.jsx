import { useEffect, useState } from 'react';
import { useMovieContext } from '../../../../context/MovieContext';
import { useNavigate, useParams } from 'react-router-dom';
import MovieGenres from '../../../../components/MovieGenre';
import axios from 'axios';
import './View.css';

function View() {
  const { movie, setMovie, genres } = useMovieContext();
  const { movieId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (movieId !== undefined) {
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          const movieData = response.data;
          const releaseYear = movieData.releaseDate ? movieData.releaseDate.split('-')[0] : null;

          setMovie({
            ...movieData,
            releaseYear,
          });
        })
        .catch((e) => {
          console.log(e);
          navigate('/');
        });
    }
  }, [movieId, navigate, setMovie]);

  return (
    <>
      {movie && (
        <>
          <div>
            <div className='banner'>
              <h1>{movie.title} ({movie.releaseYear})</h1>
            </div>
          </div>
          <div>
            <div className='info'>
              <h3>{movie.overview}</h3>
              <MovieGenres movieId={movie.tmdbId} />
            </div>
          </div>
          {movie.casts && movie.casts.length && (
            <div>
              <h1>Cast & Crew</h1>
              <ul className="cast-list">
                {movie.casts.map((cast, index) => (
                  <li key={index}>{cast.name}</li>
                ))}
              </ul>
            </div>
          )}

          {movie.videos && movie.videos.length && (
            <div>
              <h1>Videos</h1>
              {JSON.stringify(movie.videos)}
            </div>
          )}

          {movie.photos && movie.photos.length && (
            <div>
              <h1>Photos</h1>
              {JSON.stringify(movie.photos)}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default View;