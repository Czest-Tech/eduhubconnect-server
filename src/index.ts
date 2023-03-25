
import 'dotenv/config';
require('module-alias/register');
import validateEnv  from './utils/validateEnv';
import App from './app';
import UserController from './resources/user/user.controller';
import AuthController from './resources/auth/auth.controller';
import UploadsController from './resources/uploads/uploads.controller';
import MessagesController from './resources/messages/messages.controller';
import JobsController from './resources/jobs/jobs.controller';
import SiteContentController from './resources/site-content/site-content.controller';

"use strict mode"
validateEnv();

const app = new App([
    new UserController(), 
    new AuthController(),
    new MessagesController(),
    new UploadsController(),
    new JobsController(),
    new SiteContentController()
], Number(process.env.PORT))

app.listen()

