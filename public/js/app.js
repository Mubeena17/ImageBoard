import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            headline: "My Vue App",
            images: [],
            cardCSS: "data-card",
            message: "",
            photo: "",
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
            fetch("/image", {
                method: "POST",
                body: formData,
            })
                .then((response) => {
                    return response.json();
                })
                .then((result) => (this.message = result.message))
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
