import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

const startServer = async () => {
  console.log("⏳ Connecting to Database...");
  await connectDB();
  console.log("✅ MongoDB successfully connected!");
  
  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
};

startServer();