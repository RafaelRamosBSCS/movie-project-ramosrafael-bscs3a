import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import "./Form.css";
import { useMovieContext } from "../../../../context/MovieContext";

const Form = () => {
  const [query, setQuery] = useState("");
  const [isCastAdded, setIsCastAdded] = useState(false);
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [movie, setMovie] = useState(undefined);
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]); // New state for videos
  const [newVideoUrl, setNewVideoUrl] = useState(""); // New state for new video URL
  const navigate = useNavigate();
  let { movieId } = useParams();
  const [existingVideos, setExistingVideos] = useState([]);
const [existingPhotos, setExistingPhotos] = useState([]);
const [selectedExistingVideo, setSelectedExistingVideo] = useState(null);
const [selectedExistingPhoto, setSelectedExistingPhoto] = useState(null);
const [isReplacing, setIsReplacing] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedVideo, setSelectedVideo] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);

  const { accessToken, userId } = useMovieContext();


  const prepareAllCreditsData = () => {
    let allCreditsData = [];
  
    // Go through each department in credits state
    Object.entries(credits).forEach(([department, members]) => {
      members.forEach(member => {
        allCreditsData.push({
          movieId: movieId,
          userId: userId,
          name: member.name,
          url: member.profile_path ? 
            `https://image.tmdb.org/t/p/w500${member.profile_path}` : "",
          characterName: member.role || ""  // This will capture both character names and crew jobs
        });
      });
    });
  
    return allCreditsData;
  };
  
  const [credits, setCredits] = useState({
    Acting: []
  });
  const [selectedCastMember, setSelectedCastMember] = useState([]);

  const handleAddImage = async (movieId2) => {
    console.log("Adding image for movieId:", movieId2);
    
    const imageData = {
      movieId: movieId ? movieId : movieId2,
      url: selectedImage?.file_path ? 
        `https://image.tmdb.org/t/p/w500${selectedImage.file_path}&language=en-US` : "",
      description: selectedImage?.height ?
        `Height: ${selectedImage.height}, Aspect Ratio: ${selectedImage.aspect_ratio}` : "" // Added description field
    };
  
    console.log("Sending image data:", imageData);
  
    try {
      const response = await axios({
        method: movieId ? "patch" : "post",
        url: movieId ? `/photos/${movieId}` : "/photos",
        data: imageData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
      });
      console.log("Photos added successfully:", response.data);
      alert("Photos added successfully!");
      return true;
    } catch (error) {
      console.error("Error adding Photos:", error.response?.data || error.message);
      alert("Failed to add Photos. Please try again.");
      return false;
    }
  };

  const handleAddImage2Edit = async (movieId2) => {
    console.log("Adding new image for movieId:", movieId2);
    
    const imageData = {
      movieId: movieId ? movieId : movieId2,
      url: selectedImage?.file_path ? 
        `https://image.tmdb.org/t/p/w500${selectedImage.file_path}` : "",
      description: selectedImage?.height ?
        `Height: ${selectedImage.height}, Aspect Ratio: ${selectedImage.aspect_ratio}` : ""
    };
  
    console.log("Sending image data:", imageData);
    try {
      const response = await axios({
        method: "post",  // Always use POST for new images
        url: "/photos",  // Always use base endpoint
        data: imageData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
      });
      console.log("Photo added successfully:", response.data);
      alert("Photo added successfully!");
      if (movieId) {
        fetchExistingPhotos(); // Refresh the list if editing
      }
      return true;
    } catch (error) {
      console.error("Error adding photo:", error.response?.data || error.message);
      alert("Failed to add photo. Please try again.");
      return false;
    }
  };

  const handleAddVideo = async (movieId2) => {
    console.log(movieId2);
    console.log(movieId);

    // If no videos are found, proceed with empty fields in videoData

    const videoData = {
      movieId: movieId ? movieId : movieId2, // Use the dynamically provided movieId
      url: selectedVideo?.key
        ? `https://www.youtube.com/embed/${selectedVideo.key}`
        : "https://www.youtube.com/embed/not_available", // Use placeholder URL
      name: selectedVideo?.name || "No video selected", // Default name if no video selected
      site: selectedVideo?.site || "YouTube", // Default site as "YouTube"
      videoKey: selectedVideo?.key || "not_available", // Default key
      videoType: selectedVideo?.type || "placeholder", // Default type
      official: selectedVideo?.official || false, // Default to false
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
      return true; // Indicate success
    } catch (error) {
      console.error("Error adding video:", error);
      alert("Failed to add video. Please try again.");
      return false; // Indicate failure
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
        method: "post",  // Always use POST for new videos
        url: "/videos",  // Always use base endpoint
        data: videoData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Video added successfully:", response.data);
      alert("Video added successfully!");
      if (movieId) {
        fetchExistingVideos(); // Refresh the list if editing
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
  
    // Only process actors without a department field
    credits.Acting.forEach(member => {
      if (member.name && !member.department) {
        const castData = {
          movieId: parseInt(currentMovieId),
          userId: userId,
          name: member.name,
          url: member.profile_path ? 
            `https://image.tmdb.org/t/p/w500${member.profile_path}` : 
            "https://via.placeholder.com/150x150.png?text=No+Image",
          characterName: member.character || `${member.name} as Cast`
        };
  
        console.log("Preparing cast data:", castData);
  
        const promise = axios({
          method: "post",
          url: "/casts",
          data: castData,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
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
      console.error("Error adding actors:", error.response?.data || error.message);
      alert("Failed to add actors. Please try again.");
      return false;
    }
  };

  const handleCredits = (creditsResponse) => {
    const { cast = [] } = creditsResponse.data;
    
    // Filter for actors only and exclude those with a department field
    const actors = cast.filter(member => 
      member.known_for_department === "Acting" && !member.department
    ).map(member => ({
      ...member,
      role: member.character
    }));
  
    setCredits({
      Acting: actors
    });
  };

// Add these functions to handle existing media
const fetchExistingVideos = async () => {
  try {
    const response = await axios({
      method: "get",
      url: `/videos/movie/${movieId}`, // Adjust endpoint based on your API
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
      url: `/photos/movie/${movieId}`, // Adjust endpoint based on your API
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("Existing photos:", response.data);
    setExistingPhotos(response.data);
  } catch (error) {
    console.error("Error fetching existing photos:", error);
    setExistingPhotos([]);
  }
};

const handleDeleteVideo = async (videoId) => {
  try {
    await axios({
      method: "delete",
      url: `/videos/${videoId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    alert("Video deleted successfully!");
    fetchExistingVideos(); // Refresh the list
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
    fetchExistingPhotos(); // Refresh the list
  } catch (error) {
    console.error("Error deleting photo:", error);
    alert("Failed to delete photo. Please try again.");
  }
};



  const convertYear = (date) => {
    return date ? date.split("-")[0] : null;
  };

  const handleSearch = useCallback(() => {
    axios({
      method: "get",
      url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
      headers: {
        Accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODhiYjc3NjQwOGNhNjM3MWIyMTY3ZmFiNDdlOTQ0YiIsIm5iZiI6MTczMzA1ODcwNi41NDQ5OTk4LCJzdWIiOiI2NzRjNjA5MjM4NjI4MzkyN2RlMDE4N2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.oYRqyrw4Ltmuo7z_J7ZTtpw1QtWIQoO8DLF2tDDW0-A",
      },
    }).then((response) => {
      setSearchedMovieList(response.data.results);
      console.log(response.data.results);
    });
  }, [query]);

  const fetchVideos = (tmdbId) => {
    return axios
      .get(
        `https://api.themoviedb.org/3/movie/${tmdbId}/videos?language=en-US`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODhiYjc3NjQwOGNhNjM3MWIyMTY3ZmFiNDdlOTQ0YiIsIm5iZiI6MTczMzA1ODcwNi41NDQ5OTk4LCJzdWIiOiI2NzRjNjA5MjM4NjI4MzkyN2RlMDE4N2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.oYRqyrw4Ltmuo7z_J7ZTtpw1QtWIQoO8DLF2tDDW0-A",
          },
        }
      )
      .then((response) => {
        const videoResults = response.data.results;
        setVideos(videoResults.length > 0 ? videoResults : ""); // Set to "" if no videos are found
        console.log("Videos from TMDB:", videoResults);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
        setVideos(""); // Set to "" in case of error
      });
  };

  const fetchImages = (tmdbId) => {
    return axios
      .get(
        `https://api.themoviedb.org/3/movie/${tmdbId}/images?language=en-US`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODhiYjc3NjQwOGNhNjM3MWIyMTY3ZmFiNDdlOTQ0YiIsIm5iZiI6MTczMzA1ODcwNi41NDQ5OTk4LCJzdWIiOiI2NzRjNjA5MjM4NjI4MzkyN2RlMDE4N2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.oYRqyrw4Ltmuo7z_J7ZTtpw1QtWIQoO8DLF2tDDW0-A",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        // Log the entire response to see the structure
        console.log("Full Image Response:", response.data);
        
        // Log the backdrops specifically
        console.log("Backdrops:", response.data.backdrops);
        
        // Check if backdrops exist and log their content
        if (response.data.backdrops && response.data.backdrops.length > 0) {
          console.log("First Backdrop Details:", response.data.backdrops[0]);
        }
  
        const imageResults = response.data.backdrops;
        setImages(imageResults.length > 0 ? imageResults : "");
        console.log("Images set to state:", imageResults);
      })
      .catch((error) => {
        console.error("Error fetching Images:", error);
        setImages(""); // Set to "" in case of error
      });
  };


  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    
    Promise.all([
      axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`,
        {
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODhiYjc3NjQwOGNhNjM3MWIyMTY3ZmFiNDdlOTQ0YiIsIm5iZiI6MTczMzA1ODcwNi41NDQ5OTk4LCJzdWIiOiI2NzRjNjA5MjM4NjI4MzkyN2RlMDE4N2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.oYRqyrw4Ltmuo7z_J7ZTtpw1QtWIQoO8DLF2tDDW0-A",
          },
        }
      ),
      axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/images`,
        {
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODhiYjc3NjQwOGNhNjM3MWIyMTY3ZmFiNDdlOTQ0YiIsIm5iZiI6MTczMzA1ODcwNi41NDQ5OTk4LCJzdWIiOiI2NzRjNjA5MjM4NjI4MzkyN2RlMDE4N2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.oYRqyrw4Ltmuo7z_J7ZTtpw1QtWIQoO8DLF2tDDW0-A",
          },
        }
      ),
      axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/credits`,
        {
          headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODhiYjc3NjQwOGNhNjM3MWIyMTY3ZmFiNDdlOTQ0YiIsIm5iZiI6MTczMzA1ODcwNi41NDQ5OTk4LCJzdWIiOiI2NzRjNjA5MjM4NjI4MzkyN2RlMDE4N2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.oYRqyrw4Ltmuo7z_J7ZTtpw1QtWIQoO8DLF2tDDW0-A",
          },
        }
      )
    ])
    .then(([videoResponse, imageResponse, creditsResponse]) => {
      // Handle videos
      const videoResults = videoResponse.data.results;
      setVideos(videoResults.length > 0 ? videoResults : "");
      
      // Handle images
      const backdrops = imageResponse.data.backdrops || [];
      const imageResults = [...backdrops];
      setImages(imageResults.length > 0 ? imageResults : "");
      
      // Handle credits - now only for actors
      const { cast = [] } = creditsResponse.data;
      
      // Filter for only actors (no crew members in cast)
      const actors = cast.filter(member => 
        member.known_for_department === "Acting" && !member.department
      ).map(member => ({
        ...member,
        role: member.character
      }));
  
      setCredits({
        Acting: actors
      });
    })
    .catch(error => {
      console.error("Error fetching movie data:", error);
    });
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
  
      // Add video
      const isVideoAdded = await handleAddVideo(newMovieId);
      if (!isVideoAdded) {
        alert("Video could not be added. Please try again.");
        return;
      }
  
      // Add image
      const isImageAdded = await handleAddImage(newMovieId);
      if (!isImageAdded) {
        alert("Image could not be added. Please try again.");
        return;
      }
  
      // Only add casts if this is a new movie (not editing)
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

  
  useEffect(() => {
    if (movieId) {
      // Fetch existing videos and photos when editing
      fetchExistingVideos();
      fetchExistingPhotos();
    }
  }, [movieId]);
  


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
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODhiYjc3NjQwOGNhNjM3MWIyMTY3ZmFiNDdlOTQ0YiIsIm5iZiI6MTczMzA1ODcwNi41NDQ5OTk4LCJzdWIiOiI2NzRjNjA5MjM4NjI4MzkyN2RlMDE4N2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.oYRqyrw4Ltmuo7z_J7ZTtpw1QtWIQoO8DLF2tDDW0-A",
                },
              }
            ),
            axios.get(
              `https://api.themoviedb.org/3/movie/${tmdbId}/images`,
              {
                headers: {
                  Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODhiYjc3NjQwOGNhNjM3MWIyMTY3ZmFiNDdlOTQ0YiIsIm5iZiI6MTczMzA1ODcwNi41NDQ5OTk4LCJzdWIiOiI2NzRjNjA5MjM4NjI4MzkyN2RlMDE4N2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.oYRqyrw4Ltmuo7z_J7ZTtpw1QtWIQoO8DLF2tDDW0-A",
                },
              }
            ),
            axios.get(
              `https://api.themoviedb.org/3/movie/${tmdbId}/credits`,
              {
                headers: {
                  Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ODhiYjc3NjQwOGNhNjM3MWIyMTY3ZmFiNDdlOTQ0YiIsIm5iZiI6MTczMzA1ODcwNi41NDQ5OTk4LCJzdWIiOiI2NzRjNjA5MjM4NjI4MzkyN2RlMDE4N2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.oYRqyrw4Ltmuo7z_J7ZTtpw1QtWIQoO8DLF2tDDW0-A",
                },
              }
            )
          ]);
        })
        .then(([videoResponse, imageResponse, creditsResponse]) => {
          // Handle videos
          const videoResults = videoResponse.data.results;
          setVideos(videoResults.length > 0 ? videoResults : "");
          
          // Handle images
          const backdrops = imageResponse.data.backdrops || [];
          const posters = imageResponse.data.posters || [];
          const imageResults = [...backdrops, ...posters];
          setImages(imageResults.length > 0 ? imageResults : "");
          
          // Handle credits
          const { cast = [], crew = [] } = creditsResponse.data;
          
          // Organize credits by department
          const organizedCredits = {
            Acting: [],
            Production: [],
            Directing: [],
            Writing: [],
            Sound: [],
            Camera: [],
            "Costume & Make-Up": [],
            Art: [],
            "Visual Effects": [],
            Crew: []
          };

          cast.forEach(member => {
            if (organizedCredits[member.known_for_department]) {
              organizedCredits[member.known_for_department].push({
                ...member,
                role: member.character
              });
            } else {
              organizedCredits.Crew.push({
                ...member,
                role: member.character
              });
            }
          });

          crew.forEach(member => {
            if (organizedCredits[member.known_for_department]) {
              organizedCredits[member.known_for_department].push({
                ...member,
                role: member.job
              });
            } else {
              organizedCredits.Crew.push({
                ...member,
                role: member.job
              });
            }
          });

          setCredits(organizedCredits);
        })
        .catch((error) => console.log(error));
    }
  }, [movieId]);

  

  return (
    <>
      <h1>{movieId !== undefined ? "Edit " : "Create "} Movie</h1>

      {movieId === undefined && (
        <>
          <div className="search-container">
            Search Movie:{" "}
            <input
              type="text"
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="button" onClick={handleSearch}>
              Search
            </button>
            <div className="searched-movie">
              {searchedMovieList.map((movie) => (
                <p key={movie.id} onClick={() => handleSelectMovie(movie)}>
                  {movie.original_title}
                </p>
              ))}
            </div>
          </div>
          <hr />
        </>
      )}

      <div className="container">
        <form>
          {selectedMovie ? (
            <img
              className="poster-image"
              src={`https://image.tmdb.org/t/p/original${selectedMovie.poster_path}`}
              alt={selectedMovie.original_title}
            />
          ) : (
            ""
          )}
          <div className="field">
            Title:
            <input
              type="text"
              disabled={!movieId}
              value={selectedMovie ? selectedMovie.original_title : ""}
              onChange={(e) =>
                setSelectedMovie({
                  ...selectedMovie,
                  original_title: e.target.value,
                })
              }
            />
          </div>
          <div className="field">
            Overview:
            <textarea
              disabled={!movieId}
              rows={10}
              value={selectedMovie ? selectedMovie.overview : ""}
              onChange={(e) =>
                setSelectedMovie({ ...selectedMovie, overview: e.target.value })
              }
            />
          </div>
          <div className="field">
            Popularity:
            <input
              type="text"
              disabled={!movieId}
              value={selectedMovie ? selectedMovie.popularity : ""}
              onChange={(e) =>
                setSelectedMovie({
                  ...selectedMovie,
                  popularity: e.target.value,
                })
              }
            />
          </div>
          <div className="field">
            Release Date:
            <input
              type="text"
              disabled={!movieId}
              value={selectedMovie ? selectedMovie.release_date : ""}
              onChange={(e) =>
                setSelectedMovie({
                  ...selectedMovie,
                  release_date: e.target.value,
                })
              }
            />
          </div>
          <div className="field">
            Vote Average:
            <input
              type="text"
              disabled={!movieId}
              value={selectedMovie ? selectedMovie.vote_average : ""}
              onChange={(e) =>
                setSelectedMovie({
                  ...selectedMovie,
                  vote_average: e.target.value,
                })
              }
            />
          </div>
          <button type="button" onClick={handleSave}>
            Save
          </button>
        </form>
        <h2>Videos</h2>
<div className="videoSection">
  {/* Existing Videos (when editing) */}
  {movieId && existingVideos.length > 0 && (
    <div className="existingVideos">
      <h3>Current Videos</h3>
      <div className="videosMainCont">
        {existingVideos.map((video) => (
          <div className="videosCont" key={video.id}>
            <p>{video.name}</p>
            <div className="videolist">
              <div className="video-preview">
                <iframe
                  width="280"
                  height="158"
                  src={video.url}
                  title={video.name}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
              <button onClick={() => handleDeleteVideo(video.id)}>
                Delete Video
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Available Videos from TMDB */}
  <h3>{movieId ? 'Add New Video' : 'Select Video'}</h3>
  <div className="videosMainCont">
    {videos && videos.length > 0 ? (
      videos.map((video) => (
        <div className="videosCont" key={video.id}>
          <p>{video.name}</p>
          <div className="videolist">
            <div className="video-preview">
              <iframe
                width="280"
                height="158"
                src={`https://www.youtube.com/embed/${video.key}`}
                title={video.name}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
            <button
              onClick={() => {
                setSelectedVideo(video);
                alert("Successfully selected a video!");
              }}
            >
              Select Video
            </button>
          </div>
        </div>
      ))
    ) : (
      <p>No videos found</p>
    )}
  </div>

  {selectedVideo && (
    <button onClick={() => handleAddVideo2Edit(movieId)} className="addVideoButton">
      Add Selected Video
    </button>
  )}
</div>
        
      </div>
      <h2>Photos</h2>
      <h3>{movieId ? 'Add New Photo' : 'Select Photo'}</h3>
  <div className="imagesMainCont">
    {selectedMovie ? (
      images && images.length > 0 ? (
        images.map((image) => (
          <div className="imagesCont" key={image.file_path}>
            <div className="image-preview">
              <img
                src={`https://image.tmdb.org/t/p/w500/${image.file_path}`}
                alt="Movie Scene"
                width="200"
              />
            </div>
            <button
              onClick={() => {
                setSelectedImage(image);
                alert("Successfully selected an image!");
              }}
            >
              Select Image
            </button>
          </div>
        ))
      ) : (
        <p>No images found for this movie</p>
      )
    ) : (
      <p>Select a movie to view available images</p>
    )}
  </div>

  {selectedImage && (
    <button onClick={() => handleAddImage2Edit(movieId)} className="addPhotoButton">
      Add Selected Photo
    </button>
  )}

<div className="creditsMainCont">
  {credits.Acting.length > 0 && (
    <div className="actorsSection">
      <h3>Actors</h3>
      <div className="membersList">
        {credits.Acting.map((actor) => (
          <div 
            key={actor.credit_id} 
            className="memberCard"
          >
            <img
              className="profileImage"
              src={actor.profile_path 
                ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                : "https://via.placeholder.com/150x150.png?text=No+Image"}
              alt={actor.name}
            />
            <div className="memberInfo">
              <h4>{actor.name}</h4>
              <p>as {actor.character}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>

{credits.Acting.length > 0 && (
  <button 
    onClick={() => handleAddCast(selectedMovie?.id)}
    className="addAllCastsButton"
    disabled={isCastAdded}
    style={{
      padding: '10px 20px',
      margin: '20px 0',
      backgroundColor: isCastAdded ? '#cccccc' : '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: isCastAdded ? 'not-allowed' : 'pointer'
    }}
  >
    {isCastAdded ? 'Actors Added' : 'Add All Actors'}
  </button>
)}
      {<h1>"KAYO NALANG BAHALA MAGLAGAY SA OUTLET"</h1>}

      {movieId && (
        <div>
          <hr />
          <nav>
            <ul className="tabs">
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/cast-and-crews`);
                }}
              >
                Cast & Crews
              </li>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/videos`);
                }}
              >
                Videos
              </li>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/photos`);
                }}
              >
              </li>
            </ul>
          </nav>
          <Outlet />
        </div>
      )}
    </>
  );
};

export default Form;
