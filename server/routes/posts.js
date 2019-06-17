const express = require("express");

const router = express.Router();

const { errorHandler } = require("../middleware");
const {
  getPosts,
  newPost,
  createPost,
  showPost
} = require("../controllers/posts");

router.get("/", errorHandler(getPosts));

router.get("/new", newPost);

router.get("/:id", errorHandler(showPost));

router.get("/:id/edit", (req, res, next) => {
  res.send("Edit");
});

router.post("/", errorHandler(createPost));

router.put("/:id", (req, res, next) => {
  res.send("Update");
});

router.delete("/:id", (req, res, next) => {
  res.send("Delete");
});

module.exports = router;
