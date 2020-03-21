import * as fs from 'fs'

const fileNames = fs.readdirSync('./openApiSpec3')
const fileNamesParts = fileNames.slice(1,1000)
console.log('fileNamesParts' ,fileNamesParts)

let resultArray = [];
let errFiles = {
  noPathObject:[],
  noTitle:[],
  other:[]
}

Promise.all(
  fileNamesParts.map(fileName => {
    try {
      console.log(fileName)
      let defaultJson = {
        "apiServiceId": "uLyMVe4XHi",
        "serviceName": "test1 API", // title
        "baseURL": [],  // 調査依頼
        "discription": "", // discription
        "category": ["SNS", "example2", "example3"], // 検討対象外
        "updated": "", // 今回は対象外。api-typesのリポジトリの更新日時を取ってくる
        "icon": "/default.png" // 対象外。デフォルトを埋め込む
      };
      const originalJson = JSON.parse(`${fs.readFileSync(`openApiSpec3/${fileName}`,'utf8')}`)
      defaultJson.apiServiceId = fileName.slice(0,-5)
      defaultJson.serviceName = originalJson.info.title
      defaultJson.baseURL = originalJson.servers
      // defaultJson.discription = originalJson.info.description
      if (
        originalJson.paths &&
        originalJson.info.title &&
        typeof originalJson.info.title === 'string' &&
        !originalJson.info.title.includes('Swagger Petstore')
        )
      {
        resultArray.push(defaultJson)
      } else {
        if(originalJson.paths) {
          errFiles.noPathObject.push(fileName)
        } else {
          errFiles.noTitle.push(fileName)
        }
      }
    }catch(error){
      errFiles.other.push(`${fileName} / ${error}`)
      console.log(error)
    }
  })
).then(() => {
  fs.writeFile(`apilist.json`, JSON.stringify(resultArray), (error) => {
    if (error) console.log('Error1')
  })
  fs.writeFile(`errFile.json`, JSON.stringify(errFiles), (error) => {
    if (error) console.log('Error3')
  })
}).catch(error => console.log('Error2',error));
