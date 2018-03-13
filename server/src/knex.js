const mockConnection = () => {
    const connection = require("knex")({ client: "mysql" });
    require("mock-knex").mock(connection);
    return connection;
};

const realConnection = require("knex")({
    client: "mysql",
    connection: {
        host:
            process.env.NODE_ENV === "production"
                ? process.env.DB_HOST
                : "localhost",
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
});

const knex = process.env.NODE_ENV === "test" ? mockConnection : realConnection;

module.exports = knex;
