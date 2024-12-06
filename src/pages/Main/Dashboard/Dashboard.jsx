import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    movies: 0,
    photos: 0,
    videos: 0,
    casts: 0
  });

  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Get all movies first
        const moviesResponse = await axios.get('/movies', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const movies = moviesResponse.data;

        let totalPhotos = 0;
        let totalVideos = 0;
        let totalCasts = 0;

        // Fetch data for each movie
        for (const movie of movies) {
          try {
            // Get photos - ensure we handle it as an array
            const photosResponse = await axios.get(`/photos/${movie.id}`, {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            // Handle response as array (matches PHP gateway)
            if (photosResponse.data) {
              const photoArray = Array.isArray(photosResponse.data) ? photosResponse.data : [photosResponse.data];
              totalPhotos += photoArray.filter(photo => photo && photo.id).length;
            }

            // Get videos (already returns as array)
            const videosResponse = await axios.get(`/videos/${movie.id}`, {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (Array.isArray(videosResponse.data)) {
              totalVideos += videosResponse.data.length;
            }

            // Get casts
            const castsResponse = await axios.get(`/casts/${movie.id}`, {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (castsResponse.data) {
              const castsArray = Array.isArray(castsResponse.data) ? castsResponse.data : [castsResponse.data];
              totalCasts += castsArray.filter(cast => cast && cast.id).length;
            }

          } catch (error) {
            console.error(`Error fetching data for movie ${movie.id}:`, error);
          }
        }

        console.log('Final counts:', {
          movies: movies.length,
          photos: totalPhotos,
          videos: totalVideos,
          casts: totalCasts
        });

        setMetrics({
          movies: movies.length,
          photos: totalPhotos,
          videos: totalVideos,
          casts: totalCasts
        });
        setLoading(false);

      } catch (error) {
        console.error('Error fetching metrics:', error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, [accessToken]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Overview</h1>
      
      {loading ? (
        <div className="loading-message">Loading metrics...</div>
      ) : (
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <h2>Total Movies</h2>
              <span className="metric-icon">🎬</span>
            </div>
            <div className="metric-value">{metrics.movies}</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h2>Total Photos</h2>
              <span className="metric-icon">📸</span>
            </div>
            <div className="metric-value">{metrics.photos}</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h2>Total Videos</h2>
              <span className="metric-icon">🎥</span>
            </div>
            <div className="metric-value">{metrics.videos}</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h2>Total Cast Members</h2>
              <span className="metric-icon">🎭</span>
            </div>
            <div className="metric-value">{metrics.casts}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;