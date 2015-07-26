var fs = require('fs')
var Promise = require("bluebird")
var crypto = require('crypto')

function objectPath(key) {
  var shasum = crypto.createHash('sha1');
  shasum.update(key);
  return '/tmp/' + shasum.digest('hex');
}

module.exports = function(url, callback) {

  var file = objectPath(url)
  return new Promise(function(fulfill, reject){

    fs.readFile(file, function(err, data) {
        if (err) {
          callback().then(function(result){
            fs.writeFile(file, JSON.stringify(result), function(err) {
              if (err) {
                console.error("Cache write error: " + err);
              }else{
                console.info("Cache write for [" + url + "] to [" + file + "]");
              }
            })
            fulfill(result)
          }).catch(reject)

        } else {
          console.info("Cache hit for [" + url + "] from [" + file + "]");
          fulfill(JSON.parse(data))
        }
    });


  })

}
