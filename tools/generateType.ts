import buildTemplate from "openapi2aspida/dist/buildTemplate";
import * as fs from "fs";

const targetJson;
const originalResultJson = JSON.parse(`${fs.readFileSync(targetJson, "utf8")}`);
const resultJson = originalResultJson.data;

buildTemplate(resultJson, false, false, false);
