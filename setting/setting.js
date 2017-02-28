var projectConfig = require('../config/projectConfig.js');
var fs = require('fs');

module.exports = function(name) {
	if(!name) return;

	//根据传入的项目名称更改项目的配置文件:修改当前的projuect名,添加对应项目名的urls信息
	var filePath = 'config/projectConfig.js';
	var data = fs.readFileSync(filePath, 'utf-8');
	//获取{}内的配置信息
	var configMainStr = /\{([\s\S]*)\}/.exec(data)[0];
	var configData = JSON.parse(configMainStr);

	// delete configData[configData.currentProject];
	if(configData.currentProject != name) {
		configData.currentProject = name;
		configData[name] = {
			urlsConf: {}
		};

		//将之前{}的配置内容替换为修改后的信息，并写入到配置文件
		var newConfig = data.replace(configMainStr, JSON.stringify(configData));
		fs.writeFileSync(filePath, newConfig, 'utf-8');
	}

	//创建对应项目的开发目录
	var publicDir = {
		root: 'public/' + name,
		js:  'public/' + name + '/js',
		img: 'public/' + name + '/img',
		css: 'public/' + name + '/css',
		sass: 'public/' + name + '/sass'
	};

	var viewDir = {
		root: 'views/' + name + 'View',
		tpl: 'views/' + name + 'View/template'
	};

	if(!fs.existsSync(publicDir.root)) {
		console.log('该目录不存在');
		for(var key in publicDir) {
			mkdir('-p', publicDir[key]);
		}
		//创建默认文件
		fs.closeSync(fs.openSync(publicDir.js + '/index.js', 'w'));
		fs.closeSync(fs.openSync(publicDir.sass + '/index.scss', 'w'));
		fs.closeSync(fs.openSync(publicDir.css + '/index.css', 'w'));
	} else {
		console.log('该目录已存在');
	}

	if(!fs.existsSync(viewDir.root)) {
		console.log('该目录不存在');
		for(var key in viewDir) {
			mkdir('-p', viewDir[key]);
		}

		cp('-rf', 'views/index.ejs', viewDir.root);

		//替换资源引用路径的项目名称为当前项目名称
		var projectIndexPath = viewDir.root + '/index.ejs';
		var viewIndex = fs.readFileSync(projectIndexPath, 'utf-8');
		var viewIndexChangePath = viewIndex.replace(/\{\{(.+)\}\}/g, name);
		fs.writeFileSync(projectIndexPath, viewIndexChangePath, 'utf-8');
	} else {
		console.log('该目录已存在');
	}
}