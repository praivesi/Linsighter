const express = require("express");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views"));

app.get("/", function (req, res) {
  console.log("test");
  res.render("test", {});
});

app.listen(3000, function () {
  console.log("localhost:3000 실행중");
});
