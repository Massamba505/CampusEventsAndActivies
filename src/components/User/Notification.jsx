import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import { myConstant } from '../../const/const';
import toast from 'react-hot-toast';
import loadingGif from '../../assets/loading.gif'

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('events-app'))["token"];
      
      // Fetch unread notifications
      const response = await fetch(myConstant + '/api/user/notifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      console.log(data)
      setNotifications(data.data); // Adjust based on your backend response structure

      // Optionally fetch read notifications if needed
      const responseV2 = await fetch(myConstant + '/api/user/notifications/read', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!responseV2.ok) {
        throw new Error('Failed to fetch read notifications');
      }

      
      setError(null);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  const deleteNotification = async (notificationId) => {
    const token = JSON.parse(localStorage.getItem('events-app'))["token"];

    try {
      const response = await fetch(`${myConstant}/api/user/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
      // Remove the deleted notification from the state
      setNotifications(notifications.filter(notification => notification._id !== notificationId));
      toast.success("Notification Deleted.");

    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);
  return (
    <>
        <Navbar />
        <div className="p-6 flex justify-center">
            <div className='p-4'>
            <h1 className="text-2xl font-bold text-center mb-6">Notifications</h1>

            {loading && (
              <div className="flex flex-col justify-center items-center">
                <img src={loadingGif} width={50} alt="loading..." />
                <p className="text-blue-500">Getting notifications</p>
              </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
                </div>
            )}

            {!loading && !error && notifications.length === 0 && (
                <p className="text-center text-gray-700">No notifications available.</p>
            )}

            

            <div className="flex flex-col mt-11 items-center justify-center gap-4">
                {notifications.map((notification) => (
                <div key={notification.event_id.event_id} className="bg-white p-4 w-full sm:w-8/12 rounded-lg shadow">
                    <h2 className="font-semibold text-blue-600">{notification.event_id.title}</h2>
                    <p className="text-gray-700 text-sm md:text-base">{notification.message}</p>
                    <div className="flex justify-center gap-2 sm:gap-4">
                      <Link to={`/events/${notification.event_id.event_id}`}>
                          <button className="mt-2 text-sm sm:text-base bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
                          View Event
                          </button>
                      </Link>
                      <button 
                          onClick={() => deleteNotification(notification._id)} 
                          className="mt-2 text-sm sm:text-base bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                      >
                          Delete
                      </button>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
    </>
  );
};

export default Notification;
