import bycrpt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "config"
import HttpException from "./exceptions/http.exception";
import { random } from "lodash";

class HashKeys {
    
    private makeHashId (legnth:number): string {
        let result:string = '';
        const characters =  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;  

        for ( var i = 0; i < charactersLength; i++ ) {
            result = result + characters.charAt(Math.floor(Math.random() *  charactersLength));
        }
        return result;

    }
    public hashPassword = async(password: string) => {
        var converted_pass;
       await bycrpt.hash(password, 12).then(hash => {
          converted_pass = hash;
      });
        return converted_pass;
    }
    public checkPasswordHash = async(password:string,hashedPassword:string):Promise<boolean> => {
         console.log("raw password", password, "hASHED FROM DB", hashedPassword)
      const isMatched =  await bycrpt.compare(password, hashedPassword)
     
         return isMatched;
    }
    public hashSession = async(session:string = this.makeHashId(5)):Promise<string> => {
        var converted_session:string = '';
        await bycrpt.hash(session, 12).then(hash => {
            converted_session = hash;
        });
        return converted_session;
    }

    async signJwt( object : object, keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey", options?: jwt.SignOptions | undefined) {

        const siginingKey = Buffer.from(config.get<string>(keyName), "base64").toString("ascii");

        return jwt.sign(object, siginingKey, {...(options && options), algorithm:"RS256"});
    }
    async verifyJwt( token : string, keyName: "accessTokenPrivateKey" | "refreshPrivateKey"): Promise<{
        valid: boolean,
        expired: any,
        decoded: any,
      }> {

        const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString("ascii");

        try{ 
            const decoded = jwt.verify(token,publicKey);
            return { valid: true, expired: false, decoded};
        } catch(e:any){
            console.log(e)
            return {
                valid: false,
                expired: e.message === "jwt expired",
                decoded: null,
              };
        }
    }
    public  slugify(string:string): string{
        return string
          .toString()
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "")
          .replace(/\-\-+/g, "-")
          .replace(/^-+/, "")
          .replace(/-+$/, "");
    }

    public generateKey(length:number = 6, type="mixed"){
        var result           = '';
        var characters       = type === "mixed" ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' : '0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    


}

export default HashKeys



