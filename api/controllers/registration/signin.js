const User = require('../../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER, // Your email from environment variables
        pass: process.env.EMAIL_PASS, // Your app password from environment variables
    },
});

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase() });

        // Check if the user already exists
        if (user) {
            if (user.confirm === 1) {
                return res.status(400).json({ success: false, error: 'Email already exists' });
            } else {
                await User.deleteOne({ email: email.toLowerCase() });
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a random OTP
        const otp = Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111;

        // Email options
        const mailOptions = {
            from: '"Tradly" <no-reply@tradly.in>', // Sender address
            to: email.toLowerCase(), // List of receivers
            subject: 'Your One-Time Password (OTP) for Verification',
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;}
                    .container {width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);}
                    .header {text-align: center; padding: 10px 0; border-bottom: 1px solid #e0e0e0;}
                    .header h1 {margin: 0; color: #333333;}
                    .content {padding: 20px;}
                    .content p {font-size: 16px; color: #333333;}
                    .otp {font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; color: #333333;}
                    .footer {text-align: center; font-size: 14px; color: #666666; padding: 10px 0; border-top: 1px solid #e0e0e0;}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header"><h1>Tradly</h1></div>
                    <div class="content">
                        <p>Dear ${name},</p>
                        <p>We have received a request to verify your email address for Tradly. Please use the following One-Time Password (OTP) to complete your verification process:</p>
                        <div class="otp">${otp}</div>
                        <p>This OTP is valid for the next 10 minutes. Please do not share this OTP with anyone for security reasons. If you did not request this verification, please ignore this email.</p>
                        <p>If you have any questions or need further assistance, please contact our support team.</p>
                        <p>Thank you for using Tradly.in.</p>
                    </div>
                    <div class="footer">
                        <p>Best regards,<br>Tradly Support Team<br>mail@tradly.in</p>
                    </div>
                </div>
            </body>
            </html>
            `,
        };

        // Send email
        const emailSent = await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) return reject(error);
                resolve(info);
            });
        });

        // Save the new user
        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            otp,
        });

        await newUser.save();

        // Respond after successful email and user creation
        res.status(201).json({ success: true, message: 'Registration successful. OTP sent.' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};


exports.otpCheck = async (req, res) => {
    const { otp, email } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ success: false, error: 'Invalid username or password' });
        // console.log(otp + user.otp)
        if (otp === user.otp) {
            await User.updateOne({ email: email.toLowerCase() }, { $set: { confirm: 1 } });
            const token = jwt.sign({ id: user._id.toString(), name: user.name, email: user.email, pp: user.profilePhoto }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Lax', domain: process.env.COOKIE_DOMAIN });
            res.json({ success: true, message: 'Login successful' });
        } else {
            return res.status(400).json({ success: false, error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during Checking OTP:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};