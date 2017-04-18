//构建项目对应的接口url及返回的标识(代表接口返回的内容，切将在模版中使用)
var config = {
	"currentProject": "nodeLayerDemo",
	"aprilFoolWeb2017": {
		"urlsConf": {
			"data0": "http://www.huya.com/hd/foolsboom/cache.php?m=FoolsBoom&do=ajaxGetCombatInfo&convert=1",
			"data1": "http://www.huya.com/hd/foolsboom/cache.php?m=FoolsBoom&do=ajaxGetFoolInfo&convert=1"
		}
	},
	"nodeLayerDemo": {
		"urlsConf": {
			"data1": "http://www.huya.com/hd/foolsboom/cache.php?m=FoolsBoom&do=ajaxGetFoolInfo&convert=1"
		}
	}
}

module.exports = config;