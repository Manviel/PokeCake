const express = require("express");

const router = express.Router();

const { errorHandler } = require("../middleware");
const {
  getPosts,
  newPost,
  createPost,
  showPost,
  editPost,
  postUpdate,
  postDelete
} = require("../controllers/posts");

router.get("/", errorHandler(getPosts));

router.get("/new", newPost);

router.get("/:id", errorHandler(showPost));

router.get("/:id/edit", errorHandler(editPost));

router.post("/", errorHandler(createPost));

router.put("/:id", errorHandler(postUpdate));

router.delete("/:id", errorHandler(postDelete));

module.exports = router;
