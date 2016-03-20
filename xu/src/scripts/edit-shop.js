$(function(){
	"use strict";

	init();

	function init(){
		addListenter();
	}

	function addListenter(){
		$("#form").on("click",".J_btn_submit",function(){
			validate();
			// submit();
		}).on("change","#poster",function(){
			console.log($(this).val());
			$("#validate_poster").val($(this).val());
		});
	}

	function validate(){
		$("#form").validate({
			rules:{
				title:{
					required: true
				},
				address:{
					required:true
				},
				startingprice:{
					required: true,
					number:true
				},
				distributionfee:{
					required:true,
					number:true
				},
				distributiontime:{
					required: true,
					number:true
				},
				beginetime:{
					required:true
				},
				endtime:{
					required: true
				},
				notice:{
					required:true
				},
				validate_poster:{
					required: true
				}
			},
			messages:{
				title:{
					required: "请输入店铺名称"
				},
				address:{
					required:"请输入店铺地址"
				},
				startingprice:{
					required: "请输入起送费",
					number:"请输入数字类型"
				},
				distributionfee:{
					required:"请输入配送费",
					number:"请输入数字类型"
				},
				distributiontime:{
					required: "请输入配送时间",
					number:"请输入数字类型"
				},
				beginetime:{
					required:"请输入起送时间"
				},
				endtime:{
					required: "请输入终止配送时间"
				},
				notice:{
					required:"请输入店铺公告"
				},
				validate_poster:{
					required: "请上传店铺海报"
				}
			},
			submitHandler:function(){
				var form = $("#form");

				var data = {};

				form.find("input,textarea").each(function(){
					var $this = $(this);
					data[$this.attr("id")] = $this.val();
				});

				$.ajax({
					url:"/submitCreateShop",
					type:"post",
					data:data,
					success:function(data){
					},
					error:function(data){
					}
				});
			}
		});
	}

	function submit(){
		var form = $("#form");

		var data = {};

		form.find("input,textarea").each(function(){
			var $this = $(this);
			data[$this.attr("id")] = $this.val();
		});

		$.ajax({
			url:"/submitEditShop",
			type:"post",
			data:data,
			success:function(data){
				console.log(data);
			},
			error:function(data){
				console.log(data);
			}
		});
	}
});