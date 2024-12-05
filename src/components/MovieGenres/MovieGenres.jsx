import React, { useState, useEffect } from "react";
import axios from "axios";

const MovieGenres = ({ movieId }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;

    axios({
      method: "get",
      url: url,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODhiYjc3NjQwOGNhNjM3MWIyMTY3ZmFiNDdlOTQ0YiIsIm5iZiI6MTczMzA1ODcwNi41NDQ5OTk4LCJzdWIiOiI2NzRjNjA5MjM4NjI4MzkyN2RlMDE4N2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.oYRqyrw4Ltmuo7z_J7ZTtpw1QtWIQoO8DLF2tDDW0-A",
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