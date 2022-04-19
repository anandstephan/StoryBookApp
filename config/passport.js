const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID:'305541932078-imsj2q35l3ot9rilhnknrlgm43ol1gba.apps.googleusercontent.com',
        clientSecret:'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',
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
