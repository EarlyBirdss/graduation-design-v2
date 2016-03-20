define(function  (require, exports, module) { 

	"use strict";

	init();

	function init(){
		addLinstener();
	} 

	function addLinstener(){
		$("#J_btn_register").on("click",function(){
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
				url:"/submitRegister",
				type:"post",
				data: data,
				success: function(data){
					console.log(data);
					if(data.success === "F"){
						window.alert(data.errMsg);
					}else{
						window.alert(data.message);
					}
				},
				error: function(data){
					window.alert(data.errMsg);
				}
			});
		}
	}

});