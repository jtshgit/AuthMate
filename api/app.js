// app.js

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./model/user');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const loginController = require('./controllers/registration/login');
const signinController = require('./controllers/registration/signin');
const resetPassController = require('./controllers/registration/resetPass');
const axios = require('axios');

// Initialize the app
const app = express();
dotenv.config();

// Set up middlewares
app.use(cookieParser());
app.use(bodyParser.json());
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));

// Set up express-session for Passport
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, httpOnly: true },  // Set secure: true in production for HTTPS
    })
);

// Initialize Passport.js session support
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Passport Google OAuth Setup
passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5001/auth/google/callback',  // Match this URL with Google Console
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if the user exists
            const existingUser = await User.findOne({ email: profile.emails[0].value });

            if (existingUser) {
                existingUser.googleId = profile.id;
                existingUser.name = profile.displayName;
                existingUser.profilePhoto = profile.photos[0]?.value;
                await existingUser.save();
                return done(null, existingUser);
            }

            // Create a new user if not found
            const newUser = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                profilePhoto: profile.photos[0]?.value,
            });

            await newUser.save();
            done(null, newUser);
        } catch (err) {
            done(err, null);
        }
    }
));

// Serialize user to store in session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google Login Route
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

// Google Callback Route
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), async (req, res) => {
    try {
        const user = req.user;
        
        // JWT Authentication
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email, pp: user.profilePhoto },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set JWT token in cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set true in production for HTTPS
            sameSite: 'Lax',
        });

        // Respond with success
        res.redirect('/auth/success');
    } catch (err) {
        console.error('Error during Google callback:', err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.get('/auth/success', (req, res) => {
    res.send(`
      <script>
        window.opener.postMessage('success', window.location.origin);
        window.close();
      </script>
    `);
  });
  
// Example protected route that requires authentication via JWT
app.get('/protected', loginController.protected);
// Registration and Login routes (use your existing logic)
app.post('/register', signinController.register);
app.post('/otpcheck', signinController.otpCheck);
app.post('/login', loginController.login);
app.post('/logout', loginController.logout);

// Reset Password routes (use your existing logic)
app.post('/resetpass', resetPassController.resetPass);
app.post('/resotpcheck', resetPassController.resetOtpCheck);
app.post('/resetconfirm', resetPassController.resetConfirm);

app.get('/proxy-image', async (req, res) => {
    const imageUrl = req.query.url;  // URL to the image (passed as query parameter)
    
    if (!imageUrl) {
        return res.status(400).send('Image URL is required');
    }

    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        
        // Set appropriate headers for image type
        const contentType = response.headers['content-type'];
        res.set('Content-Type', contentType);

        // Send the image as a response
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Failed to load image');
    }
});
// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
