const Post = require("../models/post");

module.exports = {
  async getPosts(req, res, next) {
    let posts = await Post.find({});

    res.render("posts/index", { posts });
  },

  async createPost(req, res, next) {
    let post = await Post.create(req.body);

    res.redirect(`/posts/${post.id}`);
  },

  async showPost(req, res, next) {
    let post = await Post.findById(req.params.id);

    res.render("posts/show", { post });
  },

  newPost(req, res, next) {
    res.render("posts/new");
  }
};