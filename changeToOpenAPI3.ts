import { parse } from 'swagger-parser'
import { OpenAPI, OpenAPIV3 } from 'openapi-types'
import * as fs from 'fs'

export interface Template {
  baseURL: string
  types?: string
  files: {
    file: string[]
    methods: string
  }[]
}

const isV3 = (openapi: OpenAPI.Document): openapi is OpenAPIV3.Document => 'openapi' in openapi

const changeFunc = async (input: string | OpenAPI.Document, isYaml: boolean): Promise<Template> => {
  const openapi = await parse(input, { parse: { json: !isYaml } })
  return isV3(openapi) ? openapi : await require('swagger2openapi').convertObj(openapi, { direct: true })
}

const targetJson = 'result_500.json'

const originalResultJson = JSON.parse(`${fs.readFileSync(targetJson,'utf8')}`)
const resultJson = originalResultJson.data
let resultData = []

Promise.all(resultJson.map(async resultJsonData => {
  const newJson = await changeFunc(resultJsonData,true);
  resultData.push(newJson);
})).then(()=>{
  fs.writeFile(`new_${targetJson}`, JSON.stringify({data:resultData}), (error) => {
    if (error) console.log('Error',error)
  })
})
