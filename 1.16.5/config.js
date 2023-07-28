require("dotenv").config();

var options = {
  host: process.env.MCHOST,
  port: 4042,
  username: process.env.MCUSERNAME,
  version: "1.16.5",
};

module.exports = { options };