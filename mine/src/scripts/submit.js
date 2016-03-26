define(function(require, exports, module) {

	"use strict";

	var submit = {
		newProject: function($this, callback) {
			//新建项目
			var data = {
				projectname: $("#projectname").val(),
				teamId: $("#projectower").val()
			};

			if (!data.projectname) {
				layer.alert("请填写项目名称");
				return false;
			}

			$.ajax({
				type: "post",
				url: "/submitNewProject",
				data: data,
				success: function(data) {
					if (data.success === "F") {
						// layer.alert(data.errMsg);
						window.alert(data.errMsg);
					} else {
						if (typeof callback === "function") {
							callback.call(null, data.data);
						}
					}
				},
				error: function(data) {
					layer.alert(data.errMsg);
				}
			});
		},
		newTeam: function($this, callback) {
			//新建团队

			var data = {
				teamname: $("#teamname").val(),
				teamdesc: $("#teamdesc").val()
			};

			if (!data.teamname) {
				layer.alert("请填写团队名称");
				return false;
			}

			$.ajax({
				type: "post",
				url: "/submitNewTeam",
				data: data,
				success: function(data) {
					if (data.success === "F") {
						layer.alert(data.errMsg);
					} else {
						if (typeof callback === "function") {
							console.log(callback);
							callback.call(null, data.data);
						}
					}
				},
				error: function(data) {
					layer.alert(data.errMsg);
				}
			});
		},
		userExit: function($this) {
			//退出当前用户
			$.ajax({
				type: "post",
				url: "/submitLogout",
				success: function(data) {
					if (data.success === "F") {
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					} else {
						window.alert(data.message);
					}

				},
				error: function(data) {
					window.alert(data.errMsg);
				}
			});
		},
		quitTeam: function($this) {

			var data = {
				teamId: $this.data("teamId")
			};

			$.ajax({
				type: "post",
				url: "/submitQuitTeam",
				success: function(data) {
					if (data.success === "F") {
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					} else {
						window.alert(data.message);
					}

				},
				error: function(data) {
					window.alert(data.errMsg);
				}
			});
		},
		newTask: function($this, callback) {
			var projectTitle = $this.parents(".J_project_title");
			var data = {
				teamId: projectTitle.data("teamid"),
				projectId: projectTitle.data("projectid"),
				taskname: $this.prev(".J_task_name").val(),
				status: projectTitle.data("status")
			};
			console.log(data);

			$.ajax({
				type: "post",
				url: "/submitNewTask",
				data: data,
				success: function(data) {
					if (data.success === "F") {
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					} else {
						if (typeof callback === "function") {
							callback.call(null, data.data);
						}
					}

				},
				error: function(data) {
					window.alert(data.errMsg);
				}
			});
		},
		finishTask: function($this, callback) {

			var projectTitle = $this.parents(".J_project_title");

			var data = {
				teamId: projectTitle.data("teamid"),
				projectId: projectTitle.data("projectid"),
				taskId: $this.next(".J_task_title").data("taskid")
			};

			$.ajax({
				type: "post",
				url: "/submitFinishTask",
				data: data,
				success: function(data) {
					if (data.success === "F") {
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					} else {
						if (typeof callback === "function") {
							callback.call(null, data.data);
						}
					}

				},
				error: function(data) {
					window.alert(data.errMsg);
				}
			});
		},
		deleteTask: function($this,callback){
			var projectTitle = $this.parents(".J_project_title");
			var data = {
				teamId: projectTitle.data("teamid"),
				projectId: projectTitle.data("projectid"),
				taskId: $this.prev(".J_task_title").data("taskid")
			};

			$.ajax({
				type: "post",
				url: "/submitDeleteTask",
				datatype: "json",
				data: data,
				success: function(data) {
					if (data.success === "F") {
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					} else {
						if (typeof callback === "function") {
							callback.call(null);
						}
					}

				},
				error: function(data) {
					window.alert(data.errMsg);
				}
			});
		},
		getTaskDetail: function($this,callback){
			var data;
			if($this.hasClass("J_task_title")){
				var J_project_title = $this.parents(".J_project_title");
				data = {
					teamId: J_project_title.data("teamid"),
					projectId: J_project_title.data("projectid"),
					taskId: $this.data("taskid")
				};

			}else {
				data = {
					teamId: $this.data("teamid"),
					projectId: $this.data("projectid"),
					taskId: $this.data("taskid")
				};
			}
			

			$.ajax({
				type: "get",
				url: "/getSection",
				datatype: "json",
				data: {type: "taskDetail",data: data},
				success: function(data){
					
					$("#J_task_detail").html(data);
					if (typeof callback === "function") {
						callback.call(null);
					}
				}
			});
		},
		addTeamer: function($this,callback){
			var data = {
				teamId: $this.parents(".add-teamer-form").data("teamid"),
				teamername: $("#teamername").val()
			};

			if(!data.teamername){
				window.alert("请输入添加成员用户名");
				return false;
			}

			$.ajax({
				type: "post",
				url: "/addTeamer",
				datatype: "json",
				data: data,
				success: function(data){
					if (data.success === "F") {
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					} else {
						if (typeof callback === "function") {
							callback.call(null,data.data);
						}
					}
				},
				error: function(data){
					if(data.errMsg){
						window.alert(data.errMsg);
					}
				}
			});
		},
		addTaskDesc: function($this,callback){
			var J_taskdesc_form = $(".J_taskdesc_form");
			var data = {
				teamId: J_taskdesc_form.data("teamid"),
				projectId: J_taskdesc_form.data("projectid"),
				taskId: J_taskdesc_form.data("taskid"),
				taskdesc: $("#taskdesc").val()
			};

			$.ajax({
				type: "post",
				url: "/submitTaskDesc",
				datatype: "json",
				data: data,
				success: function(data){
					if (data.success === "F") {
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					} else {
						if (typeof callback === "function") {
							callback.call(null,data.data);
						}
					}
				},
				error: function(data){
					if(data.errMsg){
						window.alert(data.errMsg);
					}
				}
			});
		},
		// updateTaskdesc:function($this,callback){
		// 	var J_taskdesc_form = $(".J_taskdesc_form");
		// 	var data = {
		// 		teamId: J_taskdesc_form.data("teamid"),
		// 		projectId: J_taskdesc_form.data("projectid"),
		// 		taskId: J_taskdesc_form.data("taskid"),
		// 		taskdesc: $("#taskdesc").val()
		// 	};

		// 	$.ajax({
		// 		type: "post",
		// 		url: "/submitUpdateTaskDesc",
		// 		datatype: "json",
		// 		data: data,
		// 		success: function(data){
		// 			if (data.success === "F") {
		// 				// layer.alert(data.errMsg, {icon: 6});
		// 				window.alert(data.errMsg);
		// 			} else {
		// 				if (typeof callback === "function") {
		// 					callback.call(null,data.data);
		// 				}
		// 			}
		// 		},
		// 		error: function(data){
		// 			if(data.errMsg){
		// 				window.alert(data.errMsg);
		// 			}
		// 		}
		// 	});
		// },
		addComment: function($this,callback){
			var J_new_comment_form = $(".J_new_comment_form");

			var data = {
				teamId: J_new_comment_form.data("teamid"),
				projectId: J_new_comment_form.data("projectid"),
				taskId: J_new_comment_form.data("taskid"),
				content: $("#comment").val()
			};

			$.ajax({
				type: "post",
				url: "/submitComment",
				datatype: "json",
				data: data,
				success: function(data){
					if (data.success === "F") {
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					} else {
						if (typeof callback === "function") {
							callback.call(null,data.data);
						}
					}
				},
				error: function(data){
					if(data.errMsg){
						window.alert(data.errMsg);
					}
				}
			});
		}

	};

	exports.submit = submit;

});