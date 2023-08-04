require("dotenv").config();

var options = {
  host: process.env.MCHOST,
  port: 30180,
  username: process.env.MCUSERNAME,
  version: "1.20.1",
};

module.exports = { options };