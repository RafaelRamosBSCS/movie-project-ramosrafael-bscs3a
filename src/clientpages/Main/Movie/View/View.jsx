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

          {/* Videos Section */}
          {movie.videos && movie.videos.length > 0 && (
            <div className="videos-section">
              <h2>Videos</h2>
              <div className="video-grid">
                {movie.videos.map((video, index) => (
                  <div key={index} className="video-card">
                    <iframe
                      width="560"
                      height="315"
                      src={video.url}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <h4>{video.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Cast & Crew Section */}
          {movie.casts && movie.casts.length > 0 && (
            <div className="cast-section">
              <h2>Cast & Crew</h2>
              <div className="cast-grid">
                {movie.casts.map((cast, index) => (
                  <div key={index} className="cast-card">
                    <img
                      src={cast.url || "https://via.placeholder.com/150x150.png?text=No+Image"}
                      alt={cast.name}
                      className="cast-image"
                    />
                    <div className="cast-info">
                      <h4>{cast.name}</h4>
                      <p>{cast.characterName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Photos Section */}
          {movie.photos && movie.photos.length > 0 && (
            <div className="photos-section">
              <h2>Photos</h2>
              <div className="photo-grid">
                {movie.photos.map((photo, index) => (
                  <div key={index} className="photo-card">
                    <img
                      src={photo.url}
                      alt={`Movie Scene ${index + 1}`}
                      className="movie-photo"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default View;