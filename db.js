const spicedPg = require("spiced-pg");
require("dotenv").config();

const db = spicedPg(
    `postgres:${process.env.USER}:${process.env.PASS}@localhost:5432/${process.env.DATABASE}`
);

module.exports.getImage = (offset) => {
    return db
        .query(
            `SELECT * FROM images ORDER BY created_at DESC LIMIT 2 OFFSET $1`,
            [offset]
        )
        .then((result) => result.rows);
};

module.exports.uploadImageDb = ({ url, description, title, username }) => {
    return db
        .query(
            `INSERT INTO images (url,description, title, username)
            VALUES ($1, $2, $3,$4)
            RETURNING *`,
            [url, description, title, username]
        )
        .then((result) => result.rows[0]);
};

module.exports.getSelectedImage = (id) => {
    return db
        .query("SELECT * FROM images WHERE id=$1", [id])
        .then((result) => result.rows[0]);
};

module.exports.getImageComment = (id) => {
    return db
        .query(`SELECT * FROM comments WHERE image_id=$1`, [id])
        .then((result) => result.rows);
};

module.exports.addImageComment = ({ comment, username, image_id }) => {
    return db
        .query(
            `INSERT INTO comments (comment, username, image_id) VALUES ( $1, $2, $3 )
        RETURNING *`,
            [comment, username, image_id]
        )
        .then((result) => result.rows[0]);
};
