const express = require("express");

const router = express.Router();

const { errorHandler } = require("../middleware");
const { getPosts, newPost } = require("../controllers/posts");

router.get("/", errorHandler(getPosts));

router.get("/new", newPost);

router.get("/:revid", (req, res, next) => {
  res.send("Show");
});

router.get("/:revid/edit", (req, res, next) => {
  res.send("Edit");
});

router.post("/", (req, res, next) => {
  res.send("Create");
});

router.put("/:revid", (req, res, next) => {
  res.send("Update");
});

router.delete("/:revid", (req, res, next) => {
  res.send("Delete");
});

module.exports = router;
