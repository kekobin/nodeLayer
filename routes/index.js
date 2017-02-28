'use strict';

var express = require('express');
var router = express.Router();
var util = require('../util/getData');
var path = require('path');
var config = require('../config/projectConfig');

for(var projectName in config) {
  console.log(projectName)
  var projectConfig = config[projectName];
  handleProjectRouter(projectName, projectConfig);
}

function handleProjectRouter(projectName, projectConfig) {
  var urlsConf = projectConfig.urlsConf;

  router.get('/' + projectName, function(req, res, next) {
    if(urlsConf == null || urlsConf.length === 0) {
      res.render( projectName + 'View/index', {});
    } else {
      util.getDatas(projectName, urlsConf,'data').done(function(data){
        res.render( projectName + 'View/index', data);
      });
    }
  });
}

module.exports = router;
