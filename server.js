const path = require("path");
const express = require("express");
const app = express();
require("dotenv").config();
const { PORT = 8080 } = process.env;
const { getImage, getSelectedImage } = require("./db");
const { uploader } = require("./middleware");
const fs = require("fs");
const { S3 } = require("./s3");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(express.json());

app.get("/images", (req, res) => {
    getImage().then((result) => {
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
        }).promise();

        promise
            .then((result) => {
                console.log("success");
                console.log("result", result);
                // it worked!!!
                return res.json({
                    success: true,
                    message: "File upload successful",
                    url: `/${req.file.filename}`,
                    description: req.body.description,
                    title: req.body.title,
                    username: req.body.username,
                });
            })
            .catch((err) => {
                // uh oh
                return res.json({
                    success: false,
                    message: "Something went wrong",
                });
            });
    } else {
        return res.json({
            success: false,
            message: "File upload failed",
        });
    }
});

app.post("/modal", (req, res) => {
    console.log("body ", req.body);
    if (req.body) {
        getSelectedImage(req.body.id).then((result) => {
            return res.send(result);
        });
    }
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.use(() => (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(418).send(err.code);
    }
});

app.listen(PORT, () => console.log(`I'm listening on port ${PORT}`));
