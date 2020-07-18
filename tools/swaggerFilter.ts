import * as fetch from 'node-fetch'
import * as fs from 'fs'

const refCounter = (str) => {
  return str.split('ref').length - 1
} 

const Counter = (json) => {
  const strNumber = JSON.stringify(json).length;

  let strNumber1
  let strNumber2

  if(JSON.stringify(json.info) === undefined) {
    strNumber1 = 0
  } else {
    strNumber1 = JSON.stringify(json.info).length
  }
  if(JSON.stringify(json.paths) === undefined) {
    strNumber2 = 0
  } else {
    strNumber2 = refCounter(JSON.stringify(json.paths))
  }

  return {  
    total: strNumber,
    info: strNumber1,
    pathsref: strNumber2,
    openAPI: JSON.stringify(json.openapi)
  }
};

let resultData = []

const makeRandomURLList = async () => {
  // jsonへ書き込める文字数に限度があるので、スクレイピングしてくるページ数をiの値で調整
  for(let i = 1200; i < 1400; i++){
    (await fetch(
      `https://app.swaggerhub.com/apiproxy/specs?sort=UPDATED&order=ASC&page=${i}&limit=100`
    ))
    .json()
    .catch(error => {
      console.log('Error1',error)
    })
    .then(datas =>  {
      const Filtering = async (jsonData) => {
        for(let k = 0; k < 100; k++ ){
          (await fetch(
            jsonData.apis[k].properties[0].url
          ))
          .json()
          .catch(error => {
            console.log('Error2',error)
          })
          .then(datas => {
            console.log(i,k,jsonData.apis[k].properties[0].url)
            let data = {}
            data.api = jsonData.apis[k].properties[0].url
            // 文字数カウント
            const countNumber = Counter(datas)
            // 最初にpathが0のものは除いておく
            if (countNumber.pathsref < 1) return
            // total、info、pathsrefの量によってFilterをかける
            if(countNumber.total >75000){
              resultData.push(data)
              return
            } else if (countNumber.info > 500) {
              resultData.push(data)
              return
            } else if (countNumber.pathsref > 115) {
              resultData.push(data)
              return
            }
          })
          .catch(error => {
            console.log('Error3',error)
          })
        }
      }
      Filtering(datas);
    })
    .catch(error => {
      console.log('Error4',error)
    })
  }
  // 書き込むファイル名を適当に設定
  fs.writeFile('prodfile8.json', JSON.stringify({data:resultData}), (error) => {
    if (error) console.log('Error5',error)
  })

}

makeRandomURLList();