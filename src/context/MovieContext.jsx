import { useContext, createContext, useState, useEffect } from 'react';

const MovieContext = createContext({ 
  movieList: [], 
  selectedMovie: undefined,
  accessToken: null,
  userId: null
});

function MovieContextProvider({ children }) {
  const [movieList, setMovieList] = useState([]);
  const [movie, setMovie] = useState(undefined);
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get tokens from localStorage on initial load
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedUserId = localStorage.getItem("userId");

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    }
  }, []); 

  // Add function to update tokens
  const updateTokens = (newAccessToken, newUserId) => {
    setAccessToken(newAccessToken);
    setUserId(newUserId);
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("userId", newUserId);
  };

  return (
    <MovieContext.Provider 
      value={{ 
        movieList, 
        setMovieList, 
        movie, 
        setMovie, 
        accessToken, 
        setAccessToken, 
        userId,
        setUserId,
        updateTokens 
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export default MovieContextProvider;

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovieContext must be used within a MovieContextProvider');
  }
  return context;
};