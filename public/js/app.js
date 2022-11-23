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
            lowestId: null,
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

                    this.images.unshift(result);
                })
                .catch((err) => {
                    this.message = err;
                    return;
                });
        },
        showModal: function (imageId) {
            this.selectImageId = imageId;
            history.pushState(null, "", `/modals/${imageId}`);
            console.log("show modal", this.selectImageId);
        },
        closeModal: function () {
            this.selectImageId = false;
            history.pushState(null, "", "/");
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

                    images.map((photo) => {
                        this.lowestId = photo.lowestId;
                        if (photo.id === this.lowestId)
                            this.hasMoreItem = false;
                    });

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

        console.log("location.pathname ", location.pathname);
        //-----history -----//
        if (parseInt(location.pathname.slice(-1))) {
            // console.log("now : ", location.pathname.slice(-1));
            this.selectImageId = location.pathname.slice(-1);
            console.log("parse int", this.selectImageId);
        } else {
            history.pushState({}, "", "/");
        }

        window.addEventListener("popstate", () => {
            this.selectImageId = location.pathname.slice(1);
            console.log("selected popstate", this.selectImageId);
        });

        // if (!isNaN(location.pathname.slice(1))) {
        //     this.imageSelected = location.pathname.slice(1);
        //     window.addEventListener("popstate", () => {
        //         this.imageSelected = location.pathname.slice(1);
        //     });
        // } else {
        //     this.imageSelected = null;
        //     history.replaceState({}, "", "/");
        // }
    },
}).mount("#main");

// created_at: "2022-11-17T12:57:30.644Z";
// description: "This photo brings back so many great memories.";
// id: 1;
// title: "Welcome to Spiced and the Future!";
// url: "https://s3.amazonaws.com/imageboard/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg";
// username: "funkychicken";
