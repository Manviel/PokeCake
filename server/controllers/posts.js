const Post = require("../models/post");

module.exports = {
  async getPosts(req, res, next) {
    let posts = await Post.find({});

    res.render("posts/index", { posts });
  },

  async createPost(req, res, next) {
    let post = await Post.create(req.body.post);

    res.redirect(`/posts/${post.id}`);
  },

  async showPost(req, res, next) {
    let post = await Post.findById(req.params.id);

    res.render("posts/show", { post });
  },

  async editPost(req, res, next) {
    let post = await Post.findById(req.params.id);

    res.render("posts/edit", { post });
  },

  async postUpdate(req, res, next) {
    let post = await Post.findByIdAndUpdate(req.params.id, req.body.post, {
      new: true
    });

    res.redirect(`/posts/${post.id}`);
  },

  newPost(req, res, next) {
    res.render("posts/new");
  }
};
