import { Schema, model } from "mongoose";
import {Session} from "./session.interface";


const SessionModel = new Schema (
      {
          user: {type: Schema.Types.ObjectId, ref:"User"},
          valid: {type: Boolean, default:true},
          userAgent: {type: String},
          accessToken:{type: String},
          refreshToken:{type: String},
      },
      {
          timestamps: true
      }
)

export default model<Session>("Session", SessionModel)