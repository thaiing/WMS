<template>
	<div class="main markdown">
		<h1>IconFont 图标</h1>
		<ul class="icon_lists clear" @click="onSelectIcon">
			<li>
				<i class="icon iconfont el-icon-yrt-xin"></i>
				<div class="name">新</div>
				<div class="fontclass">.el-icon-yrt-xin</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-ziti"></i>
				<div class="name">字体</div>
				<div class="fontclass">.el-icon-yrt-ziti</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-baocun"></i>
				<div class="name">保存</div>
				<div class="fontclass">.el-icon-yrt-baocun</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-bangzhu"></i>
				<div class="name">帮助</div>
				<div class="fontclass">.el-icon-yrt-bangzhu</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-hebingdanyuan"></i>
				<div class="name">合并单元</div>
				<div class="fontclass">.el-icon-yrt-hebingdanyuan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhifubao"></i>
				<div class="name">支付宝</div>
				<div class="fontclass">.el-icon-yrt-zhifubao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-bianji"></i>
				<div class="name">编辑</div>
				<div class="fontclass">.el-icon-yrt-bianji</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shezhi"></i>
				<div class="name">设置</div>
				<div class="fontclass">.el-icon-yrt-shezhi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shezhi1"></i>
				<div class="name">设置</div>
				<div class="fontclass">.el-icon-yrt-shezhi1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shuaxin"></i>
				<div class="name">刷新</div>
				<div class="fontclass">.el-icon-yrt-shuaxin</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shuaxin1"></i>
				<div class="name">刷新</div>
				<div class="fontclass">.el-icon-yrt-shuaxin1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-bianji1"></i>
				<div class="name">编辑</div>
				<div class="fontclass">.el-icon-yrt-bianji1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-import"></i>
				<div class="name">导入</div>
				<div class="fontclass">.el-icon-yrt-import</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shanchu"></i>
				<div class="name">删除</div>
				<div class="fontclass">.el-icon-yrt-shanchu</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shuaxin2"></i>
				<div class="name">刷新</div>
				<div class="fontclass">.el-icon-yrt-shuaxin2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-print"></i>
				<div class="name">打印</div>
				<div class="fontclass">.el-icon-yrt-print</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shanchu1"></i>
				<div class="name">删除</div>
				<div class="fontclass">.el-icon-yrt-shanchu1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shanchu2"></i>
				<div class="name">删除</div>
				<div class="fontclass">.el-icon-yrt-shanchu2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kaiqi"></i>
				<div class="name">开启</div>
				<div class="fontclass">.el-icon-yrt-kaiqi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-f14"></i>
				<div class="name">刷新</div>
				<div class="fontclass">.el-icon-yrt-f14</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-daoru"></i>
				<div class="name">导入</div>
				<div class="fontclass">.el-icon-yrt-daoru</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-daoru1"></i>
				<div class="name">导入</div>
				<div class="fontclass">.el-icon-yrt-daoru1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-guanbi"></i>
				<div class="name">关闭</div>
				<div class="fontclass">.el-icon-yrt-guanbi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-rukushangjia"></i>
				<div class="name">入库上架</div>
				<div class="fontclass">.el-icon-yrt-rukushangjia</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zan"></i>
				<div class="name">赞</div>
				<div class="fontclass">.el-icon-yrt-zan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-feiji"></i>
				<div class="name">飞机</div>
				<div class="fontclass">.el-icon-yrt-feiji</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tianjia2"></i>
				<div class="name">添加</div>
				<div class="fontclass">.el-icon-yrt-tianjia2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-settings2"></i>
				<div class="name">设置</div>
				<div class="fontclass">.el-icon-yrt-settings2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tubiao"></i>
				<div class="name">设置</div>
				<div class="fontclass">.el-icon-yrt-tubiao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-guanbi1"></i>
				<div class="name">关闭</div>
				<div class="fontclass">.el-icon-yrt-guanbi1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-daoru2"></i>
				<div class="name">导入</div>
				<div class="fontclass">.el-icon-yrt-daoru2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-rukuguanli"></i>
				<div class="name">入库管理-</div>
				<div class="fontclass">.el-icon-yrt-rukuguanli</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-baocun1"></i>
				<div class="name">保存</div>
				<div class="fontclass">.el-icon-yrt-baocun1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-ordinaryprint"></i>
				<div class="name">打印</div>
				<div class="fontclass">.el-icon-yrt-ordinaryprint</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-daochu"></i>
				<div class="name">导出</div>
				<div class="fontclass">.el-icon-yrt-daochu</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-pandianliebiao"></i>
				<div class="name">盘点列表</div>
				<div class="fontclass">.el-icon-yrt-pandianliebiao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-quehuobuhuo"></i>
				<div class="name">缺货补货</div>
				<div class="fontclass">.el-icon-yrt-quehuobuhuo</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yiweiguanli"></i>
				<div class="name">移位管理</div>
				<div class="fontclass">.el-icon-yrt-yiweiguanli</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-import1"></i>
				<div class="name">导入</div>
				<div class="fontclass">.el-icon-yrt-import1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-04"></i>
				<div class="name">定位</div>
				<div class="fontclass">.el-icon-yrt-04</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-27"></i>
				<div class="name">购物车</div>
				<div class="fontclass">.el-icon-yrt-27</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kucun"></i>
				<div class="name">库存</div>
				<div class="fontclass">.el-icon-yrt-kucun</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kuaidi"></i>
				<div class="name">快递</div>
				<div class="fontclass">.el-icon-yrt-kuaidi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-88"></i>
				<div class="name">微信</div>
				<div class="fontclass">.el-icon-yrt-88</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dayin"></i>
				<div class="name">打印</div>
				<div class="fontclass">.el-icon-yrt-dayin</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xiaoxituisongshezhi"></i>
				<div class="name">消息推送设置</div>
				<div class="fontclass">.el-icon-yrt-xiaoxituisongshezhi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-cogs3"></i>
				<div class="name">设置</div>
				<div class="fontclass">.el-icon-yrt-cogs3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-suo"></i>
				<div class="name">锁</div>
				<div class="fontclass">.el-icon-yrt-suo</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chazishanchudaibiankuang"></i>
				<div class="name">叉子删除带边框</div>
				<div class="fontclass">.el-icon-yrt-chazishanchudaibiankuang</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zan1"></i>
				<div class="name">赞</div>
				<div class="fontclass">.el-icon-yrt-zan1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-msnui-shezhi"></i>
				<div class="name">设置</div>
				<div class="fontclass">.el-icon-yrt-msnui-shezhi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-msnui-rmb"></i>
				<div class="name">人民币</div>
				<div class="fontclass">.el-icon-yrt-msnui-rmb</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-saomiao"></i>
				<div class="name">扫描</div>
				<div class="fontclass">.el-icon-yrt-saomiao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon1"></i>
				<div class="name">加入购物车</div>
				<div class="fontclass">.el-icon-yrt-icon1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon27"></i>
				<div class="name">删除</div>
				<div class="fontclass">.el-icon-yrt-icon27</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dianhua"></i>
				<div class="name">电话</div>
				<div class="fontclass">.el-icon-yrt-dianhua</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-saomiao1"></i>
				<div class="name">扫描</div>
				<div class="fontclass">.el-icon-yrt-saomiao1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-edit"></i>
				<div class="name">编辑</div>
				<div class="fontclass">.el-icon-yrt-edit</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dunhuo"></i>
				<div class="name">囤货</div>
				<div class="fontclass">.el-icon-yrt-dunhuo</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-rmb"></i>
				<div class="name">人民币</div>
				<div class="fontclass">.el-icon-yrt-rmb</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-setup"></i>
				<div class="name">设置</div>
				<div class="fontclass">.el-icon-yrt-setup</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-iconfontcolor32"></i>
				<div class="name">编辑</div>
				<div class="fontclass">.el-icon-yrt-iconfontcolor32</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-guanbi2"></i>
				<div class="name">关闭</div>
				<div class="fontclass">.el-icon-yrt-guanbi2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zan2"></i>
				<div class="name">赞</div>
				<div class="fontclass">.el-icon-yrt-zan2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-msnui-info"></i>
				<div class="name">帮助</div>
				<div class="fontclass">.el-icon-yrt-msnui-info</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-caigoujihua"></i>
				<div class="name">采购计划</div>
				<div class="fontclass">.el-icon-yrt-caigoujihua</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shenpi"></i>
				<div class="name">审批</div>
				<div class="fontclass">.el-icon-yrt-shenpi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-bianji2"></i>
				<div class="name">编辑</div>
				<div class="fontclass">.el-icon-yrt-bianji2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dingwei"></i>
				<div class="name">定位</div>
				<div class="fontclass">.el-icon-yrt-dingwei</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-liebiaotuodong"></i>
				<div class="name">列表拖动</div>
				<div class="fontclass">.el-icon-yrt-liebiaotuodong</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhuanyi1"></i>
				<div class="name">转移</div>
				<div class="fontclass">.el-icon-yrt-zhuanyi1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-wuliuguanliicon"></i>
				<div class="name">物流管理icon</div>
				<div class="fontclass">.el-icon-yrt-wuliuguanliicon</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jinlingyingcaiwangtubiao20"></i>
				<div class="name">删除</div>
				<div class="fontclass">.el-icon-yrt-jinlingyingcaiwangtubiao20</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jinlingyingcaiwangtubiao35"></i>
				<div class="name">帮助</div>
				<div class="fontclass">.el-icon-yrt-jinlingyingcaiwangtubiao35</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jinlingyingcaiwangtubiao68"></i>
				<div class="name">打印</div>
				<div class="fontclass">.el-icon-yrt-jinlingyingcaiwangtubiao68</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-addplus"></i>
				<div class="name">添加</div>
				<div class="fontclass">.el-icon-yrt-addplus</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jinhuo"></i>
				<div class="name">进货</div>
				<div class="fontclass">.el-icon-yrt-jinhuo</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tianjia"></i>
				<div class="name">添加</div>
				<div class="fontclass">.el-icon-yrt-tianjia</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-saomiao2"></i>
				<div class="name">扫描</div>
				<div class="fontclass">.el-icon-yrt-saomiao2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kaiqi1"></i>
				<div class="name">开启</div>
				<div class="fontclass">.el-icon-yrt-kaiqi1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-peihuo"></i>
				<div class="name">配货</div>
				<div class="fontclass">.el-icon-yrt-peihuo</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tuihuo"></i>
				<div class="name">退货</div>
				<div class="fontclass">.el-icon-yrt-tuihuo</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-saozi"></i>
				<div class="name">扫字</div>
				<div class="fontclass">.el-icon-yrt-saozi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kaiqi2"></i>
				<div class="name">开启</div>
				<div class="fontclass">.el-icon-yrt-kaiqi2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shouji"></i>
				<div class="name">手机</div>
				<div class="fontclass">.el-icon-yrt-shouji</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shenfenzhengrenzheng"></i>
				<div class="name">身份证认证</div>
				<div class="fontclass">.el-icon-yrt-shenfenzhengrenzheng</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shenfenzhengrenzheng1"></i>
				<div class="name">身份证认证</div>
				<div class="fontclass">.el-icon-yrt-shenfenzhengrenzheng1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chazhaoshiyao"></i>
				<div class="name">全盘扫描</div>
				<div class="fontclass">.el-icon-yrt-chazhaoshiyao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-weixinsaomiao"></i>
				<div class="name">微信扫描</div>
				<div class="fontclass">.el-icon-yrt-weixinsaomiao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-daoru3"></i>
				<div class="name">导入</div>
				<div class="fontclass">.el-icon-yrt-daoru3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-daoru4"></i>
				<div class="name">导入</div>
				<div class="fontclass">.el-icon-yrt-daoru4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-toupiao"></i>
				<div class="name">投票</div>
				<div class="fontclass">.el-icon-yrt-toupiao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-hebingumerger"></i>
				<div class="name">合并uMerger</div>
				<div class="fontclass">.el-icon-yrt-hebingumerger</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-bianji3"></i>
				<div class="name">编辑</div>
				<div class="fontclass">.el-icon-yrt-bianji3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-gerenzhongxindingdantuihuozhong"></i>
				<div class="name">个人中心-订单-退货中</div>
				<div class="fontclass">.el-icon-yrt-gerenzhongxindingdantuihuozhong</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-guanbi3"></i>
				<div class="name">关闭</div>
				<div class="fontclass">.el-icon-yrt-guanbi3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fuzhi"></i>
				<div class="name">复制</div>
				<div class="fontclass">.el-icon-yrt-fuzhi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-iconfontguanlibumen1111"></i>
				<div class="name">入库</div>
				<div class="fontclass">.el-icon-yrt-iconfontguanlibumen1111</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icozhuanhuan"></i>
				<div class="name">购物车</div>
				<div class="fontclass">.el-icon-yrt-icozhuanhuan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhanweifu"></i>
				<div class="name">占位符</div>
				<div class="fontclass">.el-icon-yrt-zhanweifu</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fenpei"></i>
				<div class="name">分配</div>
				<div class="fontclass">.el-icon-yrt-fenpei</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-paper-airplane"></i>
				<div class="name">纸飞机</div>
				<div class="fontclass">.el-icon-yrt-paper-airplane</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-iconfontadd"></i>
				<div class="name">加号</div>
				<div class="fontclass">.el-icon-yrt-iconfontadd</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jiahao"></i>
				<div class="name">加号</div>
				<div class="fontclass">.el-icon-yrt-jiahao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-quancha"></i>
				<div class="name">圈叉</div>
				<div class="fontclass">.el-icon-yrt-quancha</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-saomiao3"></i>
				<div class="name">扫描</div>
				<div class="fontclass">.el-icon-yrt-saomiao3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-piliangtianjia"></i>
				<div class="name">批量添加</div>
				<div class="fontclass">.el-icon-yrt-piliangtianjia</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-pingtaishouquanzhongzhi"></i>
				<div class="name">平台授权终止</div>
				<div class="fontclass">.el-icon-yrt-pingtaishouquanzhongzhi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jingxiaoshangzhongzhi"></i>
				<div class="name">经销商终止</div>
				<div class="fontclass">.el-icon-yrt-jingxiaoshangzhongzhi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zijinguanli"></i>
				<div class="name">群蜂资金管理</div>
				<div class="fontclass">.el-icon-yrt-zijinguanli</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dianhua1"></i>
				<div class="name">群蜂电话</div>
				<div class="fontclass">.el-icon-yrt-dianhua1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-youjiantou3"></i>
				<div class="name">右箭头</div>
				<div class="fontclass">.el-icon-yrt-youjiantou3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-font29"></i>
				<div class="name">打印</div>
				<div class="fontclass">.el-icon-yrt-font29</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zijintixian"></i>
				<div class="name">群蜂资金提现</div>
				<div class="fontclass">.el-icon-yrt-zijintixian</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-cangku"></i>
				<div class="name">仓库</div>
				<div class="fontclass">.el-icon-yrt-cangku</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-ruku"></i>
				<div class="name">入库</div>
				<div class="fontclass">.el-icon-yrt-ruku</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-30"></i>
				<div class="name">金融锁</div>
				<div class="fontclass">.el-icon-yrt-30</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-19"></i>
				<div class="name">金融</div>
				<div class="fontclass">.el-icon-yrt-19</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-bangzhu1"></i>
				<div class="name">帮助</div>
				<div class="fontclass">.el-icon-yrt-bangzhu1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-qiyong"></i>
				<div class="name">启用</div>
				<div class="fontclass">.el-icon-yrt-qiyong</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-rfidsaomiao"></i>
				<div class="name">RFID扫描</div>
				<div class="fontclass">.el-icon-yrt-rfidsaomiao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-wenjianjia"></i>
				<div class="name">文件夹</div>
				<div class="fontclass">.el-icon-yrt-wenjianjia</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon08"></i>
				<div class="name">仓库-08</div>
				<div class="fontclass">.el-icon-yrt-icon08</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shenpi1"></i>
				<div class="name">审批</div>
				<div class="fontclass">.el-icon-yrt-shenpi1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tianjia1"></i>
				<div class="name">添加</div>
				<div class="fontclass">.el-icon-yrt-tianjia1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shangpinguanli"></i>
				<div class="name">商品管理</div>
				<div class="fontclass">.el-icon-yrt-shangpinguanli</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xinjian"></i>
				<div class="name">新建</div>
				<div class="fontclass">.el-icon-yrt-xinjian</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhantiepeizhi"></i>
				<div class="name">粘贴配置</div>
				<div class="fontclass">.el-icon-yrt-zhantiepeizhi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-paizhao"></i>
				<div class="name">拍照</div>
				<div class="fontclass">.el-icon-yrt-paizhao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-gouwuche"></i>
				<div class="name">购物车</div>
				<div class="fontclass">.el-icon-yrt-gouwuche</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jihuadan"></i>
				<div class="name">计划单</div>
				<div class="fontclass">.el-icon-yrt-jihuadan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-arrow-left1"></i>
				<div class="name">左箭头</div>
				<div class="fontclass">.el-icon-yrt-arrow-left1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-arrow-down"></i>
				<div class="name">下箭头</div>
				<div class="fontclass">.el-icon-yrt-arrow-down</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zaihaijianceshujuku"></i>
				<div class="name">灾害监测数据库</div>
				<div class="fontclass">.el-icon-yrt-zaihaijianceshujuku</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kehutuisong"></i>
				<div class="name">客户推送</div>
				<div class="fontclass">.el-icon-yrt-kehutuisong</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shenpi2"></i>
				<div class="name">审批</div>
				<div class="fontclass">.el-icon-yrt-shenpi2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhengquegouxuan"></i>
				<div class="name">正确，勾选</div>
				<div class="fontclass">.el-icon-yrt-zhengquegouxuan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-liulanjilu"></i>
				<div class="name">浏览记录</div>
				<div class="fontclass">.el-icon-yrt-liulanjilu</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-saoyisao"></i>
				<div class="name">扫一扫</div>
				<div class="fontclass">.el-icon-yrt-saoyisao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shouye"></i>
				<div class="name">首页</div>
				<div class="fontclass">.el-icon-yrt-shouye</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-liebiao"></i>
				<div class="name">列表</div>
				<div class="fontclass">.el-icon-yrt-liebiao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yu"></i>
				<div class="name">预</div>
				<div class="fontclass">.el-icon-yrt-yu</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dayin1"></i>
				<div class="name">打印</div>
				<div class="fontclass">.el-icon-yrt-dayin1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tuihuo1"></i>
				<div class="name">退货</div>
				<div class="fontclass">.el-icon-yrt-tuihuo1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shengdanjianhuagouwuche"></i>
				<div class="name">圣诞简化-购物车</div>
				<div class="fontclass">.el-icon-yrt-shengdanjianhuagouwuche</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-my-help"></i>
				<div class="name">帮助</div>
				<div class="fontclass">.el-icon-yrt-my-help</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-saomiao4"></i>
				<div class="name">扫描</div>
				<div class="fontclass">.el-icon-yrt-saomiao4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon10"></i>
				<div class="name">调拨</div>
				<div class="fontclass">.el-icon-yrt-icon10</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-gouxuan"></i>
				<div class="name">勾选</div>
				<div class="fontclass">.el-icon-yrt-gouxuan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dianhua2"></i>
				<div class="name">电话</div>
				<div class="fontclass">.el-icon-yrt-dianhua2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-hexiaotiaoxingmasaomiao"></i>
				<div class="name">核销_条形码扫描</div>
				<div class="fontclass">.el-icon-yrt-hexiaotiaoxingmasaomiao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dingwei1"></i>
				<div class="name">定位</div>
				<div class="fontclass">.el-icon-yrt-dingwei1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-saomiao5"></i>
				<div class="name">扫描</div>
				<div class="fontclass">.el-icon-yrt-saomiao5</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-daifenpei"></i>
				<div class="name">待分配</div>
				<div class="fontclass">.el-icon-yrt-daifenpei</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dingwei2"></i>
				<div class="name">定位</div>
				<div class="fontclass">.el-icon-yrt-dingwei2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fenpei-copy"></i>
				<div class="name">分配</div>
				<div class="fontclass">.el-icon-yrt-fenpei-copy</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shanchu3"></i>
				<div class="name">删除</div>
				<div class="fontclass">.el-icon-yrt-shanchu3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-guoqiflag50"></i>
				<div class="name">国旗_flag50</div>
				<div class="fontclass">.el-icon-yrt-guoqiflag50</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tuihuo2"></i>
				<div class="name">退货</div>
				<div class="fontclass">.el-icon-yrt-tuihuo2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shourumingxi"></i>
				<div class="name">收入明细</div>
				<div class="fontclass">.el-icon-yrt-shourumingxi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zanwushourumingxi"></i>
				<div class="name">暂无收入明细</div>
				<div class="fontclass">.el-icon-yrt-zanwushourumingxi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-paizhaotubiao"></i>
				<div class="name">拍照图标</div>
				<div class="fontclass">.el-icon-yrt-paizhaotubiao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tuisong"></i>
				<div class="name">推送</div>
				<div class="fontclass">.el-icon-yrt-tuisong</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shenpi3"></i>
				<div class="name">审批</div>
				<div class="fontclass">.el-icon-yrt-shenpi3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-save"></i>
				<div class="name">保存</div>
				<div class="fontclass">.el-icon-yrt-save</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-12312"></i>
				<div class="name">叉车</div>
				<div class="fontclass">.el-icon-yrt-12312</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-121212122"></i>
				<div class="name">托盘箱子</div>
				<div class="fontclass">.el-icon-yrt-121212122</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-123"></i>
				<div class="name">叉车</div>
				<div class="fontclass">.el-icon-yrt-123</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-saomiao6"></i>
				<div class="name">扫描异常</div>
				<div class="fontclass">.el-icon-yrt-saomiao6</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-cangku131"></i>
				<div class="name">仓库131</div>
				<div class="fontclass">.el-icon-yrt-cangku131</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tuopan121"></i>
				<div class="name">托盘121</div>
				<div class="fontclass">.el-icon-yrt-tuopan121</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tuisong1"></i>
				<div class="name">推送</div>
				<div class="fontclass">.el-icon-yrt-tuisong1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-arrow_down_full"></i>
				<div class="name">向下箭头</div>
				<div class="fontclass">.el-icon-yrt-arrow_down_full</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-iconset0255"></i>
				<div class="name">扫描条形码</div>
				<div class="fontclass">.el-icon-yrt-iconset0255</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-iconset0311"></i>
				<div class="name">购物车-向右移动</div>
				<div class="fontclass">.el-icon-yrt-iconset0311</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-iconset0312"></i>
				<div class="name">购物车-向左移动</div>
				<div class="fontclass">.el-icon-yrt-iconset0312</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-iconset0492"></i>
				<div class="name">圆</div>
				<div class="fontclass">.el-icon-yrt-iconset0492</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-iconset0493"></i>
				<div class="name">圆</div>
				<div class="fontclass">.el-icon-yrt-iconset0493</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhuanyigeitaren"></i>
				<div class="name">转移给他人</div>
				<div class="fontclass">.el-icon-yrt-zhuanyigeitaren</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kefu"></i>
				<div class="name">客服</div>
				<div class="fontclass">.el-icon-yrt-kefu</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tianjia3"></i>
				<div class="name">添加</div>
				<div class="fontclass">.el-icon-yrt-tianjia3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shouye1"></i>
				<div class="name">首页</div>
				<div class="fontclass">.el-icon-yrt-shouye1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-rili"></i>
				<div class="name">日历</div>
				<div class="fontclass">.el-icon-yrt-rili</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-liebiao1"></i>
				<div class="name">列表</div>
				<div class="fontclass">.el-icon-yrt-liebiao1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-saomiaoerweima"></i>
				<div class="name">扫描二维码</div>
				<div class="fontclass">.el-icon-yrt-saomiaoerweima</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-danxuan"></i>
				<div class="name">单选</div>
				<div class="fontclass">.el-icon-yrt-danxuan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-gouwuche1"></i>
				<div class="name">购物车</div>
				<div class="fontclass">.el-icon-yrt-gouwuche1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shizhongfill"></i>
				<div class="name">时钟-fill</div>
				<div class="fontclass">.el-icon-yrt-shizhongfill</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-gouxuan1"></i>
				<div class="name">勾选</div>
				<div class="fontclass">.el-icon-yrt-gouxuan1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-bangdingshouji"></i>
				<div class="name">绑定手机</div>
				<div class="fontclass">.el-icon-yrt-bangdingshouji</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-74wodedingdan"></i>
				<div class="name">我的订单</div>
				<div class="fontclass">.el-icon-yrt-74wodedingdan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-iconfontarrows1"></i>
				<div class="name">下箭头</div>
				<div class="fontclass">.el-icon-yrt-iconfontarrows1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-iconfontarrows"></i>
				<div class="name">下箭头</div>
				<div class="fontclass">.el-icon-yrt-iconfontarrows</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-iconfonti"></i>
				<div class="name">右箭头</div>
				<div class="fontclass">.el-icon-yrt-iconfonti</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-iconfonticonfonti2copycopy"></i>
				<div class="name">右箭头</div>
				<div class="fontclass">.el-icon-yrt-iconfonticonfonti2copycopy</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-danxuankuang-copy"></i>
				<div class="name">单选框</div>
				<div class="fontclass">.el-icon-yrt-danxuankuang-copy</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-weibiaoti1"></i>
				<div class="name">首页</div>
				<div class="fontclass">.el-icon-yrt-weibiaoti1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-huoweizhijian"></i>
				<div class="name">货位质检</div>
				<div class="fontclass">.el-icon-yrt-huoweizhijian</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fuzhi1"></i>
				<div class="name">复制</div>
				<div class="fontclass">.el-icon-yrt-fuzhi1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhongzhi"></i>
				<div class="name">终止</div>
				<div class="fontclass">.el-icon-yrt-zhongzhi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-weibiaoti7"></i>
				<div class="name">上下转换</div>
				<div class="fontclass">.el-icon-yrt-weibiaoti7</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-weibiaoti38"></i>
				<div class="name">圆</div>
				<div class="fontclass">.el-icon-yrt-weibiaoti38</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-weibiaoti40"></i>
				<div class="name">右箭头</div>
				<div class="fontclass">.el-icon-yrt-weibiaoti40</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-youjiantou4"></i>
				<div class="name">右箭头</div>
				<div class="fontclass">.el-icon-yrt-youjiantou4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fahuo"></i>
				<div class="name">发货</div>
				<div class="fontclass">.el-icon-yrt-fahuo</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xiaoxi"></i>
				<div class="name">消息</div>
				<div class="fontclass">.el-icon-yrt-xiaoxi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhiding"></i>
				<div class="name">置顶</div>
				<div class="fontclass">.el-icon-yrt-zhiding</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-liebiaolist36"></i>
				<div class="name">列表</div>
				<div class="fontclass">.el-icon-yrt-liebiaolist36</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yuancircle46"></i>
				<div class="name">圆</div>
				<div class="fontclass">.el-icon-yrt-yuancircle46</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zitifont5"></i>
				<div class="name">字体</div>
				<div class="fontclass">.el-icon-yrt-zitifont5</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zitifont6"></i>
				<div class="name">字体</div>
				<div class="fontclass">.el-icon-yrt-zitifont6</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-liebiaolist29"></i>
				<div class="name">列表</div>
				<div class="fontclass">.el-icon-yrt-liebiaolist29</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-liebiaolist46"></i>
				<div class="name">列表</div>
				<div class="fontclass">.el-icon-yrt-liebiaolist46</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-churuliushuichaxun"></i>
				<div class="name">出入流水查询</div>
				<div class="fontclass">.el-icon-yrt-churuliushuichaxun</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon21"></i>
				<div class="name">密码</div>
				<div class="fontclass">.el-icon-yrt-icon21</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhuanyi"></i>
				<div class="name">转移</div>
				<div class="fontclass">.el-icon-yrt-zhuanyi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fenpei1"></i>
				<div class="name">分配</div>
				<div class="fontclass">.el-icon-yrt-fenpei1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xiaoxi1"></i>
				<div class="name">消息</div>
				<div class="fontclass">.el-icon-yrt-xiaoxi1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tongji1"></i>
				<div class="name">ZS统计1</div>
				<div class="fontclass">.el-icon-yrt-tongji1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yuangou"></i>
				<div class="name">ZS圆勾</div>
				<div class="fontclass">.el-icon-yrt-yuangou</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xiangxiajiantou"></i>
				<div class="name">31-向下箭头</div>
				<div class="fontclass">.el-icon-yrt-xiangxiajiantou</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-merge"></i>
				<div class="name">合并</div>
				<div class="fontclass">.el-icon-yrt-merge</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yuanquanjiahao"></i>
				<div class="name">加号（圆圈）</div>
				<div class="fontclass">.el-icon-yrt-yuanquanjiahao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chongzhi"></i>
				<div class="name">重置</div>
				<div class="fontclass">.el-icon-yrt-chongzhi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jiaochacross78"></i>
				<div class="name">交叉_cross78</div>
				<div class="fontclass">.el-icon-yrt-jiaochacross78</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jiaochacross80"></i>
				<div class="name">交叉_cross80</div>
				<div class="fontclass">.el-icon-yrt-jiaochacross80</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yuancircle92"></i>
				<div class="name">圆_circle92</div>
				<div class="fontclass">.el-icon-yrt-yuancircle92</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yuanxingdecircular225"></i>
				<div class="name">圆形的_circular225</div>
				<div class="fontclass">.el-icon-yrt-yuanxingdecircular225</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-weixin"></i>
				<div class="name">微信</div>
				<div class="fontclass">.el-icon-yrt-weixin</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dingdan"></i>
				<div class="name">订单</div>
				<div class="fontclass">.el-icon-yrt-dingdan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shouji1"></i>
				<div class="name">手机</div>
				<div class="fontclass">.el-icon-yrt-shouji1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xingxing"></i>
				<div class="name">星星</div>
				<div class="fontclass">.el-icon-yrt-xingxing</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xingxu"></i>
				<div class="name">星_虚</div>
				<div class="fontclass">.el-icon-yrt-xingxu</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-gouwuche2"></i>
				<div class="name">购物车</div>
				<div class="fontclass">.el-icon-yrt-gouwuche2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-ren"></i>
				<div class="name">人</div>
				<div class="fontclass">.el-icon-yrt-ren</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-gouxuan2"></i>
				<div class="name">勾选</div>
				<div class="fontclass">.el-icon-yrt-gouxuan2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-feiji1"></i>
				<div class="name">飞机</div>
				<div class="fontclass">.el-icon-yrt-feiji1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shouji2"></i>
				<div class="name">手机</div>
				<div class="fontclass">.el-icon-yrt-shouji2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yduigouxuan"></i>
				<div class="name">YDUI-勾选</div>
				<div class="fontclass">.el-icon-yrt-yduigouxuan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chaigai"></i>
				<div class="name">拆改</div>
				<div class="fontclass">.el-icon-yrt-chaigai</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-danxuankuang"></i>
				<div class="name">单选框</div>
				<div class="fontclass">.el-icon-yrt-danxuankuang</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yuandianxiao"></i>
				<div class="name">圆点小</div>
				<div class="fontclass">.el-icon-yrt-yuandianxiao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yuandianzhong"></i>
				<div class="name">圆点中</div>
				<div class="fontclass">.el-icon-yrt-yuandianzhong</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shouye2"></i>
				<div class="name">首页</div>
				<div class="fontclass">.el-icon-yrt-shouye2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chuku"></i>
				<div class="name">出库</div>
				<div class="fontclass">.el-icon-yrt-chuku</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-renminbicaiwuzhifu"></i>
				<div class="name">人民币 财务 支付</div>
				<div class="fontclass">.el-icon-yrt-renminbicaiwuzhifu</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shangpingouwudai2"></i>
				<div class="name">商品 购物袋2</div>
				<div class="fontclass">.el-icon-yrt-shangpingouwudai2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-baogaofenpei"></i>
				<div class="name">报告分配</div>
				<div class="fontclass">.el-icon-yrt-baogaofenpei</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shanchuguanbicha2"></i>
				<div class="name">删除关闭 叉2</div>
				<div class="fontclass">.el-icon-yrt-shanchuguanbicha2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tianjiajiahaowubiankuang"></i>
				<div class="name">添加 加号 无边框</div>
				<div class="fontclass">.el-icon-yrt-tianjiajiahaowubiankuang</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yuandianzhong1"></i>
				<div class="name">圆点中</div>
				<div class="fontclass">.el-icon-yrt-yuandianzhong1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xinjian1"></i>
				<div class="name">新建</div>
				<div class="fontclass">.el-icon-yrt-xinjian1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dayin2"></i>
				<div class="name">打印</div>
				<div class="fontclass">.el-icon-yrt-dayin2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-biaoti"></i>
				<div class="name">标题</div>
				<div class="fontclass">.el-icon-yrt-biaoti</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-rili1"></i>
				<div class="name">日历</div>
				<div class="fontclass">.el-icon-yrt-rili1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fuxuan"></i>
				<div class="name">复选</div>
				<div class="fontclass">.el-icon-yrt-fuxuan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zan3"></i>
				<div class="name">赞</div>
				<div class="fontclass">.el-icon-yrt-zan3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-liulan"></i>
				<div class="name">浏览</div>
				<div class="fontclass">.el-icon-yrt-liulan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon-service"></i>
				<div class="name">客服电话</div>
				<div class="fontclass">.el-icon-yrt-icon-service</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon-transfer"></i>
				<div class="name">调拨</div>
				<div class="fontclass">.el-icon-yrt-icon-transfer</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chaku"></i>
				<div class="name">查库</div>
				<div class="fontclass">.el-icon-yrt-chaku</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chaxun"></i>
				<div class="name">查询</div>
				<div class="fontclass">.el-icon-yrt-chaxun</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shanchu11"></i>
				<div class="name">删除 (1)</div>
				<div class="fontclass">.el-icon-yrt-shanchu11</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-ai-list"></i>
				<div class="name">列表</div>
				<div class="fontclass">.el-icon-yrt-ai-list</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-ai-pay-copy"></i>
				<div class="name">银联</div>
				<div class="fontclass">.el-icon-yrt-ai-pay-copy</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tuisong2"></i>
				<div class="name">推送</div>
				<div class="fontclass">.el-icon-yrt-tuisong2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-wuxing"></i>
				<div class="name">五星</div>
				<div class="fontclass">.el-icon-yrt-wuxing</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chuku-copy"></i>
				<div class="name">仓库</div>
				<div class="fontclass">.el-icon-yrt-chuku-copy</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-renzheng"></i>
				<div class="name">认证</div>
				<div class="fontclass">.el-icon-yrt-renzheng</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-guanbi5"></i>
				<div class="name">单选</div>
				<div class="fontclass">.el-icon-yrt-guanbi5</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-guanbi4"></i>
				<div class="name">已完成/加载成功</div>
				<div class="fontclass">.el-icon-yrt-guanbi4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dianhua3"></i>
				<div class="name">电话</div>
				<div class="fontclass">.el-icon-yrt-dianhua3</div>
			</li>
			<li>
				<i class="icon iconfont el-icon-yrt-chuku1"></i>
				<div class="name">出库</div>
				<div class="fontclass">.el-icon-yrt-chuku1</div>
			</li>
			<li>
				<i class="icon iconfont el-icon-yrt-ruku1"></i>
				<div class="name">入库</div>
				<div class="fontclass">.el-icon-yrt-ruku1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-pandian"></i>
				<div class="name">盘点</div>
				<div class="fontclass">.el-icon-yrt-pandian</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-goods"></i>
				<div class="name">商品</div>
				<div class="fontclass">.el-icon-yrt-goods</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-date-1"></i>
				<div class="name">时间选择</div>
				<div class="fontclass">.el-icon-yrt-date-1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kaiqihuodong"></i>
				<div class="name">开启活动</div>
				<div class="fontclass">.el-icon-yrt-kaiqihuodong</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-toolbar-car"></i>
				<div class="name">送货到家</div>
				<div class="fontclass">.el-icon-yrt-toolbar-car</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chaifen"></i>
				<div class="name">拆分</div>
				<div class="fontclass">.el-icon-yrt-chaifen</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-hebing"></i>
				<div class="name">合并</div>
				<div class="fontclass">.el-icon-yrt-hebing</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yuancircle94"></i>
				<div class="name">圆_circle94</div>
				<div class="fontclass">.el-icon-yrt-yuancircle94</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-cf-c63"></i>
				<div class="name">调拨管理</div>
				<div class="fontclass">.el-icon-yrt-cf-c63</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-cf-c65"></i>
				<div class="name">明细表</div>
				<div class="fontclass">.el-icon-yrt-cf-c65</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon05"></i>
				<div class="name">审批</div>
				<div class="fontclass">.el-icon-yrt-icon05</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fukuan"></i>
				<div class="name">付款</div>
				<div class="fontclass">.el-icon-yrt-fukuan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kehufenpei"></i>
				<div class="name">客户分配</div>
				<div class="fontclass">.el-icon-yrt-kehufenpei</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-saomiao21"></i>
				<div class="name">扫描2</div>
				<div class="fontclass">.el-icon-yrt-saomiao21</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fuzhi2"></i>
				<div class="name">复制</div>
				<div class="fontclass">.el-icon-yrt-fuzhi2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon2"></i>
				<div class="name">浏览</div>
				<div class="fontclass">.el-icon-yrt-icon2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-sanjiaodown"></i>
				<div class="name">下箭头</div>
				<div class="fontclass">.el-icon-yrt-sanjiaodown</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-sanjiaoright"></i>
				<div class="name">右箭头</div>
				<div class="fontclass">.el-icon-yrt-sanjiaoright</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tongji3"></i>
				<div class="name">统计3</div>
				<div class="fontclass">.el-icon-yrt-tongji3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-liebiao2"></i>
				<div class="name">列表</div>
				<div class="fontclass">.el-icon-yrt-liebiao2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shenpi4"></i>
				<div class="name">审批</div>
				<div class="fontclass">.el-icon-yrt-shenpi4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shenpi5"></i>
				<div class="name">审批</div>
				<div class="fontclass">.el-icon-yrt-shenpi5</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-ai-password"></i>
				<div class="name">密码</div>
				<div class="fontclass">.el-icon-yrt-ai-password</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fenpeixiangmu"></i>
				<div class="name">分配项目</div>
				<div class="fontclass">.el-icon-yrt-fenpeixiangmu</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chaxun1"></i>
				<div class="name">查询</div>
				<div class="fontclass">.el-icon-yrt-chaxun1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-ai-connection"></i>
				<div class="name">人脉</div>
				<div class="fontclass">.el-icon-yrt-ai-connection</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kucunchaxun"></i>
				<div class="name">库存查询</div>
				<div class="fontclass">.el-icon-yrt-kucunchaxun</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-iconfontchaxun"></i>
				<div class="name">查询</div>
				<div class="fontclass">.el-icon-yrt-iconfontchaxun</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jiaochacross79"></i>
				<div class="name">交叉_cross79</div>
				<div class="fontclass">.el-icon-yrt-jiaochacross79</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhongzhiicon"></i>
				<div class="name">终止icon</div>
				<div class="fontclass">.el-icon-yrt-zhongzhiicon</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-bangdingshouji01"></i>
				<div class="name">绑定手机-01</div>
				<div class="fontclass">.el-icon-yrt-bangdingshouji01</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jinxingzhong"></i>
				<div class="name">进行中</div>
				<div class="fontclass">.el-icon-yrt-jinxingzhong</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-untitled96"></i>
				<div class="name">背景实心叉</div>
				<div class="fontclass">.el-icon-yrt-untitled96</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-saomiao7"></i>
				<div class="name">扫描</div>
				<div class="fontclass">.el-icon-yrt-saomiao7</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dingwei3"></i>
				<div class="name">定位</div>
				<div class="fontclass">.el-icon-yrt-dingwei3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tupian"></i>
				<div class="name">图片</div>
				<div class="fontclass">.el-icon-yrt-tupian</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-feiji2"></i>
				<div class="name">飞机</div>
				<div class="fontclass">.el-icon-yrt-feiji2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-anquansaomiao"></i>
				<div class="name">安全扫描</div>
				<div class="fontclass">.el-icon-yrt-anquansaomiao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yujingtongji"></i>
				<div class="name">预警统计</div>
				<div class="fontclass">.el-icon-yrt-yujingtongji</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xialakuang"></i>
				<div class="name">下拉框</div>
				<div class="fontclass">.el-icon-yrt-xialakuang</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yinlian1193427easyiconnet"></i>
				<div class="name">银联</div>
				<div class="fontclass">.el-icon-yrt-yinlian1193427easyiconnet</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-danxuanfuxuan"></i>
				<div class="name">单选-复选</div>
				<div class="fontclass">.el-icon-yrt-danxuanfuxuan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-liudongzijintubiao22"></i>
				<div class="name">流动资金图标</div>
				<div class="fontclass">.el-icon-yrt-liudongzijintubiao22</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-cangku1"></i>
				<div class="name">仓库</div>
				<div class="fontclass">.el-icon-yrt-cangku1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-cangchuguanli"></i>
				<div class="name">仓储管理</div>
				<div class="fontclass">.el-icon-yrt-cangchuguanli</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhifubao1"></i>
				<div class="name">支付宝</div>
				<div class="fontclass">.el-icon-yrt-zhifubao1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-weixin2"></i>
				<div class="name">微信</div>
				<div class="fontclass">.el-icon-yrt-weixin2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fenpei2"></i>
				<div class="name">分配</div>
				<div class="fontclass">.el-icon-yrt-fenpei2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-youxianzijin"></i>
				<div class="name">优先资金</div>
				<div class="fontclass">.el-icon-yrt-youxianzijin</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhihuiliangkuhuoweiguanli"></i>
				<div class="name">智慧粮库－货位管理</div>
				<div class="fontclass">.el-icon-yrt-zhihuiliangkuhuoweiguanli</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dianhua21"></i>
				<div class="name">电话 (2)</div>
				<div class="fontclass">.el-icon-yrt-dianhua21</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-pan"></i>
				<div class="name">盘</div>
				<div class="fontclass">.el-icon-yrt-pan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-querenshouhuo"></i>
				<div class="name">确认收货</div>
				<div class="fontclass">.el-icon-yrt-querenshouhuo</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-bianhaozhuanyi"></i>
				<div class="name">编号转移</div>
				<div class="fontclass">.el-icon-yrt-bianhaozhuanyi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shanchu4"></i>
				<div class="name">删除</div>
				<div class="fontclass">.el-icon-yrt-shanchu4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-daishouhuo"></i>
				<div class="name">待收货</div>
				<div class="fontclass">.el-icon-yrt-daishouhuo</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon"></i>
				<div class="name">扫码</div>
				<div class="fontclass">.el-icon-yrt-icon</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dianhua4"></i>
				<div class="name">电话</div>
				<div class="fontclass">.el-icon-yrt-dianhua4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-daochu1"></i>
				<div class="name">导出</div>
				<div class="fontclass">.el-icon-yrt-daochu1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-weixin3"></i>
				<div class="name">微信</div>
				<div class="fontclass">.el-icon-yrt-weixin3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-delivery-truck"></i>
				<div class="name">送货货车</div>
				<div class="fontclass">.el-icon-yrt-delivery-truck</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zantingzijincunqu"></i>
				<div class="name">暂停资金存取</div>
				<div class="fontclass">.el-icon-yrt-zantingzijincunqu</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kaitongwangshangjiaoyi"></i>
				<div class="name">开通网上交易</div>
				<div class="fontclass">.el-icon-yrt-kaitongwangshangjiaoyi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-suodingkucun01"></i>
				<div class="name">锁定库存</div>
				<div class="fontclass">.el-icon-yrt-suodingkucun01</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shouye3"></i>
				<div class="name">首页</div>
				<div class="fontclass">.el-icon-yrt-shouye3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhaohuizijinhao01"></i>
				<div class="name">资金纪录</div>
				<div class="fontclass">.el-icon-yrt-zhaohuizijinhao01</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-piliangtianjia1"></i>
				<div class="name">批量添加</div>
				<div class="fontclass">.el-icon-yrt-piliangtianjia1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-ruku2"></i>
				<div class="name">入库</div>
				<div class="fontclass">.el-icon-yrt-ruku2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-iconfontcustomize"></i>
				<div class="name">自定义</div>
				<div class="fontclass">.el-icon-yrt-iconfontcustomize</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-iconfontpaishe"></i>
				<div class="name">拍摄扫描</div>
				<div class="fontclass">.el-icon-yrt-iconfontpaishe</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yigouxuan"></i>
				<div class="name">已勾选</div>
				<div class="fontclass">.el-icon-yrt-yigouxuan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kuaididangenzong"></i>
				<div class="name">快递单跟踪</div>
				<div class="fontclass">.el-icon-yrt-kuaididangenzong</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dingdan1"></i>
				<div class="name">订单</div>
				<div class="fontclass">.el-icon-yrt-dingdan1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chaxun2"></i>
				<div class="name">查询</div>
				<div class="fontclass">.el-icon-yrt-chaxun2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-payment"></i>
				<div class="name">付款</div>
				<div class="fontclass">.el-icon-yrt-payment</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shangpinruku"></i>
				<div class="name">商品入库</div>
				<div class="fontclass">.el-icon-yrt-shangpinruku</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-mima"></i>
				<div class="name">密码</div>
				<div class="fontclass">.el-icon-yrt-mima</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shouhuodizhi"></i>
				<div class="name">收货地址</div>
				<div class="fontclass">.el-icon-yrt-shouhuodizhi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhuanjifenshimingrenzheng"></i>
				<div class="name">积分商城-实名认证</div>
				<div class="fontclass">.el-icon-yrt-zhuanjifenshimingrenzheng</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xingji"></i>
				<div class="name">星级</div>
				<div class="fontclass">.el-icon-yrt-xingji</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-paizhao1"></i>
				<div class="name">拍照</div>
				<div class="fontclass">.el-icon-yrt-paizhao1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tucenggouxuan"></i>
				<div class="name">勾选</div>
				<div class="fontclass">.el-icon-yrt-tucenggouxuan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shangjiantou"></i>
				<div class="name">上箭头</div>
				<div class="fontclass">.el-icon-yrt-shangjiantou</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jiarugouwuche"></i>
				<div class="name">加入购物车</div>
				<div class="fontclass">.el-icon-yrt-jiarugouwuche</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zan4"></i>
				<div class="name">赞</div>
				<div class="fontclass">.el-icon-yrt-zan4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-top01"></i>
				<div class="name">置顶</div>
				<div class="fontclass">.el-icon-yrt-top01</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-gouwuche3"></i>
				<div class="name">购物车</div>
				<div class="fontclass">.el-icon-yrt-gouwuche3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-wuxing1"></i>
				<div class="name">五星</div>
				<div class="fontclass">.el-icon-yrt-wuxing1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shouhuo"></i>
				<div class="name">收货</div>
				<div class="fontclass">.el-icon-yrt-shouhuo</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shujuguanlisvg42"></i>
				<div class="name">盘管</div>
				<div class="fontclass">.el-icon-yrt-shujuguanlisvg42</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhongzhi1"></i>
				<div class="name">终止</div>
				<div class="fontclass">.el-icon-yrt-zhongzhi1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-weixin-copy"></i>
				<div class="name">微信</div>
				<div class="fontclass">.el-icon-yrt-weixin-copy</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-daishouhuo1"></i>
				<div class="name">待收货</div>
				<div class="fontclass">.el-icon-yrt-daishouhuo1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-daishouhuo2"></i>
				<div class="name">待收货</div>
				<div class="fontclass">.el-icon-yrt-daishouhuo2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jianhuoguanli1"></i>
				<div class="name">拣货管理 (1)</div>
				<div class="fontclass">.el-icon-yrt-jianhuoguanli1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dianhua5"></i>
				<div class="name">电话</div>
				<div class="fontclass">.el-icon-yrt-dianhua5</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xiangxiajiantou1"></i>
				<div class="name">向下箭头</div>
				<div class="fontclass">.el-icon-yrt-xiangxiajiantou1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chai"></i>
				<div class="name">拆</div>
				<div class="fontclass">.el-icon-yrt-chai</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-ai247"></i>
				<div class="name">字体</div>
				<div class="fontclass">.el-icon-yrt-ai247</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-iconplsd"></i>
				<div class="name">批量+</div>
				<div class="fontclass">.el-icon-yrt-iconplsd</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-iconddsho"></i>
				<div class="name">确认收货</div>
				<div class="fontclass">.el-icon-yrt-iconddsho</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fahuo1"></i>
				<div class="name">发货</div>
				<div class="fontclass">.el-icon-yrt-fahuo1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dabao"></i>
				<div class="name">打包</div>
				<div class="fontclass">.el-icon-yrt-dabao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shanchuyixuanqunchengyuanchacha"></i>
				<div class="name">删除已选群成员-叉叉</div>
				<div class="fontclass">.el-icon-yrt-shanchuyixuanqunchengyuanchacha</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-saomiaoxinxi"></i>
				<div class="name">扫描信息</div>
				<div class="fontclass">.el-icon-yrt-saomiaoxinxi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tupian1"></i>
				<div class="name">图片</div>
				<div class="fontclass">.el-icon-yrt-tupian1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jinxingzhong1"></i>
				<div class="name">进行中</div>
				<div class="fontclass">.el-icon-yrt-jinxingzhong1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-youjiantou"></i>
				<div class="name">右箭头</div>
				<div class="fontclass">.el-icon-yrt-youjiantou</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhuanyi11"></i>
				<div class="name">转移</div>
				<div class="fontclass">.el-icon-yrt-zhuanyi11</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-wo"></i>
				<div class="name">人</div>
				<div class="fontclass">.el-icon-yrt-wo</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-service"></i>
				<div class="name">客服</div>
				<div class="fontclass">.el-icon-yrt-service</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kefu2"></i>
				<div class="name">客服</div>
				<div class="fontclass">.el-icon-yrt-kefu2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-Id"></i>
				<div class="name">身份证</div>
				<div class="fontclass">.el-icon-yrt-Id</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-youjiantou5"></i>
				<div class="name">右箭头</div>
				<div class="fontclass">.el-icon-yrt-youjiantou5</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-liulan1"></i>
				<div class="name">浏览</div>
				<div class="fontclass">.el-icon-yrt-liulan1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-gouxuan3"></i>
				<div class="name">勾选</div>
				<div class="fontclass">.el-icon-yrt-gouxuan3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yuan"></i>
				<div class="name">圆</div>
				<div class="fontclass">.el-icon-yrt-yuan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-wenjianjia1"></i>
				<div class="name">文件夹</div>
				<div class="fontclass">.el-icon-yrt-wenjianjia1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-asterisks-1-copy"></i>
				<div class="name">星号</div>
				<div class="fontclass">.el-icon-yrt-asterisks-1-copy</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhongzhihuodong"></i>
				<div class="name">终止活动</div>
				<div class="fontclass">.el-icon-yrt-zhongzhihuodong</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shenpi6"></i>
				<div class="name">审批</div>
				<div class="fontclass">.el-icon-yrt-shenpi6</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-haofangtuo400iconfontpai"></i>
				<div class="name">好房拓 4.0.0 iconfont_派</div>
				<div class="fontclass">.el-icon-yrt-haofangtuo400iconfontpai</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-renzhengshangjia"></i>
				<div class="name">认证商家</div>
				<div class="fontclass">.el-icon-yrt-renzhengshangjia</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shenfenzheng"></i>
				<div class="name">身份证</div>
				<div class="fontclass">.el-icon-yrt-shenfenzheng</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yingfeng"></i>
				<div class="name">盈峰</div>
				<div class="fontclass">.el-icon-yrt-yingfeng</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-gouxuan4"></i>
				<div class="name">勾选</div>
				<div class="fontclass">.el-icon-yrt-gouxuan4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fenpei3"></i>
				<div class="name">分配</div>
				<div class="fontclass">.el-icon-yrt-fenpei3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon_cut"></i>
				<div class="name">减少</div>
				<div class="fontclass">.el-icon-yrt-icon_cut</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chukumingxi"></i>
				<div class="name">出库明细</div>
				<div class="fontclass">.el-icon-yrt-chukumingxi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-saomiao8"></i>
				<div class="name">扫描</div>
				<div class="fontclass">.el-icon-yrt-saomiao8</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dayin3"></i>
				<div class="name">打印</div>
				<div class="fontclass">.el-icon-yrt-dayin3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-daishouhuo3"></i>
				<div class="name">待收货</div>
				<div class="fontclass">.el-icon-yrt-daishouhuo3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shanchu5"></i>
				<div class="name">删除</div>
				<div class="fontclass">.el-icon-yrt-shanchu5</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-webicon301"></i>
				<div class="name">实名认证</div>
				<div class="fontclass">.el-icon-yrt-webicon301</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-iconcheckbox1"></i>
				<div class="name">复选选中</div>
				<div class="fontclass">.el-icon-yrt-iconcheckbox1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-iconless"></i>
				<div class="name">减少</div>
				<div class="fontclass">.el-icon-yrt-iconless</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon234"></i>
				<div class="name">仓库</div>
				<div class="fontclass">.el-icon-yrt-icon234</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-add"></i>
				<div class="name">添加</div>
				<div class="fontclass">.el-icon-yrt-add</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tuihuo3"></i>
				<div class="name">退货</div>
				<div class="fontclass">.el-icon-yrt-tuihuo3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-youjiantou6"></i>
				<div class="name">3.0-右箭头</div>
				<div class="fontclass">.el-icon-yrt-youjiantou6</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yiwancheng"></i>
				<div class="name">已完成</div>
				<div class="fontclass">.el-icon-yrt-yiwancheng</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zan5"></i>
				<div class="name">赞</div>
				<div class="fontclass">.el-icon-yrt-zan5</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-saomiaoguanli"></i>
				<div class="name">下载</div>
				<div class="fontclass">.el-icon-yrt-saomiaoguanli</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-invtaking"></i>
				<div class="name">盘点</div>
				<div class="fontclass">.el-icon-yrt-invtaking</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tuihuozhong"></i>
				<div class="name">退货中</div>
				<div class="fontclass">.el-icon-yrt-tuihuozhong</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shouji3"></i>
				<div class="name">手机</div>
				<div class="fontclass">.el-icon-yrt-shouji3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-qrcode-2"></i>
				<div class="name">扫描二维码</div>
				<div class="fontclass">.el-icon-yrt-qrcode-2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-mima1"></i>
				<div class="name">密码</div>
				<div class="fontclass">.el-icon-yrt-mima1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-liangfanzhuang"></i>
				<div class="name">打包</div>
				<div class="fontclass">.el-icon-yrt-liangfanzhuang</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-saomiao31"></i>
				<div class="name">扫描3</div>
				<div class="fontclass">.el-icon-yrt-saomiao31</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-renyuanjieshao"></i>
				<div class="name">人员介绍</div>
				<div class="fontclass">.el-icon-yrt-renyuanjieshao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-ren111"></i>
				<div class="name">人</div>
				<div class="fontclass">.el-icon-yrt-ren111</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-2"></i>
				<div class="name">名片扫描</div>
				<div class="fontclass">.el-icon-yrt-2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-liulanjilusel"></i>
				<div class="name">浏览记录_sel</div>
				<div class="fontclass">.el-icon-yrt-liulanjilusel</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xinghao"></i>
				<div class="name">星号</div>
				<div class="fontclass">.el-icon-yrt-xinghao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-reset"></i>
				<div class="name">重置</div>
				<div class="fontclass">.el-icon-yrt-reset</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-churuku"></i>
				<div class="name">出入库</div>
				<div class="fontclass">.el-icon-yrt-churuku</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jiance"></i>
				<div class="name">监测</div>
				<div class="fontclass">.el-icon-yrt-jiance</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shipan"></i>
				<div class="name">实盘</div>
				<div class="fontclass">.el-icon-yrt-shipan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yuan1"></i>
				<div class="name">圆</div>
				<div class="fontclass">.el-icon-yrt-yuan1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chaifen1"></i>
				<div class="name">拆分</div>
				<div class="fontclass">.el-icon-yrt-chaifen1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chaifen2"></i>
				<div class="name">拆分</div>
				<div class="fontclass">.el-icon-yrt-chaifen2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dingwei4"></i>
				<div class="name">定位</div>
				<div class="fontclass">.el-icon-yrt-dingwei4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-saoyisao-copy"></i>
				<div class="name">扫一扫</div>
				<div class="fontclass">.el-icon-yrt-saoyisao-copy</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shizhong"></i>
				<div class="name">时钟</div>
				<div class="fontclass">.el-icon-yrt-shizhong</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-iconfontzhizuobiaozhun023147"></i>
				<div class="name">新</div>
				<div class="fontclass">.el-icon-yrt-iconfontzhizuobiaozhun023147</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-gouwuche21"></i>
				<div class="name">购物车</div>
				<div class="fontclass">.el-icon-yrt-gouwuche21</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kuaidi1"></i>
				<div class="name">快递</div>
				<div class="fontclass">.el-icon-yrt-kuaidi1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fenjianchuku"></i>
				<div class="name">分拣出库</div>
				<div class="fontclass">.el-icon-yrt-fenjianchuku</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fenjianruku"></i>
				<div class="name">分拣入库</div>
				<div class="fontclass">.el-icon-yrt-fenjianruku</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dingdangdaishimingrenzheng"></i>
				<div class="name">叮当贷-实名认证</div>
				<div class="fontclass">.el-icon-yrt-dingdangdaishimingrenzheng</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-renyuan"></i>
				<div class="name">人员</div>
				<div class="fontclass">.el-icon-yrt-renyuan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-paizhao2"></i>
				<div class="name">拍照</div>
				<div class="fontclass">.el-icon-yrt-paizhao2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shimingrenzheng"></i>
				<div class="name">实名认证</div>
				<div class="fontclass">.el-icon-yrt-shimingrenzheng</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kefurexian"></i>
				<div class="name">客服热线</div>
				<div class="fontclass">.el-icon-yrt-kefurexian</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dingwei5"></i>
				<div class="name">定位</div>
				<div class="fontclass">.el-icon-yrt-dingwei5</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-saoyisao1"></i>
				<div class="name">扫一扫 (1)</div>
				<div class="fontclass">.el-icon-yrt-saoyisao1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dingdangdaizijinliushui"></i>
				<div class="name">叮当贷-资金流水</div>
				<div class="fontclass">.el-icon-yrt-dingdangdaizijinliushui</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shen"></i>
				<div class="name">身份证</div>
				<div class="fontclass">.el-icon-yrt-shen</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-msg"></i>
				<div class="name">消息</div>
				<div class="fontclass">.el-icon-yrt-msg</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tel"></i>
				<div class="name">电话</div>
				<div class="fontclass">.el-icon-yrt-tel</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-clock"></i>
				<div class="name">时钟</div>
				<div class="fontclass">.el-icon-yrt-clock</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-cir-cny"></i>
				<div class="name">环 人民币</div>
				<div class="fontclass">.el-icon-yrt-cir-cny</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-solid-time"></i>
				<div class="name">时钟 实心</div>
				<div class="fontclass">.el-icon-yrt-solid-time</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kuaidi2"></i>
				<div class="name">快递</div>
				<div class="fontclass">.el-icon-yrt-kuaidi2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-scan-copy"></i>
				<div class="name">扫描</div>
				<div class="fontclass">.el-icon-yrt-scan-copy</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chengbenfenxi"></i>
				<div class="name">成本分析</div>
				<div class="fontclass">.el-icon-yrt-chengbenfenxi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-danxuan2"></i>
				<div class="name">单选2</div>
				<div class="fontclass">.el-icon-yrt-danxuan2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xiaoxi2"></i>
				<div class="name">消息</div>
				<div class="fontclass">.el-icon-yrt-xiaoxi2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-mlfp"></i>
				<div class="name">目录分配</div>
				<div class="fontclass">.el-icon-yrt-mlfp</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhifubaozhifu"></i>
				<div class="name">支付宝支付</div>
				<div class="fontclass">.el-icon-yrt-zhifubaozhifu</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-baocun2"></i>
				<div class="name">保存</div>
				<div class="fontclass">.el-icon-yrt-baocun2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shenfenrenzheng"></i>
				<div class="name">身份认证</div>
				<div class="fontclass">.el-icon-yrt-shenfenrenzheng</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-new1"></i>
				<div class="name">新人</div>
				<div class="fontclass">.el-icon-yrt-new1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-39kaiguankai2"></i>
				<div class="name">39开关开2</div>
				<div class="fontclass">.el-icon-yrt-39kaiguankai2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xiaoxi3"></i>
				<div class="name">消息</div>
				<div class="fontclass">.el-icon-yrt-xiaoxi3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-gouxuan5"></i>
				<div class="name">勾选</div>
				<div class="fontclass">.el-icon-yrt-gouxuan5</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chongzhi1"></i>
				<div class="name">重置</div>
				<div class="fontclass">.el-icon-yrt-chongzhi1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-liulan2"></i>
				<div class="name">浏览</div>
				<div class="fontclass">.el-icon-yrt-liulan2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-gouwuche4"></i>
				<div class="name">购物车</div>
				<div class="fontclass">.el-icon-yrt-gouwuche4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dingwei6"></i>
				<div class="name">定位</div>
				<div class="fontclass">.el-icon-yrt-dingwei6</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-renminbi1688"></i>
				<div class="name">人民币</div>
				<div class="fontclass">.el-icon-yrt-renminbi1688</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shizhong1"></i>
				<div class="name">时钟</div>
				<div class="fontclass">.el-icon-yrt-shizhong1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-23"></i>
				<div class="name">托盘码－批量</div>
				<div class="fontclass">.el-icon-yrt-23</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-youjiantou7"></i>
				<div class="name">右箭头</div>
				<div class="fontclass">.el-icon-yrt-youjiantou7</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fenpei4"></i>
				<div class="name">分配</div>
				<div class="fontclass">.el-icon-yrt-fenpei4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-saomiaojieguo"></i>
				<div class="name">扫描结果</div>
				<div class="fontclass">.el-icon-yrt-saomiaojieguo</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chacha"></i>
				<div class="name">叉叉</div>
				<div class="fontclass">.el-icon-yrt-chacha</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhongzhi2"></i>
				<div class="name">重置</div>
				<div class="fontclass">.el-icon-yrt-zhongzhi2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-ziti1"></i>
				<div class="name">字体</div>
				<div class="fontclass">.el-icon-yrt-ziti1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dayin4"></i>
				<div class="name">打印</div>
				<div class="fontclass">.el-icon-yrt-dayin4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yuyinsaomiao"></i>
				<div class="name">语音扫描</div>
				<div class="fontclass">.el-icon-yrt-yuyinsaomiao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-716bianjiqi_zitiyanse"></i>
				<div class="name">716编辑器_字体颜色</div>
				<div class="fontclass">.el-icon-yrt-716bianjiqi_zitiyanse</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-728bianjiqi_zitidaxiao"></i>
				<div class="name">728编辑器_字体大小</div>
				<div class="fontclass">.el-icon-yrt-728bianjiqi_zitidaxiao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon-yuanxk"></i>
				<div class="name">圆形线条</div>
				<div class="fontclass">.el-icon-yrt-icon-yuanxk</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon-yuanzhuti"></i>
				<div class="name">圆柱体</div>
				<div class="fontclass">.el-icon-yrt-icon-yuanzhuti</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon-yuanzhuiti"></i>
				<div class="name">圆锥体</div>
				<div class="fontclass">.el-icon-yrt-icon-yuanzhuiti</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-ruku11"></i>
				<div class="name">入库</div>
				<div class="fontclass">.el-icon-yrt-ruku11</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-weixin4"></i>
				<div class="name">微信</div>
				<div class="fontclass">.el-icon-yrt-weixin4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-sekuaigouwuche"></i>
				<div class="name">色块－购物车</div>
				<div class="fontclass">.el-icon-yrt-sekuaigouwuche</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xiangao"></i>
				<div class="name">金融&货币－24</div>
				<div class="fontclass">.el-icon-yrt-xiangao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xiangao1"></i>
				<div class="name">金融&货币－25</div>
				<div class="fontclass">.el-icon-yrt-xiangao1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xiangao2"></i>
				<div class="name">金融&货币－32</div>
				<div class="fontclass">.el-icon-yrt-xiangao2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xiangao3"></i>
				<div class="name">金融&货币－36</div>
				<div class="fontclass">.el-icon-yrt-xiangao3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-saomiao9"></i>
				<div class="name">扫描</div>
				<div class="fontclass">.el-icon-yrt-saomiao9</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kuaidi3"></i>
				<div class="name">快递</div>
				<div class="fontclass">.el-icon-yrt-kuaidi3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-youjiantou8"></i>
				<div class="name">右箭头</div>
				<div class="fontclass">.el-icon-yrt-youjiantou8</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fenjian"></i>
				<div class="name">分拣</div>
				<div class="fontclass">.el-icon-yrt-fenjian</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kaiguanclose"></i>
				<div class="name">开关 开</div>
				<div class="fontclass">.el-icon-yrt-kaiguanclose</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kuaidi4"></i>
				<div class="name">快递</div>
				<div class="fontclass">.el-icon-yrt-kuaidi4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kuaidi5"></i>
				<div class="name">快递</div>
				<div class="fontclass">.el-icon-yrt-kuaidi5</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-4"></i>
				<div class="name">人</div>
				<div class="fontclass">.el-icon-yrt-4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-rili2"></i>
				<div class="name">日历</div>
				<div class="fontclass">.el-icon-yrt-rili2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fenpei5"></i>
				<div class="name">分配</div>
				<div class="fontclass">.el-icon-yrt-fenpei5</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tubiao-"></i>
				<div class="name">客户交易分布</div>
				<div class="fontclass">.el-icon-yrt-tubiao-</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tubiao-1"></i>
				<div class="name">金融交易统计</div>
				<div class="fontclass">.el-icon-yrt-tubiao-1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-plan-plane-aeroplane-fun-office-timepass-eedb"></i>
				<div class="name">计划，飞机</div>
				<div class="fontclass">.el-icon-yrt-plan-plane-aeroplane-fun-office-timepass-eedb</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-cangku2"></i>
				<div class="name">仓库</div>
				<div class="fontclass">.el-icon-yrt-cangku2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fenpei6"></i>
				<div class="name">分配</div>
				<div class="fontclass">.el-icon-yrt-fenpei6</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shangxiajiantou-"></i>
				<div class="name">上下箭头-3</div>
				<div class="fontclass">.el-icon-yrt-shangxiajiantou-</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chai_heidi"></i>
				<div class="name">拆_黑底</div>
				<div class="fontclass">.el-icon-yrt-chai_heidi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhuanyiwenti"></i>
				<div class="name">转移问题</div>
				<div class="fontclass">.el-icon-yrt-zhuanyiwenti</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chaxun3"></i>
				<div class="name">查询</div>
				<div class="fontclass">.el-icon-yrt-chaxun3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kuaididan"></i>
				<div class="name">快递单</div>
				<div class="fontclass">.el-icon-yrt-kuaididan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-suokaiqi"></i>
				<div class="name">锁（开启）</div>
				<div class="fontclass">.el-icon-yrt-suokaiqi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tubiaozhizuomoban"></i>
				<div class="name">减少</div>
				<div class="fontclass">.el-icon-yrt-tubiaozhizuomoban</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jiaoyi"></i>
				<div class="name">交易</div>
				<div class="fontclass">.el-icon-yrt-jiaoyi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tupian2"></i>
				<div class="name">图片</div>
				<div class="fontclass">.el-icon-yrt-tupian2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fenpeimubiao"></i>
				<div class="name">分配目标</div>
				<div class="fontclass">.el-icon-yrt-fenpeimubiao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kuaidi6"></i>
				<div class="name">快递</div>
				<div class="fontclass">.el-icon-yrt-kuaidi6</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zuojiantou"></i>
				<div class="name">左箭头</div>
				<div class="fontclass">.el-icon-yrt-zuojiantou</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chaxun4"></i>
				<div class="name">查询</div>
				<div class="fontclass">.el-icon-yrt-chaxun4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shachu-xue"></i>
				<div class="name">删除</div>
				<div class="fontclass">.el-icon-yrt-shachu-xue</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zijinlicai"></i>
				<div class="name">资金，理财</div>
				<div class="fontclass">.el-icon-yrt-zijinlicai</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shenfenzheng1"></i>
				<div class="name">身份证</div>
				<div class="fontclass">.el-icon-yrt-shenfenzheng1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tianjia4"></i>
				<div class="name">添加</div>
				<div class="fontclass">.el-icon-yrt-tianjia4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dayin_hebing"></i>
				<div class="name">打印_合并</div>
				<div class="fontclass">.el-icon-yrt-dayin_hebing</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-renyuansousuo"></i>
				<div class="name">人员搜索</div>
				<div class="fontclass">.el-icon-yrt-renyuansousuo</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dingdan2"></i>
				<div class="name">订单</div>
				<div class="fontclass">.el-icon-yrt-dingdan2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dingwei7"></i>
				<div class="name">定位</div>
				<div class="fontclass">.el-icon-yrt-dingwei7</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-liebiao3"></i>
				<div class="name">列表</div>
				<div class="fontclass">.el-icon-yrt-liebiao3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zuojiantou1"></i>
				<div class="name">左箭头</div>
				<div class="fontclass">.el-icon-yrt-zuojiantou1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-gouxuan6"></i>
				<div class="name">勾选</div>
				<div class="fontclass">.el-icon-yrt-gouxuan6</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-ziyuan"></i>
				<div class="name">勾选</div>
				<div class="fontclass">.el-icon-yrt-ziyuan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shizhong2"></i>
				<div class="name">时钟1</div>
				<div class="fontclass">.el-icon-yrt-shizhong2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jingwuicon_svg-"></i>
				<div class="name">国旗</div>
				<div class="fontclass">.el-icon-yrt-jingwuicon_svg-</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-guoqi_flag"></i>
				<div class="name">国旗_flag54</div>
				<div class="fontclass">.el-icon-yrt-guoqi_flag</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-gouwuche5"></i>
				<div class="name">购物车</div>
				<div class="fontclass">.el-icon-yrt-gouwuche5</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-renqun"></i>
				<div class="name">人群</div>
				<div class="fontclass">.el-icon-yrt-renqun</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-niantie"></i>
				<div class="name">粘贴</div>
				<div class="fontclass">.el-icon-yrt-niantie</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xinjian2"></i>
				<div class="name">新建</div>
				<div class="fontclass">.el-icon-yrt-xinjian2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt--daima"></i>
				<div class="name">07-代码</div>
				<div class="fontclass">.el-icon-yrt--daima</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-youjiantou1"></i>
				<div class="name">右箭头</div>
				<div class="fontclass">.el-icon-yrt-youjiantou1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xiaoxi4"></i>
				<div class="name">消息</div>
				<div class="fontclass">.el-icon-yrt-xiaoxi4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-weixin1"></i>
				<div class="name">微信 (1)</div>
				<div class="fontclass">.el-icon-yrt-weixin1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-clock1"></i>
				<div class="name">时钟</div>
				<div class="fontclass">.el-icon-yrt-clock1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xiaoxi5"></i>
				<div class="name">消息</div>
				<div class="fontclass">.el-icon-yrt-xiaoxi5</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-paizhao-xianxing"></i>
				<div class="name">237拍照-线性</div>
				<div class="fontclass">.el-icon-yrt-paizhao-xianxing</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-anniu"></i>
				<div class="name">符号-按钮</div>
				<div class="fontclass">.el-icon-yrt-anniu</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-danhangshurukuang"></i>
				<div class="name">符号-单行输入框</div>
				<div class="fontclass">.el-icon-yrt-danhangshurukuang</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-duohangshurukuang"></i>
				<div class="name">符号-多行输入框</div>
				<div class="fontclass">.el-icon-yrt-duohangshurukuang</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jilianxuanze"></i>
				<div class="name">符号-级联选择</div>
				<div class="fontclass">.el-icon-yrt-jilianxuanze</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kaiguan"></i>
				<div class="name">符号-开关</div>
				<div class="fontclass">.el-icon-yrt-kaiguan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-star1"></i>
				<div class="name">星星</div>
				<div class="fontclass">.el-icon-yrt-star1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon-test3"></i>
				<div class="name">组织管理</div>
				<div class="fontclass">.el-icon-yrt-icon-test3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon-test2"></i>
				<div class="name">文件夹</div>
				<div class="fontclass">.el-icon-yrt-icon-test2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xiajiantou"></i>
				<div class="name">下箭头</div>
				<div class="fontclass">.el-icon-yrt-xiajiantou</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shangjiantou1"></i>
				<div class="name">上箭头</div>
				<div class="fontclass">.el-icon-yrt-shangjiantou1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shouye4"></i>
				<div class="name">首页</div>
				<div class="fontclass">.el-icon-yrt-shouye4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-web__bitebiyoujiantou"></i>
				<div class="name">web__比特币右箭头</div>
				<div class="fontclass">.el-icon-yrt-web__bitebiyoujiantou</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-daima"></i>
				<div class="name">符号-代码</div>
				<div class="fontclass">.el-icon-yrt-daima</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jiaoyiguanli"></i>
				<div class="name">后台-交易管理</div>
				<div class="fontclass">.el-icon-yrt-jiaoyiguanli</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-web-icon-1"></i>
				<div class="name">消息</div>
				<div class="fontclass">.el-icon-yrt-web-icon-1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-feiyongkemu"></i>
				<div class="name">费用科目</div>
				<div class="fontclass">.el-icon-yrt-feiyongkemu</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-placeholder__"></i>
				<div class="name">定位</div>
				<div class="fontclass">.el-icon-yrt-placeholder__</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xinzengyugengxinxiaoshoudingdan"></i>
				<div class="name">新增与更新销售订单</div>
				<div class="fontclass">.el-icon-yrt-xinzengyugengxinxiaoshoudingdan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shizhongtianjia"></i>
				<div class="name">时钟添加</div>
				<div class="fontclass">.el-icon-yrt-shizhongtianjia</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-renyuantianjia"></i>
				<div class="name">人员添加</div>
				<div class="fontclass">.el-icon-yrt-renyuantianjia</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shizhong3"></i>
				<div class="name">时钟</div>
				<div class="fontclass">.el-icon-yrt-shizhong3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xiaoxi6"></i>
				<div class="name">消息</div>
				<div class="fontclass">.el-icon-yrt-xiaoxi6</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-clock2"></i>
				<div class="name">时钟</div>
				<div class="fontclass">.el-icon-yrt-clock2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fq_yingshoukuan"></i>
				<div class="name">fq_应收款</div>
				<div class="fontclass">.el-icon-yrt-fq_yingshoukuan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-wodezijin"></i>
				<div class="name">供方-我的资金</div>
				<div class="fontclass">.el-icon-yrt-wodezijin</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shanchu6"></i>
				<div class="name">删除</div>
				<div class="fontclass">.el-icon-yrt-shanchu6</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon-p_rili"></i>
				<div class="name">日历</div>
				<div class="fontclass">.el-icon-yrt-icon-p_rili</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dingdan3"></i>
				<div class="name">订单</div>
				<div class="fontclass">.el-icon-yrt-dingdan3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-paizhao3"></i>
				<div class="name">拍照</div>
				<div class="fontclass">.el-icon-yrt-paizhao3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-hangbanyanwu"></i>
				<div class="name">航班延误</div>
				<div class="fontclass">.el-icon-yrt-hangbanyanwu</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-hangbandongtai"></i>
				<div class="name">航班动态</div>
				<div class="fontclass">.el-icon-yrt-hangbandongtai</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-wenjianjia2"></i>
				<div class="name">文件夹</div>
				<div class="fontclass">.el-icon-yrt-wenjianjia2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xiaoxi7"></i>
				<div class="name">消息</div>
				<div class="fontclass">.el-icon-yrt-xiaoxi7</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-reduce_icon"></i>
				<div class="name">减少</div>
				<div class="fontclass">.el-icon-yrt-reduce_icon</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-feiji3"></i>
				<div class="name">飞机</div>
				<div class="fontclass">.el-icon-yrt-feiji3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-calendar"></i>
				<div class="name">日历</div>
				<div class="fontclass">.el-icon-yrt-calendar</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhuanxiangzijin"></i>
				<div class="name">专项资金</div>
				<div class="fontclass">.el-icon-yrt-zhuanxiangzijin</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zuojiantou3"></i>
				<div class="name">右箭头</div>
				<div class="fontclass">.el-icon-yrt-zuojiantou3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shujutongji"></i>
				<div class="name">数据统计</div>
				<div class="fontclass">.el-icon-yrt-shujutongji</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-credentials_icon"></i>
				<div class="name">身份证</div>
				<div class="fontclass">.el-icon-yrt-credentials_icon</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xing"></i>
				<div class="name">星</div>
				<div class="fontclass">.el-icon-yrt-xing</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shizhong4"></i>
				<div class="name">时钟</div>
				<div class="fontclass">.el-icon-yrt-shizhong4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xiangjipaizhao"></i>
				<div class="name">相机拍照</div>
				<div class="fontclass">.el-icon-yrt-xiangjipaizhao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shizhong_l"></i>
				<div class="name">时钟_l</div>
				<div class="fontclass">.el-icon-yrt-shizhong_l</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jianshao_l"></i>
				<div class="name">减少_l</div>
				<div class="fontclass">.el-icon-yrt-jianshao_l</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-batch-reduce"></i>
				<div class="name">批量减少</div>
				<div class="fontclass">.el-icon-yrt-batch-reduce</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-sanjiaoleft"></i>
				<div class="name">左箭头</div>
				<div class="fontclass">.el-icon-yrt-sanjiaoleft</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-sanjiaoleft-copy"></i>
				<div class="name">左箭头</div>
				<div class="fontclass">.el-icon-yrt-sanjiaoleft-copy</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-sanjiaoleft1"></i>
				<div class="name">左箭头</div>
				<div class="fontclass">.el-icon-yrt-sanjiaoleft1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-arrow-left"></i>
				<div class="name">左箭头</div>
				<div class="fontclass">.el-icon-yrt-arrow-left</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-siji-"></i>
				<div class="name">司机-01</div>
				<div class="fontclass">.el-icon-yrt-siji-</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tuihuobaozhang"></i>
				<div class="name">退货保障</div>
				<div class="fontclass">.el-icon-yrt-tuihuobaozhang</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jianshao"></i>
				<div class="name">减少</div>
				<div class="fontclass">.el-icon-yrt-jianshao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zuojiantou2"></i>
				<div class="name">左箭头</div>
				<div class="fontclass">.el-icon-yrt-zuojiantou2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon-test"></i>
				<div class="name">签字</div>
				<div class="fontclass">.el-icon-yrt-icon-test</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yinhang-yinlian-"></i>
				<div class="name">银行-银联-09</div>
				<div class="fontclass">.el-icon-yrt-yinhang-yinlian-</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dingwei8"></i>
				<div class="name">定位</div>
				<div class="fontclass">.el-icon-yrt-dingwei8</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kaiguan1"></i>
				<div class="name">开关</div>
				<div class="fontclass">.el-icon-yrt-kaiguan1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xialakuang1"></i>
				<div class="name">下拉框</div>
				<div class="fontclass">.el-icon-yrt-xialakuang1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jiankongzhongxin"></i>
				<div class="name">监控中心</div>
				<div class="fontclass">.el-icon-yrt-jiankongzhongxin</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shanchu7"></i>
				<div class="name">删除</div>
				<div class="fontclass">.el-icon-yrt-shanchu7</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fl-renshi"></i>
				<div class="name">人事</div>
				<div class="fontclass">.el-icon-yrt-fl-renshi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-star"></i>
				<div class="name">置顶推荐top</div>
				<div class="fontclass">.el-icon-yrt-star</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-liebiao4"></i>
				<div class="name">列表</div>
				<div class="fontclass">.el-icon-yrt-liebiao4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jiaoyichenggong"></i>
				<div class="name">首页-交易成功</div>
				<div class="fontclass">.el-icon-yrt-jiaoyichenggong</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dingwei9"></i>
				<div class="name">定位</div>
				<div class="fontclass">.el-icon-yrt-dingwei9</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-rili3"></i>
				<div class="name">日历</div>
				<div class="fontclass">.el-icon-yrt-rili3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kefu3"></i>
				<div class="name">客服</div>
				<div class="fontclass">.el-icon-yrt-kefu3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shouji-tianchong"></i>
				<div class="name">手机</div>
				<div class="fontclass">.el-icon-yrt-shouji-tianchong</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dingwei10"></i>
				<div class="name">定位</div>
				<div class="fontclass">.el-icon-yrt-dingwei10</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-anniu1"></i>
				<div class="name">按钮</div>
				<div class="fontclass">.el-icon-yrt-anniu1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xiaoxi8"></i>
				<div class="name">消息</div>
				<div class="fontclass">.el-icon-yrt-xiaoxi8</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jianshao1"></i>
				<div class="name">减少</div>
				<div class="fontclass">.el-icon-yrt-jianshao1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shizhong5"></i>
				<div class="name">时钟</div>
				<div class="fontclass">.el-icon-yrt-shizhong5</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-liulan3"></i>
				<div class="name">浏览</div>
				<div class="fontclass">.el-icon-yrt-liulan3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shouji4"></i>
				<div class="name">手机</div>
				<div class="fontclass">.el-icon-yrt-shouji4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jiahao1"></i>
				<div class="name">加号</div>
				<div class="fontclass">.el-icon-yrt-jiahao1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yigouxuan1"></i>
				<div class="name">已勾选32</div>
				<div class="fontclass">.el-icon-yrt-yigouxuan1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shouye5"></i>
				<div class="name">首页</div>
				<div class="fontclass">.el-icon-yrt-shouye5</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-guoqi"></i>
				<div class="name">国旗</div>
				<div class="fontclass">.el-icon-yrt-guoqi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tongji"></i>
				<div class="name">统计</div>
				<div class="fontclass">.el-icon-yrt-tongji</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shenfenzhengfanmian"></i>
				<div class="name">身份证反面</div>
				<div class="fontclass">.el-icon-yrt-shenfenzhengfanmian</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-youjiantou2"></i>
				<div class="name">右箭头</div>
				<div class="fontclass">.el-icon-yrt-youjiantou2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yigouxuan2"></i>
				<div class="name">已勾选40</div>
				<div class="fontclass">.el-icon-yrt-yigouxuan2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jiajianzujianjiahao"></i>
				<div class="name">加减组件 加号</div>
				<div class="fontclass">.el-icon-yrt-jiajianzujianjiahao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-cheliangziliaoshenhe"></i>
				<div class="name">车辆资料审核</div>
				<div class="fontclass">.el-icon-yrt-cheliangziliaoshenhe</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-cheliangziliao"></i>
				<div class="name">车辆资料</div>
				<div class="fontclass">.el-icon-yrt-cheliangziliao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chengyunfangziliaoshenhe"></i>
				<div class="name">承运方资料审核</div>
				<div class="fontclass">.el-icon-yrt-chengyunfangziliaoshenhe</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-feiyongguizeziliao"></i>
				<div class="name">费用规则资料</div>
				<div class="fontclass">.el-icon-yrt-feiyongguizeziliao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chengyunfangziliao"></i>
				<div class="name">承运方资料</div>
				<div class="fontclass">.el-icon-yrt-chengyunfangziliao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yunshujihuashenhe"></i>
				<div class="name">运输计划审核</div>
				<div class="fontclass">.el-icon-yrt-yunshujihuashenhe</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-cheliangyunwei"></i>
				<div class="name">车辆运维</div>
				<div class="fontclass">.el-icon-yrt-cheliangyunwei</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-cheliangdangan"></i>
				<div class="name">车辆档案</div>
				<div class="fontclass">.el-icon-yrt-cheliangdangan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-cheliangweixiubaoyang"></i>
				<div class="name">车辆维修保养</div>
				<div class="fontclass">.el-icon-yrt-cheliangweixiubaoyang</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-cheliangjiankong"></i>
				<div class="name">车辆监控</div>
				<div class="fontclass">.el-icon-yrt-cheliangjiankong</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chengbentongjifenxi"></i>
				<div class="name">成本统计分析</div>
				<div class="fontclass">.el-icon-yrt-chengbentongjifenxi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-cheliangyingxiangshezhi"></i>
				<div class="name">车辆影像设置</div>
				<div class="fontclass">.el-icon-yrt-cheliangyingxiangshezhi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-chengbenjisuangongshi"></i>
				<div class="name">成本计算公式</div>
				<div class="fontclass">.el-icon-yrt-chengbenjisuangongshi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-qitafeiyong"></i>
				<div class="name">其他费用</div>
				<div class="fontclass">.el-icon-yrt-qitafeiyong</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-renyuanguanli"></i>
				<div class="name">人员管理</div>
				<div class="fontclass">.el-icon-yrt-renyuanguanli</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-sijipaiban"></i>
				<div class="name">司机排班</div>
				<div class="fontclass">.el-icon-yrt-sijipaiban</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-sijiguanli"></i>
				<div class="name">司机管理</div>
				<div class="fontclass">.el-icon-yrt-sijiguanli</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zuzhijigou"></i>
				<div class="name">组织机构</div>
				<div class="fontclass">.el-icon-yrt-zuzhijigou</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fuhao-ziti"></i>
				<div class="name">符号-字体</div>
				<div class="fontclass">.el-icon-yrt-fuhao-ziti</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-folder-open"></i>
				<div class="name">文件夹开</div>
				<div class="fontclass">.el-icon-yrt-folder-open</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-guoqi_flag1"></i>
				<div class="name">国旗_flag54</div>
				<div class="fontclass">.el-icon-yrt-guoqi_flag1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-character-mind"></i>
				<div class="name">人物-关注</div>
				<div class="fontclass">.el-icon-yrt-character-mind</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-character-success"></i>
				<div class="name">人物-成功</div>
				<div class="fontclass">.el-icon-yrt-character-success</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-character-cancel"></i>
				<div class="name">人物-取消</div>
				<div class="fontclass">.el-icon-yrt-character-cancel</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-character-minus"></i>
				<div class="name">人物-减去</div>
				<div class="fontclass">.el-icon-yrt-character-minus</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dianhuaweijie"></i>
				<div class="name">电话 未接</div>
				<div class="fontclass">.el-icon-yrt-dianhuaweijie</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-paizhao4"></i>
				<div class="name">拍照</div>
				<div class="fontclass">.el-icon-yrt-paizhao4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhiding1"></i>
				<div class="name">置顶</div>
				<div class="fontclass">.el-icon-yrt-zhiding1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-pingfen"></i>
				<div class="name">评分</div>
				<div class="fontclass">.el-icon-yrt-pingfen</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-web-icon-"></i>
				<div class="name">派送</div>
				<div class="fontclass">.el-icon-yrt-web-icon-</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-benpao"></i>
				<div class="name">奔跑</div>
				<div class="fontclass">.el-icon-yrt-benpao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon--2"></i>
				<div class="name">开关</div>
				<div class="fontclass">.el-icon-yrt-icon--2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon--3"></i>
				<div class="name">开关</div>
				<div class="fontclass">.el-icon-yrt-icon--3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon--1"></i>
				<div class="name">消息</div>
				<div class="fontclass">.el-icon-yrt-icon--1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon--"></i>
				<div class="name">纸飞机</div>
				<div class="fontclass">.el-icon-yrt-icon--</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-renxiang"></i>
				<div class="name">人像</div>
				<div class="fontclass">.el-icon-yrt-renxiang</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xiuxiyixia"></i>
				<div class="name">休息一下</div>
				<div class="fontclass">.el-icon-yrt-xiuxiyixia</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tuihuochuli"></i>
				<div class="name">退货处理</div>
				<div class="fontclass">.el-icon-yrt-tuihuochuli</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-wenjian"></i>
				<div class="name">文件</div>
				<div class="fontclass">.el-icon-yrt-wenjian</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xing1"></i>
				<div class="name">星</div>
				<div class="fontclass">.el-icon-yrt-xing1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zan6"></i>
				<div class="name">赞</div>
				<div class="fontclass">.el-icon-yrt-zan6</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-weiqianzi"></i>
				<div class="name">未签字</div>
				<div class="fontclass">.el-icon-yrt-weiqianzi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yiqianzi"></i>
				<div class="name">已签字</div>
				<div class="fontclass">.el-icon-yrt-yiqianzi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-rili4"></i>
				<div class="name">日历</div>
				<div class="fontclass">.el-icon-yrt-rili4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhcc_xiangxiajiantou"></i>
				<div class="name">zhcc_向下箭头</div>
				<div class="fontclass">.el-icon-yrt-zhcc_xiangxiajiantou</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shouji5"></i>
				<div class="name">手机</div>
				<div class="fontclass">.el-icon-yrt-shouji5</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fuzhi3"></i>
				<div class="name">复制</div>
				<div class="fontclass">.el-icon-yrt-fuzhi3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tubiaolunkuo-"></i>
				<div class="name">客服</div>
				<div class="fontclass">.el-icon-yrt-tubiaolunkuo-</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dingwei11"></i>
				<div class="name">定位</div>
				<div class="fontclass">.el-icon-yrt-dingwei11</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-feiji4"></i>
				<div class="name">飞机</div>
				<div class="fontclass">.el-icon-yrt-feiji4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt--"></i>
				<div class="name">统计</div>
				<div class="fontclass">.el-icon-yrt--</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-gouxuan7"></i>
				<div class="name">勾选</div>
				<div class="fontclass">.el-icon-yrt-gouxuan7</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shizhong6"></i>
				<div class="name">时钟</div>
				<div class="fontclass">.el-icon-yrt-shizhong6</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-ren1"></i>
				<div class="name">人</div>
				<div class="fontclass">.el-icon-yrt-ren1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-daimamoshi"></i>
				<div class="name">代码模式</div>
				<div class="fontclass">.el-icon-yrt-daimamoshi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-liebiao5"></i>
				<div class="name">列表</div>
				<div class="fontclass">.el-icon-yrt-liebiao5</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-feijihangban"></i>
				<div class="name">飞机航班</div>
				<div class="fontclass">.el-icon-yrt-feijihangban</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-clock3"></i>
				<div class="name">时钟手表</div>
				<div class="fontclass">.el-icon-yrt-clock3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-feiji5"></i>
				<div class="name">飞机</div>
				<div class="fontclass">.el-icon-yrt-feiji5</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-_fuzhi-"></i>
				<div class="name">时钟</div>
				<div class="fontclass">.el-icon-yrt-_fuzhi-</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-gouwuche6"></i>
				<div class="name">购物车</div>
				<div class="fontclass">.el-icon-yrt-gouwuche6</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt--zhishengfeiji"></i>
				<div class="name">100-直升飞机</div>
				<div class="fontclass">.el-icon-yrt--zhishengfeiji</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shizhong7"></i>
				<div class="name">时钟</div>
				<div class="fontclass">.el-icon-yrt-shizhong7</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhcc_xiangxiajiantou1"></i>
				<div class="name">zhcc_向下箭头1</div>
				<div class="fontclass">.el-icon-yrt-zhcc_xiangxiajiantou1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt--daxiajiantou"></i>
				<div class="name">017-大下箭头</div>
				<div class="fontclass">.el-icon-yrt--daxiajiantou</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zhcc_jiahao"></i>
				<div class="name">zhcc_加号</div>
				<div class="fontclass">.el-icon-yrt-zhcc_jiahao</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yidong"></i>
				<div class="name">移动</div>
				<div class="fontclass">.el-icon-yrt-yidong</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-mn_xiuxi"></i>
				<div class="name">AK-MN休息</div>
				<div class="fontclass">.el-icon-yrt-mn_xiuxi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-im_dianhua2"></i>
				<div class="name">AK-IM电话2</div>
				<div class="fontclass">.el-icon-yrt-im_dianhua2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-paobu"></i>
				<div class="name">跑步</div>
				<div class="fontclass">.el-icon-yrt-paobu</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dianhua6"></i>
				<div class="name">电话</div>
				<div class="fontclass">.el-icon-yrt-dianhua6</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-shijianxuanzeqi"></i>
				<div class="name">时间选择器</div>
				<div class="fontclass">.el-icon-yrt-shijianxuanzeqi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yiwancheng1"></i>
				<div class="name">已完成</div>
				<div class="fontclass">.el-icon-yrt-yiwancheng1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-liulan-tianchong"></i>
				<div class="name">浏览-填充</div>
				<div class="fontclass">.el-icon-yrt-liulan-tianchong</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fuzhi4"></i>
				<div class="name">复制</div>
				<div class="fontclass">.el-icon-yrt-fuzhi4</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-biaodanzujian-xialakuang"></i>
				<div class="name">表单组件-下拉框</div>
				<div class="fontclass">.el-icon-yrt-biaodanzujian-xialakuang</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yidong1"></i>
				<div class="name">移动</div>
				<div class="fontclass">.el-icon-yrt-yidong1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xiaoxi9"></i>
				<div class="name">消息</div>
				<div class="fontclass">.el-icon-yrt-xiaoxi9</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xing2"></i>
				<div class="name">星</div>
				<div class="fontclass">.el-icon-yrt-xing2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-biangengcheliangyanse"></i>
				<div class="name">变更车辆颜色</div>
				<div class="fontclass">.el-icon-yrt-biangengcheliangyanse</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-qianzi"></i>
				<div class="name">签字12</div>
				<div class="fontclass">.el-icon-yrt-qianzi</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-dabiaoti"></i>
				<div class="name">大标题</div>
				<div class="fontclass">.el-icon-yrt-dabiaoti</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-anniuzu"></i>
				<div class="name">按钮组</div>
				<div class="fontclass">.el-icon-yrt-anniuzu</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-tupian3"></i>
				<div class="name">图片</div>
				<div class="fontclass">.el-icon-yrt-tupian3</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-wenjian1"></i>
				<div class="name">文件</div>
				<div class="fontclass">.el-icon-yrt-wenjian1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-liebiao6"></i>
				<div class="name">列表</div>
				<div class="fontclass">.el-icon-yrt-liebiao6</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-xin1"></i>
				<div class="name">新</div>
				<div class="fontclass">.el-icon-yrt-xin1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-ziyuan1"></i>
				<div class="name">支付宝</div>
				<div class="fontclass">.el-icon-yrt-ziyuan1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fuxuankuang"></i>
				<div class="name">复选框</div>
				<div class="fontclass">.el-icon-yrt-fuxuankuang</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-huakuai"></i>
				<div class="name">滑块</div>
				<div class="fontclass">.el-icon-yrt-huakuai</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-jiantou_shangxiaqiehuan"></i>
				<div class="name">箭头_上下切换</div>
				<div class="fontclass">.el-icon-yrt-jiantou_shangxiaqiehuan</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-layout-custom"></i>
				<div class="name">自定义布局</div>
				<div class="fontclass">.el-icon-yrt-layout-custom</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-icon-test1"></i>
				<div class="name">复选-选中</div>
				<div class="fontclass">.el-icon-yrt-icon-test1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fuxuankuang_xuanzhong"></i>
				<div class="name">复选框_选中</div>
				<div class="fontclass">.el-icon-yrt-fuxuankuang_xuanzhong</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yuandaima"></i>
				<div class="name">源代码</div>
				<div class="fontclass">.el-icon-yrt-yuandaima</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-danxuankuang1"></i>
				<div class="name">单选框</div>
				<div class="fontclass">.el-icon-yrt-danxuankuang1</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fuhao-shuzishurukuang"></i>
				<div class="name">符号-数字输入框</div>
				<div class="fontclass">.el-icon-yrt-fuhao-shuzishurukuang</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-yanse"></i>
				<div class="name">颜色</div>
				<div class="fontclass">.el-icon-yrt-yanse</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-wenjianjiazhankai"></i>
				<div class="name">文件夹展开</div>
				<div class="fontclass">.el-icon-yrt-wenjianjiazhankai</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-wenjianjiashanchu"></i>
				<div class="name">文件夹删除</div>
				<div class="fontclass">.el-icon-yrt-wenjianjiashanchu</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-kaiguan2"></i>
				<div class="name">开关</div>
				<div class="fontclass">.el-icon-yrt-kaiguan2</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-zitidaima"></i>
				<div class="name">字体代码</div>
				<div class="fontclass">.el-icon-yrt-zitidaima</div>
			</li>

			<li>
				<i class="icon iconfont el-icon-yrt-fuxuankuang1"></i>
				<div class="name">复选框</div>
				<div class="fontclass">.el-icon-yrt-fuxuankuang1</div>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	methods: {
		onSelectIcon(evt) {
			var icon = evt.toElement.innerText;
			if (icon && icon.indexOf('.') >= 0) {
				this.$emit('onSelectIcon', icon.replace('.', ''));
				this.$message.success('选择成功！');
				this.findRef('icon-popover').doClose();
			}
		},
	},
};
</script>

