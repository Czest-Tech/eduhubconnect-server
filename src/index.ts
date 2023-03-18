
import 'dotenv/config';
require('module-alias/register');
import validateEnv  from './utils/validateEnv';
import App from './app';
import UserController from './resources/user/user.controller';
import AuthController from './resources/auth/auth.controller';
import UploadsController from './resources/uploads/uploads.controller';
import MessagesController from './resources/messages/messages.controller';

"use strict mode"
validateEnv();

const app = new App([
    new UserController(), 
    new AuthController(),
    new MessagesController(),
    new UploadsController()
], Number(process.env.PORT))

app.listen()

