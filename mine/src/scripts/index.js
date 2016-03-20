define(function  (require, exports, module) { 

	"use strict";
	// var submit = seajs.use("submit");
	console.log(require("/src/scripts/submit"));
	var submit = require("/src/scripts/submit").submit;
	var layer = require("/plugin/layer/layer");
	init();

	function init(){
		initTab();
		addListener();
	}

	function addListener(){

		//topbar
		$("#J_header").on("click",".J_new",function(){
			//新建
			$(".J_new_pop").slideToggle("fast");

		}).on("click",".J_msg",function(){
			//消息
			renderSection($(this).data("type"));

		}).on("click",".J_user",function(){
			//用户可操作条
			$(".J_user_pop").slideToggle("fast");

		}).on("click",".J_new_project",function(){
			//新建项目
			// $(".J_new_pop").hide();
			$(".J_new_project_pop").slideDown("fast");

		}).on("click",".J_new_team",function(){
			//新建团队
			// $(".J_new_pop").hide();
			$(".J_new_team_pop").slideDown("fast");

		}).on("click",".J_new_cle",function(){
			//新建取消按钮
			$(this).parents(".new-pop").slideUp("fast");

		}).on("click",".J_btn_new_project",function(){
			//新建项目确定按钮
			submit.newProject($(this));

		}).on("click",".J_btn_new_team",function(){
			//新建团队确定按钮
			submit.newTeam($(this));

		}).on("click",".J_team_manage",function(){
			//团队管理
			renderSection($(this).data("type"));

		}).on("click",".J_user_exit",function(){
			//退出当前登录
			submit.userExit($(this));

		});

		$(".J_w_tab_body").on("click",".event-itm",function(){
			//
			slideOutTaskDetail();
		});

		$(".J_tab2_body").on("click",".ws-2-item",function(){
			//
			slideOutTaskDetail($(this));
		});

		$(".J_dit_tab_body").on("click",".ws-2-item",function(){
			//
			slideOutTaskDetail($(this));
		});

		$("#J_task_detail").on("click",".J_close_pop",function(){
			//关闭任务详情滑窗
			slideInTaskDetail();
		});

		$("#article").on("click",".J_project_item",function(){
			//加载项目详情
			renderSection($(this).data("type"));
		}).on("click", ".J_new_task_btn", function(){

			$(this).hide().parents(".task-box").find(".form").slideDown();

		}).on("click",".J_new_task_cfm", function(){
			//新建任务确定按钮
			submit.newTask($(this),function(){
				$(this).parents(".form").slideUp().parents(".task-box").find(".J_new_task_btn").show();
			});
		}).on("click", ".J_new_task_cle", function(){

			//新建任务取消按钮
			$(this).parents(".form").slideUp().parents(".task-box").find(".J_new_task_btn").show();
		}).on("click", ".J_task_fanish_btn",function(){
			//完成任务按钮

			submit.finishTask($(this));
		});





		//aside Tab
		$("#J_aside").on("click",".a-list",function(){
			var $this = $(this);
			$this.addClass("cur").siblings().removeClass("cur");
			renderSection($this.data("type"));
		});


	}

	function initTab(){
		// 工作台
		var workspacetab = new Tab({
			tabHead: ".J_w_tab_head",
			tabBody: ".work-space",
			headCurClass: "tt-cur",
			bodyCurClass: "cur",
			headItem: ".tt-itm",
			bodyItem: ".ws-main"
		});
		// 工作台
		new Tab({
			tabHead: ".J_tab2_head",
			tabBody: ".J_tab2_body",
			headCurClass: "cur",
			bodyCurClass: "cur",
			headItem: ".ws-2-tab",
			bodyItem: ".ws-2-tab"
		});
		// 工作台
		new Tab({
			tabHead: ".ws-ad-box",
			tabBody: ".J_tab2_body",
			headCurClass: "cur",
			bodyCurClass: "cur",
			headItem: ".aside-itm",
			bodyItem: ".ws-2-tab",
			beforeClick: function(){
				workspacetab.click($(".J_w_tab_head .tt-itm").eq(1));
			}
		});

		// 发现
		new Tab({
			tabHead: ".J_dit_tab_head",
			tabBody: ".J_dit_tab_body",
			headCurClass: "cur",
			bodyCurClass: "cur",
			headItem: ".ditt-itm",
			bodyItem: ".ws-2-tab"
		});

		//消息
		new Tab({
			tabHead: ".J_ms_tab_head",
			tabBody: ".J_ms_tab_body",
			headCurClass: "cur",
			bodyCurClass: "cur",
			headItem: ".ms-tabs",
			bodyItem: ".ms-tabs-item"
		});
	}

	function renderSection(type){
		$.ajax({
			type: "get",
			data: {type: type},
			url:"/getSection",
			success: function(data){
				$(".section").replaceWith(data);
			}
		});
	}

	function slideOutTaskDetail(){

		$("#J_task_detail").animate({
			width: "55%"
		},1000);
	}

	function slideInTaskDetail($this){
		//TODO 后台获取数据

		$("#J_task_detail").animate({
			width: "0"
		},1000);
	}

});