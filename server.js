const path = require("path");
const express = require("express");
const app = express();
require("dotenv").config();
const { PORT = 8080 } = process.env;
const {
    getImage,
    getSelectedImage,
    uploadImageDb,
    getImageComment,
    addImageComment,
} = require("./db");
const { uploader } = require("./middleware");
const fs = require("fs");
const { S3 } = require("./s3");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(express.json());

app.post("/images", (req, res) => {
    getImage(req.body.offset).then((result) => {
        return res.send(result);
    });
});

//need to handle MulterError: File too large
app.post("/image", uploader.single("photo"), (req, res) => {
    if (req.file) {
        const { filename, mimetype, size, path } = req.file;

        const promise = S3.putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
            .promise()
            .then((result) => {
                console.log("success");
                let url = `https://s3.amazonaws.com/spicedling/${filename}`;

                const { description, title, username } = req.body;
                return uploadImageDb({
                    url,
                    description,
                    title,
                    username,
                }).then((row) => {
                    unlinkFile(req.file.path);
                    return row;
                });
                // it worked!!!
            })

            .then((row) => {
                return res.json({
                    success: true,
                    message: "File upload successful",
                    url: `https://s3.amazonaws.com/spicedling/${filename}`,
                    description: req.body.description,
                    title: req.body.title,
                    username: req.body.username,
                    id: row.id,
                });
            })
            .catch((err) => {
                // uh oh
                return res.json({
                    success: false,
                    message: err.message,
                });
            });
    } else {
        return res.json({
            success: false,
            message: "File upload failed",
        });
    }
});

app.get("/modal/:id", (req, res) => {
    if (+req.params.id) {
        getSelectedImage(req.params.id).then((result) => {
            return res.send(result);
        });
    }
});

app.get("/comment/:id", (req, res) => {
    if (req.params.id) {
        getImageComment(req.params.id).then((result) => {
            return res.send(result);
        });
    }
});

app.post("/comment/:id", (req, res) => {
    if (req.body) {
        addImageComment({
            comment: req.body.comment,
            username: req.body.username,
            image_id: req.params.id,
        }).then((result) => {
            return res.json({
                comment: result.comment,
                username: result.username,
                image_id: result.image_id,
                id: result.id,
            });
        });
    }
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// app.use(() => (err, req, res, next) => {
//     if (err instanceof multer.MulterError) {
//         return res.status(418).send(err.code);
//     }
// });

app.listen(PORT, () => console.log(`I'm listening on port ${PORT}`));
