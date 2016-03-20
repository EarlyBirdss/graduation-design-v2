"use strict";
function Tab(option){
	this.tabHead = option.tabHead;
	this.tabBody = option.tabBody;

	var defaultOption = {
		headCurClass: "cur",
		bodyCurClass: "cur",
		headItem: "",
		bodyItem: "",
		beforeClick: function(){

		},
		callback:function(){

		}

	}

	this.option = $.extend(true,defaultOption,option);

	this.init();
}
Tab.prototype = {
	constructor: "Tab",
	init: function(){
		this.addLitener();
	},
	addLitener: function(){
		var that = this;
		var option = that.option;
		$("body").on("click",option.headItem,function(){
			if(typeof that.option.beforeClick === "function"){
				that.option.beforeClick();
			}
			that.click(this);
		});

	},
	click: function(clickItem){
		var $clickItem = $(clickItem)
		var index = $(this.tabHead).find(this.option.headItem).index($clickItem);
		var $bodyItem = $(this.tabBody).find(this.option.bodyItem).eq(index);
		$clickItem.addClass(this.option.headCurClass).siblings().removeClass(this.option.headCurClass);
		$bodyItem.addClass(this.option.bodyCurClass).siblings().removeClass(this.option.bodyCurClass);

		if(typeof this.option.callback === "function"){
			this.option.callback.call();
		}

	}
}