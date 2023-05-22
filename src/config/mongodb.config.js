const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const serverDbUrl = process.env.SERVER_DB;

if (!serverDbUrl) {
  console.error("Missing SERVER_DB environment variable");
  process.exit(1);
}

mongoose.connect(serverDbUrl);

const conn = mongoose.connection;

conn.on("error", (error) => {
  console.error("Database Connection Error:", error.message);
});

conn.on("open", () => {
  console.log("Database Connection Established");
});
