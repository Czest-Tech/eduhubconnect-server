import { Request, Response } from "express";
import { get } from "lodash";
import config from "config";
import SessionHandler from "./session.service"
import HashKeys from "../../utils/hashKeys";

import { User } from "../user/user.interface";
import UserService from "../user/user.service";

class SessionController {
  private sessionHandler = new SessionHandler();
  private hashKeys = new HashKeys();
  private userService = new UserService()
  async CreateUserSession(user: any, userAgent: string): Promise<any> {


    const session = await this.sessionHandler.CreateSession(user._id, userAgent);
    const { _id } = session;
    const accessToken = await this.hashKeys.signJwt({ ...user, _id }, "accessTokenPrivateKey", { expiresIn: config.get("accessTokenTtl") });
    const refreshToken = await this.hashKeys.signJwt({ ...user, _id }, "refreshTokenPrivateKey", { expiresIn: config.get("refreshTokenTtl") });
    const updateSessionData = await this.sessionHandler.UpdateSession({ user: user._id }, { valid: true, refreshToken: refreshToken, accessToken: accessToken });
    return { accessToken, refreshToken };

  }

  async getUserSessionsHandler(req: Request, res: Response) {
    const userId = res.locals.user._id;

    const sessions = await this.sessionHandler.FindSessions({ user: userId, valid: true });

    return res.status(200).json(sessions);
  }
  async getUserSession(id:any) {
    const user = await this.sessionHandler.FindSessions({ accessToken: id, valid: true });
    return user[0];
  }

  async validateAndReissueTokens(refreshToken: any, accessToken: any) {
    const sessions = await this.sessionHandler.FindSessions({ refreshToken: refreshToken, accessToken: accessToken, valid: true });
    return sessions;
  }


  async deleteSessionHandler(userId: string, refreshtoken: string) {
    const logoutUser = await this.sessionHandler.UpdateSession({ user: userId }, { valid: false, accessToken: null, refreshToken: null, });
    return logoutUser;
  }
  async reIssueToken({ refreshToken }: { refreshToken: string }) {
    const { decoded } = await this.hashKeys.verifyJwt(refreshToken, "accessTokenPrivateKey");

    if (!decoded || get(decoded, "session")) return false;

    const { _id, valid, user } = await this.sessionHandler.FindSessions(get(decoded, "session"));
    if (!_id || !valid) return false;

    const users = await this.userService.findUser({ _id: user });
    if (!users) {
      return false;
    }

    const accessToken = this.hashKeys.signJwt({ ...users, session: _id }, "accessTokenPrivateKey", { expiresIn: config.get("accessTokenTtl") });

    return accessToken;

  }
}
export default SessionController
