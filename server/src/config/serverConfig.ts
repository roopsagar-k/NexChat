import dotenv from "dotenv";

dotenv.config();

export const serverConfig = {
    apiPort: process.env.API_PORT || 3000,
    socketPort: process.env.SOCKET_PORT || 3001,
}