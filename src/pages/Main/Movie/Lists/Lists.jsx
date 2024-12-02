import { useNavigate } from "react-router-dom";
import "./Lists.css";
import { useEffect, useState } from "react";
import axios from "axios";
const Lists = () => {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);

  const getMovies = () => {
    //get the movies from the api or database
    axios.get("/movies").then((response) => {
      setLists(response.data);
    });
  };
  useEffect(() => {
    getMovies();
  }, []);

  const handleDelete = (id) => {
    const isConfirm = window.confirm(
      "Are you sure that you want to delete this data?"
    );
    if (isConfirm) {
      // Delete from /movies/:id
      axios
        .delete(`/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(() => {
          // Delete from /videos/:id
          axios
            .delete(`/videos/${id}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            })
            .then(() => {
              // Delete from /photos/:id
              axios
                .delete(`/photos/${id}`, {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                })
                .then(() => {
                  // Delete from /casts/:id
                  axios
                    .delete(`/casts/${id}`, {
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                      },
                    })
                    .then(() => {
                      // Update the list after all deletions
                      const tempLists = [...lists];
                      const index = lists.findIndex((movie) => movie.id === id);
                      if (index !== undefined || index !== -1) {
                        tempLists.splice(index, 1);
                        setLists(tempLists);
                      }
                    })
                    .catch((error) => {
                      console.error("Error deleting casts:", error);
                    });
                })
                .catch((error) => {
                  console.error("Error deleting photos:", error);
                });
            })
            .catch((error) => {
              console.error("Error deleting video:", error);
            });
        })
        .catch((error) => {
          console.error("Error deleting movie:", error);
        });
    }
  };

  return (
    <div className="lists-container">
      <div className="create-container">
        <button
          type="button"
          onClick={() => {
            navigate("/main/movies/form");
          }}
        >
          Create new
        </button>
      </div>
      <div className="table-container">
        <table className="movie-lists">
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lists.map((movie, index) => (
              <tr>
                <td>{movie.id}</td>
                <td>{movie.title}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/main/movies/form/" + movie.id);
                    }}
                  >
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(movie.id)}>
                    Delete
                  </button>
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
