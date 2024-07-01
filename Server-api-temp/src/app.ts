import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { router } from "./routes/routes";
import { authroute } from "./routes/authroutes";
import { logger} from './middle/log';
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const mongoDBUrl = process.env.MONGODB_URL;

console.log(mongoDBUrl);

if (!mongoDBUrl) {
  throw new Error("MONGODB_URL environment variable is not set!");
}

mongoose.connect(mongoDBUrl)
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.error(`Error details: ${err}`));

// ? middleware log
app.use(logger);

app.use("/", router);
app.use("/users", authroute);

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
  console.log(`Server is rocking at ${PORT}`);
});
