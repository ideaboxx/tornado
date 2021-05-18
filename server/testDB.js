const { Pool } = require("pg");

const connectionString =
  "postgres://mzzucfpeejagoc:c7ed173bba841b9e3a059bbffb13c9438933ba7ac252065e5c356d385d25dc01@ec2-23-21-229-200.compute-1.amazonaws.com:5432/dcphdi8fkhh3q9";

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool
  .query(`select * from logs`)
  .then((data) => console.log("Row count", data.rowCount));
