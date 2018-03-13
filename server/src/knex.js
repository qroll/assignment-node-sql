/*
referenced from https://github.com/rgeraldporter/knex-tdd-experiment/blob/master/src/lib/db.js
*/

const mockConnection = () => {
    const connection = require("knex")({ client: "mysql" });
    require("mock-knex").mock(connection);
    return connection;
};

const realConnection = () => {
    return require("knex")({
        client: "mysql",
        connection: {
            host:
                process.env.NODE_ENV === "production"
                    ? process.env.DB_HOST
                    : "localhost",
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database:
                process.env.NODE_ENV === "test" ? "test" : process.env.DB_NAME
        }
    });
};

const knex =
    process.env.NODE_ENV === "unit" ? mockConnection() : realConnection();

module.exports = knex;
