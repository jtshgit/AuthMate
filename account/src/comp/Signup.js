import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { register, otpCheck, getProtected } from './AuthService';
import Toast, { Toaster } from 'react-hot-toast';

export default function Signup() {
    const location = useLocation();
    const redirectPath = new URLSearchParams(location.search).get("redirect") || process.env.REACT_APP_PUBLIC_URL + "/settings";
    const verifyUser = async () => {
        try {
            const response = await getProtected();
            if (response.data.success) {
                window.location.href = process.env.REACT_APP_PUBLIC_URL + "/settings?redirect=" + redirectPath;
            } else {

            }
        } catch (error) {
        }
    };
    verifyUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otppage, setOtppage] = useState(false);
    const [otp, setOtp] = useState('');
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const validateEmail = (email) => {
        // Regular expression for email validation
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleRegister = async () => {
        if (name.length < 3) {
            Toast.error('Enter a valid Name');
            return;
        } else if (!validateEmail(email)) {
            Toast.error('Enter a valid Email');
            return;
        } else if (password.length < 8) {
            Toast.error('Enter 8 digit password');
            return;
        } else if (password !== password2) {
            Toast.error('Both password are not same');
            return;
        };
        try {
            await Toast.promise(
                register(name, email, password),
                {
                    loading: 'Loading...', // Optional loading message
                    success: 'Email sent!',
                    error: 'Email is already registed.',
                }
            );
            setOtp('')
            setOtppage(true)
        } catch (error) {
            // Toast.error('Error registering user!');
        }
    };
    const handleOtp = async () => {
        try {
            const response = await Toast.promise(
                otpCheck(otp, email),
                {
                    loading: 'Checking...', // Optional loading message
                    success: 'Verified!',
                    error: 'Enter a valid OTP',
                }
            );
            if (response.data.success) {
                setTimeout(() => {
                    window.location.href = redirectPath;
                }, 500);
            }
        } catch (error) {
        }
    };

    const handleGoogleLogin = async () => {

        const loginPromise = Toast.promise(
            new Promise((resolve, reject) => {
                const loginWindow = window.open(
                    process.env.REACT_APP_API_URL + `/auth/google`,
                    '_blank',
                    'width=500,height=600'
                );

                const interval = setInterval(() => {
                    if (loginWindow.closed) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 1000);
            }),
            {
                loading: 'Redirecting to Google login...',
                success: 'Login process completed!',
                error: 'Something went wrong!',
            }
        );
        try {
            await loginPromise;
            // Now, check if the user is verified
            verifyUser();
        } catch (error) {
            console.error('Login process failed', error);
        }
    };
    return (
        <div className='loginSign'>
            <div className="form signup">
                {otppage ? (
                    <div className="form-content">
                        <header>Signup</header>
                        <center style={{ marginTop: "10px" }}>Enter OTP (sent on mail)</center>
                        <div className="field input-field">
                            <input type="text" name="otp" onChange={(e) => setOtp(e.target.value)} placeholder="OTP" value={otp} />
                        </div>
                        <div className="field button-field">
                            <button onClick={handleOtp}>Sign Up</button>
                        </div>
                    </div>
                ) : (
                    <div className="form-content">
                        <header>Signup</header>
                        <div className="field input-field">
                            <input onChange={(e) => setName(e.target.value)} type="text" placeholder="Name" className="input" />
                        </div>
                        <div className="field input-field">
                            <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="input" />
                        </div>

                        <div className="field input-field">
                            <input type={showPassword ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)} placeholder="Create password" className="password" />
                        </div>

                        <div className="field input-field">
                            <input type={showPassword ? 'text' : 'password'} onChange={(e) => setPassword2(e.target.value)} placeholder="Confirm password" className="password" />
                        </div>
                        <div className="checkboxdiv">
                            <input id='show' type='checkbox'
                                checked={showPassword}
                                onChange={togglePasswordVisibility} />
                            <label for="show">Show Password</label>
                        </div>

                        <div className="field button-field">
                            <button onClick={handleRegister}>Signup</button>
                        </div>

                        <div className="form-link">
                            <span>Already have an account? <Link to={"/login?redirect=" + redirectPath} className="link login-link">Login</Link></span>
                        </div>
                    </div>
                )}
                <div className="line"></div>

                <div className="media-options">
                    <button onClick={handleGoogleLogin} className="field google">
                        <img src="img/googleLogo.png" alt="" className="google-img" />
                        <span>Login with Google</span>
                    </button>
                </div>

            </div>

            <div><Toaster
                position="top-center"
                reverseOrder={false}
            /></div>
        </div>
    )
}
