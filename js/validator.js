import JSON5 from 'json5';
import * as fs from 'fs';


class JSONStruct {
  schema = {
    import: false
  }
  BUILTIN_TYPES = {
    INT: "int",
    NUMBER: "number",
    STRING: "string",
    BOOLEAN: "boolean",
    OBJECT: "object",
    ANY: "any"
  }
  
  PRIMITIVE_TYPES = {
    INT: "int",
    NUMBER: "number",
    STRING: "string",
    BOOLEAN: "boolean",
  }
  PRIMITIVE_TYPES_ARRAY = Object.values(this.PRIMITIVE_TYPES)
  
  importedTypes = new Set()
  
  types = {}
  
  constructor() {
  }
  
  loadFileSync(path, options= {encoding:'utf8', flag:'r'}, loadedTypes = new Set()) {
    let text = fs.readFileSync(path, options)
    this.schema = JSON5.parse(text)
    if(!this.getStruct()) {
      return undefined
    }
    if(this.schema.import) {
      if(!this.schema.$id) {
        throw new Error("When you use import the schema must have id")
      }
      if(!loadedTypes.has(this.schema.$id)) {
        Object.keys(this.schema.import).forEach(type => {
          this.schema.import[type] = this.pathMerger(path.split('/').slice(0, -1).join('/'), this.schema.import[type])
          console.log(this.schema.import[type])
          this.importType(type, this.schema.import[type], options)
          if(this.importedTypes.has(this.schema.$id)) {
            throw new Error(`Found a recycled dependency ${type} and ${this.schema.$id}`)
          }
        })
        this.importedTypes.add(this.schema.$id)
      }
    }
    if(this.schema.required) {
      if(typeof this.schema.required === "string") {
        this.schema.required = [this.schema.required]
      }
      if(!Array.isArray(this.schema.required)) {
        console.log(`required expected key or array of keys but get ${this.schema.required}`)
      }
    }
    return this
  }
  
  verify(data) {
    data = JSON.parse(JSON.stringify(data))
    if(this.schema.required) {
      for(let i =0; i < this.schema.required.length; i++) {
        if(!this.dataHas(data, this.schema.required[i])) {
          console.log(`${this.schema.required[i]} is required by the schema`)
          return false
        }
      }
    }
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
      if(this.types[type]) {
        return this.types[type].verify(value)
      }
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
  
  dataHas(data, key) {
    let keyParts = key.split('.')
    let item = data
    for (let i=0; i<keyParts.length; i++) {
      item = item[keyParts[i]]
      if(!item) {
        return false
      }
    }
    return true
  }
  
  importType(name, path, options) {
    let json_schema = new JSONStruct()
    json_schema.loadFileSync(path, options, this.importedTypes)
    console.log(json_schema)
    if(!json_schema.schema.$id) {
      throw new Error(`Struct (${name})  imported in ${this.schema.$id}. so it must have an id`)
    }
    this.importedTypes.add(json_schema.importedTypes)
    this.types[name] = json_schema
  }
  
  pathMerger(path1, path2) {
    if(path2.charAt(0) === '/') {
      return path2
    }
    return `./${path1}/${path2}`
  }
  
  getPrimitiveTypes(keyIdentifier) {
    let insideBracketsREGEX = /(?<=\[).+?(?=\])/g
    let struct = this.getStruct()
    if(!struct) {
      throw new Error("The Struct is not Defined")
    }
    let keyParts = keyIdentifier.split('.')
    let subStruct = struct
    for(let i = 0; i < keyParts.length; i++) {
      let indexes = keyParts[i].match(insideBracketsREGEX)
      if(!indexes) {
        subStruct = subStruct[keyParts[i]]
      } else {
        subStruct = subStruct[keyParts[i].split('[')[0]]
        indexes = indexes.map(index => parseInt(index.trim()))
        try {
          for (let j = 0; j < indexes.length; j++) {
            subStruct = subStruct[indexes[j]]
          }
        } catch (e) {
          console.log(e)
          console.log(`${keyParts[i]} is not valid in the schema`)
          return undefined
        }
      }
      
      if(typeof subStruct === 'string') {
        return subStruct.split("|").map(type => {
          type = type.trim()
          if(this.PRIMITIVE_TYPES_ARRAY.includes(type)) {
            return type
          }
          if(this.types[type]) {
            return this.types[type].getPrimitiveTypes(keyParts.slice(i + 1).join("."))
          }
          console.log(`key: ${keyIdentifier} does not have a primitive type and have ${type} which is not supported as a primitive type`)
          return undefined
        }).filter(item => item !== undefined).flat()
      }
      
      console.log(keyParts[i], subStruct)
    }
  }
  
}

export {JSONStruct}
