import { useEffect, useState } from "react";
import { useMovieContext } from "../../../../context/MovieContext";
import { useNavigate, useParams } from "react-router-dom";
import MovieGenres from "../../../../components/MovieGenres/MovieGenres";
import axios from "axios";
import "./View.css";

function View() {
  const { movie, setMovie } = useMovieContext();
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (movieId !== undefined) {
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          const movieData = response.data;
          const releaseYear = movieData.releaseDate
            ? movieData.releaseDate.split("-")[0]
            : null;

          setMovie({
            ...movieData,
            releaseYear,
          });
        })
        .catch((e) => {
          console.log(e);
          navigate("/");
        });
    }
  }, [movieId, navigate, setMovie]);

  return (
    <div className="movie-view-container">
      {movie && (
        <>
          <section className="hero-section">
            <div
              className="hero-backdrop"
              style={{
                backgroundImage: `linear-gradient(to top, #111 10%, transparent 60%),
                                 url(${movie.backdropPath})`,
              }}
            >
              <div className="hero-content">
                <div className="movie-info">
                  <img
                    src={movie.posterPath}
                    alt={movie.title}
                    className="hero-poster"
                  />
                  <div className="movie-details">
                    <h1 className="movie-title">
                      {movie.title}
                      <span className="release-year">
                        ({movie.releaseYear})
                      </span>
                    </h1>
                    <MovieGenres movieId={movie.tmdbId} />
                    <p className="movie-overview">{movie.overview}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {movie.videos && movie.videos.length > 0 && (
            <section className="content-section">
              <h2 className="section-title">Videos</h2>
              <div className="video-grid">
                {movie.videos.map((video, index) => (
                  <div key={index} className="video-card">
                    <iframe
                      src={video.url}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}
              </div>
            </section>
          )}

          {movie.photos && movie.photos.length > 0 && (
            <section className="content-section">
              <h2 className="section-title">Photos</h2>
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
            </section>
          )}

          {movie.casts && movie.casts.length > 0 && (
            <section className="content-section cast-section">
              <h2 className="section-title">Cast & Crew</h2>
              <div className={`cast-grid ${isExpanded ? "expanded" : ""}`}>
                {movie.casts.map((cast, index) => (
                  <div key={index} className="cast-card">
                    <img
                      src={
                        cast.url ||
                        "https://via.placeholder.com/150x150.png?text=No+Image"
                      }
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
              <button
                className="expand-button"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Show Less" : "Show More"}
              </button>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default View;
