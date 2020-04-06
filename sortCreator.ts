import * as fs from 'fs'
import { OpenAPIV3 } from 'openapi-types'

const fileNames = fs.readdirSync('./openApiSpec3')
const fileNamesParts = fileNames.slice(1,10000)
console.log('fileNamesParts' ,fileNamesParts)

let resultArray = [];
let errFiles = {
  noPathObject:[],
  noTitle:[],
  other:[]
}
type Api = {
  apiServiceId: string
  title: string
  baseURL: OpenAPIV3.ServerObject[]
  discription: string
  category: string[]
  updated: string
  icon: string
}

Promise.all(
  fileNamesParts.map(fileName => {
    try {
      console.log(fileName)
      let defaultJson: Api = {
        "apiServiceId": "uLyMVe4XHi",
        "title": "test1 API", // title
        "baseURL": [],  // 調査依頼
        "discription": "", // discription
        "category": ["SNS", "example2", "example3"], // 検討対象外
        "updated": "", // 今回は対象外。api-typesのリポジトリの更新日時を取ってくる
        "icon": "/default.png" // 対象外。デフォルトを埋め込む
      };
      const originalJson: OpenAPIV3.Document = JSON.parse(`${fs.readFileSync(`openApiSpec3/${fileName}`,'utf8')}`)
      defaultJson.apiServiceId = fileName.slice(0,-5)
      defaultJson.title = originalJson.info.title
      defaultJson.baseURL = originalJson.servers

      const isPassTest = (obj: OpenAPIV3.Document) => {
        const checkServers = (arr: OpenAPIV3.ServerObject[]) => {
          const hasLocalhost = (arr: OpenAPIV3.ServerObject[]) => arr.some(element =>
            element.url.includes('localhost')
          )
          return originalJson.servers.length > 0 ? !hasLocalhost(arr) : false
        }
        const includeSwaggerMockServer = (arr: OpenAPIV3.ServerObject[]) => {
          const checkStrings = [
            'virtserver.swaggerhub.com',
            'petstore.swagger.io',
            '://0.0.0.0'
          ]
          return arr.some( obj =>
            checkStrings.filter(str => obj.url.includes(str)).length > 0
          )
        }

        const result =
          obj.paths &&
          obj.info.title &&
          typeof obj.info.title === 'string' &&
          !obj.info.title.includes('Swagger Petstore') &&
          checkServers(obj.servers) &&
          !includeSwaggerMockServer(obj.servers)

        return result
      }
      if (isPassTest(originalJson))
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

console.log(resultArray.length)
