import * as React from 'react';
// import * as ReactDOM from 'react-dom/client'; 
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Login from './pages/Public/Login/Login';
import Dashboard from './pages/Main/Dashboard/Dashboard';
import Main from './pages/Main/Main';
import Movie from './pages/Main/Movie/Movie';
import Lists from './pages/Main/Movie/Lists/Lists';
import MainClient from './clientpages/Main/MainClient';
import Home from './clientpages/Main/Movie/Home/Home';
import View from './clientpages/Main/Movie/View/View';
import MovieContextProvider from './context/MovieContext';
import Register from './pages/Public/Register/Register';


const router = createBrowserRouter([
  {
    path: '/',
    element: <MainClient />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/view/:movieId?',
        element: <View />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/admin',
    element: <Main />,
    children: [
      {
        path: '/admin/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/admin/movies',
        element: <Movie />,
        children: [
          {
            path: '/admin/movies',
            element: <Lists />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <div className='App'>
            <MovieContextProvider>
        <RouterProvider router={router} />
      </MovieContextProvider>
    </div>
  );
}

export default App;
