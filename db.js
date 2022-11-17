const spicedPg = require("spiced-pg");
require("dotenv").config();

const db = spicedPg(
    `postgres:${process.env.USER}:${process.env.PASS}@localhost:5432/${process.env.DATABASE}`
);

module.exports.getImage = () => {
    return db.query("SELECT * FROM images").then((result) => result.rows);
};
//signup
module.exports.addPetitioner = ({ firstName, lastName, email, password }) => {
    return db
        .query(
            `INSERT INTO users ("first_name", "last_name", "email", "password")
    VALUES ($1, $2, $3, $4)
    RETURNING id`,
            [firstName, lastName, email, password]
        )
        .then((result) => result.rows[0]);
};
