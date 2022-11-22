const comment = {
    props: ["id"],
    methods: {
        addComment: function (e) {
            e.preventDefault();

            console.log("username", this.username);

            fetch(`/comment/${this.id}`, {
                method: "POST",
                body: JSON.stringify({
                    username: this.username,
                    comment: this.comment,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    return response.json();
                })
                .then((result) => {
                    console.log("ulpoaded :", result);
                    this.comments.push(result);
                    this.comment = "";
                    this.username = "";
                })
                .catch((err) => {
                    this.message = err;
                    return;
                });
        },
    },
    data() {
        return {
            comments: [],
            username: "",
            comment: "",
        };
    },
    template: `<div v-for="comment of comments">
                    <p> {{comment.comment}} by {{comment.username}}</p>
               </div>
               <form id="comment-form"  
                method="post"
                enctype="multipart/form-data"
                @submit.prevent="onFormSubmit">
                <div class="form-row">
                    <input type="text" v-model="username" name="username" placeholder="username"/> 
                    <input type="text" v-model="comment"  name="comment"  placeholder="Add Comment"/>  
                </div>
                <input type="submit" v-on:click="addComment" value="Comment!" class="btn-submit" />
            </form>
               
               `,

    mounted() {
        fetch(`/comment/${this.id}`)
            .then((res) => {
                return res.json();
            })
            .then((comments) => {
                this.comments = comments;
            })
            .catch((err) => console.log(err));
    },
};

export default comment;
