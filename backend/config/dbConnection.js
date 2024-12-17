const mongoose = require("mongoose");

const DBConnection = async () => {
  await mongoose
    .connect(process.env.DBUri)
    .then(() => {
      console.log("Database is connected successfully");
    })
    .catch((err) => {
      console.log("Database is not connected", err);
    });
};

module.exports = DBConnection;
