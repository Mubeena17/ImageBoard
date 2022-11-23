const spicedPg = require("spiced-pg");
require("dotenv").config();

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${process.env.USER}:${process.env.PASS}@localhost:5432/${process.env.DATABASE}`
);

module.exports.getImage = (offset) => {
    return db
        .query(
            `SELECT *,
            (SELECT id FROM images ORDER BY id ASC LIMIT 1) AS "lowestId" 
             FROM images ORDER BY created_at DESC LIMIT 2 OFFSET $1`,
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
        .query(
            `SELECT *, 
            (SELECT id FROM images WHERE id < $1 ORDER BY id DESC LIMIT 1) AS "nextid",
            (SELECT id FROM images WHERE id > $1 ORDER BY id ASC LIMIT 1) AS "previousid" FROM images WHERE id=$1`,
            [id]
        )
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

module.exports.getMoreImages = (lastId) => {
    return db
        .query(
            `SELECT * FROM images
    WHERE id < $1
    ORDER BY id DESC
    LIMIT 10`
        )
        .then(({ rows }) => rows);
};

module.exports.getMore = (lowestId) => {
    return db.query(
        `SELECT *,
    (SELECT id FROM images ORDER BY id ASC LIMIT 1) AS "lowestId" 
    FROM images
    WHERE id < $1
    ORDER BY id DESC
    LIMIT 3`,
        [lowestId]
    );
};

module.exports.get1 = () => {
    return db
        .query(
            `SELECT *,
            (SELECT id FROM images ORDER BY id ASC LIMIT 1) AS "lowestId"
            FROM images ORDER BY created_at DESC LIMIT 2 OFFSET 0`
        )
        .then((result) => result.rows);
};
