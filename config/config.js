require("dotenv").config();

module.exports = {
  development: {
    username: "postgres",
    password: "chief042",
    database: "novax",
    host: "127.0.0.1",
    dialect: "postgres",
    port: 5433,
    logging: console.log,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: console.log,
  },
};
