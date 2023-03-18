import { cleanEnv, str, port } from 'envalid';

function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({choices: ['development', 'production']}),
        MONGO_PASSWORD: str(),
        MONGO_USER: str(),
        MONGO_PATH: str(),
        PORT: port({default: 6262}),
        ACCESS_TOKEN_PRIVATE_KEY: str(),
        ACCESS_TOKEN_PUBLIC_KEY: str(),
        REFRESH_PRIVATE_KEY: str(),
        REFRESH_PUBLIC_KEY: str(),
    })
}
export default validateEnv;