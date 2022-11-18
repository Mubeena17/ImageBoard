const path = require("path");
const express = require("express");
const app = express();
require("dotenv").config();
const { PORT = 8080 } = process.env;
const { getImage } = require("./db");
const { uploader } = require("./middleware");

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
    if (req.file) {
        console.log("file is", req.file);
        res.json({
            success: true,
            message: "File upload successful",
            file: `/${req.file.filename}`,
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
