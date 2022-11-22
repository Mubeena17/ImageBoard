import comment from "./comment.js";

const modal = {
    props: ["imageId"],
    components: {
        comment: comment,
    },
    methods: {
        getnextid: function (e) {
            this.$emit("next");
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
                <button class="modal-default-button" @click="$emit('close')">
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

    mounted() {
        fetch(`/modal/${this.imageId}`)
            .then((res) => {
                return res.json();
            })
            .then((image) => {
                this.currentImage = image;
                this.id = image.id;
            });
    },
};

export default modal;
