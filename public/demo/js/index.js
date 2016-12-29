$(function() {
	var baseTplUrl = '',
		// dataUrl = 'http://hd.huya.com/201608hzls/js/json/01.json';
		dataUrl = 'http://mobilegame.huya.com/reward/get_reward_state?type=0';

	$('#changeData').click(function(e) {
		$.ajax({
			url: dataUrl,
			dataType: 'jsonp',
	        jsonpCallback: 'dataCallback1',
			success: function(resp) {
				console.log(JSON.stringify(resp))
var data = {"reward":[{"status":9,"taskid":9},{"status":9,"taskid":9},{"status":9,"taskid":3},{"status":9,"taskid":4},{"status":9,"taskid":5},{"status":3,"taskid":6},{"status":3,"taskid":7}]}
				
				var t = $('#tpl1').html()
				var template = _.template(t);
				var html = template({
					data0: data
				})

				$('#list').html(html);
			}
		});
	});
});