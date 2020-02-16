import { parse } from 'swagger-parser'
import { OpenAPI, OpenAPIV3 } from 'openapi-types'
import * as fs from 'fs'
import * as crypto from 'crypto'

const isV3 = (openapi: OpenAPI.Document): openapi is OpenAPIV3.Document => 'openapi' in openapi

const changeFunc = async (input: string | OpenAPI.Document, isYaml: boolean): Promise<OpenAPIV3.Document> => {
  const openapi = await parse(input, { parse: { json: !isYaml } })
  return isV3(openapi) ? openapi : await require('swagger2openapi').convertObj(openapi, { direct: true })
}

const targetJson = 'result_500.json'

const originalResultJson = JSON.parse(`${fs.readFileSync(targetJson,'utf8')}`)
const resultJson = originalResultJson.data.slice(0,4)

if(!fs.existsSync('swaggerHubJsonFiles')){
  fs.mkdirSync('swaggerHubJsonFiles')
}

resultJson.map(async resultJsonData => {
  const newJson = await changeFunc(resultJsonData,true);
  const serversHashed = crypto.createHash('sha256').update(`${newJson.servers}`,'utf8').digest('hex')
  fs.writeFile(`swaggerHubJsonFiles/${serversHashed}.json`, JSON.stringify(newJson), (error) => {
    if (error) console.log('Error',error)
  })
})
