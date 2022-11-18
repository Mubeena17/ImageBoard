const aws = require("aws-sdk");
require("dotenv").config();

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    //secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

module.exports.S3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});
