import Connection from "tedious";
// ResourceGroup: ubikomResourceGroup
// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "dryad", // update me
      password: "Pourlanature1" // update me
    },
    type: "default"
  },
  server: "ubikomdb.database.windows.net", // update me
  options: {
    database: "sql", //update me
    encrypt: true,
    rowCollectionOnDone: true
  }
};

const connection = Connection.connect(config);


export default connection
