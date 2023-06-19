



/*import countries from "../database/json/countries.json";

import axios from "axios";

import cheerio from "cheerio";

import fs from "fs";
(async () => {
  let { data } = await axios.get("https://flagpedia.net/emoji");
  let $ = cheerio.load(data);
  let list = $("table[class=color]")
    .find("tbody")
    .find("tr")
    .map((i, el) => {
      return {
        emoji: $(el)
          .find("td[class=nowrap]")
          .find("span")
          .attr("data-clipboard"),
        name: $(el).find("td[class=td-country]").find("a").text(),
      };
    })
    .toArray();

  let newCountries = countries.map((c) => {
    let flag = list.find(
      (f) => f.name.toLocaleLowerCase() === c.name.toLocaleLowerCase()
    );
    if (!flag) console.log(c.name);
    return { ...c, emoji: flag?.emoji || "no flag" };
  });
  //console.log(newCountries);
  fs.writeFileSync(
    "../database/json/newcountries.json",
    JSON.stringify(newCountries, null, 2)
  );
})();
*/