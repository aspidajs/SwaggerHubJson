import * as fs from 'fs'

const fileNames = fs.readdirSync('./openApiSpec3')
const fileNamesParts = fileNames.slice(1,1000)
console.log('fileNamesParts' ,fileNamesParts)

let resultArray = [];

Promise.all(
  fileNamesParts.map(fileName => {
    try {
      console.log(fileName)
      let defaultJson = {
        "apiServiceId": "uLyMVe4XHi",
        "service": "test1 API", // title
        "owner": "default",  // 調査依頼
        "discription": "", // discription
        "category": ["SNS", "example2", "example3"], // 検討対象外
        "updated": "a month ago", // 今回は対象外。api-typesのリポジトリの更新日時を取ってくる
        "icon": "default.png" // 対象外。デフォルトを埋め込む
      };
      const originalJson = JSON.parse(`${fs.readFileSync(`openApiSpec3/${fileName}`,'utf8')}`)
      defaultJson.apiServiceId = fileName.slice(0,-5)
      defaultJson.service = originalJson.info.title
      // defaultJson.discription = originalJson.info.description
      if (originalJson.paths) {
        resultArray.push(defaultJson)
      }
    }catch(error){
      console.log('Error3',error)
    }
  })
).then(() => {
  fs.writeFile(`apilist.json`, JSON.stringify(resultArray), (error) => {
    if (error) console.log('Error1')
  })
}).catch(error => console.log('Error2',error));
