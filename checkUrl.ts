import * as fs from "fs";

const targetJson = "base.json";

let resultJson = JSON.parse(`${fs.readFileSync(targetJson, "utf8")}`);

const newResultJson = [];

const sameRemoveFilter = (array) => {
  const itemUrl = array.map((item) => item.url);
  return array.filter((item, index) => itemUrl.indexOf(item.url) === index);
};

resultJson.map((result) => {
  let materialJson = sameRemoveFilter(result.baseURL);
  const filteredUrl = materialJson.filter(
    (base) =>
      !base.url.match(
        /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/
      )
  );
  result.baseURL = filteredUrl;
  if (filteredUrl.length) {
    newResultJson.push(result);
  }
});

fs.writeFile(`apilist.json`, JSON.stringify(newResultJson), (error) => {
  if (error) console.log("Error1");
});
