import React, { useState, useEffect } from "react";
import axios from "axios";

const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;
const MovieGenres = ({ movieId }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;

    axios({
      method: "get",
      url: url,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${tmdbApiKey}`,
      },
    })
      .then((response) => {
        setGenres(response.data.genres);
      })
      .catch((err) => {
        console.error("Error fetching genres:", err);
      });
  }, [movieId]);

  return (
    <div className="hero-genres">
      {genres.map((genre) => (
        <span key={genre.id} className="genre-pill">
          {genre.name}
        </span>
      ))}
    </div>
  );
};

export default MovieGenres;