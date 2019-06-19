const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const keys = require("../keys");

const baseClient = mbxGeocoding({ accessToken: keys.mapboxToken });

const Post = require("../models/post");

module.exports = {
  async getPosts(req, res, next) {
    let posts = await Post.find({});

    res.render("posts/index", { posts });
  },

  async createPost(req, res, next) {
    let response = await baseClient
      .forwardGeocode({
        query: req.body.post.location,
        limit: 2
      })
      .send();

    let match = response.body;

    req.body.post.coordinates = match.features[0].geometry.coordinates;

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
    let response = await baseClient
      .forwardGeocode({
        query: req.body.post.location,
        limit: 2
      })
      .send();

    let match = response.body;

    req.body.post.coordinates = match.features[0].geometry.coordinates;

    let post = await Post.findByIdAndUpdate(req.params.id, req.body.post, {
      new: true
    });

    res.redirect(`/posts/${post.id}`);
  },

  async postDelete(req, res, next) {
    await Post.findByIdAndRemove(req.params.id);
    res.redirect("/posts");
  },

  newPost(req, res, next) {
    res.render("posts/new");
  }
};
