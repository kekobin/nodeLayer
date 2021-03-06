'use strict';

var http = require('http');
var https = require('https');
var Q = require('q');
var eachAsync = require('each-async');
var requestify = require('requestify');

var Reuest = {
  http: http,
  https: https
};

//构建一个本地的缓存，缓存一个项目的http请求，缓存在内存中，缓存时间为60s
var cdnCustom = {};

var util = {
  getDatas: function(projectName, urlsConf, key, req) {
    var deferred = Q.defer();
    var cookies = req.cookies;
    var noCache = !!req.query.cache;//在请求的url上面加上?cache=1去掉接口访问的缓存

    //对每一个页面的接口请求，请求到的数据缓存到内存中60s
    if(typeof cdnCustom[projectName] == 'object' && !noCache) {
      var expires = cdnCustom[projectName].expires, cacheTime = 60000;

      if((Date.now() - expires) > cacheTime) {
        delete cdnCustom[projectName];
        getFromServer.call(this);
      } else {
        console.log('====get data from cache====');
        deferred.resolve(cdnCustom[projectName].data);
      }
    } else {
      getFromServer.call(this);
    }

    function getFromServer() {
      cdnCustom[projectName] = {
        expires: Date.now(),
        data: {}
      };
      
      var promiseArr = [];
      var uid = 0, self = this, urlsNameArr = [], urlsArr = [];

      // for (var i = 0; i < urlArr.length; i++) {
      //   var url = urlArr[i];
      //   var def = this.requestUrl(url);
      //   promiseArr.push(def);
      // }
      for(var name in urlsConf) {
        urlsNameArr.push(name);
        urlsArr.push(urlsConf[name]);
      }

      eachAsync(urlsArr, function (url, index, done) {
        var urlName = urlsNameArr[index];
        var def = self.requestUrl(url, urlName, cookies);
        promiseArr.push(def);

        if(promiseArr.length === urlsArr.length) {
          Q.all(promiseArr).then(function(data) {
            var ret = {};
            data.forEach(function(result) {
              // var key = (key || 'data') + (uid++);
              ret[result.urlName] = JSON.parse(result.data);
            });
            promiseArr = [];

            //缓存到内存
            cdnCustom[projectName].data = ret;

            deferred.resolve(ret);
          }, function() {
            deferred.resolve(null);
          });
        }

        done();
      }, function (error) {
        console.log('finished');
      });
    }
    
    return deferred.promise;
  },
  requestUrl: function(url, urlName, cookies) {
    var protocol = /https\:/.test(url) ? https : http;
    console.log('请求的url地址是:' + url);
    var deferred = Q.defer();

    // protocol.get(url, function(res){
    //   var statusCode = res.statusCode;
    //   var contentType = res.headers['content-type'];
    //   var error;
    //   if (statusCode !== 200) {
    //     error = new Error(`Request Failed.\n` +
    //       `Status Code: ${statusCode}`);
    //   }
    //   if (error) {
    //     console.log(error.message);
    //     deferred.resolve(null);
    //     return;
    //   }
    //   var rawData = '';
    //   res.on('data', function(chunk) {
    //     rawData += chunk;
    //   });

    //   res.on('end', function() {
    //     deferred.resolve({
    //       urlName: urlName,
    //       data: rawData
    //     });
    //   });
    // }).on('error', function(e){
    //   deferred.resolve(null);
    //   console.log(`Got error: ${e.message}`);
    // });
    
    //通过requestify带上对应的cookies
    requestify.get(url, {
        cookies: cookies
    }).then(function(response) {
        var data = response.body;

        deferred.resolve({
          urlName: urlName,
          data: data
        });
    }).fail(function(response) {
      deferred.resolve(null);
      console.log(`problem with request: ${response}`);
    });

    return deferred.promise;
  }
}

module.exports = util;