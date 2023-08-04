require("dotenv").config();

var options = {
  host: process.env.MCHOST,
  port: 30180,
  username: process.env.MCUSERNAME,
  version: "1.16.5",
};

module.exports = { options };