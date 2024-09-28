import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../utils/auth';
import { useAuthContext } from '../context/AuthContext.jsx';
import { myConstant } from '../const/const.js';

const Signup = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const { setAuthUser } = useAuthContext();

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Password strength validation
        const passwordValidationError = validatePassword(password);
        if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            return;
        }
        setPasswordError('');

        // Check if passwords match
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch(myConstant + '/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullname:`${firstName} ${lastName}`, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            toast.success('Signup successful! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.message);
        }
    };
    const handleGoogleLogin = async () => {
        await signInWithGoogle(setAuthUser);
      };

    return (
        <div className="h-screen w-screen align-content-center">
            <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-lg lg:max-w-7xl">
                <div className="hidden lg:block lg:w-10/12 bg-cover"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80')"
                    }}>
                </div>
                <div className="w-full p-8">
                    <h2 className="text-2xl font-semibold text-center text-blue-500">Join Around Campus 🏫</h2>
                    <p className="text-xl text-gray-600 text-center">Create your account</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                                <input
                                    placeholder='First Name'
                                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
                                <input
                                    placeholder='Last Name'
                                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                            <input
                                placeholder='Email'
                                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                                <input
                                    placeholder='Password'
                                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                                <input
                                    placeholder='Confirm Password'
                                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {passwordError && (
                            <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                        )}

                        <div className="mt-8">
                            <button
                                type="submit"
                                className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600"
                            >
                                Sign Up
                            </button>
                        </div>

                        <div className="flex justify-center m-4 gap-1">
                            Already have an account? 
                            <Link to={"/login"} className='text-blue-500'> Login here </Link>
                        </div>

                        <div className="mt-4 flex gap-3 items-center justify-between">
                            <span className="border-b w-10/12 lg:w-10/12"></span>
                            <b className="text-xs text-center text-gray-500 uppercase">or</b>
                            <span className="border-b w-10/12 lg:w-10/12"></span>
                        </div>

                        <div className="mt-4">
                            <div className="block mb-3">
                                <button
                                    onClick={handleGoogleLogin}
                                    type="button"
                                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-[18px] w-[18px]" />
                                    Continue with Google
                                </button>
                            </div>

                            <div className="block">
                                <button
                                    onClick={handleGoogleLogin}
                                    type="button"
                                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="h-[18px] w-[18px]" />
                                    Continue with GitHub
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;
