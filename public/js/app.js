import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            headline: "My Vue App",
            images: [],
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

// Vue.createApp({
//     data() {
//         return {
//             headline: "My fancy image board",
//             headlineCss: "headlineClass",
//             cities: [],
//             firstName: "",
//             count: 0,
//         };
//     },
//     methods: {
//         updateName: function (e) {
//             this.firstName = "Sven";
//         },
//         increaseCount: function () {
//             this.count++;
//         },
//     },
//     mounted() {
//         fetch("/cities")
//             .then((res) => res.json())
//             .then((cities) => {
//                 this.cities = cities;
//             });
//     },
// }).mount("#main");
