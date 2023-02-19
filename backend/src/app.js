const express = require("express");
const ejs = require("ejs");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");
const app = express();
const googleTrends = require("google-trends-api");

const GT = require("./google_trends");

dotenv.config({ path: path.join(__dirname, "../.env") });

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views"));

app.get("/", function (req, res) {
  console.log("test");
  res.render("test", {});
});

app.get("/data", async (req, res) => {
  try {
    // const request_body = {
    //   startDate: "2017-08-01",
    //   endDate: "2017-09-30",
    //   timeUnit: "date",
    //   category: [
    //     { name: "패션의류", param: ["50000000"] },
    //     { name: "화장품/미용", param: ["50000002"] },
    //   ],
    //   device: "pc",
    //   ages: ["20", "30"],
    //   gender: "f",
    // };

    // // const url = "https://openapi.naver.com/v1/datalab/search";
    // const url = "https://openapi.naver.com/v1/datalab/shopping/categories";
    // const headers = {
    //   "Content-Type": "application/json",
    //   "X-Naver-Client-Id": process.env.CLIENT_ID,
    //   "X-Naver-Client-Secret": process.env.CLIENT_SECRET,
    // };

    // const result = await axios.post(url, request_body, {
    //   headers: headers,
    // });

    let trend_data = [];

    await googleTrends.dailyTrends(
      {
        geo: "KR",
      },
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          const data = JSON.parse(results);
          const trends = data.default.trendingSearchesDays[0].trendingSearches;

          for (let i = 0; i < trends.length; i++) {
            trend_data.push({
              title: trends[i].title.query,
              imageUrl: trends[i].image.imageUrl,
              shareUrl: trends[i].shareUrl,
            });
          }
        }
      }
    );

    console.log("response => " + JSON.stringify(trend_data));

    return res.json(trend_data);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

app.listen(3000, function () {
  console.log("localhost:3000 실행중");
});
