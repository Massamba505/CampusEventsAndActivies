import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { myConstant } from '../../const/const';

const CodeInput = () => {
    const { email } = useParams();
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (value, index) => {
        // Only allow numeric input and move to next input after entering a digit
        if (/^[0-9]$/.test(value) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move to next input if value is filled
            if (value !== '' && index < 3) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const otpCode = otp.join('');

        try {
            const response = await fetch(myConstant + `/api/auth/reset-password/${otpCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to verify the code');
            }

            // On success, navigate to set new password page
            toast.success('OTP verified successfully!');
            navigate(`/set-new-password/${data.userId}`);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = () => {
        // Logic to resend OTP (not implemented yet)
        toast('Resending OTP...');
        handleResendCode();
    };

    const handleResendCode = async () => {

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
            navigate('/enter-code');
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-center text-2xl font-semibold text-blue-600 mb-6">
                    We’ve sent a 4-digit code to your email
                </h2>

                <p className="text-gray-600 text-center">Enter 4-Digit Code</p>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex justify-center gap-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-input-${index}`}
                                className="w-14 bg-white h-14 text-center border-2 rounded-lg border-blue-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-2xl"
                                type="text"
                                value={digit}
                                maxLength="1"
                                pattern="[0-9]"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                onChange={(e) => handleChange(e.target.value, index)}
                                required
                            />
                        ))}
                    </div>
                    <div className="flex flex-col items-center space-y-4">
                        <button
                            type="button"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Verifying...' : 'Verify'}
                        </button>
                        <button
                            type="button"
                            className="text-blue-600 hover:text-blue-500 font-semibold cursor-pointer"
                            onClick={handleResend}
                        >
                            Resend OTP
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CodeInput;
