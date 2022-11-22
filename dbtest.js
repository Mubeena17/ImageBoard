const {
    getImage,
    getSelectedImage,
    uploadImageDb,
    getImageComment,
    addImageComment,
} = require("./db");

addImageComment({
    comment: "text comments",
    username: "testuser",
    image_id: 12,
}).then((result) => console.log(result));
