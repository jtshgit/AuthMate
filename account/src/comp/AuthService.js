import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const register = async (name, email, password) => {
    return await axios.post(`${API_URL}/register`, { name, email, password }, { withCredentials: true });
};
export const sendOtp = async (email) => {
    return await axios.post(`${API_URL}/sendOtp`, { email }, { withCredentials: true });
};
export const resetpass = async (email) => {
    return await axios.post(`${API_URL}/resetpass`, { email }, { withCredentials: true });
};
export const reset = async (otp, email, password) => {
    return await axios.post(`${API_URL}/resetconfirm`, { otp, email, password }, { withCredentials: true });
};
export const resetOtpCheck = async (otp, email) => {
    return await axios.post(`${API_URL}/resotpcheck`, { otp, email }, { withCredentials: true });
};
export const login = async (email, password) => {
    return await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });
};
export const otpCheck = async (otp, email) => {
    return await axios.post(`${API_URL}/otpcheck`, { otp, email }, { withCredentials: true });
};
export const logout = async () => {
    return await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
};

export const getProtected = async () => {
    return await axios.get(`${API_URL}/protected`, { withCredentials: true });
};
