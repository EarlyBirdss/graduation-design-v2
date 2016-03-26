# 嗯 这是我的毕设

### 我不管我不管 终于完成了bug满满的毕设初稿

### 概述
* 这篇毕设主要是worktile[http://www.worktile.com](http://www.worktile.com "worktile")仿站，只截取了最最简单最最基本的功能，有时间的话再来一步一步完善吧
* 语言为express + mongoose + jQuery的组合，express跟mongoose 都不是很熟悉，学了一点点，按照自己的想法胡乱的用

### 界面&&流程&&功能

 * 注册登录就不讲了
 * 刚刚注册进来界面是这样的
 * ![](http://i.imgur.com/8WijtL0.png)
 * 然后添加团队是酱的
 * ![](http://i.imgur.com/IG9gP3P.png)
 * 成功添加团队后跳转
 * ![](http://i.imgur.com/h0q1wld.png)
 * 然后添加队员
 * ![](http://i.imgur.com/zcPu2SO.png)
 * 成功添加队员后
 * ![](http://i.imgur.com/xSAP6py.png)
 * 然后添加项目
 * ![](http://i.imgur.com/xF6TrrO.png)
 * 成功添加项目后跳转
 * ![](http://i.imgur.com/ZiYIGXJ.png)
 * 然后添加任务
 * ![](http://i.imgur.com/afu7ejK.png)
 * 成功添加任务
 * ![](http://i.imgur.com/A8jwYWU.png)
 * 然后点击查看任务详情
 * ![](http://i.imgur.com/wHgzl2g.png)
 * 然后添加任务描述，评论啥的
 * ![](http://i.imgur.com/sTQnBvu.png)
 * 成功评论，成功添加任务描述
 * ![](http://i.imgur.com/OrZk8gW.png)
 * 然后完成任务
 * ![](http://i.imgur.com/BwZRibd.png)
 * 然后删除任务
 * ![](http://i.imgur.com/yKcBZyu.png)
 * 然后然后 当我多加几个团队几个项目的时候，最大的bug就出现了，参见，recordBUG.md。就是mongoose的Model.find()异步的问题，或者说我根本不会mongoose联表查询或者不会组织数据结构。老大说回调太多了，让用promise。嗯嗯 肯定会用的，再等两天再来慢慢研究，这个大bug肯定是要改掉的。