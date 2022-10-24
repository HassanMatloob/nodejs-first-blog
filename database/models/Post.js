const mongo = require('mongoose');

const PostSchema = new mongo.Schema({
    title: String,
    description: String,
    content: String,
    username: String,
    image: String,
    createdAt: {
        type: Date,
        default: new Date()
    }
});

const Post = mongo.model('Post', PostSchema);

module.exports = Post;