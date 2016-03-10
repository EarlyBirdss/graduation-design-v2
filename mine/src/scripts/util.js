"use strict";
function Tab(option){
	this.tabHead = option.tabHead;
	this.tabBody = option.tabBody;

	var defaultOption = {
		headCurClass: "cur",
		bodyCurClass: "cur",
		headItem: "",
		bodyItem: "",
		callback:function(){

		}

	}

	this.option = $.extend(true,defaultOption,option);

	this.init();
}
Tab.prototype = {
	constructor: "Tab",
	init: function(){
		console.log("init");
		this.addLitener();
	},
	addLitener: function(){
		var that = this;
		var option = that.option;
		$(that.tabHead).on("click",option.headItem,function(){
			that.changeTab(this);
		});

	},
	changeTab: function(clickItem){
		var $clickItem = $(clickItem)
		var index = $(this.tabHead).find(this.option.headItem).index($clickItem);
		console.log(index);
		var $bodyItem = $(this.tabBody).find(this.option.bodyItem).eq(index);
		console.log($bodyItem);
		$clickItem.addClass(this.option.headCurClass).siblings().removeClass(this.option.headCurClass);
		$bodyItem.addClass(this.option.bodyCurClass).siblings().removeClass(this.option.bodyCurClass);

		if(typeof this.option.callback === "function"){
			this.option.callback.call();
		}

	}
}