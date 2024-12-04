import { useContext, createContext, useState, useEffect } from 'react';

const MovieContext = createContext({ list: [], selectedMovie: undefined });

function MovieContextProvider({ children }) {
  const [movieList, setMovieList] = useState([]);
  const [movie, setMovie] = useState(undefined);
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);

  // Use useEffect to retrieve and set accessToken and userId from localStorage
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedUserId = localStorage.getItem("userId");

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []); 

  return (
    <MovieContext.Provider value={{ movieList, setMovieList, movie, setMovie, accessToken, setAccessToken, userId }}>
      {children}
    </MovieContext.Provider>
  );
}

export default MovieContextProvider;

export const useMovieContext = () => {
  const data = useContext(MovieContext);
  return data;
};
