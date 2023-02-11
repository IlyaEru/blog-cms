import { useContext } from 'react';
import { HashRouter, Route, Routes as ReactRoutes } from 'react-router-dom';
import { AuthContext } from './App';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import NewPost from './pages/NewPost/NewPost';
import PostDetails from './pages/PostDetails/PostDetails';

export default function Routes() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <HashRouter>
      <Navbar />
      <ReactRoutes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/posts/:postId" element={<PostDetails />} />
        <Route
          path="/new-post"
          element={!isAuthenticated ? <Login /> : <NewPost />}
        />
        <Route
          path="/edit-post/:postId"
          element={!isAuthenticated ? <Login /> : <NewPost />}
        />
        <Route path="*" element={<h1>404: Not Found</h1>} />
      </ReactRoutes>
    </HashRouter>
  );
}
