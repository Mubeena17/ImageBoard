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
    },
    data() {
        return {
            currentImage: {},
            id: null,
        };
    },
    template: `<div class="modal-wrapper">
            <div class="modal-container">
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
        this.imageId = location.pathname.split("/")[2];
        fetch(`/modal/${this.imageId}`)
            .then((res) => {
                if (res.status === 200) return res.json();
                else throw Error("Something went wrong");
            })
            .then((image) => {
                this.currentImage = image;
                this.id = image.id;
            })
            .catch(() => {
                this.$emit("close");
            });
    },
};

export default modal;
