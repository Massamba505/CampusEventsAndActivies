import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import { Button } from 'react-bootstrap';
import { myConstant } from '../../const/const';

function ChangePassword({ modalVisible, setModalVisible }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const token = JSON.parse(localStorage.getItem('events-app'))?.token;

  const handlePasswordChange = async () => {

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    if (!token) {
      toast.error('User not authenticated. Please log in again.');
      return;
    }

    try {
      const response = await fetch(`${myConstant}/api/user/new-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password.');
      }

      toast.success('Password changed successfully!');
      // Reset fields
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setModalVisible(false); // Close modal
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password.');
    }
  };

  return (
    <Dialog open={modalVisible} onClose={() => setModalVisible(false)} className="relative z-10">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex container min-h-full items-center justify-center text-center ">
          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl w-9/12 transition-all my-8 max-w-lg">
            <div className="bg-white pt-5 p-6 pb-0">
              <h3 className="font-bold text-lg">Change Password</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">Old Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value.trim())}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value.trim())}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value.trim())}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <Button onClick={handlePasswordChange} className="btn btn-primary w-full">
                  Change Password
                </Button>
              </form>
            </div>
            <div className="bg-gray-50 gap-2 py-3 flex flex-row-reverse px-6">
              <button
                type="button"
                onClick={() => setModalVisible(false)}
                className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-gray-300 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}

export default ChangePassword;