<style lang="scss" scoped>
* {
	margin: 0;
	padding: 0;
	list-style: none;
}
/*
KISSY CSS Reset
理念：1. reset 的目的不是清除浏览器的默认样式，这仅是部分工作。清除和重置是紧密不可分的。
2. reset 的目的不是让默认样式在所有浏览器下一致，而是减少默认样式有可能带来的问题。
3. reset 期望提供一套普适通用的基础样式。但没有银弹，推荐根据具体需求，裁剪和修改后再使用。
特色：1. 适应中文；2. 基于最新主流浏览器。
维护：玉伯<lifesinger@gmail.com>, 正淳<ragecarrier@gmail.com>
*/

/* * 清除内外边距 * */
h1, h2, h3, h4, h5, h6, hr, p, blockquote, /* structural elements 结构元素 */
dl, dt, dd, ul, ol, li, /* list elements 列表元素 */
form, fieldset, legend, button, input, textarea, /* form elements 表单元素 */
th, td /* table elements 表格元素 */ {
	margin: 0;
	padding: 0;
}

/* * 设置默认字体 * */
button, input, select, textarea /* for ie */ {
	font: 12px/1.5 tahoma, arial, \5b8b\4f53, sans-serif;
}
h1,
h2,
h3,
h4,
h5,
h6 {
	font-size: 100%;
}
address,
cite,
dfn,
em,
var {
	font-style: normal;
} /* 将斜体扶正 */
samp {
	font-family: courier new, courier, monospace;
} /* 统一等宽字体 */
small {
	font-size: 12px;
} /* 小于 12px 的中文很难阅读，让 small 正常化 */

