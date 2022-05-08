import {JSONStruct} from './validator.js'
import * as fs from 'fs';

// let json_struct = new JSONStruct()
// json_struct.loadFileSync('../examples/simple/struct.jsonc')

// let raw = fs.readFileSync('../examples/simple/example.json')
// let data = JSON.parse(raw);

//
// console.log(json_struct.verify(data))
//
// json_struct.loadFileSync('../examples/simple/struct-required.jsonc')
// data = {"firstname": "saman"}
// console.log(json_struct.verify(data))
// data = {"firstname": "saman", "address": {"country": "Italy"}}
// console.log(json_struct.verify(data))

let json_struct = new JSONStruct()
json_struct.loadFileSync('../examples/simple/struct-import-personal.jsonc')
let  data = {
  "address": {
    "line1": false
}
}
// let x = "address[0].line[1]"
// console.log(x.match(/(?<=\[).+?(?=\])/g))
// console.log("result: " , json_struct.getPrimitiveTypes("address.line1"));
// console.log("result: " , json_struct.getPrimitiveTypes("extra"));
console.log("result: " , json_struct.getPrimitiveTypes("languages[0]"));

