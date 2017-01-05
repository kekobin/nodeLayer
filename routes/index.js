'use strict';

var express = require('express');
var router = express.Router();
var util = require('../util/getData');
var path = require('path');
var config = require('../config/projectConfig');

for(var projectName in config) {
  console.log(projectName)
  if(projectName == 'currentProject') continue;

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
