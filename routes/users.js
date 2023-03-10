const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.get('/profile/friends/send-request/:id', passport.checkAuthentication, usersController.sendFriendRequest);
router.get('/profile/friends/accept-request/:id', passport.checkAuthentication, usersController.acceptFriendRequest);
router.get('/profile/friends/cancel-request/:id', passport.checkAuthentication, usersController.removeFriendRequest);

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);


router.post('/create', usersController.create);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), usersController.createSession);


router.get('/sign-out', usersController.destroySession);

//google auth
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);

// Github oAuth
router.get('/auth/github', passport.authenticate('github', {scope:  [ 'user:email' ] }));
router.get('/auth/github/callback', passport.authenticate('github',
             {failureRedirect: '/users/sign-in'}), usersController.createSession);



module.exports = router;