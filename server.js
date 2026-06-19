import "dotenv/config";

import app from "./src/app.js";

// PORT
const PORT = process.env.PORT || 5000;

const start = async () => {
  // connect to DB

  app.listen(PORT, () => {
    console.log(`Server is running at ${PORT} in ${process.env.NODE_ENV} mode`);
  });
};

start().catch((error) => {
  console.log("Failed to start server ", error);
  process.exit(1);
});
