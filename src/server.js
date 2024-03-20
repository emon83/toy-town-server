import mongoose from "mongoose";
import app from "./app.js";
import config from "./app/config/config.js";

async function main() {
    try {
      await mongoose.connect(config.database_url);
  
      app.listen(config.port, () => {
        console.log(`app is listening on port ${config.port}`);
      });
    } catch (error) {
      console.log(error);
    }
  }

main();