import { Link, useNavigate } from "react-router-dom";
import { CheckCircle } from "react-feather"
import Modal from "../components/Modal"
import Logo from "../assets/logo.jpeg"
import { useState } from "react";
import UpcomingEvents from "../components/UpcomingEvents";


const LandingPage = () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      {/* Section 1 */}
      <section className="w-full text-gray-700 bg-white border">
        <div className="flex items-center justify-between px-2 sm:px-6">
          <div className="relative flex flex-col">
            <a href="#_" className="flex items-center">
            <img className="w-28 h-24" src={Logo}/>
            </a>
          </div>

          <div className="inline-flex items-center ml-5 space-x-2 sm:space-x-6 justify-end">
            <Link to={"/login"} className=" px-2 py-2 inline-flex items-center justify-center lg:px-4 text-base font-medium leading-6 text-black whitespace-no-wrap bg-white border border-transparent rounded-md shadow-sm hover:bg-gray-300 text-decoration-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600">
              <button>Login</button>
            </Link>
            <Link to={"/signup"} className="inline-flex px-2 py-2 text-sm items-center justify-center sm:px-4 sm:py-2 sm:text-base font-medium leading-6 text-white whitespace-no-wrap bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-500 text-decoration-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
              <button>Get Started</button>
            </Link>
          </div>

        </div>

      </section>


      {/* Section 2 */}
      <section className="px-2 h-full py-20 md:px-0 bg-gray-50">
        <div className="container items-center max-w-6xl px-8 mx-auto xl:px-5">
          <div className="flex flex-wrap items-center sm:-mx-3">
            <div className="w-full md:w-1/2 md:px-0">
              <div className="w-full pb-6 space-y-6 sm:max-w-md lg:max-w-lg md:space-y-4 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl">
                  <span className="block xl:inline">Find Events to </span>
                  <span className="block text-indigo-600 xl:inline">Connect & Grow.</span>
                </h1>
                <p className="mx-auto text-base text-gray-500 sm:max-w-md lg:text-xl md:max-w-3xl">
                  Welcome to the Campus Events and Activities App—your go-to platform for discovering and managing campus events. Easily browse events, register, verify tickets, and receive real-time notifications.
                </p>
                <p className="mx-auto text-base text-gray-500 sm:max-w-md lg:text-xl md:max-w-3xl">
                  Designed to be user-friendly and scalable, it integrates smoothly with campus services. Join the community and stay engaged!
                </p>
                <div className="relative flex flex-col sm:flex-row sm:space-x-4">
                  <Link to={"/signup"} className="flex text-decoration-none justify-center items-center w-full px-6 py-3 mb-3 text-lg text-white bg-indigo-600 rounded-md sm:mb-0 hover:bg-indigo-700 sm:w-auto">
                    Get Started
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="w-full h-auto overflow-hidden rounded-md shadow-xl sm:rounded-xl">
                <img src="https://images.unsplash.com/photo-1498049860654-af1a5c566876?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt="Events and activities" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section 3 */}
      <section className="w-full bg-gray-100 py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          {/* Header Section */}
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-3">
              <span className="inline-block bg-indigo-600 text-white px-4 py-1 rounded-full text-sm">Key Features</span>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Empower Your Event Journey
              </h2>
              <p className="max-w-xl mx-auto text-lg text-gray-600 md:text-xl lg:text-base xl:text-lg">
                Discover, create, and participate in events with ease. Our platform offers everything you need to make your event experience seamless.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            {/* Feature List */}
            <div className="space-y-8">
              {/* User Action: Discover Events */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m4 0h-4m2-2v4m5 5H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Discover Events</h3>
                  <p className="text-gray-600">
                    Browse a wide variety of events, workshops, and activities happening on campus. Find events that match your interests.
                  </p>
                </div>
              </div>

              {/* User Action: Register for Events */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7M5 12V7a2 2 0 012-2h2" />
                    </svg>
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Register & Get Tickets</h3>
                  <p className="text-gray-600">
                    Easily sign up for events and receive your tickets digitally. Manage your registrations and attendance seamlessly.
                  </p>
                </div>
              </div>

              {/* User Action: Notifications */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4-4h-4a4 4 0 00-4 4v1a4 4 0 004 4h1v1h1v-1h1v-1h-1m0 0v1h1m-2-2h1a4 4 0 004-4V7a4 4 0 00-4-4h-4a4 4 0 00-4 4v1h-1m2 5v-1a4 4 0 00-4 4v1a4 4 0 004 4h1v1m2-4h1" />
                    </svg>
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Receive Notifications</h3>
                  <p className="text-gray-600">
                    Stay updated with upcoming events, changes, and important information through instant notifications.
                  </p>
                </div>
              </div>

              {/* User Action: Event Creation */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v6h6M3 3h6l1 1v2l1 1h2l1-1h2v2l1 1v2l1-1h2l1-1v2l1 1h2v6H9M5 7h4m2-4h6m-8 4h4m-4 4h4m-4 4h4" />
                    </svg>
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Create & Manage Events</h3>
                  <p className="text-gray-600">
                    Organize events and activities effortlessly. Use our intuitive tools to manage event details, ticketing, and attendees.
                  </p>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Event Participation"
                className="w-full h-auto rounded-xl shadow-lg"
                style={{ maxWidth: '550px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 */}
      <section className="w-full py-12 flex justify-center align-content-center md:py-24 lg:py-32 bg-gray-50">
        <div className="w-full px-4 md:px-8 flex flex-col">
          {/* Header Section */}
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-indigo-600 px-3 py-1 text-sm text-white">Upcoming Events</div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-5xl">{"Don't"} Miss Out</h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl lg:text-base">
                Check out our upcoming events and secure your tickets today. <span className="text-blue-700">Swipe</span> left to see more!
              </p>
            </div>
          </div>

          <div className="sm:p-5">
            <UpcomingEvents />
          </div>

        </div>
      </section>

      {/* Section 5 */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-between">
            {/* Column 1 */}
            <div className="w-full md:w-1/4 mb-6">
              <h4 className="text-lg font-bold mb-2">About Us</h4>
              <p className="text-gray-400">
                Welcome to the Campus Events and Activities platform for discovering and managing campus events. Join our community and stay engaged!
              </p>
            </div>

            <div className="w-full md:w-1/4 mb-6">
              <h4 className="text-lg font-bold mb-2">Quick Links</h4>
              <ul className="list-none">
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-white">Login</Link>
                </li>
                <li>
                  <Link to="/signup" className="text-gray-400 hover:text-white">Get Started</Link>
                </li>
              </ul>
            </div>

            <div className="w-full md:w-1/4 mb-6">
              <h4 className="text-lg font-bold mb-2">Contact Us</h4>
              <p className="text-gray-400">Email: munadandou@gmail.com</p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-4 text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Campus Events and Activities App. All rights reserved.
            </p>
          </div>
        </div>
      </footer>


      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="text-center w-72">
            <CheckCircle size={56} className="mx-auto text-blue-500" />
            <div className="mx-auto my-12 w-48">
              <h3 className="text-lg font-black text-gray-800">Login to Get a Ticket</h3>
              <p className="text-sm text-gray-500">Please log in to continue with ticket reservation.</p>
            </div>
            <div className="flex gap-2 flex-column">
              <button onClick={()=>navigate("/login")} className="bg-blue-500 btn btn-primary w-full">Login</button>
              <button onClick={() => setOpen(false)} className="btn btn-light w-full border">Cancel</button>
            </div>
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;