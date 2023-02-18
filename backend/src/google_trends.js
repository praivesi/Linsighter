// "use strict";
// const _ = require("lodash");
// const Q = require("q");
// const Parser = require("rss-parser");
// const parser = new Parser({
//   customFields: {
//     item: ["ht:approx_traffic", "ht:picture", "ht:news_item"],
//   },
// });

// const moment = require("moment-timezone");
// moment.locale("ko");
// const TIMEZONE = "Asia/Seoul";

const googleTrends = require("google-trends-api");

const GT = {
  get_daily_trends_kr: async function () {
    let trend_data = [];

    await googleTrends.dailyTrends(
      {
        geo: "KR",
      },
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          console.log("results => " + JSON.parse(results));

          const data = JSON.parse(results);
          const trends = data.default.trendingSearchesDays[0].trendingSearches;

          console.log(
            "data.default.trendingSearchesDays[0].trendingSearches => " +
              data.default.trendingSearchesDays[0].trendingSearches
          );

          console.log("=== Daily Trends in Korea ===");
          console.log("trends => " + trends);
          console.log("data => " + data);
          for (let i = 0; i < trends.length; i++) {
            console.log(`${i + 1}. ${trends[i].title.query}`);
            console.log(`${i + 1}. ${trends[i].image.imageUrl}`);
            console.log(`${i + 1}. ${trends[i].shareUrl}`);

            trend_data.push({
              title: trends[i].title.query,
              imageUrl: trends[i].image.imageUrl,
              shareUrl: trends[i].shareUrl,
            });
          }
        }

        console.log("trend_data => " + JSON.stringify(trend_data));
        return trend_data;

        console.log("cccc");
      }
    );
  },
};

module.exports = GT;
