import {JSONStruct} from './validator.js'
import * as fs from 'fs';

let json_struct = new JSONStruct()
json_struct.loadFileSync('../examples/simple/struct.jsonc')

let raw = fs.readFileSync('../examples/simple/example.json')
let data = JSON.parse(raw);

console.log(json_struct.verify(data))
