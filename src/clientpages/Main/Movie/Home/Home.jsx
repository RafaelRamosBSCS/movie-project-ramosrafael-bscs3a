import { useNavigate } from "react-router-dom";
import "./Home.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import MovieCards from "../../../../components/MovieCards/MovieCards";
import { useMovieContext } from "../../../../context/MovieContext";

const Home = () => {
  const { accessToken, userId } = useMovieContext();
  const navigate = useNavigate();
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [isFading, setIsFading] = useState(false);
  const { movieList, setMovieList, setMovie } = useMovieContext();
  const [categories, setCategories] = useState({
    trending: [],
    topRated: [],
    recent: [],
  });

  const getMovies = () => {
    axios
      .get("/movies")
      .then((response) => {
        setMovieList(response.data);
        const random = Math.floor(Math.random() * response.data.length);
        setFeaturedMovie(response.data[random]);

        const sortedByVote = [...response.data].sort(
          (a, b) => b.voteAverage - a.voteAverage
        );
        const sortedByDate = [...response.data].sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        );

        setCategories({
          trending: response.data.slice(0, 6),
          topRated: sortedByVote.slice(0, 6),
          recent: sortedByDate.slice(0, 6),
        });
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (movieList.length) {
        setIsFading(true);

        setTimeout(() => {
          const random = Math.floor(Math.random() * movieList.length);
          setFeaturedMovie(movieList[random]);
          setIsFading(false);
        }, 1000);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [featuredMovie, movieList]);

  const MovieRow = ({ title, movies }) => (
    <div className="movie-row">
      <h2 className="row-title">{title}</h2>
      <div className="movie-slider">
        {movies.map((movie) => (
          <div key={movie.id}>
            <MovieCards
              movie={movie}
              onClick={() => {
                navigate(`/view/${movie.id}`);
                setMovie(movie);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="streaming-container">
      {featuredMovie && movieList.length ? (
        <div className="hero-section">
          <div
            className={`hero-backdrop ${isFading ? "fade-out" : "fade-in"}`}
            style={{
              backgroundImage: `linear-gradient(to top, #111 10%, transparent 90%),
                               url(${
                                 featuredMovie.backdropPath !==
                                 "https://image.tmdb.org/t/p/original/undefined"
                                   ? featuredMovie.backdropPath
                                   : featuredMovie.posterPath
                               })`,
            }}
          >
            <div className="hero-content">
              <h1 className="hero-title">{featuredMovie.title}</h1>
              <p className="hero-overview">{featuredMovie.overview}</p>
              <div className="hero-buttons">
                <button
                  className="play-button"
                  onClick={() => {
                    navigate(`/view/${featuredMovie.id}`);
                    setMovie(featuredMovie);
                  }}
                >
                  ▶ Watch Now
                </button>
                <button
                  className="more-info-button"
                  onClick={() => {
                    navigate(`/view/${featuredMovie.id}`);
                    setMovie(featuredMovie);
                  }}
                >
                  ℹ More Info
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hero-section-loader"></div>
      )}

      <div className="content-rows">
        <MovieRow title="Trending Now" movies={categories.trending} />
        <MovieRow title="Top Rated" movies={categories.topRated} />
        <MovieRow title="Recently Added" movies={categories.recent} />

        <h2 className="row-title">All Movies</h2>
        <div className="list-container">
          {movieList.map((movie) => (
            <div key={movie.id}>
              <MovieCards
                movie={movie}
                onClick={() => {
                  navigate(`/view/${movie.id}`);
                  setMovie(movie);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
