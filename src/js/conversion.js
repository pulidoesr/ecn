let jsonObject = {
  "name": "John",
  "age": 30,
  "city": "New York",
  "measurement": "\""  
};
let jsonString = JSON.stringify(jsonObject);
console.log("Original JSON String:", jsonString);
console.log("measurement:" + jsonObject.measurement)

let modifiedJsonString = jsonString.replace(/"/g, "'")
console.log("Modified JSON String:", modifiedJsonString);
