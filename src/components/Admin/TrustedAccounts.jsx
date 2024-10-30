import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { myConstant } from '../../const/const';
import { XIcon } from 'lucide-react';
import loadingGif from '../../assets/loading.gif';

const UserAccount = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(myConstant + '/api/user/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('events-app'))['token']}`,
          },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const updateUserRole = async (role) => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('events-app'))['token'];
      const response = await fetch(myConstant + `/api/user/${selectedUser._id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        toast.error('Error updating user role');
        throw new Error('Error updating user role');
      }

      const data = await response.json();
      setSelectedUser(data);
      const me_id = JSON.parse(localStorage.getItem('events-app'))['id'];
      const updatedUsers = users.map((user) => (user._id === data._id ? data : user));
      if (me_id === data._id) {
        localStorage.setItem("events-app", JSON.stringify({ token, role: data.role, id: me_id }));
        window.location.reload();
      }
      setUsers(updatedUsers);
      toast.success('User role changed successfully');
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColorClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-[#22313f]';
      case 'organizer':
        return 'bg-[#6ec189]';
      case 'user':
        return 'bg-[#00bbf0]';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`container mx-auto bg-white ${getRoleColorClass(selectedUser?.role)} p-4 rounded-lg`}>
      <h1 className="text-3xl text-center text-blue-500 font-bold mb-4">User Management</h1>
      {loading ? (
        <div className="flex flex-col justify-center items-center">
          <img src={loadingGif} width={50} alt="loading..." />
          <p className="text-blue-500">Getting all users</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {users.length > 0 &&
            users.map((user) => (
              <div
                key={user._id}
                onClick={() => openModal(user)}
                className={`p-2 ${getRoleColorClass(user.role)} shadow-md rounded-lg flex items-center space-x-4 cursor-pointer transition duration-150 ease-in-out`}
              >
                <img
                  src={user.profile_picture || '/default-avatar.png'}
                  alt={user.fullname}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <span className="text-base font-semibold text-white">{user.fullname}</span><br />
                  <small className="text-xs text-gray-200">{user.email}</small><br />
                  <small className="text-xs font-semibold text-white">
                    Role: {user.role}
                  </small>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">User Details</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-800">
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <img
              src={selectedUser.profile_picture || '/default-avatar.png'}
              alt={selectedUser.fullname}
              className="w-32 h-32 rounded-full object-cover mx-auto my-4"
            />
            <p>
              <strong>Full Name:</strong> {selectedUser.fullname}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Role:</strong>{' '}
              <span className={`${getRoleColorClass(selectedUser.role)} text-white`}>
                {selectedUser.role}
              </span>
            </p>
            <p>
              <strong>About:</strong> {selectedUser.about || 'No about available.'}
            </p>
            <div className="mt-4 space-y-2">
              <button
                className="w-full bg-[#6ec189] text-white py-2 rounded-lg"
                onClick={() => updateUserRole('organizer')}
              >
                Make Organizer
              </button>
              <button
                className="w-full bg-[#00bbf0] text-white py-2 rounded-lg"
                onClick={() => updateUserRole('user')}
              >
                Make User
              </button>
              <button
                className="w-full bg-[#22313f] text-white py-2 rounded-lg"
                onClick={() => updateUserRole('admin')}
              >
                Make Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccount;
