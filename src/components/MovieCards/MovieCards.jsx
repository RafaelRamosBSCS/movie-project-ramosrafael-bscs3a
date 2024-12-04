import './MovieCards.css';

function MovieCards({ movie, onClick }) {
  return (
    <div className='card' onClick={onClick}>
      <img 
        src={movie.backdropPath} 
        alt={movie.title}
      />
      <div className="overlay">
        <h3 className="title">{movie.title}</h3>
      </div>
    </div>
  );
}

export default MovieCards;