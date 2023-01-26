var http = require("http")
var fs = require("fs")

// get arg from command line
var myArgs = process.argv.slice(2)
var INSTANCE = myArgs[0]

// get config file
var CFG = require("../config/methode/" + INSTANCE + "/instance.json")

// set token file path
var TOKENFILE = "./config/methode/" + INSTANCE + "/.token.txt"

// set request parameters
var options = {
  "method": "POST",
  "hostname": CFG.hostname,
  "port": CFG.port,
  "path": CFG.path + "/v3/auth/login",
  "headers": {
    "cookie": "MRS_CONNECTION_TOKEN=",
    "content-type": "application/json"
  }
};

// execute request
var req = http.request(options, function (res) {
  var chunks = []
  res.on("data", function (chunk) {
    chunks.push(chunk)
  })
  res.on("end", function () {
    var body = Buffer.concat(chunks)
    save2file(body.toString())
  })
})
req.write(JSON.stringify({
  connectionId: CFG.connectionId,
  username: CFG.username,
  password: CFG.password,
  applicationId: CFG.applicationId,
  options: {loadConfig: false, showUserInfo: true, showGroups: true}
}))
req.end()

// save token in textfile
function save2file( body ){
  var out = JSON.parse(body)
  var token = out.result.token.value
  //console.log( "New session token created: " + token )
  fs.writeFile( TOKENFILE, token, (err) => {
    if (err) console.log(err)
  })
}