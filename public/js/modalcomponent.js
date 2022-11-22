const modalComponent = {
    props: ["imageId"],
    methods: {
        getnextid: function (e) {
            // inform the parent component that name got updated
            // for this we emit an event

            this.$emit("next");
        },
    },
    data() {
        return {
            currentImage: {},
        };
    },
    template: `<div class="modal-wrapper">
                    <div class="modal-container">
                        <div class="modal-header">
                            <h3>{{currentImage.title}}</h3>
                        </div>
                        <div class="modal-body">
                     <div id="modal-img-container" >
                   
                        <img  :src="currentImage.url" />
                   
                    <text>{{currentImage.title}}</text>
              
            </div>
                    </div>
                    <div class="modal-footer">
                    
                    <button class="modal-default-button" @click="$emit('close')">
                    OK
                  </button>
                  </div></div></div>`,

    mounted() {
        console.log("id", this.imageId);
        fetch(`/modal/${this.imageId}`)
            .then((res) => {
                return res.json();
            })
            .then((image) => {
                console.log("image: ", image);
                this.currentImage = image;
            });
    },
};

export default modalComponent;
