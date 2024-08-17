
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register', { errors: [] }));

// Register Handle
router.post('/register', async (req, res) => {
  console.log('Register POST route received');
  const { name, email, password, password2 } = req.body;
  console.log(req.body);

  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  // Check pass length
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if (errors.length > 0) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    try {
      // Validation passed
      const user = await User.findOne({ email: email });
      console.log('User query result:', user);
      if (user) {
        errors.push({ msg: 'Email is already registered' });
        return res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);

        // Save user
        await newUser.save();

        // Authenticate user after successful registration
        req.login(newUser, (err) => {
          if (err) {
            console.error('Error logging in after registration:', err);
            return res.render('register', {
              errors: [{ msg: 'An error occurred during login. Please try again.' }],
              name,
              email,
              password,
              password2
            });
          }
          res.redirect('/');
        });
      }
    } catch (err) {
      console.error('Error during registration:', err);
      res.render('register', {
        errors: [{ msg: 'An error occurred during registration. Please try again.' }],
        name,
        email,
        password,
        password2
      });
    }
  }
});

// Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

module.exports = router;
