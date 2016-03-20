define(function  (require, exports, module) { 

	"use strict";

	init();

	function init(){
		addLinstener();
	} 

	function addLinstener(){
		$("#form").on("click",".J_btn_login",function(){
			submit();
		});
	}

	function submit(){
		var data = {
			username: $("#username").val(),
			password: $("#password").val()
		}
		if(!data.username || !data.password){
			window.alert("请输入完整登陆信息");
		}else{
			$.ajax({
				url:"/submitLogin",
				type:"post",
				data: data,
				success: function(data){
					if(data.success === "F"){
						window.alert(data.errMsg);
					}
				},
				error: function(data){
					window.alert(data.errMsg);
				}
			});
		}
	}

});