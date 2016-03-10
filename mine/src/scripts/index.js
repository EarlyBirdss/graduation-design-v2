$(function(){

	"use strict";
	init();

	function init(){
		initTab();
		addListener();
	}

	function addListener(){

		//topbar
		$("#J_header").on("click",".J_new",function(){
			$(".J_new_pop").slideToggle("fast");
		}).on("click",".J_user",function(){
			$(".J_user_pop").slideToggle("fast");
		});

		//aside
		$("#J_aside").on("click",".a-list",function(){
			var $this = $(this);
			$this.addClass("cur").siblings().removeClass("cur");
			renderSection($this.data("type"));
			console.log("tab click");
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
	}

	function renderSection(type){
		$.ajax({
			type: "get",
			data: {type: type},
			url:"/getSection",
			success: function(data){
				$(".section").replace(data);
			}
		});
	}

});