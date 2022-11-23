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
            displayModal: false,
        };
    },
    methods: {
        uploadImage: function (e) {
            const inputs = document.querySelectorAll(
                "#title, #description, #username, #photo"
            );

            const myform = document.getElementById("uploadform");

            if (!myform.checkValidity()) {
                this.message = "All fields required";
                return;
            }

            const formData = new FormData(myform);

            fetch("/image", {
                method: "POST",
                body: formData,
            })
                .then((response) => {
                    if (response.status === 200) return response.json();
                    else throw Error("Something went wrong");
                })
                .then((result) => {
                    this.photo = result.file;
                    this.message = result.message;

                    this.images.unshift(result);
                })
                .then(() => {
                    inputs.forEach((input) => {
                        input.value = "";
                    });
                })
                .catch((err) => {
                    this.message = err.message;
                    return;
                });
        },
        showModal: function (imageId) {
            history.pushState(null, "", `/modals/${imageId}`);
            this.displayModal = true;
        },
        closeModal: function () {
            this.displayModal = false;
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
        renderModal: function () {
            let url = location.pathname.split("/");
            if (
                url.length == 3 &&
                url[1] == "modals" &&
                +url[2] &&
                url[0] == ""
            ) {
                this.displayModal = true;
            } else {
                this.displayModal = false;
            }
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

        //check for urls
        this.renderModal();

        window.addEventListener("popstate", () => {
            // this.selectImageId = location.pathname.slice(1);
            this.renderModal();
        });
    },
}).mount("#main");

// created_at: "2022-11-17T12:57:30.644Z";
// description: "This photo brings back so many great memories.";
// id: 1;
// title: "Welcome to Spiced and the Future!";
// url: "https://s3.amazonaws.com/imageboard/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg";
// username: "funkychicken";
