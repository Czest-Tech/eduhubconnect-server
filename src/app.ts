import express, { Application } from "express";
import mongoose from "mongoose";
import compression from "compression";
import  cookieSession from "cookie-session";
const session = require('express-session')
require('./utils/googlePassport')
import cors from "cors";
import morgan from "morgan";
import Controller from "./utils/interfaces/controller.interface";
import ErrorMiddleware from "./middleware/error.middleware";
import helmet from "helmet";
import unsetSession from "./middleware/unsetSession.middleware";
import passport from "passport"
import { env } from "process";
class App {
 
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port:number){
     
        this.express = express();
        this.port = port;
        this.initSession()
        this.initialiseDatabaseConnection();
        this.initialiseMiddleware();
        this.validateSessions();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandling();
    }

    private initialiseMiddleware(): void {
        this.express.use(helmet({crossOriginEmbedderPolicy: false,crossOriginResourcePolicy:false}));
        this.express.use(passport.initialize());
        this.express.use(passport.session());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({extended: false}));
        this.express.use(compression());
      
    }
    private initialiseControllers(controllers: Controller[]): void {
         controllers.forEach(controller => {
             this.express.use('/api', controller.router);
         });
    }
    private initialiseErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }
    private validateSessions():void {
        this.express.use(unsetSession)
    }
    private initialiseDatabaseConnection(): void {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;

        mongoose.connect(
            `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`
            // `mongodb//${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}` ##for docker config
        );
        mongoose.set('strictQuery', false);

    }
    private initSession() {
        this.express.use( session({
            secret: env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: { secure: true }
         }))
        
    }
    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`);
        })
    }
}

export default App;
