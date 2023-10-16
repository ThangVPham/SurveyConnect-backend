import "dotenv/config";
import mongoose from "mongoose";

export default function ConnectToDb() {
  const DB_STRING = process.env.DB_CONNECTION_STRING;
  mongoose
    .connect(DB_STRING)
    .then(() => {
      console.log("Database Connected");
    })
    .catch((e: Error) => {
      console.log(`${e.name} - ${e.message}`);
    });
}
