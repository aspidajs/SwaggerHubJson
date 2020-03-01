import * as fs from 'fs'

const fileNames = fs.readdirSync('./swaggerHubJsonFiles2.1')
const fileNamesParts = fileNames.slice(8001,10000)
console.log(fileNamesParts)

let resultArray = [];

Promise.all(
  fileNamesParts.map(fileName => {
    try {
      console.log(fileName)
      let defaultJson = {
        "apiServiceId": "uLyMVe4XHi",
        "service": "test1 API", // title
        "owner": "default",  // 調査依頼
        "discription": "apis description will be appear here", // discription
        "category": ["SNS", "example2", "example3"], // 検討対象外
        "updated": "a month ago", // 今回は対象外。api-typesのリポジトリの更新日時を取ってくる
        "numberOfDownloads": 12345, // 今回は対象外。api-typesのリポジトリのDL数を取ってくる。
        "icon": "default.png" // 対象外。デフォルトを埋め込む。
      };
      const originalJson = JSON.parse(`${fs.readFileSync(`swaggerHubJsonFiles2.1/${fileName}`,'utf8')}`)
      defaultJson.apiServiceId = fileName.slice(0,-5)
      defaultJson.service = originalJson.info.title
      defaultJson.discription = originalJson.info.description
      if (originalJson.paths) {
        resultArray.push(defaultJson)
      }
    }catch(error){
      console.log('Error3',error)
    }
  })
).then(() => {
  fs.writeFile(`sortResorce6.json`, JSON.stringify({data:resultArray}), (error) => {
    if (error) console.log('Error1')
  })
}).catch(error => console.log('Error2',error));
