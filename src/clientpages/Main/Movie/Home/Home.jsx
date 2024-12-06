import { useNavigate } from "react-router-dom";
import "./Home.css";
import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import MovieCards from "../../../../components/MovieCards/MovieCards";
import { useMovieContext } from "../../../../context/MovieContext";

const MovieRowComponent = ({ title, movies, navigate, setMovie }) => {
  const sliderRef = useRef(null);
  const scrollPosRef = useRef(0);

  const handleScroll = () => {
    if (sliderRef.current) {
      scrollPosRef.current = sliderRef.current.scrollLeft;
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", handleScroll);
      slider.scrollLeft = scrollPosRef.current;
    }
    return () => {
      if (slider) {
        slider.removeEventListener("scroll", handleScroll);
      }
    };
  }, [movies]);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300 * (direction === "left" ? -1 : 1);
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="movie-row">
      <div className="row-header">
        <h2 className="row-title">{title}</h2>
        <div className="row-navigation">
          <button
            className="slider-nav-button prev-button"
            onClick={() => scroll("left")}
          >
            ←
          </button>
          <button
            className="slider-nav-button next-button"
            onClick={() => scroll("right")}
          >
            →
          </button>
        </div>
      </div>
      <div className="movie-slider-container">
        <div className="movie-slider" ref={sliderRef}>
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
    </div>
  );
};

const Home = () => {
  const { accessToken, userId } = useMovieContext();
  const navigate = useNavigate();
  const [movieGenres, setMovieGenres] = useState([]);

  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [isFading, setIsFading] = useState(false);
  const { movieList, setMovieList, setMovie } = useMovieContext();
  const [categories, setCategories] = useState({
    trending: [],
    topRated: [],
    recent: [],
  });

  useEffect(() => {
    if (featuredMovie?.tmdbId) {
      axios({
        method: "get",
        url: `https://api.themoviedb.org/3/movie/${featuredMovie.tmdbId}?language=en-US`,
        headers: {
          Accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODhiYjc3NjQwOGNhNjM3MWIyMTY3ZmFiNDdlOTQ0YiIsIm5iZiI6MTczMzA1ODcwNi41NDQ5OTk4LCJzdWIiOiI2NzRjNjA5MjM4NjI4MzkyN2RlMDE4N2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.oYRqyrw4Ltmuo7z_J7ZTtpw1QtWIQoO8DLF2tDDW0-A",
        },
      })
        .then((response) => {
          setMovieGenres(response.data.genres);
        })
        .catch((error) => console.log("Error fetching genres:", error));
    }
  }, [featuredMovie]);

  const getMovies = () => {
    axios
      .get("/movies")
      .then((response) => {
        setMovieList(response.data);
        const random = Math.floor(Math.random() * response.data.length);
        setFeaturedMovie(response.data[random]);

        const sortedByPopularity = [...response.data].sort(
          (a, b) => b.popularity - a.popularity
        );
        const sortedByVoteAverage = [...response.data].sort(
          (a, b) => b.voteAverage - a.voteAverage
        );

        setCategories({
          trending: sortedByPopularity.slice(0, 6),
          topRated: sortedByVoteAverage.slice(0, 6),
          recent: response.data.slice(0, 6),
        });
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    let fadeTimer;
    let changeTimer;

    const changeFeaturedMovie = () => {
      setIsFading(true);

      fadeTimer = setTimeout(() => {
        let random;
        let attempts = 0;
        const maxAttempts = 10;

        do {
          random = Math.floor(Math.random() * movieList.length);
          attempts++;
        } while (
          movieList[random].id === featuredMovie?.id &&
          attempts < maxAttempts
        );

        setFeaturedMovie(movieList[random]);
        setIsFading(false);
      }, 2100);
    };

    const startLoop = () => {
      if (movieList.length > 1) {
        changeTimer = setInterval(changeFeaturedMovie, 8000);
      }
    };

    startLoop();

    return () => {
      clearInterval(changeTimer);
      clearTimeout(fadeTimer);
    };
  }, [movieList]);

  return (
    <div className="streaming-container">
      {featuredMovie && movieList.length ? (
        <div className="hero-section">
          <div
            className={`hero-backdrop ${isFading ? "fade-out" : "fade-in"}`}
            style={{
              backgroundImage: `linear-gradient(to top, #111 10%, transparent 90%),
              url(${
                featuredMovie.backdropPath
                  ? `https://image.tmdb.org/t/p/w1280${featuredMovie.backdropPath}`
                  : featuredMovie.posterPath
                  ? `https://image.tmdb.org/t/p/w780${featuredMovie.posterPath}`
                  : ""
              })`,
            }}
          >
            <div className="hero-content">
              <h1 className="hero-title">{featuredMovie.title}</h1>
              <p className="hero-overview">{featuredMovie.overview}</p>
              <div className="hero-genres">
                {movieGenres.map((genre) => (
                  <span key={genre.id}>{genre.name}</span>
                ))}
              </div>
              <div className="hero-buttons">
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
        <MovieRowComponent
          title="Most Popular"
          movies={categories.trending}
          navigate={navigate}
          setMovie={setMovie}
        />
        <MovieRowComponent
          title="Highest Rated"
          movies={categories.topRated}
          navigate={navigate}
          setMovie={setMovie}
        />
        <MovieRowComponent
          title="Recently Added"
          movies={categories.recent}
          navigate={navigate}
          setMovie={setMovie}
        />

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