/* * 重置列表元素 * */
ul,
ol {
	list-style: none;
}

/* * 重置文本格式元素 * */
a {
	text-decoration: none;
}
a:hover {
	text-decoration: underline;
}

/* * 重置表单元素 * */
legend {
	color: #000;
} /* for ie6 */
fieldset,
img {
	border: 0;
} /* img 搭车：让链接里的 img 无边框 */
button,
input,
select,
textarea {
	font-size: 100%;
} /* 使得表单元素在 ie 下能继承字体大小 */
/* 注：optgroup 无法扶正 */

/* * 重置表格元素 * */
table {
	border-collapse: collapse;
	border-spacing: 0;
}

/* 清除浮动 */
.ks-clear:after,
.clear:after {
	content: '\20';
	display: block;
	height: 0;
	clear: both;
}
.ks-clear,
.clear {
	*zoom: 1;
}

.main {
	padding: 0px;
	margin: 0 auto;
}
.main h1 {
	font-size: 36px;
	color: #333;
	text-align: left;
	margin-bottom: 30px;
	border-bottom: 1px solid #eee;
}

.helps {
	margin-top: 40px;
}
.icon_lists {
	width: 100% !important;
}

.icon_lists li {
	float: left;
	width: 100px;
	height: 180px;
	text-align: center;
	list-style: none !important;
}
.icon_lists .icon {
	font-size: 42px;
	line-height: 100px;
	margin: 10px 0;
	color: #333;
	-webkit-transition: font-size 0.25s ease-out 0s;
	-moz-transition: font-size 0.25s ease-out 0s;
	transition: font-size 0.25s ease-out 0s;
}
.icon_lists .icon:hover {
	font-size: 100px;
}

