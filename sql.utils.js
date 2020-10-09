import Connection from "tedious";

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "dryad", // update me
      password: "Pourlanature1" // update me
    },
    type: "default"
  },
  server: "postsearch-sql.database.windows.net", // update me
  options: {
    database: "sql", //update me
    encrypt: true,
    rowCollectionOnDone: true
  }
};

const connection = Connection.connect(config);


export default connection
