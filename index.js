const app = require("./app");
// const connectDatabase = require("./db/Database");
const db= require('./model/index')
require("dotenv").config()

// Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception`);
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  
}


// connect db
// connectDatabase();
db.sequelize.sync({force:false})
  .then(() => {
    console.log("Database connected...");
  })
  .catch((err) => {
    console.log("DB connection Failed...: " + err.message);
  });
  



// create server
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT}`
  );
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});