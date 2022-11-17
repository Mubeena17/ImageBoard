import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            headline: "My Vue App",
            images: [],
            cardCSS: "cont_cards",
        };
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
