var fs = require('fs');
var path = require('path');

//通过该方法能够使得前后端共享模版
exports.template = function(project, file) {
	var filePath = path.join(__dirname, '../views/' + project + 'View/' + file);
	var tplStr = fs.readFileSync(filePath);
	
	console.log('=======filePath of ejs===========' + filePath);

	return String(tplStr);
};