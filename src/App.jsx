import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import SignUp from './pages/SignUp.jsx';
import Login from './pages/Login.jsx';
import Landing from './pages/Landing';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from './context/AuthContext.jsx';
import CreateEvent from './components/CreateEvent.jsx';
import EventDetails from './components/EventDetails.jsx';
import Error404 from './components/Error404.jsx';
import ForgotPassword from './pages/FogotPassword/ForgotPassword.jsx';
import EnterCode from './pages/FogotPassword/EnterCode.jsx';
import SetNewPassword from './pages/FogotPassword/SetNewPassword.jsx';
import CategoriesManagement from './pages/CategoryManagement.jsx';
import SearchResults from './components/SearchResults.jsx';
import Profile from './pages/User/Profile.jsx';
import TicketSuccess from './components/User/Stripe/TicketSuccess.jsx';
import TicketCancel from './components/User/Stripe/TicketCancel.jsx';
import CalendarApp from './components/Calender/CalenderApp.jsx';
import Notification from './components/User/Notification.jsx';

function App() {
  const { authUser } = useAuthContext();

  return (
    <div className='App'>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} /> {/* should be able to access*/}
        <Route path="/login" element={!authUser ? <Login /> : <Home />} />
        <Route path="/signup" element={!authUser ? <SignUp /> : <Home />} />
        <Route path="/forgot-password" element={!authUser ? <ForgotPassword /> : <Home />} />
        <Route path="/enter-code/:email" element={!authUser ? <EnterCode /> : <Home />} />
        <Route path="/set-new-password/:userId" element={!authUser ? <SetNewPassword /> : <Home />} />

        {/* Protected routes */}
        <Route path="/home" element={authUser ? <Home /> : <Landing />} />
        <Route path="/calender" element={authUser ? <CalendarApp /> : <Landing />} />
        <Route path="/events" element={authUser ? <Home /> : <Navigate to='/login' />} />
        <Route path="/create-event" element={authUser ? <CreateEvent /> : <Navigate to='/login' />} />
        <Route path="/events/:eventId" element={authUser ? <EventDetails /> : <Navigate to='/login' />} />
        <Route path="/search" element={authUser ? <SearchResults /> : <Navigate to='/login' />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to='/login' />} />
        <Route path="/tickets/success" element={authUser ? <TicketSuccess /> : <Navigate to='/login' />} />
        <Route path="/tickets/cancel" element={authUser ? <TicketCancel /> : <Navigate to='/login' />} />
        <Route path="/notifications" element={authUser ? <Notification /> : <Navigate to='/login' />} />
        <Route path="/admin/category" element={authUser ? <CategoriesManagement /> : <Navigate to='/login' />} />

        {/* Redirect to 404 if no match */}
        <Route path="*" element={<Error404 />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
