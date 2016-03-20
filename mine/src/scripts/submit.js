define(function  (require, exports, module) { 

	"use strict";

	var submit = {
		newProject: function($this){
			//新建项目
			var data = {
				projectname: $("#projectname").val(),
				teamname: $("#projectower").val()
			};

			if(!data.projectname){
				layer.alert("请填写项目名称");
				return false;
			}

			$.ajax({
				type: "post",
				url: "/submitNewProject",
				data: data,
				success: function(data) {
					if(data.success === "F"){
						layer.alert(data.errMsg);
					}
				},
				error: function(data){
					layer.alert(data.errMsg);
				}
			});
		},
		newTeam: function($this){
			//新建团队

			var data = {
				teamname: $("#teamname").val(),
				teamdesc: $("#teamdesc").val()
			};

			if(!data.teamname){
				layer.alert("请填写团队名称");
				return false;
			}
			
			$.ajax({
				type: "post",
				url: "/submitNewTeam",
				data: data,
				success: function(data) {
					if(data.success === "F"){
						layer.alert(data.errMsg);
					}
				},
				error: function(data){
					layer.alert(data.errMsg);
				}
			});
		},
		userExit: function($this){
			//退出当前用户
			$.ajax({
				type: "post",
				url: "/submitLogout",
				success: function(data) {
					if(data.success === "F"){
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					}else{
						window.alert(data.message);
					}

				},
				error: function(data){
					window.alert(data.errMsg);
				}
			});
		},
		quitTeam: function($this){
			$.ajax({
				type: "post",
				url: "/submitQuitTeam",
				success: function(data) {
					if(data.success === "F"){
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					}else{
						window.alert(data.message);
					}

				},
				error: function(data){
					window.alert(data.errMsg);
				}
			});
		},
		newTask: function($this,callback) {

			var data = {
				taskname: $("#task").val()
			};

			$.ajax({
				type: "post",
				url: "/submitNewTask",
				data: data,
				success: function(data) {
					if(data.success === "F"){
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					}else{
						if(typeof callback === "function") {
							callback.call(null);
						}
					}

				},
				error: function(data){
					window.alert(data.errMsg);
				}
			});
		},
		finishTask: function($this, callback) {
			var data = {
				taskname: $this.next(".J_task_title").html();
			};

			$.ajax({
				type: "post",
				url: "/submitNewTask",
				data: data,
				success: function(data) {
					if(data.success === "F"){
						// layer.alert(data.errMsg, {icon: 6});
						window.alert(data.errMsg);
					}else{
						if(typeof callback === "function") {
							callback.call(null);
						}
					}

				},
				error: function(data){
					window.alert(data.errMsg);
				}
			});
		}

	}

	exports.submit = submit;

});