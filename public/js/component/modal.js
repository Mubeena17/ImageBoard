import comment from "./comment.js";

const modal = {
    components: {
        comment: comment,
    },
    emits: ["close"],
    methods: {
        getnextid: function (e) {
            this.$emit("next");
        },
        close: function () {
            this.$emit("close");
        },

        nextModal: function (e) {
            history.pushState(null, "", `/modals/${this.next}`);
            this.fetchImage();
        },
        previousModal: function (e) {
            history.pushState(null, "", `/modals/${this.previous}`);
            this.fetchImage();
        },
        fetchImage: function () {
            this.imageId = location.pathname.split("/")[2];
            fetch(`/modal/${this.imageId}`)
                .then((res) => {
                    if (res.status === 200) return res.json();
                    else throw Error("Something went wrong");
                })
                .then((image) => {
                    this.previous = image.previousid;
                    this.next = image.nextid;

                    this.currentImage = image;
                    this.id = image.id;
                })
                .catch(() => {
                    this.$emit("close");
                });
        },
    },
    data() {
        return {
            currentImage: {},
            id: null,
            previous: null,
            next: null,
        };
    },
    template: `<div class="modal-wrapper">
            <div class="modal-container">
            <button v-if="previous" style="float: left; position: absolute;left: 2%; top: 50%;" 
                    v-on:click="previousModal">
                <span >&#8592;</span>
            </button>
            <button v-if="next" style="float: left;
                    position: absolute;top: 50%;
                    right: 2%;"  v-on:click="nextModal">
                    <span>&#8594;</span>
            </button>
                <button class="modal-default-button" @click="close" >
                            <span class="close">&times;</span>
                </button>

                <div class="modal-body">
                    <div class="modal-image">
                            <div class="modal-header">
                                    <h3>{{currentImage.title}}</h3>
                            </div>
                        <div class="modal-image-container">
                            <img style="width:90%;" :src="currentImage.url"  />
                            <p>{{currentImage.description}}</p>
                            
                        </div>
                </div>
                
                <div class="modal-info">
                    <comment v-bind:id="imageId"></comment>
                </div>
            </div>    
    </div>`,

    beforeMount() {
        this.fetchImage();
    },
};

export default modal;
