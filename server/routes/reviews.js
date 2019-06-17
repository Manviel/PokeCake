const express = require("express");
const router = express.Router({ mergeParams: true });

router.get("/", (req, res, next) => {
  res.send("Review");
});

router.get("/new", (req, res, next) => {
  res.send("New");
});

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