.markdown {
	color: #666;
	font-size: 14px;
	line-height: 1.8;
}

.highlight {
	line-height: 1.5;
}

.markdown img {
	vertical-align: middle;
	max-width: 100%;
}

.markdown h1 {
	color: #404040;
	font-weight: 500;
	line-height: 40px;
	margin-bottom: 24px;
}

.markdown h2,
.markdown h3,
.markdown h4,
.markdown h5,
.markdown h6 {
	color: #404040;
	margin: 1.6em 0 0.6em 0;
	font-weight: 500;
	clear: both;
}

.markdown h1 {
	font-size: 28px;
}

.markdown h2 {
	font-size: 22px;
}

.markdown h3 {
	font-size: 16px;
}

.markdown h4 {
	font-size: 14px;
}

.markdown h5 {
	font-size: 12px;
}

.markdown h6 {
	font-size: 12px;
}

.markdown hr {
	height: 1px;
	border: 0;
	background: #e9e9e9;
	margin: 16px 0;
	clear: both;
}

.markdown p {
	margin: 1em 0;
}

.markdown > p,
.markdown > blockquote,
.markdown > .highlight,
.markdown > ol,
.markdown > ul {
	width: 80%;
}

.markdown ul > li {
	list-style: circle;
}

.markdown > ul li,
.markdown blockquote ul > li {
	margin-left: 0px;
	padding-left: 4px;
}

