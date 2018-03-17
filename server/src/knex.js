/*
referenced from https://github.com/rgeraldporter/knex-tdd-experiment/blob/master/src/lib/db.js
*/

const mockConnection = () => {
    const connection = require("knex")({ client: "mysql" });
    require("mock-knex").mock(connection);
    return connection;
};

const realConnection = () => {
    const connectionString =
        "mysql://" +
        process.env.DB_USER +
        ":" +
        process.env.DB_PASSWORD +
        "@" +
        (process.env.NODE_ENV === "production"
            ? process.env.DB_HOST
            : "localhost") +
        ":" +
        process.env.DB_PORT +
        "/" +
        process.env.DB_NAME;

    console.log(connectionString);

    return require("knex")({
        client: "mysql",
        connection: connectionString
    });
};

const knex = () => {
    switch (process.env.NODE_ENV) {
        case "unit":
            return mockConnection();
            break;
        default:
            return realConnection();
            break;
    }
};

module.exports = knex();
