import JSON5 from 'json5';
import * as fs from 'fs';


class JSONStruct {
  schema = {}
  BUILTIN_TYPES = {
    INT: "int",
    NUMBER: "number",
    STRING: "string",
    BOOLEAN: "boolean",
    OBJECT: "object",
    ANY: "any"
  }
  types = {
    'builtin': Object.keys(this.BUILTIN_TYPES).map(key => this.BUILTIN_TYPES[key])
  }
  constructor() {
  }
  
  loadFileSync(path, options= {encoding:'utf8', flag:'r'}) {
    let text = fs.readFileSync( path, options)
    this.schema = JSON5.parse(text)
    if(!this.getStruct()) {
      return undefined
    }
    return this
  }
  
  verify(data) {
    data = JSON.parse(JSON.stringify(data))
    if(!this.getStruct()) {
      return false
    }
    return this.verifyStruct(data, this.schema.struct)
  }
  
  verifyStruct(data, struct) {
    let keys = Object.keys(data);
    for(let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let isOk = true
      if(struct[key]) {
        switch (typeof struct[key] ) {
          
          case this.BUILTIN_TYPES.OBJECT:
            if(Array.isArray(struct[key])) {
              if(struct[key].length > 0) {
                isOk = this.verifyField(data[key], struct[key])
              } else {
                isOk = this.verifyField(data[key], [this.BUILTIN_TYPES.ANY])
              }
            } else {
              if(struct[key] === {}) {
                isOk = this.verifyField(data[key], [this.BUILTIN_TYPES.OBJECT])
              } else {
                isOk = this.verifyStruct(data[key], struct[key])
              }
            }
            break
          
          case this.BUILTIN_TYPES.STRING:
            isOk = this.verifyField(data[key], struct[key].split('|').map(item => item.trim()))
            break
        }
      }
      if(!isOk) {
        return false
      }
    }
    return true
  }
  
  verifyField(value, types) {
    for(let i =0; i < types.length; i++) {
      if(this.verifyFiledByType(value, types[i])) {
        return true
      }
    }
    return false
  }
  
  verifyFiledByType(value, type) {
    if(!Array.isArray(value)) {
      switch (type) {
        case this.BUILTIN_TYPES.ANY:
          return true
        case this.BUILTIN_TYPES.INT:
          return Number.isInteger(value)
        case this.BUILTIN_TYPES.NUMBER:
          return (typeof value === this.BUILTIN_TYPES.NUMBER)
        case this.BUILTIN_TYPES.STRING:
          return (typeof value === this.BUILTIN_TYPES.STRING)
        case this.BUILTIN_TYPES.BOOLEAN:
          return (typeof value === this.BUILTIN_TYPES.BOOLEAN)
        case this.BUILTIN_TYPES.OBJECT:
          return (typeof value === this.BUILTIN_TYPES.OBJECT)
      }
    } else {
      let isOk = true
      let isTypeArray = Array.isArray(type)
      for(let i = 0; i< value.length; i++) {
        if(isTypeArray) {
          isOk = this.verifyField(value[i], type === [] ? ["any"] : type)
        } else {
          isOk = this.verifyFiledByType(value[i], type)
        }
      }
      return isOk
    }
    return true
  }
  
  getStruct() {
    return this.schema.struct;
  }
  
}

export {JSONStruct}
