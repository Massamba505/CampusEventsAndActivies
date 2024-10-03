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
import CheckoutPage from './pages/CheckoutForm.jsx';
import TicketSuccess from './components/User/Stripe/TicketSuccess.jsx';

function App() {
  const { authUser } = useAuthContext();

  return (
    <div className='App'>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to='/' />} />
        <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to='/' />} />
        <Route path="/forgot-password" element={!authUser ? <ForgotPassword /> : <Navigate to='/' />} /> {/* Forgot Password route */}
        <Route path="/enter-code/:email" element={!authUser ? <EnterCode /> : <Navigate to='/' />} /> {/* Enter Code route */}
        <Route path="/set-new-password/:userId" element={!authUser ? <SetNewPassword /> : <Navigate to='/' />} /> {/* Set New Password route */}

        {/* Protected routes */}
        <Route path="/" element={authUser ? <Home /> : <Landing/>} />
        <Route path="/events" element={authUser ? <Home /> : <Navigate to='/login' />} />
        <Route path="/create-event" element={authUser ? <CreateEvent /> : <Navigate to='/login' />} />
        <Route path="/events/:eventId" element={authUser ? <EventDetails /> : <Navigate to='/login' />} />
        <Route path="/search" element={authUser ? <SearchResults /> : <Navigate to='/login' />} />
        
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to='/login' />} />
        <Route path="/check" element={authUser ? <CheckoutPage eventId="1000" ticketType="VIP" price={100} eventDate="10/12/2024" /> : <Navigate to='/login' />} />


        <Route path="/tickets/success" element={authUser ? <TicketSuccess /> : <Navigate to='/login' />} />
        <Route path="/tickets/cancel" element={authUser ? <TicketSuccess /> : <Navigate to='/login' />} />

        <Route path="/admin/category" element={authUser ? <CategoriesManagement /> : <Navigate to='/login' />} />

        {/* Redirect to login if no match */}
        <Route path="*" element={<Error404 />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;

// import React, { useState, useEffect } from "react";
// import "./App.css";
// import { myConstant } from "./const/const";

// const ProductDisplay = () => (
//   <section>
//     <div className="product">
//       <img
//         src="https://i.imgur.com/EHyR2nP.png"
//         alt="The cover of Stubborn Attachments"
//       />
//       <div className="description">
//       <h3>Stubborn Attachments</h3>
//       <h5>$20.00</h5>
//       </div>
//     </div>
//     <form action={myConstant + `/api/tickets/create-checkout-session`} method="POST">
//       <button type="submit">
//         Checkout
//       </button>
//     </form>
//   </section>
// );

// const Message = ({ message }) => (
//   <section>
//     <p>{message}</p>
//   </section>
// );

// export default function App() {
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     // Check to see if this is a redirect back from Checkout
//     const query = new URLSearchParams(window.location.search);

//     if (query.get("success")) {
//       setMessage("Order placed! You will receive an email confirmation.");
//     }

//     if (query.get("canceled")) {
//       setMessage(
//         "Order canceled -- continue to shop around and checkout when you're ready."
//       );
//     }
//   }, []);

//   return message ? (
//     <Message message={message} />
//   ) : (
//     <ProductDisplay />
//   );
// }