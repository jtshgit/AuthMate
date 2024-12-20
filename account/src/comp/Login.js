import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { login, getProtected } from './AuthService';
import Toast, { Toaster } from 'react-hot-toast';


export default function Login() {
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
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const validateEmail = (email) => {
        // Regular expression for email validation
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleLogin = async () => {
        if (!validateEmail(email)) {
            Toast.error('Enter a valid Email');
            return;
        } else if (password.length < 8) {
            Toast.error('Enter 8 digit password');
            return;
        };
        try {
            const response = await Toast.promise(
                login(email, password),
                {
                    loading: 'Logging in...',
                    success: 'Done!',
                    error: 'Invalid User.',
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
            <div className="form login">
                <div className="form-content">
                    <header>Login</header>
                    <div className="field input-field">
                        <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input" />
                    </div>

                    <div className="field input-field">
                        <input type={showPassword ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="password" />
                    </div>
                    <div className="checkboxdiv">
                        <input id='show' type='checkbox'
                            checked={showPassword}
                            onChange={togglePasswordVisibility} />
                        <label for="show">Show Password</label>
                    </div>

                    <div className="form-link">
                        <Link to={"/reset?redirect=" + redirectPath} className="forgot-pass">Forgot password?</Link>
                    </div>

                    <div className="field button-field">
                        <button onClick={handleLogin}>Login</button>
                    </div>

                    <div className="form-link">
                        <span>Don't have an account? <Link to={"/signup?redirect=" + redirectPath} className="link signup-link">Signup</Link></span>
                    </div>
                </div>
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
