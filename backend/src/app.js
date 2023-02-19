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
    const now = new Date();
    const oneYearAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      //   now.getDate() - 20
      now.getDate()
    );

    for (let date = oneYearAgo; date <= now; date.setDate(date.getDate() + 1)) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      let cur_date = `${year}-${month}-${day}`;

      await googleTrends.dailyTrends(
        {
          trendDate: new Date(cur_date),
          geo: "KR",
        },
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            const data = JSON.parse(results);
            const trends =
              data.default.trendingSearchesDays[0].trendingSearches;

            let daily_data = [];

            for (let i = 0; i < trends.length; i++) {
              today_data = {
                title: trends[i].title.query,
                imageUrl: trends[i].image.imageUrl,
                shareUrl: trends[i].shareUrl,
              };

              daily_data.push(today_data);
            }

            trend_data.push({
              date: cur_date,
              daily_data: daily_data,
            });

            console.log("cur_daily_data => " + JSON.stringify(daily_data));
          }
        }
      );

      const deep_start_date = new Date(
        Date.now() - 365 * 24 * 60 * 60 * 1000
        // Date.now() - 10 * 24 * 60 * 60 * 1000
      );
      const deep_end_date = new Date();

      for (var i = 0; i < trend_data.length; i++) {
        for (var j = 0; j < trend_data[i].daily_data.length; j++) {
          console.log("keyword = " + trend_data[i].daily_data[j].title);
          const options = {
            keyword: trend_data[i].daily_data[j].title,
            startTime: deep_start_date,
            endTime: deep_end_date,
          };

          await googleTrends.interestOverTime(options, function (err, results) {
            if (err) {
              console.log("Error: ", err);
            } else {
              trend_data[i].daily_data[j].deep_data = JSON.parse(results);
              console.log(
                "deep_data => " +
                  JSON.stringify(trend_data[i].daily_data[j].deep_data)
              );
            }
          });
        }
      }
    }

    return res.json(trend_data);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

app.listen(3000, function () {
  console.log("localhost:3000 실행중");
});
