import { useContext, createContext, useState, useEffect } from "react";

const MovieContext = createContext({
  movieList: [],
  selectedMovie: undefined,
  accessToken: null,
  userId: null,
});

function MovieContextProvider({ children }) {
  const [movieList, setMovieList] = useState([]);
  const [movie, setMovie] = useState(undefined);
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    try {
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedUserId = localStorage.getItem("userId");

      if (
        storedAccessToken &&
        typeof storedAccessToken === "string" &&
        storedAccessToken.trim() !== ""
      ) {
        if (storedAccessToken.split(".").length === 3) {
          setAccessToken(storedAccessToken);
        } else {
          localStorage.removeItem("accessToken");
          setAccessToken(null);
        }
      }

      if (storedUserId && !isNaN(parseInt(storedUserId))) {
        setUserId(parseInt(storedUserId));
      } else {
        localStorage.removeItem("userId");
        setUserId(null);
      }
    } catch (error) {
      console.error("Error loading authentication data:", error);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      setAccessToken(null);
      setUserId(null);
    }
  }, []);

  const updateTokens = (newAccessToken, newUserId) => {
    try {
      if (
        !newAccessToken ||
        typeof newAccessToken !== "string" ||
        newAccessToken.trim() === ""
      ) {
        throw new Error("Invalid token format");
      }

      if (newAccessToken.split(".").length !== 3) {
        throw new Error("Invalid JWT format");
      }

      if (!newUserId || isNaN(parseInt(newUserId))) {
        throw new Error("Invalid user ID");
      }

      setAccessToken(newAccessToken);
      setUserId(parseInt(newUserId));
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("userId", newUserId.toString());
    } catch (error) {
      console.error("Error updating tokens:", error);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      setAccessToken(null);
      setUserId(null);
      throw error;
    }
  };

  const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    setAccessToken(null);
    setUserId(null);
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
        updateTokens,
        clearTokens,
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
    throw new Error(
      "useMovieContext must be used within a MovieContextProvider"
    );
  }
  return context;
};
