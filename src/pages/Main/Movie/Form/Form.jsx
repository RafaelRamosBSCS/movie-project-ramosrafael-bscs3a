import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import "./Form.css";

const Form = () => {
  const [query, setQuery] = useState("");
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [movie, setMovie] = useState(undefined);
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]); // New state for videos
  const [newVideoUrl, setNewVideoUrl] = useState(""); // New state for new video URL
  const navigate = useNavigate();
  let { movieId } = useParams();
  const [description, setDescription] = useState("");
  const [selectedVideo, setSelectedVideo] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);
  const [credits, setCredits] = useState({
    Acting: [],
    Production: [],
    Directing: [],
    Writing: [],
    Sound: [],
    Camera: [],
    "Costume & Make-Up": [],
    Art: [],
    "Visual Effects": [],
    Crew: []  // For any other departments
  });
  const [selectedCastMember, setSelectedCastMember] = useState([]);

  









  

  const handleAddImage = async (movieId2) => {
    console.log("Adding image for movieId:", movieId2);
  
    const accessToken = localStorage.getItem("accessToken");
    // Get userId from localStorage or your auth state management
    const userId = localStorage.getItem("userId"); // Add this line
    
    const imageData = {
      movieId: movieId ? movieId : movieId2,
      url: selectedImage?.file_path ? 
        `https://image.tmdb.org/t/p/w500${selectedImage.file_path}` : "",
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

  const handleAddVideo = async (movieId2) => {
    console.log(movieId2);
    console.log(movieId);

    // If no videos are found, proceed with empty fields in videoData

    const accessToken = localStorage.getItem("accessToken");
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
  
  const handleAddCast = async (movieId2) => {
    console.log("Adding cast for movieId:", movieId2);
  
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    
    const castData = {
      movieId: movieId ? movieId : movieId2,
      name: selectedCastMember?.name || "",
      url: selectedCastMember?.profile_path ? 
        `https://image.tmdb.org/t/p/w500${selectedCastMember.profile_path}` : "",
      characterName: selectedCastMember?.character || ""
    };
  
    console.log("Sending cast data:", castData);
  
    try {
      const response = await axios({
        method: movieId ? "patch" : "post",
        url: movieId ? `/casts/${movieId}` : "/casts",
        data: castData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
      });
      console.log("Cast member added successfully:", response.data);
      alert("Cast member added successfully!");
      return true;
    } catch (error) {
      console.error("Error adding cast member:", error.response?.data || error.message);
      alert("Failed to add cast member. Please try again.");
      return false;
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
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI",
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
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI",
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
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI",
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
    
    // Fetch videos, images, and credits
    Promise.all([
      axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI",
          },
        }
      ),
      axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/images`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI",
          },
        }
      ),
      axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/credits`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI",
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
      
      // Handle credits
      const { cast = [], crew = [] } = creditsResponse.data;
      console.log("Credits data:", creditsResponse.data);
      
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

      // Add cast members (mostly actors)
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

      // Add crew members
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
    .catch(error => {
      console.error("Error fetching movie data:", error);
    });
  };

  const handleSave = async () => {
    if (videos && videos.length > 0 && (!selectedVideo || !selectedVideo.key)) {
      alert("Videos are available. Please select a video before proceeding.");
      return false; // Stop the process
    }
  
    if (!videos || videos.length <= 0) {
      alert("No videos found. Proceeding with empty video data.");
    }
  
    const accessToken = localStorage.getItem("accessToken");
  
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
      // Dynamically decide between patch and post
      const response = await axios({
        method: movieId ? "patch" : "post",
        url: movieId ? `/movies/${movieId}` : "/movies",
        data: data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      // Get the movie ID, either from existing state or the response for a new movie
      const newMovieId = movieId || response.data.id;
      console.log("safjadsfdsgfdsfhdsbfj", movieId || "sd");
      console.log("safjadsfdsgfdsfhdsbfj", newMovieId);
      console.log("Movie saved successfully:", response.data);
      alert("Movie saved successfully!");
  
      // Proceed to add the video
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
  
      // Add selected cast member if one is selected
      if (selectedCastMember) {
        const isCastAdded = await handleAddCast(newMovieId);
        if (!isCastAdded) {
          alert("Cast member could not be added. Please try again.");
          return;
        }
      }
  
      // Navigate to the movie details page
      navigate(`/main/movies`);
    } catch (error) {
      console.error("Error saving movie:", error);
      alert("Failed to save the movie. Please try again.");
    }
  };

  
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
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI",
                },
              }
            ),
            axios.get(
              `https://api.themoviedb.org/3/movie/${tmdbId}/images`,
              {
                headers: {
                  Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI",
                },
              }
            ),
            axios.get(
              `https://api.themoviedb.org/3/movie/${tmdbId}/credits`,
              {
                headers: {
                  Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI",
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

        <div className="videosMainCont">
          {videos && videos.length > 0 ? (
            videos.map((video) => (
              <div className="videosCont" key={video.id}>
                <p>{video.name}</p>
                <div className="videolist">
                  <div className="video-preview">
                    {/* Assuming the video.key is the unique identifier for a YouTube video */}
                    <iframe
                      width="280"
                      height="158"
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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

                {/* <div>
                  <button type="button" onClick={handleAddVideo}>
                    Add Video
                  </button>
                </div> */}
              </div>
            ))
          ) : (
            <p>No videos found</p>
          )}
        </div>
        
      </div>
      <h2>Photos</h2>
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
<div className="creditsMainCont">
  {Object.entries(credits).map(([department, members]) => (
    members.length > 0 && (
      <div key={department} className="departmentSection">
        <h3>{department}</h3>
        <div className="membersList">
          {members.map((member) => (
            <div 
              key={member.credit_id} 
              className="memberCard"
            >
              <img
                className="profileImage"
                src={member.profile_path 
                  ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                  : "https://via.placeholder.com/150x150.png?text=No+Image"}
                alt={member.name}
              />
              <div className="memberInfo">
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedCastMember(member);
                  alert("Successfully selected cast member!");
                }}
              >
                Select Cast Member
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  ))}
</div>

{selectedCastMember && (
  <button onClick={() => handleAddCast(movieId)} className="addCastButton">
    Add Selected Cast Member
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
