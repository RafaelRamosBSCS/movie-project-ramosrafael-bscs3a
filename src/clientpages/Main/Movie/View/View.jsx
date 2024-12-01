import { useEffect, useState } from 'react';
import { useMovieContext } from '../../../../context/MovieContext';
import { useNavigate, useParams } from 'react-router-dom';
import MovieGenres from '../../../../components/MovieGenres/MovieGenres';
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
            <div className="poster-image" >
            <img
                src={movie.posterPath}
                alt={movie?.title || "Movie Poster"}
              style={{
                width: "200px",
                height: "auto", 
              }}
              />
            </div>
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
              {movie.videos && movie.videos[0] ? (
            <div className="video-preview">
              {/* Assuming the video.key is the unique identifier for a YouTube video */}
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${movie.videos[0]?.videoKey}`}
                title={movie.videos[0]?.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : null}
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