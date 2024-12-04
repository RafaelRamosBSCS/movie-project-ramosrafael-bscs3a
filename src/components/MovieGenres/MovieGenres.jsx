import React, { useState, useEffect } from "react";
import axios from "axios";

const MovieGenres = ({ movieId }) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bearerToken = "your_bearer_token";

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;

    axios({
      method: "get",
      url: url,
      headers: {
        Accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODhiYjc3NjQwOGNhNjM3MWIyMTY3ZmFiNDdlOTQ0YiIsIm5iZiI6MTczMzA1ODcwNi41NDQ5OTk4LCJzdWIiOiI2NzRjNjA5MjM4NjI4MzkyN2RlMDE4N2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.oYRqyrw4Ltmuo7z_J7ZTtpw1QtWIQoO8DLF2tDDW0-A",
      },
    })
      .then((response) => {
        setGenres(response.data.genres);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching data from TMDb API");
        setLoading(false);
      });
  }, [movieId, bearerToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


  const genreList = genres.map((genre) => genre.name).join(", ");

  return (
    <div>
      <h3>Genres:</h3>
      <p>{genreList}</p>
    </div>
  );
};

export default MovieGenres;
