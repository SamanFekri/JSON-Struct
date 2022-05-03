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

## Custom types
You can define custom types and import them into your json-struct.json

Note: when you import a custom type both structs must have unique `$id`

Here is the example `example/simple/struct-import-person.jsonc`
```json5
{
    "$schema": "https://github.com/SamanFekri/JSON-Struct",
    "$id": "com.skings.personal",
    "import": {
        "address": "./struct-import-address.jsonc",
    },
    "struct": {
        "firstname": "string"
        "address": "address", // the address is a custom type that we import
    }
}

```

`address` type defines here Here is the example `example/simple/struct-import-address.jsonc`:
```json5
{
    "$schema": "https://github.com/SamanFekri/JSON-Struct",
    "$id": "com.skings.address",
    "struct": {
        "line1": "string",
        "line2": "string",
        "city": "string",
        "country": "string"
    }
}

```


## Required
You can use required fields as below
```json5
{
    "$schema": "https://github.com/SamanFekri/JSON-Struct",
    "struct": {
        "firstname": "string",
        // ...
        "address": {
            "line1": "string",
            "line2": "string",
            "city": "string",
            "country": "string"
        },
        //...
    },
    "required": ["firstname", "address.country"] // firstname and address country arerequired
}

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
