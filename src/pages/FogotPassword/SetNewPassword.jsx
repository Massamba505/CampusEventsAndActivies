import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { myConstant } from '../../const/const';

const SetNewPassword = () => {
    const { userId } = useParams();  // Get userId from route params
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Password strength validation function
    const validatePassword = (password) => {
        const minLength = 4;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);

        if (password.length < minLength) {
            return `Password should be at least ${minLength} characters long.`;
        } else if (!hasUppercase) {
            return 'Password should contain at least one uppercase letter.';
        } else if (!hasLowercase) {
            return 'Password should contain at least one lowercase letter.';
        } else if (!hasDigit) {
            return 'Password should contain at least one number.';
        } else if (!hasSpecialChar) {
            return 'Password should contain at least one special character.';
        }
        return '';
    };
    
    const handleSubmit = async () => {
        
        // Password strength validation
        const passwordValidationError = validatePassword(newPassword);
        if (passwordValidationError) {
            toast.error(passwordValidationError);
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(myConstant + '/api/auth/set-new-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update the password');
            }

            toast.success('Password updated successfully!');
            navigate('/login');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-center text-2xl font-bold text-blue-600 mb-4">Set New Password</h2>
                <p className="text-gray-600 text-center mb-6">Enter your new password below</p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 w-full px-4 bg-white  py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        type="button"
                        className={`w-full py-2 px-4 rounded-md font-bold text-white ${
                            isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Setting Password...' : 'Set New Password'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SetNewPassword;
