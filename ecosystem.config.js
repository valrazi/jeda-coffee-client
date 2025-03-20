require("dotenv").config();
const pjson = require("./package.json");

// Ensure PORT is defined, or use a default value
const PORT = process.env.PORT || 4003;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'https://livereport.asianet.co.id'
module.exports = {
  apps: [
    {
      name: `${pjson.name}:${PORT}`,
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        PORT: PORT,
        NEXTAUTH_URL:  NEXTAUTH_URL
      },
    },
  ],
};
