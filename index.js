const path = require('path');

const expressEdge = require('express-edge');

const express = require('express');

const mongo = require('mongoose');

const bodyParser = require('body-parser');

const fileUpload = require("express-fileupload");

const Post = require('./database/models/Post');

const app = new express();

//connect to MongoDB
mongo.connect('mongodb://localhost:27017/node-blog', {useNewUrlParser: true})
    .then(() => 'You are connected to Mongo!')
    .catch(err => console.error('Something went wrong while connecting to DB', err))

app.use(fileUpload());

app.use(express.static('public'));

app.use(expressEdge.engine);

app.set('views', __dirname + '/views');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

// //homepage route
// app.get('/', function(req, res){
//     res.sendFile(path.resolve(__dirname, 'pages/index.html'));
// })

// render the app to express-edge template in views/index.edge instead of static files in pages folder
app.get('/', async (req, res) => {
    const posts = await Post.find({}) //get all posts from db
    res.render('index',{posts}); //send all posts to views
});

//render to single post page
app.get('/post/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('post', {
        post
    })
});

//render to create post form file in views floder
app.get('/posts/new', (req, res) => {
    res.render('create');
});

//route for store the form-data
app.post('/posts/store',  (req, res) => {
    const {image} = req.files
    //console.log(req.files)

    image.mv(path.resolve(__dirname, 'public/posts', image.name), (error) => {
        Post.create({
            ...req.body,
            image: `/posts/${image.name}`
        }, (error, post) => {
            res.redirect('/');
        });
    })
});

//about route
app.get('/about', function(req, res){
    res.sendFile(path.resolve(__dirname, 'pages/about.html'));
})

//contact route
app.get('/contact', function(req, res){
    res.sendFile(path.resolve(__dirname, 'pages/contact.html'));
})

//post route
app.get('/post', function(req, res){
    res.sendFile(path.resolve(__dirname, 'pages/post.html'));
})

app.listen(4000, () => {
    console.log('App listening on port 4000')
});