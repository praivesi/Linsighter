const express = require("express");
const ejs = require("ejs");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");
const app = express();

dotenv.config({ path: path.join(__dirname, "../.env") });

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views"));

app.get("/", function (req, res) {
  console.log("test");
  res.render("test", {});
});

app.get("/data", async (req, res) => {
  try {
    const request_body = {
      startDate: "2020-10-01",
      endDate: "2020-10-30",
      timeUnit: "month",
      keywordGroups: [
        { groupName: "치킨", keywords: ["BBQ", "BHC", "교촌치킨"] },
        { groupName: "떡볶이", keywords: ["엽기떡볶이", "신전떡볶이", "배떡"] },
      ],
    };

    const url = "https://openapi.naver.com/v1/datalab/search";
    const headers = {
      "Content-Type": "application/json",
      "X-Naver-Client-Id": process.env.CLIENT_ID,
      "X-Naver-Client-Secret": process.env.CLIENT_SECRET,
    };

    const result = await axios.post(url, request_body, {
      headers: headers,
    });

    console.log(result.data);
    return res.json(result.data);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

app.listen(3000, function () {
  console.log("localhost:3000 실행중");
});
