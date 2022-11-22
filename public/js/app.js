import * as Vue from "./vue.js";
import modal from "./component/modal.js";
import comment from "./component/comment.js";

Vue.createApp({
    components: {
        modal: modal,
        comment: comment,
    },
    data() {
        return {
            headline: "My Vue App",
            images: [],
            cardCSS: "data-card",
            message: "",
            offset: 0,
            selectImageId: 0,
            currentImage: {},
            hasMoreItem: true,
        };
    },
    methods: {
        uploadImage: function (e) {
            e.preventDefault();

            const myform = document.getElementById("uploadform");
            const formData = new FormData(myform);

            fetch("/image", {
                method: "POST",
                body: formData,
            })
                .then((response) => {
                    return response.json();
                })
                .then((result) => {
                    this.photo = result.file;
                    this.message = result.message;
                    console.log("ulpoaded :", result);
                    this.images.unshift(result);
                })
                .catch((err) => {
                    this.message = err;
                    return;
                });
        },
        showModal: function (imageId) {
            this.selectImageId = imageId;
        },
        loadMore: function (offset) {
            this.offset = offset + 2;
            fetch("/images", {
                method: "POST",
                body: JSON.stringify({
                    offset: this.offset,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    return res.json();
                })
                .then((images) => {
                    this.hasMoreItem = images.length ? true : false;
                    this.images.push(...images);
                });
        },
    },
    mounted() {
        fetch("/images", {
            method: "POST",
            body: JSON.stringify({
                offset: this.offset,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((images) => {
                this.images = images;
            });
    },
}).mount("#main");

// created_at: "2022-11-17T12:57:30.644Z";
// description: "This photo brings back so many great memories.";
// id: 1;
// title: "Welcome to Spiced and the Future!";
// url: "https://s3.amazonaws.com/imageboard/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg";
// username: "funkychicken";
