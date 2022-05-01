# JSON-Struct
JSON Struct is a vocabulary that allows you to annotate and validate JSON documents.

# Examples

## Basic
This is a simple example of vocabulary

`examples/simple/struct.jsonc`
```json5
{
    "$schema": "https://github.com/SamanFekri/JSON-Struct",
    "struct": {
        "firstname": "string", 
        "lastname": "string",
        "age": "int",
        "address": { 
            "line1": "string",
            "line2": "string",
            "city": "string",
            "country": "string"
        },
        "salary": "number", // in euros
        "is_happy": "boolean",
        "languages": ["string"]
    }
}
```

## Multiple types
Defining a field with multiple type.(exp. string and int) 
```json
"id": "string|int"
```

# Types
- Integer:`int`
- Number: `number`
- String: `string`
- Boolean: `boolean`
- JSON Object: (`object`, `{}`) 
  - Note: It also accepts nested objects
- Array: (`[]`, `["any"]`)
  - Example: `["string"]` this is an array of string
  - Note: It also accepts nested arrays and array of objects
- Anything: `any`
