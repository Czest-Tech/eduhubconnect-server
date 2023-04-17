var GoogleStrategy = require('passport-google-oauth20').Strategy;
import SessionController from "../resources/sessions/session.controller";
import { User } from "../resources/user/user.interface";
import { Types } from "mongoose";
import passport from "passport"
import UserModel from '../resources/user/user.model';
import UserService from "../resources/user/user.service";

const userMode = UserModel;
const userServices = new UserService()
const sessionHandler = new SessionController();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
  function (accessToken: any, refreshToken: any, profile: any, cb: any) {

    if (profile) {
      let newUser = {
        email: profile.emails[0].value,
        isEmailVerified: profile.emails[0].verified,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        accountType:1,
        profileSource: "external",
        profilePhotoSource: "external",
        profilePhoto: profile.photos[0],
        profileCoverPhoto: [],
        providerId: profile.id,
        provider: profile.provider,
        googleId: profile.id,
        password: "1234"
      }


      userMode.find({$or:[{ googleId: profile.id}, {email:newUser.email} ]} , async function (err: any, user: any) {
        if (user.length !== 0) {
          console.log(user)
          const createUserSession = await sessionHandler.CreateUserSession(user[0], " ")
          user.push(createUserSession)
          return cb(err, user);
        } else {
          try {
            let newObj: (User & { _id: Types.ObjectId; })[] = []
            userMode.create(newUser).then(async (done: any) => {

              let userSettings = {
                "userId": done._id,
                "notificationSettings": [
                  {
                    "name": "Send Promitions to via sms", "value": false
                  },
                  {
                    "name": "Receive monthly news letter to my email", "value": true
                  },
                  {
                    "name": "Enable notification sound", "value": false
                  }
                ],
                "notificationPrivacySettings": [
                  {
                    "name": "Show My Profile", "value": false
                  },
                  {
                    "name": "Find me on Google", "value": true
                  },
                  {
                    "name": "Share my location", "value": false
                  },
                  {
                    "name": "Find me by EMail Address", "value": false
                  }
                ]

              }
              const updateUserSettings = await userServices.createOrupdateUserSettings({ userId: done._id }, userSettings)
              const createUserSession = await sessionHandler.CreateUserSession(done, " ")
              newObj.push(createUserSession)
              newObj.push(done)

              return done
            })

            return cb(err, ...newObj);
          } catch (err: any) {
            console.log(err)
          }

        }

      })
    }
  }
));


passport.serializeUser((user: any, done: any) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
  done(null, user);
});