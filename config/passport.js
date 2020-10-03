const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID:'82550139996-mcmparndg5jba5i0th5n348s9bsvie28.apps.googleusercontent.com',
        clientSecret:'NR36GrVDd8Gb0RJg-wxjoBzX',
        callbackURL:'/auth/google/callback',
        proxy:true
    },
    async(accessToken,refreshToken,profile,done) =>{
        // console.log(accessToken+"--"+refreshToken+"--"+profile+"--"+done);
      const newUser  = {
        googleId:profile.id,
        displayName : profile.displayName,
        firstName:profile.name.givenName,
        lastName:profile.name.familyName,
        image:profile.photos[0].value
      }

      try{
        let user = await User.findOne({googleId:profile.id})        
        if(user){
          done(null,user)
        }else{

          user = await User.create(newUser);
          done(null,user)

        }
      }
      catch(err){
        console.error(err)
      }
    }))
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}
