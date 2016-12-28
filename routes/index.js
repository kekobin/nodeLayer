'use strict';

var express = require('express');
var router = express.Router();
var util = require('../util/getData');
var path = require('path');
var config = require('../config/projectConfig');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   var urls = [
//   	'http://hd.huya.com/201608hzls/js/json/01.json',
//   	'http://hd.huya.com/201608hzls/js/json/021.json',
//   	'http://hd.huya.com/201608hzls/js/json/03.json',
//   	'http://hd.huya.com/201608hzls/js/json/04.json'
//   	// 'http://hd.huya.com/201608hzls/js/json/024.json',
//   	// 'http://hd.huya.com/201608hzls/js/json/025.json'
//   ];

//   util.getDatas(urls,'data').done(function(data){
//     res.render('index',data);
//   })
// });

for(var projectName in config) {
  var projectConfig = config[projectName];

  handleProjectRouter(projectName, projectConfig);
}

function handleProjectRouter(projectName, projectConfig) {
  var urls = projectConfig.urls;
  var routeName = projectName === 'root' ? '' : projectName;

  router.get('/' + routeName, function(req, res, next) {

    if(urls == null || urls.length === 0) {
      res.render( projectName + 'View/index', {});
    } else {
      util.getDatas(urls,'data').done(function(data){
        res.render( projectName + 'View/index', data);
      });
    }
  });
}

module.exports = router;
