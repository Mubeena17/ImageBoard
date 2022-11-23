const {
    getImage,
    getSelectedImage,
    uploadImageDb,
    getImageComment,
    addImageComment,
    get1,
    getMore,
} = require("./db");
const lowestId = get1().then((result) => result[0].lowestId);
//parse int shortcut +
//getMore(lowestId).then((result) => console.log(result));