.markdown > ul li p,
.markdown > ol li p {
	margin: 0.6em 0;
}

.markdown ol > li {
	list-style: decimal;
}

.markdown > ol li,
.markdown blockquote ol > li {
	margin-left: 0px;
	padding-left: 4px;
}

.markdown strong,
.markdown b {
	font-weight: 600;
}

.markdown > table {
	border-collapse: collapse;
	border-spacing: 0px;
	empty-cells: show;
	border: 1px solid #e9e9e9;
	width: 95%;
	margin-bottom: 24px;
}

.markdown > table th {
	white-space: nowrap;
	color: #333;
	font-weight: 600;
}

.markdown > table th,
.markdown > table td {
	border: 1px solid #e9e9e9;
	padding: 8px 16px;
	text-align: left;
}

.markdown > table th {
	background: #f7f7f7;
}

.markdown blockquote {
	font-size: 90%;
	color: #999;
	border-left: 4px solid #e9e9e9;
	padding-left: 0.8em;
	margin: 1em 0;
	font-style: italic;
}

.markdown blockquote p {
	margin: 0;
}

.markdown .anchor {
	opacity: 0;
	transition: opacity 0.3s ease;
	margin-left: 8px;
}

.markdown .waiting {
	color: #ccc;
}

.markdown h1:hover .anchor,
.markdown h2:hover .anchor,
.markdown h3:hover .anchor,
.markdown h4:hover .anchor,
.markdown h5:hover .anchor,
.markdown h6:hover .anchor {
	opacity: 1;
	display: inline-block;
}

.markdown > br,
.markdown > p > br {
	clear: both;
}

.hljs {
	display: block;
	background: white;
	padding: 0.5em;
	color: #333333;
	overflow-x: auto;
}

.hljs-comment,
.hljs-meta {
	color: #969896;
}

.hljs-string,
.hljs-variable,
.hljs-template-variable,
.hljs-strong,
.hljs-emphasis,
.hljs-quote {
	color: #df5000;
}

.hljs-keyword,
.hljs-selector-tag,
.hljs-type {
	color: #a71d5d;
}

.hljs-literal,
.hljs-symbol,
.hljs-bullet,
.hljs-attribute {
	color: #0086b3;
}

.hljs-section,
.hljs-name {
	color: #63a35c;
}

.hljs-tag {
	color: #333333;
}

.hljs-title,
.hljs-attr,
.hljs-selector-id,
.hljs-selector-class,
.hljs-selector-attr,
.hljs-selector-pseudo {
	color: #795da3;
}

.hljs-addition {
	color: #55a532;
	background-color: #eaffea;
}

.hljs-deletion {
	color: #bd2c00;
	background-color: #ffecec;
}

.hljs-link {
	text-decoration: underline;
}
.fontclass {
	cursor: pointer;
}
</style>
