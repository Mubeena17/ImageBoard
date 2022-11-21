import * as Vue from "./vue.js";
import modalComponent from "./modalcomponent.js";

Vue.createApp({
    components: {
        "modal-component": modalComponent,
    },
    data() {
        return {
            headline: "My Vue App",
            images: [],
            cardCSS: "data-card",
            message: "",

            selectImageId: 0,
            currentImage: {},
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

                    this.images.push(result);
                })
                .catch((err) => {
                    this.message = err;
                    return;
                });
        },
        showModal: function (imageId) {
            this.selectImageId = imageId;
        },
    },
    mounted() {
        fetch("/images")
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
