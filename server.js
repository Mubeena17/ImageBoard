const path = require("path");
const express = require("express");
const app = express();
require("dotenv").config();
const { PORT = 8080 } = process.env;
const { getImage } = require("./db");
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

app.post("/image", uploader.single("photo"), (req, res) => {
    console.log("image in server");
    console.log(req.file);

    console.log(req.body.image_title);
    if (req.file) {
        console.log("file is", req.file);

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
            .then(() => {
                console.log("success");
                // it worked!!!
                res.json({});
            })
            .catch((err) => {
                // uh oh
                console.log(err);
            });

        res.json({
            success: true,
            message: "File upload successful",
            url: `/${req.file.filename}`,
            description: req.body.description,
            title: req.body.titile,
            username: req.body.username,
        });
    } else {
        res.json({
            success: false,
            message: "File upload failed",
        });
    }
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`I'm listening on port ${PORT}`));
