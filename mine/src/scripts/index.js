define(function  (require, exports, module) { 

	"use strict";
	// var submit = seajs.use("submit");
	var submit = require("/src/scripts/submit").submit;
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
			$(".J_new_pop").hide();
			$(".J_new_project_pop").slideDown("fast");

		}).on("click",".J_new_team",function(){
			//新建团队
			$(".J_new_pop").hide();
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
			console.log(submit);
			submit.userExit($(this));

		});

		//aside
		$("#J_aside").on("click",".a-list",function(){
			var $this = $(this);
			$this.addClass("cur").siblings().removeClass("cur");
			renderSection($this.data("type"));
		});


	}

	function initTab(){
		// 工作台
		new Tab({
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
				console.log(data);
				$(".section").replaceWith(data);
			}
		});
	}

});