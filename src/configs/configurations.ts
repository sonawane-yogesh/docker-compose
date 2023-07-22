// we need to use this file for additional const / env variables
import dotenv from "dotenv";
dotenv.config();

export default {
    get port() {
        return process.env.PORT || 3000;
    },
    get host() {
        return process.env.HOST || "127.0.0.1"
    },
    get secretKey() {
        return process.env.SECRET_KEY;
    },
    get tenantSecret() {
        return process.env.TEST_TENANT_SECRET;
    }
}