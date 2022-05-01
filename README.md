# JSON-Struct
JSON Struct is a vocabulary that allows you to annotate and validate JSON documents.

# Example
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
        "salary": "float", // in euros
        "is_happy": "boolean",
        "languages": ["string"]
    }
}
```
