const express = require("express");
const passport = require("passport");

const router = express.Router();

const { postRegister } = require("../controllers");
const { errorHandler } = require("../middleware");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.get("/register", (req, res, next) => {
  res.send("Register");
});

router.get("/login", (req, res, next) => {
  res.send("Log in");
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

router.get("/profile", (req, res, next) => {
  res.send("Profile");
});

router.get("/password", (req, res, next) => {
  res.send("Forgot password");
});

router.get("/reset/:token", (req, res, next) => {
  res.send("Reset password");
});

router.post("/register", errorHandler(postRegister));

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

router.put("/profile/:uid", (req, res, next) => {
  res.send("Update");
});

router.put("/password", (req, res, next) => {
  res.send("Forgot password");
});

router.put("/reset/:token", (req, res, next) => {
  res.send("Reset password");
});

module.exports = router;
