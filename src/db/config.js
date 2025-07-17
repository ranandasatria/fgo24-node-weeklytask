require("dotenv").config();

module.exports = {
  development: {
    username: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "1",
    database: process.env.PGDATABASE || "postgres",
    host: process.env.PGHOST || "localhost",
    port: process.env.PGPORT || 5433,
    dialect: "postgres",
  },
  // test: {
  //   username: "root",
  //   password: null,
  //   database: "database_test",
  //   host: "127.0.0.1",
  //   dialect: "mysql"
  // },

  // production: {
  //   username: "root",
  //   password: null,
  //   database: "database_production",
  //   host: "127.0.0.1",
  //   dialect: "mysql"
  // }
};


// npx sequelize-cli model:generate --name User --attributes email:string,password:string,picture:string