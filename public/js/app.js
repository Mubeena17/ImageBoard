import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            headline: "My Vue App",
            images: [],
            cardCSS: "data-card",
            message: "",
            photo: "",
            title: "",
            description: "",
            username: "",
        };
    },
    methods: {
        uploadImage: function (e) {
            e.preventDefault();
            console.log("clicked");
            const myFileInput = document.querySelector("input[type='file']");

            const photo = myFileInput.files[0];
            const formData = new FormData();
            formData.append("photo", photo);
            formData.append("image_title", this.title);
            formData.append("image_descp", this.description);
            formData.append("username", this.username);
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
                    console.log(result);
                    this.images.push(result);
                })
                .catch((err) => console.log(err));
        },
    },
    mounted() {
        fetch("/images")
            .then((res) => {
                return res.json();
            })
            .then((images) => {
                console.log(images);
                this.images = images;
            });
    },
}).mount("#main");
