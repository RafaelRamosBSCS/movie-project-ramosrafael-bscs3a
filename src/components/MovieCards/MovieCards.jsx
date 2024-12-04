import './MovieCards.css';
function MovieCards({ movie: movie, onClick }) {
  return (
    <>
      <div className='card' onClick={onClick}>
        <img src={movie.backdropPath} />
        <span>{movie.title}</span>
      </div>
    </>
  );
}

export default MovieCards;
