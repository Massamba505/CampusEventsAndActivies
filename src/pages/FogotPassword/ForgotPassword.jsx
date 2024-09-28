import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { myConstant } from "../../const/const";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!email) {
            setEmailError('Please provide a valid email address');
            return;
        }

        try {
            const response = await fetch(myConstant + '/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send password reset email');
            }

            // Show success toast and navigate to enter code page
            toast.success('Check your email for the reset code!');
            navigate(`/enter-code/${email}`);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <div className="w-full max-w-md p-6">
                <div className="mt-7 bg-white rounded-xl shadow-lg border-2">
                    <div className="p-4 sm:p-7">
                        <div className="text-center">
                            <h1 className="block text-2xl text-black">Forgot password?</h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Remember your password?{' '}
                                <a className="text-blue-600 decoration-2 hover:underline font-medium" href="/login">
                                    Login here
                                </a>
                            </p>
                        </div>

                        <div className="mt-0">
                            <form onSubmit={handleForgotPassword}>
                                <div className="grid gap-y-4">
                                    <div>
                                        <div className="mt-4">
                                            <label className="block text-gray-700 fw-bold text-m mb-2">Email Address</label>
                                            <input
                                                placeholder='email'
                                                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                                type="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    setEmailError('');
                                                }}
                                                required
                                            />
                                        </div>
                                        {emailError && (
                                            <p className="text-red-600 mt-2">
                                                {emailError}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-m"
                                    >
                                        Reset password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
