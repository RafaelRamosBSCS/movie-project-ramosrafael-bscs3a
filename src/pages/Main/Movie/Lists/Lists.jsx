import { useNavigate } from "react-router-dom";
import "./Lists.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useMovieContext } from "../../../../context/MovieContext";

const Lists = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { accessToken } = useMovieContext();

  const getMovies = () => {
    axios.get("/movies").then((response) => {
      setLists(response.data);
    });
  };

  useEffect(() => {
    getMovies();
  }, []);

  const handleRowClick = (movie) => {
    setSelectedMovie(selectedMovie?.id === movie.id ? null : movie);

    const outletElement = document.querySelector(".outlet");
    if (outletElement) {
      if (selectedMovie?.id !== movie.id) {
        outletElement.style.background = `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), 
                                        url(${
                                          movie.posterPath || movie.backdropPath
                                        })`;
        outletElement.style.backgroundSize = "cover";
        outletElement.style.backgroundPosition = "center";
      } else {
        outletElement.style.background = "";
      }
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const isConfirm = window.confirm(
      "Are you sure that you want to delete this data?"
    );
    if (isConfirm) {
      axios
        .delete(`/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(() => {
          axios
            .delete(`/videos/${id}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            })
            .then(() => {
              axios
                .delete(`/photos/${id}`, {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                })
                .then(() => {
                  axios
                    .delete(`/casts/${id}`, {
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                      },
                    })
                    .then(() => {
                      getMovies();
                      setSelectedMovie(null);
                      alert(
                        "Movie and all associated content deleted successfully!"
                      );
                    })
                    .catch((error) =>
                      console.error("Error deleting casts:", error)
                    );
                })
                .catch((error) =>
                  console.error("Error deleting photos:", error)
                );
            })
            .catch((error) => console.error("Error deleting video:", error));
        })
        .catch((error) => console.error("Error deleting movie:", error));
    }
  };

  return (
    <div className="lists-container">
      <div className="create-container">
        <button type="button" onClick={() => navigate("/main/movies/form")}>
          Create New Movie
        </button>
      </div>
      <div className="table-container">
        <table className="movie-lists">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lists.map((movie) => (
              <tr
                key={movie.id}
                onClick={() => handleRowClick(movie)}
                className={selectedMovie?.id === movie.id ? "selected" : ""}
              >
                <td>{movie.id}</td>
                <td>{movie.title}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-button edit-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/main/movies/form/" + movie.id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={(e) => handleDelete(movie.id, e)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lists;
