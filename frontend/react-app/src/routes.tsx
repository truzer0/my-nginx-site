import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  // Добавьте другие маршруты по необходимости
]);

export default router;
