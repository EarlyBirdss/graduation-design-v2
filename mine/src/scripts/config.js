seajs.config(
{
	// 激活 shim 插件
	plugins: ['shim']
 
	// shim 配置项
	,alias: 
	{
		// jQuery 的 shim 配置
		'jquery': 
		{
			src: 'http://lib.sinaapp.com/js/jquery/1.9.1/jquery-1.9.1.min.js',
			exports: 'jQuery'
		}
	}
 
	,paths:
	{
		'js':'../js/'//这个路径是以sea.js文件为基础的
		,'lib':'../lib'
	}
 
	,map:
	[
		//防止js文件夹下的文件被缓存
		[/(.*js\/[^\/\.]*\.(?:js))(?:.*)/,'$1?_='+new Date().getTime()]
	]
 
	,debug:true
});