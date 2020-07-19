import buildTemplate from "openapi2aspida/dist/buildTemplate";
import * as fs from "fs";

const targetJson = "sources/sample.json";
const originalResultJson = JSON.parse(`${fs.readFileSync(targetJson, "utf8")}`);
const resultJson = originalResultJson.data[0];

const generateType = async () => {
  const newResultJson = await buildTemplate(resultJson, false, false, false);
  fs.writeFile(`result.json`, JSON.stringify(newResultJson), (error) => {
    if (error) console.log("Error", error);
  });
};

generateType();
