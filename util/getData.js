'use strict';

var http = require('http');
var https = require('https');
var Q = require('q');

var Reuest = {
  http: http,
  https: https
}

var util = {
  getDatas: function(urlArr, key) {
    var deferred = Q.defer();
    var promiseArr = [];
    var uid = 0;
    for (var i = 0; i < urlArr.length; i++) {
      var url = urlArr[i];
      var def = this.requestUrl(url);
      promiseArr.push(def);
    }
    Q.all(promiseArr).then(function(data) {
      var ret = {};
      data.forEach(function(result) {
        // var key = (key || 'data') + (uid++);
        ret[(key || 'data') + (uid++)] = JSON.parse(result);
      });
      promiseArr = [];
      deferred.resolve(ret);
    }, function() {
      deferred.resolve(null);
    })
    return deferred.promise;
  },
  requestUrl: function(url) {
    var protocol = /https\:/.test(url) ? https : http;
    console.log('请求的url地址是:' + url);
    var deferred = Q.defer();

    protocol.get(url, function(res){
      var statusCode = res.statusCode;
      var contentType = res.headers['content-type'];
      var error;
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\n` +
          `Status Code: ${statusCode}`);
      }
      if (error) {
        console.log(error.message);
        deferred.resolve(null);
        return;
      }
      var rawData = '';
      res.on('data', function(chunk) {
        rawData = chunk;
      });

      res.on('end', function() {
        deferred.resolve(rawData);
      });
    }).on('error', function(e){
      deferred.resolve(null);
      console.log(`Got error: ${e.message}`);
    });

    return deferred.promise;
  }
}

module.exports = util;