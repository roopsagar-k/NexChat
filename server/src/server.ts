import { serverConfig } from "./config";
import { app } from "./app";
import connectDB from "./database";

const startServer = async () => {
  await connectDB();
  app.listen(serverConfig.apiPort, () => {
    console.log("Server is running at the port *:" + serverConfig.apiPort);
  });
};
startServer();
