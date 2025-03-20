require("dotenv").config();
const pjson = require("./package.json");

// Ensure PORT is defined, or use a default value
const PORT = process.env.PORT || 4003;

module.exports = {
  apps: [
    {
      name: `${pjson.name}:${PORT}`,
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        PORT: PORT, 
      },
    },
  ],
};
