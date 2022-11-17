const path = require("path");
const express = require("express");
const app = express();
require("dotenv").config();
const { PORT = 8080 } = process.env;
const { getImage } = require("./db");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/images", (req, res) => {
    getImage().then((result) => {
        return res.send(result);
    });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`I'm listening on port ${PORT}`));
