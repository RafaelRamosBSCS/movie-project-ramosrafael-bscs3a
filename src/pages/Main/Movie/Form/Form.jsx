import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Form.css";
import { useMovieContext } from "../../../../context/MovieContext";

const Form = () => {
  const [query, setQuery] = useState("");
  const [isCastAdded, setIsCastAdded] = useState(false);
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [movie, setMovie] = useState(undefined); // "movie" IS BEING USED!!!
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  let { movieId } = useParams();
  const [existingVideos, setExistingVideos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);
  const [isImagesExpanded, setIsImagesExpanded] = useState(false);
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [isCastExpanded, setIsCastExpanded] = useState(false);
  const [isCurrentVideosExpanded, setIsCurrentVideosExpanded] = useState(false);
  const [isCurrentPhotosExpanded, setIsCurrentPhotosExpanded] = useState(false);
  const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;

  const { accessToken, userId } = useMovieContext(); //USERID IS ALSO BEING USED!!!
  // const accessToken = localStorage.getItem("accessToken");

  const [credits, setCredits] = useState({
    Acting: [],
  });

  const handleAddImage = async (movieId2) => {
    console.log("Adding image for movieId:", movieId2);

    const imageData = {
      movieId: movieId ? movieId : movieId2,
      url: selectedImage?.file_path
        ? `https://image.tmdb.org/t/p/w500${selectedImage.file_path}&language=en-US`
        : "",
      description: selectedImage?.height
        ? `Height: ${selectedImage.height}, Aspect Ratio: ${selectedImage.aspect_ratio}`
        : "",
    };

    console.log("Sending image data:", imageData);

    try {
      const response = await axios({
        method: movieId ? "patch" : "post",
        url: movieId ? `/photos/${movieId}` : "/photos",
        data: imageData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Photos added successfully:", response.data);
      alert("Photos added successfully!");
      return true;
    } catch (error) {
      console.error(
        "Error adding Photos:",
        error.response?.data || error.message
      );
      alert("Failed to add Photos. Please try again.");
      return false;
    }
  };

  const handleAddImage2Edit = async (movieId2) => {
    console.log("Adding new image for movieId:", movieId2);

    const imageData = {
      movieId: movieId ? movieId : movieId2,
      url: selectedImage?.file_path
        ? `https://image.tmdb.org/t/p/w500${selectedImage.file_path}`
        : "",
      description: selectedImage?.height
        ? `Height: ${selectedImage.height}, Aspect Ratio: ${selectedImage.aspect_ratio}`
        : "",
    };

    console.log("Sending image data:", imageData);
    try {
      const response = await axios({
        method: "post",
        url: "/photos",
        data: imageData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Photo added successfully:", response.data);
      alert("Photo added successfully!");
      if (movieId) {
        fetchExistingPhotos();
      }
      return true;
    } catch (error) {
      console.error(
        "Error adding photo:",
        error.response?.data || error.message
      );
      alert("Failed to add photo. Please try again.");
      return false;
    }
  };

  const handleAddVideo = async (movieId2) => {
    console.log(movieId2);
    console.log(movieId);

    const videoData = {
      movieId: movieId ? movieId : movieId2,
      url: selectedVideo?.key
        ? `https://www.youtube.com/embed/${selectedVideo.key}`
        : "https://www.youtube.com/embed/not_available",
      name: selectedVideo?.name || "No video selected",
      site: selectedVideo?.site || "YouTube",
      videoKey: selectedVideo?.key || "not_available",
      videoType: selectedVideo?.type || "placeholder",
      official: selectedVideo?.official || false,
    };

    console.log(videoData);
    try {
      const response = await axios({
        method: movieId ? "patch" : "post",
        url: movieId ? `/videos/${movieId}` : "/videos",
        data: videoData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Video added successfully:", response.data);
      alert("Video added successfully!");
      return true;
    } catch (error) {
      console.error("Error adding video:", error);
      alert("Failed to add video. Please try again.");
      return false;
    }
  };

  const handleAddVideo2Edit = async (movieId2) => {
    console.log("Adding new video for movieId:", movieId2);

    const videoData = {
      movieId: movieId ? movieId : movieId2,
      url: selectedVideo?.key
        ? `https://www.youtube.com/embed/${selectedVideo.key}`
        : "https://www.youtube.com/embed/not_available",
      name: selectedVideo?.name || "No video selected",
      site: selectedVideo?.site || "YouTube",
      videoKey: selectedVideo?.key || "not_available",
      videoType: selectedVideo?.type || "placeholder",
      official: selectedVideo?.official || false,
    };

    console.log("Sending video data:", videoData);
    try {
      const response = await axios({
        method: "post",
        url: "/videos",
        data: videoData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Video added successfully:", response.data);
      alert("Video added successfully!");
      if (movieId) {
        fetchExistingVideos();
      }
      return true;
    } catch (error) {
      console.error("Error adding video:", error);
      alert("Failed to add video. Please try again.");
      return false;
    }
  };

  const handleAddCast = async (movieId2) => {
    if (isCastAdded) {
      console.log("Cast members already added");
      return false;
    }

    console.log("Adding actors for movieId:", movieId2);

    const userId = parseInt(localStorage.getItem("userId")) || 1;
    const currentMovieId = movieId ? movieId : movieId2;

    let allPromises = [];

    credits.Acting.forEach((member) => {
      if (member.name && !member.department) {
        const castData = {
          movieId: parseInt(currentMovieId),
          userId: userId,
          name: member.name,
          url: member.profile_path
            ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
            : "https://via.placeholder.com/150x150.png?text=No+Image",
          characterName: member.character || `${member.name} as Cast`,
        };

        console.log("Preparing cast data:", castData);

        const promise = axios({
          method: "post",
          url: "/casts",
          data: castData,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        allPromises.push(promise);
      }
    });

    if (allPromises.length === 0) {
      alert("No actors to add");
      return false;
    }

    try {
      await Promise.all(allPromises);
      console.log("All actors added successfully");
      alert("All actors added successfully!");
      setIsCastAdded(true);
      return true;
    } catch (error) {
      console.error(
        "Error adding actors:",
        error.response?.data || error.message
      );
      alert("Failed to add actors. Please try again.");
      return false;
    }
  };

  const fetchExistingVideos = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `/videos/${movieId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Existing videos:", response.data);
      setExistingVideos(response.data);
    } catch (error) {
      console.error("Error fetching existing videos:", error);
      setExistingVideos([]);
    }
  };

  const fetchExistingPhotos = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `/photos/${movieId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Existing photos response:", response.data);
      const photosArray = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setExistingPhotos(photosArray);
    } catch (error) {
      console.error("Error fetching existing photos:", error);
      setExistingPhotos([]);
    }
  };

  const handleDeleteVideo = async (videoid) => {
    try {
      await axios({
        method: "delete",
        url: `/videos/${videoid}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert("Video deleted successfully!");
      fetchExistingVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video. Please try again.");
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await axios({
        method: "delete",
        url: `/photos/${photoId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert("Photo deleted successfully!");
      fetchExistingPhotos();
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert("Failed to delete photo. Please try again.");
    }
  };

  // const handleSearch = useCallback(() => {
  //   axios({
  //     method: "get",
  //     url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
  //     headers: {
  //       Accept: "application/json",
  //       Authorization:
  //         `Bearer ${tmdbApiKey}`,
  //     },
  //   }).then((response) => {
  //     setSearchedMovieList(response.data.results);
  //     console.log(response.data.results);
  //   });
  // }, [query]);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setQuery("");

    Promise.all([
      axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`,
        {
          headers: {
            Authorization:
              `Bearer ${tmdbApiKey}`,
          },
        }
      ),
      axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/images`, {
        headers: {
          Authorization:
            `Bearer ${tmdbApiKey}`,
        },
      }),
      axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits`, {
        headers: {
          Authorization:
            `Bearer ${tmdbApiKey}`,
        },
      }),
    ])
      .then(([videoResponse, imageResponse, creditsResponse]) => {
        const videoResults = videoResponse.data.results;
        setVideos(videoResults.length > 0 ? videoResults : "");

        const backdrops = imageResponse.data.backdrops || [];
        const imageResults = [...backdrops];
        setImages(imageResults.length > 0 ? imageResults : "");

        const { cast = [] } = creditsResponse.data;

        const actors = cast
          .filter(
            (member) =>
              member.known_for_department === "Acting" && !member.department
          )
          .map((member) => ({
            ...member,
            role: member.character,
          }));

        setCredits({
          Acting: actors,
        });
      })
      .catch((error) => {
        console.error("Error fetching movie data:", error);
      });
  };

  const handleTextSave = async () => {
    if (!selectedMovie) {
      alert("No movie data to save.");
      return;
    }

    const textData = {
      tmdbId: selectedMovie.id,
      title: selectedMovie.original_title,
      overview: selectedMovie.overview,
      popularity: selectedMovie.popularity,
      releaseDate: selectedMovie.release_date,
      voteAverage: selectedMovie.vote_average,
      backdropPath: selectedMovie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`
        : "",
      posterPath: selectedMovie.poster_path
        ? `https://image.tmdb.org/t/p/original${selectedMovie.poster_path}`
        : "",
      isFeatured: 0,
    };

    try {
      const response = await axios({
        method: "patch",
        url: `/movies/${movieId}`,
        data: textData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Text data saved successfully:", response.data);
      alert("Text changes saved successfully!");
    } catch (error) {
      console.error("Error saving text data:", error);
      alert("Failed to save text changes. Please try again.");
    }
  };
  const handleSave = async () => {
    if (videos && videos.length > 0 && (!selectedVideo || !selectedVideo.key)) {
      alert("Videos are available. Please select a video before proceeding.");
      return false;
    }

    if (!videos || videos.length <= 0) {
      alert("No videos found. Proceeding with empty video data.");
    }

    if (!selectedMovie) {
      alert("Please search and select a movie.");
      return;
    }

    const data = {
      tmdbId: selectedMovie.id,
      title: selectedMovie.original_title,
      overview: selectedMovie.overview,
      popularity: selectedMovie.popularity,
      releaseDate: selectedMovie.release_date,
      voteAverage: selectedMovie.vote_average,
      backdropPath: `https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`,
      posterPath: `https://image.tmdb.org/t/p/original${selectedMovie.poster_path}`,
      isFeatured: 0,
    };

    try {
      const response = await axios({
        method: movieId ? "patch" : "post",
        url: movieId ? `/movies/${movieId}` : "/movies",
        data: data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const newMovieId = movieId || response.data.id;
      console.log("Movie saved successfully:", response.data);
      alert("Movie saved successfully!");

      const isVideoAdded = await handleAddVideo(newMovieId);
      if (!isVideoAdded) {
        alert("Video could not be added. Please try again.");
        return;
      }

      const isImageAdded = await handleAddImage(newMovieId);
      if (!isImageAdded) {
        alert("Image could not be added. Please try again.");
        return;
      }

      if (!movieId && !isCastAdded) {
        const isCastsAdded = await handleAddCast(newMovieId);
        if (!isCastsAdded) {
          alert("Cast members could not be added. Please try again.");
          return;
        }
      }

      navigate(`/main/movies`);
    } catch (error) {
      console.error("Error saving movie:", error);
      alert("Failed to save the movie. Please try again.");
    }
  };

  useEffect(() => { // THESE ARE BEING USED!!!1
    if (movieId) {
      fetchExistingVideos();
      fetchExistingPhotos();
    }
  }, [movieId]);

  useEffect(() => {
    // Don't search if query is empty or too short
    if (!query.trim() || query.length < 2) {
      setSearchedMovieList([]);
      return;
    }
  
    // Add debounce to prevent too many API calls
    const timeoutId = setTimeout(() => {
      axios({
        method: "get",
        url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${tmdbApiKey}`, // Make sure you're using the env variable here
        },
      })
        .then((response) => {
          setSearchedMovieList(response.data.results);
          console.log(response.data.results);
        })
        .catch((error) => {
          console.error("Error searching movies:", error);
          setSearchedMovieList([]);
        });
    }, 500); // 500ms delay
  
    // Cleanup timeout
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    if (movieId) {
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          setMovie(response.data);
          const tempData = {
            id: response.data.tmdbId,
            original_title: response.data.title,
            overview: response.data.overview,
            popularity: response.data.popularity,
            poster_path: response.data.posterPath,
            release_date: response.data.releaseDate,
            vote_average: response.data.voteAverage,
          };
          setSelectedMovie(tempData);
          console.log(response.data);

          const tmdbId = response.data.tmdbId;

          return Promise.all([
            axios.get(
              `https://api.themoviedb.org/3/movie/${tmdbId}/videos?language=en-US`,
              {
                headers: {
                  Authorization:
                    `Bearer ${tmdbApiKey}`,
                },
              }
            ),
            axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}/images`, {
              headers: {
                Authorization:
                  `Bearer ${tmdbApiKey}`,
              },
            }),
            axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}/credits`, {
              headers: {
                Authorization:
                  `Bearer ${tmdbApiKey}`,
              },
            }),
          ]);
        })
        .then(([videoResponse, imageResponse, creditsResponse]) => {
          const videoResults = videoResponse.data.results;
          const validVideos = videoResults.filter(
            (video) =>
              video.site === "YouTube" &&
              (video.type === "Trailer" || video.type === "Teaser") &&
              video.official
          );

          setVideos(validVideos.length > 0 ? validVideos : "");
          setVideos(videoResults.length > 0 ? videoResults : []);

          const backdrops = imageResponse.data.backdrops || [];
          const posters = imageResponse.data.posters || [];
          const imageResults = [...backdrops, ...posters];
          setImages(imageResults.length > 0 ? imageResults : "");

          const { cast = [], crew = [] } = creditsResponse.data;

          const organizedCredits = {
            Acting: [],
            Production: [],
          };

          cast.forEach((member) => {
            if (organizedCredits[member.known_for_department]) {
              organizedCredits[member.known_for_department].push({
                ...member,
                role: member.character,
              });
            } else {
              organizedCredits.Crew.push({
                ...member,
                role: member.character,
              });
            }
          });

          crew.forEach((member) => {
            if (organizedCredits[member.known_for_department]) {
              organizedCredits[member.known_for_department].push({
                ...member,
                role: member.job,
              });
            } else {
              organizedCredits.Crew.push({
                ...member,
                role: member.job,
              });
            }
          });

          setCredits(organizedCredits);
        })
        .catch((error) => console.log(error));
    }
  }, [movieId]);

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>{movieId ? "Edit Movie" : "Create New Movie"}</h1>
      </div>

      {!movieId && (
        <section className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for a movie..."
              onChange={(event) => setQuery(event.target.value)}
            />
            {/* <button type="button" onClick={handleSearch}>
              Search
            </button> */}
          </div>
          <div className="search-results">
            {searchedMovieList.map((movie) => (
              <div
                key={movie.id}
                className="search-result-item"
                onClick={() => handleSelectMovie(movie)}
              >
                {movie.original_title} ({movie.release_date?.split("-")[0]})
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedMovie && (
        <>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="movie-form">
              <div className="poster-preview">
                <img
                  src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                  alt={selectedMovie.original_title}
                />
              </div>

              <div className="form-fields">
                <div className="form-field">
                  <label>Title</label>
                  <input
                    type="text"
                    disabled={!movieId}
                    value={selectedMovie.original_title || ""}
                    onChange={(e) =>
                      setSelectedMovie({
                        ...selectedMovie,
                        original_title: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Overview</label>
                  <textarea
                    disabled={!movieId}
                    rows={6}
                    value={selectedMovie.overview || ""}
                    onChange={(e) =>
                      setSelectedMovie({
                        ...selectedMovie,
                        overview: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-fields-row">
                  <div className="form-field">
                    <label>Popularity</label>
                    <input
                      type="number"
                      disabled={!movieId}
                      value={selectedMovie.popularity || ""}
                      onChange={(e) =>
                        setSelectedMovie({
                          ...selectedMovie,
                          popularity: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label>Release Date</label>
                    <input
                      type="text"
                      disabled={!movieId}
                      value={selectedMovie.release_date || ""}
                      onChange={(e) =>
                        setSelectedMovie({
                          ...selectedMovie,
                          release_date: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-field">
                    <label>Vote Average</label>
                    <input
                      type="number"
                      step="0.1"
                      disabled={!movieId}
                      value={selectedMovie.vote_average || ""}
                      onChange={(e) =>
                        setSelectedMovie({
                          ...selectedMovie,
                          vote_average: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-actions">
                  {movieId ? (
                    <div className="button-container">
                      <button
                        type="button"
                        onClick={handleTextSave}
                        className="save-button text-save"
                      >
                        Save Text Changes
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="save-button complete-save"
                      >
                        Update Media
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSave}
                      className="save-button"
                    >
                      Create Movie
                    </button>
                    
                  )}
                </div>
                <text>When Creating, Casts will be automatically added, wait after Videos/Photos prompts are done.</text>
              </div>
            </div>
          </form>

          <section className="content-section">
            <h2 className="section-title">Videos</h2>

            {/* Current Videos */}
            {movieId && existingVideos.length > 0 && (
              <div className="media-section">
                <div
                  className="media-header"
                  onClick={() =>
                    setIsCurrentVideosExpanded(!isCurrentVideosExpanded)
                  }
                >
                  <h3>Current Videos</h3>
                  <span>{isCurrentVideosExpanded ? "▼" : "▶"}</span>
                </div>
                <div
                  className={`media-content ${
                    isCurrentVideosExpanded ? "expanded" : ""
                  }`}
                >
                  <div className="media-list">
                    {existingVideos.map((video) => (
                      <div key={video.id} className="media-item">
                        <div className="media-preview">
                          <iframe
                            src={video.url}
                            title={video.name}
                            frameBorder="0"
                            allowFullScreen
                          />
                        </div>
                        <div className="media-info">
                          <h4>{video.name}</h4>
                          <div className="media-actions"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Available Videos */}
            <div className="media-section">
              <div
                className="media-header"
                onClick={() => setIsVideoExpanded(!isVideoExpanded)}
              >
                <h3>Available Videos</h3>
                <span>{isVideoExpanded ? "▼" : "▶"}</span>
              </div>
              <div
                className={`media-content ${isVideoExpanded ? "expanded" : ""}`}
              >
                <div
                  className="media-list"
                  style={{ maxHeight: "600px", overflowY: "auto" }}
                >
                  {Array.isArray(videos) &&
                    videos.map((video) => (
                      <div key={video.id} className="media-item">
                        <div className="media-preview">
                          <iframe
                            src={`https://www.youtube.com/embed/${video.key}`}
                            title={video.name}
                            frameBorder="0"
                            allowFullScreen
                          />
                        </div>
                        <div className="media-info">
                          <h4>{video.name}</h4>
                          <div className="media-actions">
                            <button
                              onClick={() => {
                                setSelectedVideo(video);
                                alert("Video selected!");
                              }}
                              className="action-button select-button"
                            >
                              Select
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Add Selected Video Button */}
            {selectedVideo && movieId && (
              <div className="section-actions">
                <button
                  onClick={() => handleAddVideo2Edit(movieId)}
                  className="action-button select-button"
                >
                  Add Selected Video
                </button>
                <button
                  onClick={() => handleDeleteVideo(movieId)}
                  className="action-button delete-button"
                >
                  Delete All Videos
                </button>
              </div>
            )}
          </section>

          {/* Photos Section */}
          <section className="content-section">
            <h2 className="section-title">Photos</h2>

            {/* Current Photos */}
            {movieId && existingPhotos.length > 0 && (
              <div className="media-section">
                <div
                  className="media-header"
                  onClick={() =>
                    setIsCurrentPhotosExpanded(!isCurrentPhotosExpanded)
                  }
                >
                  <h3>Current Photos</h3>
                  <span>{isCurrentPhotosExpanded ? "▼" : "▶"}</span>
                </div>
                <div
                  className={`media-content ${
                    isCurrentPhotosExpanded ? "expanded" : ""
                  }`}
                >
                  <div className="media-list">
                    {existingPhotos.map((photo) => (
                      <div key={photo.id} className="media-item">
                        <div className="media-preview">
                          <img src={photo.url} alt="Movie Scene" />
                        </div>
                        <div className="media-info">
                          <div className="media-actions"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Available Photos */}
            <div className="media-section">
              <div
                className="media-header"
                onClick={() => setIsImagesExpanded(!isImagesExpanded)}
              >
                <h3>Available Photos</h3>
                <span>{isImagesExpanded ? "▼" : "▶"}</span>
              </div>
              <div
                className={`media-content ${
                  isImagesExpanded ? "expanded" : ""
                }`}
              >
                <div className="media-list">
                  {images &&
                    Array.isArray(images) &&
                    images.map((image) => (
                      <div key={image.file_path} className="media-item">
                        <div className="media-preview">
                          <img
                            src={`https://image.tmdb.org/t/p/w500/${image.file_path}`}
                            alt="Movie Scene"
                          />
                        </div>
                        <div className="media-info">
                          <div className="media-actions">
                            <button
                              onClick={() => {
                                setSelectedImage(image);
                                alert("Image selected successfully");
                              }}
                              className="action-button select-button"
                            >
                              Select Photo
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Add Selected Photo Button */}
            {selectedImage && movieId && (
              <div className="section-actions">
                <button
                  onClick={() => handleAddImage2Edit(movieId)}
                  className="action-button select-button"
                >
                  Add Selected Photo
                </button>
                <button
                  onClick={() => handleDeletePhoto(movieId)}
                  className="action-button delete-button"
                >
                  Delete All Photos
                </button>
              </div>
            )}
          </section>

          {!movieId && (
            <section className="content-section">
              <h2 className="section-title">Cast Members</h2>

              <div className="media-section">
                <div
                  className="media-header"
                  onClick={() => setIsCastExpanded(!isCastExpanded)}
                >
                  <h3>Cast List</h3>
                  <span>{isCastExpanded ? "▼" : "▶"}</span>
                </div>
                <div
                  className={`media-content ${
                    isCastExpanded ? "expanded" : ""
                  }`}
                >
                  <div className="cast-grid">
                    {credits.Acting.map((actor) => (
                      <div key={actor.credit_id} className="cast-card">
                        <div className="cast-image">
                          <img
                            src={
                              actor.profile_path
                                ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                : "https://via.placeholder.com/150x150.png?text=No+Image"
                            }
                            alt={actor.name}
                          />
                        </div>
                        <div className="cast-details">
                          <h4>{actor.name}</h4>
                          <p>as {actor.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Form;
