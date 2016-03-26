define(function(require, exports, module) {

	"use strict";
	// var submit = seajs.use("submit");
	console.log(require("/src/scripts/submit"));
	var submit = require("/src/scripts/submit").submit;
	var layer = require("/plugin/layer/layer");
	init();

	function init() {
		initTab();
		addListener();
	}

	function addListener() {

		//topbar
		$("#J_header").on("click", ".J_new", function() {
			//新建
			$(".J_new_pop").slideToggle("fast");

		}).on("click", ".J_msg", function() {
			//消息
			renderSection($(this).data("type"));

		}).on("click", ".J_user", function() {
			//用户可操作条
			$(".J_user_pop").slideToggle("fast");

		}).on("click", ".J_new_project", function() {
			//新建项目
			// $(".J_new_pop").hide();
			$(".J_new_project_pop").slideDown("fast");

		}).on("click", ".J_new_team", function() {
			//新建团队
			// $(".J_new_pop").hide();
			$(".J_new_team_pop").slideDown("fast");

		}).on("click", ".J_new_cle", function() {
			//新建取消按钮
			$(this).parents(".new-pop").slideUp("fast");

		}).on("click", ".J_btn_new_project", function() {
			//新建项目确定按钮
			submit.newProject($(this), function(data) {

				$("#J_header .J_new_cle").trigger("click");

				$("#J_aside .a-list").each(function() {
					console.log("50", $(this), data);
					if ($(this).data("teamid") === data.teamId) {
						var projectListHtml = "<li class=\"project-list\" data-type=\"taskList\" data-teamId=\"" + data.teamId + "\" data-projectId=\"" + data.projectId + "\">" +
							"<span class=\"glyphicon glyphicon-folder-open\"></span>" + data.projectname + "</li>";
						$(this).find("ul").append(projectListHtml);
					}
				});

				renderSection("tasList", data);
			});

		}).on("click", ".J_btn_new_team", function() {
			//新建团队确定按钮
			submit.newTeam($(this), function(data) {

				$("#J_header .J_new_cle").trigger("click");
				renderSection("team", data);
				var projectower = $("#projectower");
				var teamLiHtml = "<li class=\"a-list\" data-type=\"team\" data-teamId=\"" + data.teamId + "\">" +
					"<span class=\"glyphicon glyphicon-briefcase\"></span>" + data.teamname +
					"<ul></ul>" +
					"</li>";
				$("#J_aside .J_aside_team_list").append(teamLiHtml);
				if (projectower.length) {
					projectower.append("<option value=\"" + data.teamId + "\">" + data.teamname + "</option>");
				} else {
					var teamListHtml = "<select class=\"new-select\" name=\"projectower\" id=\"projectower\">" +
						"<option value==\"" + data.teamId + "\">" + data.teamname + "</option>" +
						"</select>";
					$(".J_team_list").append(teamListHtml).find("p").remove();
					$(".J_btn_new_project").removeAttr("disabled");

				}
			});

		}).on("click", ".J_team_manage", function() {
			//团队管理
			renderSection($(this).data("type"));

		}).on("click", ".J_user_exit", function() {
			//退出当前登录
			submit.userExit($(this));

		});


		$("#J_task_detail").on("click", ".J_close_pop", function() {
			//关闭任务详情滑窗
			slideInTaskDetail();
		}).on("click", ".J_taskdesc_cfm", function() {
			//添加任务描述
			submit.addTaskDesc($(this), function(data) {
				$(".J_task_desc").html(data.taskdesc).next(".J_taskdesc_form").slideUp("fast");
			});
		}).on("click", ".J_new_comment_cfm", function() {
			//评论
			submit.addComment($(this), function(data) {
				var commentListHtml = "<li class=\"tab-body-list\">" +
					"<div class=\"user-img\">" + data.userheader + "</div>" +
					"<p>" + data.username + "<span class=\"tab-update-time\">" + data.date + "</span></p>" +
					"<p class=\"content-detail\">" + data.content + "</p></li>"

				$("#J_task_detail .J_comment_list").append(commentListHtml);
				$("#comment").val("");
			});
		}).on("click",".J_task_desc",function(){
			//编辑任务描述

			var $this = $(this);
			$this.slideUp("fast").next(".J_taskdesc_form").slideDown("fast");
			submit.addTaskDesc($(this),function(data){
				$this.html(data.taskdesc).next(".J_taskdesc_form").slideUp("fast");
			});
		}).on("click",".J_taskdesc_cle",function(){
			//取消任务描述
			$(this).parents(".J_taskdesc_form").slideUp("fast").prev(".J_task_desc").slideDown("fast");
		});

		$("#article").on("click", ".event-itm", function() {
			//工作台 动态
			submit.getTaskDetail($(this), slideOutTaskDetail);
		}).on("click", ".ws-2-item", function() {
			//工作台 任务
			submit.getTaskDetail($(this), slideOutTaskDetail);
			return false;
		}).on("click", ".J_task_title", function() {
			//项目详情（任务列表） task
			submit.getTaskDetail($(this), slideOutTaskDetail);
		}).on("click", ".J_project_item", function() {
			//加载项目详情 =>tasklist
			var $this = $(this);
			var data = {
				// teamId: $this.data("teamId"),
				// projectId: $this.data("projectId")
				teamId: $this.data("teamid"),
				projectId: $this.data("projectid")
			};

			renderSection($(this).data("type"), data);
		}).on("click", ".J_new_task_btn", function() {

			$(this).hide().parents(".task-box").find(".form").slideDown();

		}).on("click", ".J_new_task_cfm", function() {
			//新建任务确定按钮
			var $this = $(this);

			submit.newTask($(this), function(data) {

				var taskItemHTML = "<li><input type=\"checkbox\" class=\"task-fanish J_task_fanish_btn\">" +
					"<span class=\"J_task_title task-title\" data-taskId=" + data.taskId + ">" + data.taskname + "</span>" +
					"<span class=\"glyphicon glyphicon-remove J_delete_task\"></span>" +
					"</li>";

				$this.parents(".form").slideUp().parents(".task-box").find(".J_new_task_btn").show();
				$this.parents(".form").siblings(".task-status").after(taskItemHTML);
			});
		}).on("click", ".J_new_task_cle", function() {

			//新建任务取消按钮
			$(this).parents(".form").slideUp().parents(".task-box").find(".J_new_task_btn").show();
		}).on("click", ".J_task_fanish_btn", function() {
			//完成任务按钮
			var $this = $(this);
			submit.finishTask($(this), function() {
				$this.next(".J_task_title").addClass("finished");

			});
		}).on("click", ".J_add_teamer", function() {
			//团队 添加成员
			$(this).slideUp("fast").next(".add-teamer-form").slideDown("fast");

		}).on("click", ".J_add_teamer_cle", function() {
			//团队 取消添加成员
			$(this).parents(".add-teamer-form").slideUp("fast").prev(".J_add_teamer").slideDown("fast");

		}).on("click", ".J_add_teamer_cfm", function() {
			//团队 确认添加成员
			submit.addTeamer($(this), function(data) {
				var teamerListHtml = "<li class=\"teamer-item J_teamer_item\">" +
					"<i class=\"user-img circle-img\">" + data.userhead + "</i>" + data.teamername +
					"</li>";
				$("#J_team .J_teamer_item").parent().append(teamerListHtml);
				$(".J_add_teamer_cle").trigger("click");
			});
		}).on("click", ".J_delete_task", function() {
			//删除任务
			var $this = $(this);
			submit.deleteTask($this, function() {
				$this.parent("li").remove();
			});
		});



		//aside Tab
		$("#J_aside").on("click", ".a-list", function() {
			var $this = $(this);
			$this.addClass("cur").siblings().removeClass("cur");
			if (!$this.data("teamid")) {
				renderSection($this.data("type"));
			} else {

				var data = {
					teamId: $this.data("teamid")
				};

				renderSection($this.data("type"), data);
			}

		}).on("click", ".project-list", function() {
			var $this = $(this);
			var data = {
				teamId: $this.data("teamid"),
				projectId: $this.data("projectid")
			};

			renderSection($this.data("type"), data);
			return false;
		});


	}

	function initTab() {
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
			beforeClick: function() {
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

		//团队
		new Tab({
			tabHead: ".J_team_tab_head",
			tabBody: ".J_team_tab_body",
			headCurClass: "tt-cur",
			bodyCurClass: "cur",
			headItem: ".tt-itm",
			bodyItem: ".ws-main"
		});
	}

	function renderSection(type, data) {
		console.log({
			type: type,
			data: data
		});
		$.ajax({
			type: "get",
			data: {
				type: type,
				data: data
			},
			datatype: "json",
			url: "/getSection",
			success: function(data) {
				$(".section").replaceWith(data);
			}
		});
	}

	function slideOutTaskDetail() {
		//TODO 后台获取数据

		$("#J_task_detail").animate({
			width: "55%"
		}, 1000);
	}

	function slideInTaskDetail() {

		$("#J_task_detail").animate({
			width: "0"
		}, 1000);
	}

});