/*
referenced from https://github.com/rgeraldporter/knex-tdd-experiment/blob/master/src/lib/db.js
*/

const mockConnection = () => {
    const connection = require("knex")({ client: "mysql" });
    require("mock-knex").mock(connection);
    return connection;
};

const development = () => {
    return require("knex")({
        client: "mysql",
        connection: {
            host: "localhost",
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        }
    });
};

const production = () => {
    const connectionString =
        "mysql://" +
        process.env.DB_USER +
        ":" +
        process.env.DB_PASSWORD +
        "@" +
        process.env.DB_HOST +
        ":" +
        process.env.DB_PORT +
        "/" +
        process.env.DB_NAME;

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
        case "production":
            return production();
            break;
        default:
            return development();
            break;
    }
};

module.exports = knex();
