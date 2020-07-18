import * as fs from "fs";
import { OpenAPIV3 } from "openapi-types";

const fileNames = fs.readdirSync("./openApiSpec3");
const fileNamesParts = fileNames.slice(1, 10000);
console.log("fileNamesParts", fileNamesParts);
const keywords = [
  "management",
  "mobile",
  "tmf",
  "customer",
  "generate",
  "authentication",
  "payment",
  "consumer",
  "inventory",
  "microservice",
  "account",
  "azure",
  "bitbucket",
  "booking",
  "forecast",
  "analytics",
  "bank",
  "overview",
  "enterprise",
  "financial",
  "weather",
  "commercial",
  "esta",
  "microsoft",
  "bot",
  "geographic",
  "healthcare",
  "insurance",
  "eps",
  "billing",
  "kyc",
  "vehicle",
];

let resultArray = [];
let errFiles = {
  noPathObject: [],
  noTitle: [],
  other: [],
};
type Api = {
  apiServiceId: string;
  title: string;
  baseURL: OpenAPIV3.ServerObject[];
  description?: string;
  category: string[];
  updated?: string;
  icon: string;
};
let descriptions: string[] = [];

Promise.all(
  fileNamesParts.map((fileName) => {
    try {
      console.log(fileName);
      let defaultJson: Api = {
        apiServiceId: "uLyMVe4XHi",
        title: "test1 API", // title
        baseURL: [], // 調査依頼
        category: [], // 検討対象外
        icon: "/default.png", // 対象外。デフォルトを埋め込む
      };
      const originalJson: OpenAPIV3.Document = JSON.parse(
        `${fs.readFileSync(`openApiSpec3/${fileName}`, "utf8")}`
      );
      defaultJson.apiServiceId = fileName.slice(0, -5);
      defaultJson.title = originalJson.info.title;
      defaultJson.baseURL = originalJson.servers;
      defaultJson.category =
        "description" in originalJson.info
          ? keywords.filter((str) =>
              originalJson.info.description.includes(str)
            ) || []
          : [];

      const isPassTest = (obj: OpenAPIV3.Document) => {
        const checkServers = (arr: OpenAPIV3.ServerObject[]) => {
          const hasLocalhost = (arr: OpenAPIV3.ServerObject[]) =>
            arr.some((element) => element.url.includes("localhost"));
          return originalJson.servers.length > 0 ? !hasLocalhost(arr) : false;
        };
        const includeDummyServer = (arr: OpenAPIV3.ServerObject[]) => {
          const checkStrings = [
            "virtserver.swaggerhub.com",
            "petstore.swagger.io",
            "//0.0.0.0",
            "//127.0.0.1",
            "https://$(catalog.host)/api/e2e-fasttrack/e2e-fasttrack-business/rest",
          ];
          return arr.some(
            (obj) =>
              checkStrings.filter((str) => obj.url.includes(str)).length > 0 ||
              !obj.url.startsWith("http") ||
              obj.url.length < 9
          );
        };

        const result =
          obj.paths &&
          obj.info.title &&
          typeof obj.info.title === "string" &&
          !obj.info.title.includes("Swagger Petstore") &&
          checkServers(obj.servers) &&
          !includeDummyServer(obj.servers);

        return result;
      };
      if (isPassTest(originalJson)) {
        resultArray.push(defaultJson);
        descriptions.push(originalJson.info.description.substr(0, 100));
      } else {
        if (originalJson.paths) {
          errFiles.noPathObject.push(fileName);
        } else {
          errFiles.noTitle.push(fileName);
        }
      }
    } catch (error) {
      errFiles.other.push(`${fileName} / ${error}`);
      console.log(error);
    }
  })
)
  .then(() => {
    const sortedResultArray = [...resultArray].sort((a: Api, b: Api) => {
      const aTitle = a.title
        .split(" ")
        .join("")
        .toLowerCase();
      const bTitle = b.title
        .split(" ")
        .join("")
        .toLowerCase();
      return aTitle > bTitle ? 1 : -1;
    });
    const counter = descriptions
      .join(" ")
      .toLowerCase()
      .split(",")
      .join(" ")
      .split(" ")
      .reduce((counter: Record<string, number>, str: string) => {
        str in counter ? (counter[str] += 1) : (counter[str] = 1);
        return counter;
      }, {});
    const wordCounter = [...Object.entries(counter)]
      .sort((a, b) => a[1] - b[1])
      .map(([k, v]) => ({ [k]: v }));

    fs.writeFile(`apilist.json`, JSON.stringify(sortedResultArray), (error) => {
      if (error) console.log("Error1");
    });
    fs.writeFile(
      `descriptions.json`,
      JSON.stringify(descriptions),
      (error) => {}
    );
    fs.writeFile(
      `wordCounter.json`,
      JSON.stringify(wordCounter),
      (error) => {}
    );
    fs.writeFile(`errFile.json`, JSON.stringify(errFiles), (error) => {
      if (error) console.log("Error3");
    });
  })
  .catch((error) => console.log("Error2", error));

console.log(resultArray.length);
