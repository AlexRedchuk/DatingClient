import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import history from '../history';
import './App.css';
import Login from './pages/auth/Login';
import MainPage from './pages/main/MainPage';
import HomePage from './pages/home/HomePage';
import { connect } from 'react-redux';
import { checkLogIn } from '../actions/authActions';
import RegisterPage from './pages/register/RegisterPage';
import UnauthorizedRoute from './helpers/UnauthorizedRoute';
import ProtectedRoute from './helpers/ProtectedRoute';
import UserCard from './pages/userCard/UserCard';
import AnounimusMessanger from './pages/anounimus/AnounimusMessanger';
import SettingsPage from './pages/settings/SettingsPage';
import Symphaties from './pages/symphaties/Symphaties';
import Potentials from './pages/potentials/Potentials';
import Messenger from './pages/massenger/Messenger';
import PageIsDeveloping from './pages/errorPages/PageIsDeveloping';
import ProfilePage from './pages/profile/ProfilePage';

const App = ({ isSignedIn, checkLogIn, googleId }) => {
  useEffect( () => { 
     window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        clientId: '1057249760018-ejaa9g0o9ha9lhkvrgfbu22ltcfl8kl6.apps.googleusercontent.com',
        scope: 'email'
      })
      if (isSignedIn === null || isSignedIn === true) {
        checkLogIn();
      }
    })
  }, [isSignedIn, checkLogIn, googleId])

  if (isSignedIn === null) {
    return <h1>No content</h1>
  }

  return (<div>
    
      <Routes>
        <Route path="/" exact element={<UnauthorizedRoute><MainPage/></UnauthorizedRoute>} />
        <Route path="/login" exact element={<UnauthorizedRoute><Login/></UnauthorizedRoute>} />
        <Route path="/home" exact element={<ProtectedRoute><HomePage><UserCard/></HomePage></ProtectedRoute>} />
        <Route path="/register" exact element={<UnauthorizedRoute><RegisterPage/></UnauthorizedRoute>} />
        <Route path="/settings" exact element={<ProtectedRoute><HomePage><SettingsPage/></HomePage></ProtectedRoute>}/>
        <Route path="/symphaties" exact element={<ProtectedRoute><HomePage><Symphaties/></HomePage></ProtectedRoute>}/>
        <Route path="/potentials" exact element={<ProtectedRoute><HomePage><Potentials/></HomePage></ProtectedRoute>}/>
        <Route path="/conversations" exact element={<ProtectedRoute><HomePage><Messenger/></HomePage></ProtectedRoute>}/>
        <Route path="/anounimus" exact element={<ProtectedRoute><HomePage><AnounimusMessanger/></HomePage></ProtectedRoute>}/>
        <Route path="/statistics" exact element={<ProtectedRoute><HomePage><PageIsDeveloping/></HomePage></ProtectedRoute>}/>
        <Route path="/profile/:id" exact element={<ProtectedRoute><HomePage><ProfilePage/></HomePage></ProtectedRoute>}/>
      </Routes>
  </div>)
}

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.auth.isSignedIn,
    googleId: state.auth.user.googleId
  }
}
export default connect(mapStateToProps, { checkLogIn })(App);
