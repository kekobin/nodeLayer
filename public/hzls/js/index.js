$(document).ready(function(){
	var baseUrl = 'http://hd.huya.com/201608hzls/';

	//活动规则切换
	$(".header_bg").on("click","a",function(){
		$(this).siblings().removeClass("on")
		.end().addClass("on");
		if($(this).index() == 1){
			$("#rule_bg").show();
			$(".list_bg,.show_bg,.hero_bg,.head_bg").hide();
		}else{
			$("#rule_bg").hide();
			$(".list_bg,.show_bg,.hero_bg,.head_bg").show();
		}
	});
	
	$(".list_main").niceScroll({
			cursorcolor:"#2A3D5E",
			cursoropacitymin:1,
			cursorwidth: "5px",
			cursorborder:0
	});
	//获取最强分队数据
	var team_page_num = 8;//每页显示8条数据
	var len;
	var page_num = 1;
	$("#strongest_team_page").createPage({
		pageCount:5,
		current:1,
		backFn:function(p){
			$.ajax({
				url: baseUrl + "js/json/02"+p+".json",
				dataType:"json",
				data:{
					page:p
				},
				success:function(res){
					//console.log(res);
					if(res.status == 200){
						var html = ejs.render($('#teamResult').html(), res);
						$("#team_result").html(html);
					}
				}
			});
		}
	});
	//最强战队分页
	var queryCond = 0;//筛选条件
	var team_name_input = "";
	var leader_name_input = "";

	
	$("#sure_page").on("click",function(){
		page_num = parseInt($("#page_num").val());
		if(page_num <= 0 || page_num > 5 || isNaN(page_num)){
			alert("请输入合法页码");
			return;
		};
		$("#strongest_team_page").html("");$("#strongest_team_page").unbind("click");
		$.ajax({
			url: baseUrl + "js/json/02"+page_num+".json",
			dataType:"json",
			data:{
				page:page_num,
				nick:leader_name_input,
				teamName:team_name_input,
				queryCond:queryCond
			},
			success:function(res){
				//console.log(res);
				if(res.status == 200){
					var html = template('team_result_script', res);
					$("#team_result").html(html);
				}
			}
		});
		$("#strongest_team_page").createPage({
			pageCount:5,
			current:page_num,
			backFn:function(p){
				$("#page_num").val("");
				$.ajax({
					url: baseUrl + "js/json/02"+p+".json",
					dataType:"json",
					data:{
						page:p,
						nick:leader_name_input,
						teamName:team_name_input,
						queryCond:queryCond
					},
					success:function(res){
						//console.log(res);
						if(res.status == 200){
							var html = template('team_result_script', res);
							$("#team_result").html(html);
						}
					}
				});
			}
		});
	});
	//搜索按钮
	function do_search(){
		var notenough = $("#not_enough").is(':checked') ? 8 : 0;
		var not_tds = $("#not_tds").is(':checked') ? 1 : 0;
		var not_mfs = $("#not_mfs").is(':checked') ? 2 : 0;
		var not_ms = $("#not_ms").is(':checked') ? 4 : 0;
		team_name_input = $("#team_name_input").val();
		leader_name_input = $("#leader_name_input").val();
		queryCond = notenough + not_tds + not_mfs + not_ms;
		$.ajax({
			url: "http://www.huya.com/hd/xerath/index.php?m=Xerath&do=ajaxGetTeamRank",
			dataType:"jsonp",
			data:{
				nick:leader_name_input,
				teamName:team_name_input,
				queryCond:queryCond
			},
			jsonp:"jsonp",
			success:function(res){
				//console.log(res);
				if(res.status == 200){
					var html = template('team_result_script', res);
					$("#team_result").html(html);
					len = res.total;
					$("#strongest_team_page").html("");$("#strongest_team_page").unbind("click");
					$("#strongest_team_page").createPage({
						pageCount:Math.ceil(len / team_page_num),
						current:1,
						backFn:function(p){
							$.ajax({
								url: "http://www.huya.com/hd/xerath/index.php?m=Xerath&do=ajaxGetTeamRank",
								dataType:"jsonp",
								jsonp:"jsonp",
								data:{
									page:p,
									nick:leader_name_input,
									teamName:team_name_input,
									queryCond:queryCond
								},
								success:function(res){
									//console.log(res);
									if(res.status == 200){
										var html = template('team_result_script', res);
										$("#team_result").html(html);
									}
								}
							});
						}
					});
				}
			}
		});
	}
	$("#sure_search").on("click",function(){
		do_search();
	});
	$(".search_l").on("click","input",function(){
		do_search();
	});
	//申请加入
	$("#team_result").on("click",".join",function(){
		alert("活动已结束");
		return false;
		if(!NAV_UTIL.isLogin()){
			NAV_UTIL.checkLogin();
			return;
		}else{
			var teamId = $(this).attr("data-teamId");
			$.ajax({
				url: "http://www.huya.com/hd/xerath/index.php?m=Xerath&do=ajaxApplyJoin",
				dataType:"jsonp",
				jsonp:"jsonp",
				data:{
					teamId:teamId
				},
				success:function(res){
					//console.log(res);
					if(res.status == 200){
						alert("已向队长申请，请等候");
						window.location.reload();
					}else{
						alert(res.msg);
					}
				}
			});
		}
	});
	//查看战队
	$("#team_result").on("click",".look",function(){
		alert("活动已结束");
		return false;
		var data_leaderId = $(this).attr("data-leaderId");
		$.ajax({
			url: "http://www.huya.com/hd/xerath/index.php?m=Xerath&do=ajaxGetTeamInfo",
			dataType:"jsonp",
			jsonp:"jsonp",
			data:{
				leaderUid:data_leaderId
			},
			success:function(res){
				//console.log(res);
				if(res.status == 200){
					var html = template('look_team_result_script', res);
					$("#look_team_result").html(html);
					$("#look_team_box").show();
					$(".account-login-mask").show();
				}
			}
		});
	});
	//最强战队hover、最强英雄hover
	$("#team_result,#must_tds,#must_mfs,#must_ms").on("mouseover","li",function(){
		$(this).siblings().removeClass("hover")
			.end().addClass("hover");
	});
	//榜单滚动条
	$(".hero_over").niceScroll({
		cursorcolor:"#2A3D5E",
		cursoropacitymin:1,
		cursorwidth: "5px",
		cursorborder:0
	});
	
	//榜单切换
	$("#must").on("click","span",function(){
		var data_title = "#" + $(this).attr("data-title");
		$(this).siblings().removeClass("hover")
			   .end().addClass("hover");
		if(data_title == "#must_tds"){
			$("#role_technogy").html("攻击力");
		}
		if(data_title == "#must_mfs"){
			$("#role_technogy").html("魔法值");
		}
		if(data_title == "#must_ms"){
			$("#role_technogy").html("治疗术");
		}
		$(".hero_over ul").hide();
		$(data_title).show();
	});
	//我的战队
	//我的战队
	var team_id;
	$("#my_team").on("click",function(){
		alert("活动已结束");
		return false;
		if(!NAV_UTIL.isLogin()){
			NAV_UTIL.checkLogin();
			return;
		}else{
			var uid = NAV_UTIL.getUserInfo().yyID;
			$.ajax({
				type:"get",
				url: "http://www.huya.com/hd/xerath/index.php?m=Xerath&do=ajaxGetTeamInfo",
				dataType:"jsonp",
				jsonp:"jsonp",
				data:{
					leaderUid:uid
				},
				success:function(res){
					//console.log(res);
					if(res.status == 200){
						//没有创建战队
						if(res.data.leaderUid == 0){
							$("#creat_team").show();
							$(".account-login-mask").show();
							return;
						}
						team_id = res.data.teamId;
						var html = template('my_team_result_script', res);
						$("#my_team_result").html(html);
						$("#my_team_box").show();
						$(".account-login-mask").show();
						if(uid == res.data.leaderUid){//队长
							$("#out_team").hide();
							$("#my_team_result ul").addClass("leader_ul");
						}else{
							$("#my_team_result .team_top").removeClass("leader");
							$("#leader_hide").hide();
							$("span.leader_span").hide();
						}
					}
				}
			});
		}
	});
	//踢出战队
	$("#my_team_result").on("click",".ti_team",function(){
		alert("活动已结束");
		return false;
		var koUid = $(this).attr("data-koUid");
		$("#ti_role_btn").attr("data-ti",koUid);
		$("#sure_ti_role_box").show();
		$(".account-login-mask").show();
	});
	$("#ti_role_btn").on("click",function(){
		alert("活动已结束");
		return false;
		var koUid = $(this).attr("data-ti");
		$.ajax({
			url:"http://www.huya.com/hd/xerath/index.php?m=Xerath&do=ajaxKickout",
			dataType:"jsonp",
			jsonp:"jsonp",
			data:{
				koUid:koUid
			},
			success:function(res){
				//console.log(res);
				if(res.status == 200){
					alert("已踢出");
					window.location.reload();
				}
			}
		});
	})
	//退出战队
	$("#my_team_result").on("click","#out_team",function(){
		alert("活动已结束");
		return false;
		var teamId = $(this).attr("data-teamId");
		$.ajax({
			url:"http://www.huya.com/hd/xerath/index.php?m=Xerath&do=ajaxLeave",
			dataType:"jsonp",
			jsonp:"jsonp",
			data:{
				teamId:teamId
			},
			success:function(res){
				//console.log(res);
				if(res.status == 200){
					alert("已退出战队");
					window.location.reload();
				}
			}
		});
	});
	//创建团队
	$("#creat_team").on("click",".sure_btn",function(){
		alert("活动已结束");
		return false;
		var team_name = $("#creat_team_name").val();
		if(!team_name){
			$(".team_error").html("战队名称不能为空");
			return;
		}
		$.ajax({
			url:"http://www.huya.com/hd/xerath/index.php?m=Xerath&do=ajaxCreateTeam",
			dataType:"jsonp",
			jsonp:"jsonp",
			data:{
				teamName:team_name
			},
			success:function(res){
				//console.log(res);
				if(res.status == 200){
					$("#creat_team").hide();
					$("#creat_team_sucess .team_name").html(team_name);
					$("#creat_team_sucess").show();
				}else{
					$(".team_error").html(res.msg);
				}
			}
		});
	});
	$("#creat_team_sucess").on("click","a.sure_btn",function(){
		window.location.reload();
	});
	//解散战队
	$("#my_team_result").on("click","#dissolve",function(){
		alert("活动已结束");
		return false;
		var team_nick_name = $(".nick_name").html();
		var teamId = $(this).attr("data-teamId");
		$("#dissolve_team_btn").attr("data-teamId",teamId)
		$(".dissolve_team_name").html(team_nick_name);
		$("#my_team_box").hide();
		$("#dissolve_team_box").show();
	});
	$("#dissolve_team_btn").on("click",function(){
		alert("活动已结束");
		return false;
		var teamId = $(this).attr("data-teamId");
		$.ajax({
			url:"http://www.huya.com/hd/xerath/index.php?m=Xerath&do=ajaxDisolve",
			dataType:"jsonp",
			jsonp:"jsonp",
			data:{
				teamId:teamId
			},
			success:function(res){
				//console.log(res);
				if(res.status == 200){
					alert("已解散");
					window.location.reload();
				}
			}
		});
	})
	//入队审批
	$("#my_team_box").on("click","#join_check",function(){
		alert("活动已结束");
		return false;
		$.ajax({
			url:"http://www.huya.com/hd/xerath/index.php?m=Xerath&do=ajaxGetApplyList",
			dataType:"jsonp",
			jsonp:"jsonp",
			success:function(res){
				// console.log(res);
				if(res.status == 200){
					var html = template('join_team_ul_script', res);
					$("#join_team_ul").html(html);
					//加入战队审批分页
					var join_team_page_num = 6;//每页显示6条数据
					var len2 = Math.ceil($("#join_team_ul li").length / join_team_page_num);
					var page_num2 = 1;
					$("#join_team_ul li").hide();
					$("#join_team_ul li:lt("+join_team_page_num+")").show();
					$("#join_team_pages").createPage({
						pageCount:len2,
						current:page_num2,
						backFn:function(p){
							$("#join_team_ul li").show();
							var indexStart = (p-1)*join_team_page_num;
							var indexEnd = p*join_team_page_num-1;
							$("#join_team_ul li:lt(" + indexStart + "), #join_team_ul li:gt(" + indexEnd + ")").hide();
							$("#join_page_num").val("");
						}
					});
					$("#join_sure_page").on("click",function(){
						page_num2 = parseInt($("#join_page_num").val());
						if(page_num2 < 0 || page_num2 > len2 || isNaN(page_num2)){
							alert("请输入合法页码");
							return;
						};
						$("#join_team_pages").html("");$("#join_team_pages").unbind("click");
						$("#join_team_ul li").show();
						var indexStart = (page_num2-1)*join_team_page_num;
						var indexEnd = page_num2*join_team_page_num-1;
						$("#join_team_ul li:lt(" + indexStart + "), #join_team_ul li:gt(" + indexEnd + ")").hide();
						$("#join_team_pages").createPage({
							pageCount:len2,
							current:page_num2,
							backFn:function(p){
								$("#join_team_ul li").show();
								var indexStart = (p-1)*join_team_page_num;
								var indexEnd = p*join_team_page_num-1;
								$("#join_team_ul li:lt(" + indexStart + "), #join_team_ul li:gt(" + indexEnd + ")").hide();
								$("#join_page_num").val("");
							}
						});
					});
				}
			}
		});
		$("#join_team_box").show();
	});
	//拒绝-通过操作
	$("#join_team_ul").on("click","a",function(){
		alert("活动已结束");
		return false;
		var approvalUid = $(this).attr("data-uid");
		var opType = $(this).attr("data-opType");
		$.ajax({
			url:"http://www.huya.com/hd/xerath/index.php?m=Xerath&do=ajaxApproval",
			dataType:"jsonp",
			jsonp:"jsonp",
			data:{
				approvalUid:approvalUid,
				opType:opType,
				teamId:team_id
			},
			success:function(res){
				//console.log(res);
				if(res.status == 200){
					alert("操作成功");
					window.location.reload();
				}else{
					alert(res.msg);
				}
			}
		});
	});
	// 入队审批关闭弹窗
	$("#join_team_box").on("click",".close",function(){
		$(".account-login-mask").show();
	});
	//我的角色
	$("#my_role").on("click",function(){
		alert("活动已结束");
		return false;
		if(!NAV_UTIL.isLogin()){
			NAV_UTIL.checkLogin();
			return;
		}else{
			$.ajax({
				url:"http://www.huya.com/hd/xerath/index.php?m=Xerath&do=ajaxGetRoleInfo&isMock=false",
				dataType:"jsonp",
				jsonp:"jsonp",
				success:function(res){
					//console.log(res);
					if(res.status == 200){
						$("#my_role_box .role_detail .nav span").removeClass("hover")
										.eq(res.data.job - 1).addClass("hover");
						$("#my_role_box .data_role").hide();
						$("#my_role_box .data_role").eq(res.data.job - 1).show();
						$("#change_role_btn").attr("data-newRoleId",res.data.job);
						var role_name = "";
						var nickName = res.data.nickName;
						if(res.data.job == 1){
							role_name = "投弹手";
							$("#role_name").html("投弹手");
						}
						if(res.data.job == 2){
							role_name = "法师";
							$("#role_name").html("法师");
						}
						if(res.data.job == 3){
							role_name = "牧师";
							$("#role_name").html("牧师");
						} 
						$("#my_role_box .nick_name").html(nickName);
						$("#my_role_box .role_name").html(role_name);
						$("#my_role_box").show();
						$(".account-login-mask").show();
					}
					if(res.status == 501){
						alert(res.msg);
						return false;
					}
				}
			});
		}
	});
	//角色切换
	$("#my_role_box .role_detail .nav").on("click","span",function(){
		var data_role = "#my_role_box .role_detail ." + $(this).attr("data-role");
		$(this).siblings().removeClass("hover")
			   .end().addClass("hover");
		$("#my_role_box .data_role").hide();
		$(data_role).show();
		var the_data_role = $(this).attr("data-role");
		if(the_data_role == "tds"){
			$("#change_role_btn").attr("data-newRoleId","1");
			$("#role_name").html("投弹手");
		}
		if(the_data_role == "fs"){
			$("#change_role_btn").attr("data-newRoleId","2");
			$("#role_name").html("法师");
		}
		if(the_data_role == "ms"){
			$("#change_role_btn").attr("data-newRoleId","3");
			$("#role_name").html("牧师");
		}
	});
	//确定更换角色
	$("#my_role_box .change_role a").on("click",function(){
		$("#my_role_box").hide();
		$("#sure_change_role_box").show();
	});
	$("#change_role_btn").on("click",function(){
		alert("活动已结束");
		return false;
		var newRoleId = $(this).attr("data-newRoleId");
		$.ajax({
			url:"http://www.huya.com/hd/xerath/index.php?m=Xerath&do=ajaxChangeRole",
			dataType:"jsonp",
			jsonp:"jsonp",
			data:{
				newRoleId:newRoleId
			},
			success:function(res){
				//console.log(res);
				if(res.status == 200){
					alert("更换成功");
					window.location.reload();
				}else{
					alert(res.msg);
				}
			}
		});
	})
	//
	$("#role_detail_box .role_detail .nav").on("click","span",function(){
		var data_role = "#role_detail_box .role_detail ." + $(this).attr("data-role");
		$(this).siblings().removeClass("hover")
			   .end().addClass("hover");
		$("#role_detail_box .data_role").hide();
		$(data_role).show();
	});

	//规则，查看详情
	$("#look_detail").on('click',function(){
		$("#role_detail_box").show();
		$(".account-login-mask").show();
	});
	//关闭弹窗
	$(".small_box .close,.big_box .close,.quit_btn").on("click",function(){
		$(this).parent().parent().hide();
		$(".account-login-mask").hide();
	});
});
//格式化时间戳
function format(time) {
    var data = new Date(time * 1000);
    return data.getHours();
}