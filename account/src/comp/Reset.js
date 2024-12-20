import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { resetpass, resetOtpCheck, reset } from './AuthService';
import Toast, { Toaster } from 'react-hot-toast';

export default function Reset() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [password2, setPassword2] = useState('');
    const [otppage, setOtppage] = useState(0);
    const [otp, setOtp] = useState('');

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
        }
        try {
            const response = await Toast.promise(
                resetpass(email),
                {
                    loading: 'checking email...', // Optional loading message
                    success: 'Enter OTP',
                    error: 'Invalid User.',
                }
            );

            if (response.data.success) {
                setOtppage(1);
            }
        } catch (error) {
        }
    };
    const handleOtp = async () => {
        try {
            const response = await Toast.promise(
                resetOtpCheck(otp, email),
                {
                    loading: 'Checking...', // Optional loading message
                    success: 'Verified!',
                    error: 'Enter a valid OTP',
                }
            );
            if (response.data.success) {
                setOtppage(2);
            }
        } catch (error) {
        }
    };
    const handleReset = async () => {
        if (password.length < 8) {
            Toast.error('Enter 8 digit password');
            return;
        } else if (password !== password2) {
            Toast.error('Both password are not same');
            return;
        };
        try {
            const response = await Toast.promise(
                reset(otp, email, password),
                {
                    loading: 'Checking...', // Optional loading message
                    success: 'Password changed!',
                    error: 'User Invalid',
                }
            );
            if (response.data.success) {
                setTimeout(() => {
                    window.location.href = process.env.REACT_APP_PUBLIC_URL + "/login";
                }, 500);
            }
        } catch (error) {
        }
    };
    return (
        <div className='loginSign'>
            <div className="form login">
                {otppage === 2 ? (
                    <div className="form-content">
                        <header>Set Password</header>
                        <div className="field input-field">
                            <input type={showPassword ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)} placeholder="Set password" className="password" />
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
                            <button onClick={handleReset}>Set Password</button>
                        </div>

                        <div className="form-link">
                            <span>Don't have an account? <Link to="/signup" className="link signup-link">Signup</Link></span>
                        </div>
                    </div>
                ) : (<></>)}
                {otppage === 1 ? (
                    <div className="form-content">
                        <header>Reset Password</header>
                        <center style={{ marginTop: "10px" }}>Enter OTP (sent on mail)</center>
                        <div className="field input-field">
                            <input type="text" name="otp" onChange={(e) => setOtp(e.target.value)} placeholder="OTP" value={otp} />
                        </div>
                        <div className="field button-field">
                            <button onClick={handleOtp}>Verify OTP</button>
                        </div>
                    </div>
                ) : (<></>)}
                {otppage === 0 ? (
                    <div className="form-content">
                        <header>Reset Password</header>
                        <div className="field input-field">
                            <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input" />
                        </div>

                        <div className="field button-field">
                            <button onClick={handleLogin}>Send OTP</button>
                        </div>

                        <div className="form-link">
                            <span>Don't have an account? <Link to="/signup" className="link signup-link">Signup</Link></span>
                        </div>
                    </div>
                ) : (<></>)}
            </div>
            <div><Toaster
                position="top-center"
                reverseOrder={false}
            /></div>
        </div>
    )
}
