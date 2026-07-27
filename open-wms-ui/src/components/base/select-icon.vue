<template>
  <div class="main markdown">
    <h1 class="padding-left-20">IconFont 图标</h1>
    <ul class="icon_lists clear" @click="onSelectIcon">
      <li class="dib">
        <span class="icon icon-yrt yrt-xin"></span>
        <div class="name">新</div>
        <div class="code-name">.yrt-xin</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-ziti"></span>
        <div class="name">字体</div>
        <div class="code-name">.yrt-ziti</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-baocun"></span>
        <div class="name">保存</div>
        <div class="code-name">.yrt-baocun</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-bangzhu"></span>
        <div class="name">帮助</div>
        <div class="code-name">.yrt-bangzhu</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-hebingdanyuan"></span>
        <div class="name">合并单元</div>
        <div class="code-name">.yrt-hebingdanyuan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhifubao"></span>
        <div class="name">支付宝</div>
        <div class="code-name">.yrt-zhifubao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-bianji"></span>
        <div class="name">编辑</div>
        <div class="code-name">.yrt-bianji</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shezhi"></span>
        <div class="name">设置</div>
        <div class="code-name">.yrt-shezhi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shezhi1"></span>
        <div class="name">设置</div>
        <div class="code-name">.yrt-shezhi1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shuaxin"></span>
        <div class="name">刷新</div>
        <div class="code-name">.yrt-shuaxin</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shuaxin1"></span>
        <div class="name">刷新</div>
        <div class="code-name">.yrt-shuaxin1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-bianji1"></span>
        <div class="name">编辑</div>
        <div class="code-name">.yrt-bianji1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-import"></span>
        <div class="name">导入</div>
        <div class="code-name">.yrt-import</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shanchu"></span>
        <div class="name">删除</div>
        <div class="code-name">.yrt-shanchu</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shuaxin2"></span>
        <div class="name">刷新</div>
        <div class="code-name">.yrt-shuaxin2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-print"></span>
        <div class="name">打印</div>
        <div class="code-name">.yrt-print</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shanchu1"></span>
        <div class="name">删除</div>
        <div class="code-name">.yrt-shanchu1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shanchu2"></span>
        <div class="name">删除</div>
        <div class="code-name">.yrt-shanchu2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kaiqi"></span>
        <div class="name">开启</div>
        <div class="code-name">.yrt-kaiqi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-f14"></span>
        <div class="name">刷新</div>
        <div class="code-name">.yrt-f14</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-daoru"></span>
        <div class="name">导入</div>
        <div class="code-name">.yrt-daoru</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-daoru1"></span>
        <div class="name">导入</div>
        <div class="code-name">.yrt-daoru1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-guanbi"></span>
        <div class="name">关闭</div>
        <div class="code-name">.yrt-guanbi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-rukushangjia"></span>
        <div class="name">入库上架</div>
        <div class="code-name">.yrt-rukushangjia</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zan"></span>
        <div class="name">赞</div>
        <div class="code-name">.yrt-zan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-feiji"></span>
        <div class="name">飞机</div>
        <div class="code-name">.yrt-feiji</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tianjia2"></span>
        <div class="name">添加</div>
        <div class="code-name">.yrt-tianjia2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-settings2"></span>
        <div class="name">设置</div>
        <div class="code-name">.yrt-settings2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tubiao"></span>
        <div class="name">设置</div>
        <div class="code-name">.yrt-tubiao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-guanbi1"></span>
        <div class="name">关闭</div>
        <div class="code-name">.yrt-guanbi1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-daoru2"></span>
        <div class="name">导入</div>
        <div class="code-name">.yrt-daoru2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-rukuguanli"></span>
        <div class="name">入库管理-</div>
        <div class="code-name">.yrt-rukuguanli</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-baocun1"></span>
        <div class="name">保存</div>
        <div class="code-name">.yrt-baocun1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-ordinaryprint"></span>
        <div class="name">打印</div>
        <div class="code-name">.yrt-ordinaryprint</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-daochu"></span>
        <div class="name">导出</div>
        <div class="code-name">.yrt-daochu</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-pandianliebiao"></span>
        <div class="name">盘点列表</div>
        <div class="code-name">.yrt-pandianliebiao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-quehuobuhuo"></span>
        <div class="name">缺货补货</div>
        <div class="code-name">.yrt-quehuobuhuo</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yiweiguanli"></span>
        <div class="name">移位管理</div>
        <div class="code-name">.yrt-yiweiguanli</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-import1"></span>
        <div class="name">导入</div>
        <div class="code-name">.yrt-import1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-04"></span>
        <div class="name">定位</div>
        <div class="code-name">.yrt-04</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-27"></span>
        <div class="name">购物车</div>
        <div class="code-name">.yrt-27</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kucun"></span>
        <div class="name">库存</div>
        <div class="code-name">.yrt-kucun</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kuaidi"></span>
        <div class="name">快递</div>
        <div class="code-name">.yrt-kuaidi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-88"></span>
        <div class="name">微信</div>
        <div class="code-name">.yrt-88</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dayin"></span>
        <div class="name">打印</div>
        <div class="code-name">.yrt-dayin</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiaoxituisongshezhi"></span>
        <div class="name">消息推送设置</div>
        <div class="code-name">.yrt-xiaoxituisongshezhi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-cogs3"></span>
        <div class="name">设置</div>
        <div class="code-name">.yrt-cogs3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-suo"></span>
        <div class="name">锁</div>
        <div class="code-name">.yrt-suo</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chazishanchudaibiankuang"></span>
        <div class="name">叉子删除带边框</div>
        <div class="code-name">.yrt-chazishanchudaibiankuang</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zan1"></span>
        <div class="name">赞</div>
        <div class="code-name">.yrt-zan1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-msnui-shezhi"></span>
        <div class="name">设置</div>
        <div class="code-name">.yrt-msnui-shezhi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-msnui-rmb"></span>
        <div class="name">人民币</div>
        <div class="code-name">.yrt-msnui-rmb</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-saomiao"></span>
        <div class="name">扫描</div>
        <div class="code-name">.yrt-saomiao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-icon1"></span>
        <div class="name">加入购物车</div>
        <div class="code-name">.yrt-icon1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-icon27"></span>
        <div class="name">删除</div>
        <div class="code-name">.yrt-icon27</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dianhua"></span>
        <div class="name">电话</div>
        <div class="code-name">.yrt-dianhua</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-saomiao1"></span>
        <div class="name">扫描</div>
        <div class="code-name">.yrt-saomiao1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-edit"></span>
        <div class="name">编辑</div>
        <div class="code-name">.yrt-edit</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dunhuo"></span>
        <div class="name">囤货</div>
        <div class="code-name">.yrt-dunhuo</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-rmb"></span>
        <div class="name">人民币</div>
        <div class="code-name">.yrt-rmb</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-setup"></span>
        <div class="name">设置</div>
        <div class="code-name">.yrt-setup</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-iconfontcolor32"></span>
        <div class="name">编辑</div>
        <div class="code-name">.yrt-iconfontcolor32</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-guanbi2"></span>
        <div class="name">关闭</div>
        <div class="code-name">.yrt-guanbi2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zan2"></span>
        <div class="name">赞</div>
        <div class="code-name">.yrt-zan2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-msnui-info"></span>
        <div class="name">帮助</div>
        <div class="code-name">.yrt-msnui-info</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-caigoujihua"></span>
        <div class="name">采购计划</div>
        <div class="code-name">.yrt-caigoujihua</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shenpi"></span>
        <div class="name">审批</div>
        <div class="code-name">.yrt-shenpi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-bianji2"></span>
        <div class="name">编辑</div>
        <div class="code-name">.yrt-bianji2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dingwei"></span>
        <div class="name">定位</div>
        <div class="code-name">.yrt-dingwei</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-liebiaotuodong"></span>
        <div class="name">列表拖动</div>
        <div class="code-name">.yrt-liebiaotuodong</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhuanyi1"></span>
        <div class="name">转移</div>
        <div class="code-name">.yrt-zhuanyi1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-wuliuguanliicon"></span>
        <div class="name">物流管理icon</div>
        <div class="code-name">.yrt-wuliuguanliicon</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jinlingyingcaiwangtubiao20"></span>
        <div class="name">删除</div>
        <div class="code-name">.yrt-jinlingyingcaiwangtubiao20</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jinlingyingcaiwangtubiao35"></span>
        <div class="name">帮助</div>
        <div class="code-name">.yrt-jinlingyingcaiwangtubiao35</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jinlingyingcaiwangtubiao68"></span>
        <div class="name">打印</div>
        <div class="code-name">.yrt-jinlingyingcaiwangtubiao68</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-addplus"></span>
        <div class="name">添加</div>
        <div class="code-name">.yrt-addplus</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jinhuo"></span>
        <div class="name">进货</div>
        <div class="code-name">.yrt-jinhuo</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tianjia"></span>
        <div class="name">添加</div>
        <div class="code-name">.yrt-tianjia</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-saomiao2"></span>
        <div class="name">扫描</div>
        <div class="code-name">.yrt-saomiao2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kaiqi1"></span>
        <div class="name">开启</div>
        <div class="code-name">.yrt-kaiqi1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-peihuo"></span>
        <div class="name">配货</div>
        <div class="code-name">.yrt-peihuo</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tuihuo"></span>
        <div class="name">退货</div>
        <div class="code-name">.yrt-tuihuo</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-saozi"></span>
        <div class="name">扫字</div>
        <div class="code-name">.yrt-saozi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kaiqi2"></span>
        <div class="name">开启</div>
        <div class="code-name">.yrt-kaiqi2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shouji"></span>
        <div class="name">手机</div>
        <div class="code-name">.yrt-shouji</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shenfenzhengrenzheng"></span>
        <div class="name">身份证认证</div>
        <div class="code-name">.yrt-shenfenzhengrenzheng</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shenfenzhengrenzheng1"></span>
        <div class="name">身份证认证</div>
        <div class="code-name">.yrt-shenfenzhengrenzheng1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chazhaoshiyao"></span>
        <div class="name">全盘扫描</div>
        <div class="code-name">.yrt-chazhaoshiyao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-weixinsaomiao"></span>
        <div class="name">微信扫描</div>
        <div class="code-name">.yrt-weixinsaomiao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-daoru3"></span>
        <div class="name">导入</div>
        <div class="code-name">.yrt-daoru3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-daoru4"></span>
        <div class="name">导入</div>
        <div class="code-name">.yrt-daoru4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-toupiao"></span>
        <div class="name">投票</div>
        <div class="code-name">.yrt-toupiao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-hebingumerger"></span>
        <div class="name">合并uMerger</div>
        <div class="code-name">.yrt-hebingumerger</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-bianji3"></span>
        <div class="name">编辑</div>
        <div class="code-name">.yrt-bianji3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-gerenzhongxindingdantuihuozhong"></span>
        <div class="name">个人中心-订单-退货中</div>
        <div class="code-name">.yrt-gerenzhongxindingdantuihuozhong</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-guanbi3"></span>
        <div class="name">关闭</div>
        <div class="code-name">.yrt-guanbi3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fuzhi"></span>
        <div class="name">复制</div>
        <div class="code-name">.yrt-fuzhi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-iconfontguanlibumen1111"></span>
        <div class="name">入库</div>
        <div class="code-name">.yrt-iconfontguanlibumen1111</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-icozhuanhuan"></span>
        <div class="name">购物车</div>
        <div class="code-name">.yrt-icozhuanhuan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhanweifu"></span>
        <div class="name">占位符</div>
        <div class="code-name">.yrt-zhanweifu</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fenpei"></span>
        <div class="name">分配</div>
        <div class="code-name">.yrt-fenpei</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-paper-airplane"></span>
        <div class="name">纸飞机</div>
        <div class="code-name">.yrt-paper-airplane</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-iconfontadd"></span>
        <div class="name">加号</div>
        <div class="code-name">.yrt-iconfontadd</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jiahao"></span>
        <div class="name">加号</div>
        <div class="code-name">.yrt-jiahao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-quancha"></span>
        <div class="name">圈叉</div>
        <div class="code-name">.yrt-quancha</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-saomiao3"></span>
        <div class="name">扫描</div>
        <div class="code-name">.yrt-saomiao3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-piliangtianjia"></span>
        <div class="name">批量添加</div>
        <div class="code-name">.yrt-piliangtianjia</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-pingtaishouquanzhongzhi"></span>
        <div class="name">平台授权终止</div>
        <div class="code-name">.yrt-pingtaishouquanzhongzhi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jingxiaoshangzhongzhi"></span>
        <div class="name">经销商终止</div>
        <div class="code-name">.yrt-jingxiaoshangzhongzhi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zijinguanli"></span>
        <div class="name">群蜂资金管理</div>
        <div class="code-name">.yrt-zijinguanli</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dianhua1"></span>
        <div class="name">群蜂电话</div>
        <div class="code-name">.yrt-dianhua1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-youjiantou3"></span>
        <div class="name">右箭头</div>
        <div class="code-name">.yrt-youjiantou3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-font29"></span>
        <div class="name">打印</div>
        <div class="code-name">.yrt-font29</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zijintixian"></span>
        <div class="name">群蜂资金提现</div>
        <div class="code-name">.yrt-zijintixian</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-cangku"></span>
        <div class="name">仓库</div>
        <div class="code-name">.yrt-cangku</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-ruku"></span>
        <div class="name">入库</div>
        <div class="code-name">.yrt-ruku</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-30"></span>
        <div class="name">金融锁</div>
        <div class="code-name">.yrt-30</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-19"></span>
        <div class="name">金融</div>
        <div class="code-name">.yrt-19</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-bangzhu1"></span>
        <div class="name">帮助</div>
        <div class="code-name">.yrt-bangzhu1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-qiyong"></span>
        <div class="name">启用</div>
        <div class="code-name">.yrt-qiyong</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-rfidsaomiao"></span>
        <div class="name">RFID扫描</div>
        <div class="code-name">.yrt-rfidsaomiao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-wenjianjia"></span>
        <div class="name">文件夹</div>
        <div class="code-name">.yrt-wenjianjia</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-icon08"></span>
        <div class="name">仓库-08</div>
        <div class="code-name">.yrt-icon08</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shenpi1"></span>
        <div class="name">审批</div>
        <div class="code-name">.yrt-shenpi1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tianjia1"></span>
        <div class="name">添加</div>
        <div class="code-name">.yrt-tianjia1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shangpinguanli"></span>
        <div class="name">商品管理</div>
        <div class="code-name">.yrt-shangpinguanli</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xinjian"></span>
        <div class="name">新建</div>
        <div class="code-name">.yrt-xinjian</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhantiepeizhi"></span>
        <div class="name">粘贴配置</div>
        <div class="code-name">.yrt-zhantiepeizhi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-paizhao"></span>
        <div class="name">拍照</div>
        <div class="code-name">.yrt-paizhao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-gouwuche"></span>
        <div class="name">购物车</div>
        <div class="code-name">.yrt-gouwuche</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jihuadan"></span>
        <div class="name">计划单</div>
        <div class="code-name">.yrt-jihuadan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-arrow-left1"></span>
        <div class="name">左箭头</div>
        <div class="code-name">.yrt-arrow-left1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-arrow-down"></span>
        <div class="name">下箭头</div>
        <div class="code-name">.yrt-arrow-down</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zaihaijianceshujuku"></span>
        <div class="name">灾害监测数据库</div>
        <div class="code-name">.yrt-zaihaijianceshujuku</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kehutuisong"></span>
        <div class="name">客户推送</div>
        <div class="code-name">.yrt-kehutuisong</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shenpi2"></span>
        <div class="name">审批</div>
        <div class="code-name">.yrt-shenpi2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhengquegouxuan"></span>
        <div class="name">正确，勾选</div>
        <div class="code-name">.yrt-zhengquegouxuan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-liulanjilu"></span>
        <div class="name">浏览记录</div>
        <div class="code-name">.yrt-liulanjilu</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-saoyisao"></span>
        <div class="name">扫一扫</div>
        <div class="code-name">.yrt-saoyisao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shouye"></span>
        <div class="name">首页</div>
        <div class="code-name">.yrt-shouye</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-liebiao"></span>
        <div class="name">列表</div>
        <div class="code-name">.yrt-liebiao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yu"></span>
        <div class="name">预</div>
        <div class="code-name">.yrt-yu</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dayin1"></span>
        <div class="name">打印</div>
        <div class="code-name">.yrt-dayin1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tuihuo1"></span>
        <div class="name">退货</div>
        <div class="code-name">.yrt-tuihuo1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shengdanjianhuagouwuche"></span>
        <div class="name">圣诞简化-购物车</div>
        <div class="code-name">.yrt-shengdanjianhuagouwuche</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-my-help"></span>
        <div class="name">帮助</div>
        <div class="code-name">.yrt-my-help</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-saomiao4"></span>
        <div class="name">扫描</div>
        <div class="code-name">.yrt-saomiao4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-icon10"></span>
        <div class="name">调拨</div>
        <div class="code-name">.yrt-icon10</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-gouxuan"></span>
        <div class="name">勾选</div>
        <div class="code-name">.yrt-gouxuan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dianhua2"></span>
        <div class="name">电话</div>
        <div class="code-name">.yrt-dianhua2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-hexiaotiaoxingmasaomiao"></span>
        <div class="name">核销_条形码扫描</div>
        <div class="code-name">.yrt-hexiaotiaoxingmasaomiao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dingwei1"></span>
        <div class="name">定位</div>
        <div class="code-name">.yrt-dingwei1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-saomiao5"></span>
        <div class="name">扫描</div>
        <div class="code-name">.yrt-saomiao5</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-daifenpei"></span>
        <div class="name">待分配</div>
        <div class="code-name">.yrt-daifenpei</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dingwei2"></span>
        <div class="name">定位</div>
        <div class="code-name">.yrt-dingwei2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fenpei-copy"></span>
        <div class="name">分配</div>
        <div class="code-name">.yrt-fenpei-copy</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shanchu3"></span>
        <div class="name">删除</div>
        <div class="code-name">.yrt-shanchu3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-guoqiflag50"></span>
        <div class="name">国旗_flag50</div>
        <div class="code-name">.yrt-guoqiflag50</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tuihuo2"></span>
        <div class="name">退货</div>
        <div class="code-name">.yrt-tuihuo2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shourumingxi"></span>
        <div class="name">收入明细</div>
        <div class="code-name">.yrt-shourumingxi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zanwushourumingxi"></span>
        <div class="name">暂无收入明细</div>
        <div class="code-name">.yrt-zanwushourumingxi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-paizhaotubiao"></span>
        <div class="name">拍照图标</div>
        <div class="code-name">.yrt-paizhaotubiao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tuisong"></span>
        <div class="name">推送</div>
        <div class="code-name">.yrt-tuisong</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shenpi3"></span>
        <div class="name">审批</div>
        <div class="code-name">.yrt-shenpi3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-save"></span>
        <div class="name">保存</div>
        <div class="code-name">.yrt-save</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-12312"></span>
        <div class="name">叉车</div>
        <div class="code-name">.yrt-12312</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-121212122"></span>
        <div class="name">托盘箱子</div>
        <div class="code-name">.yrt-121212122</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-123"></span>
        <div class="name">叉车</div>
        <div class="code-name">.yrt-123</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-saomiao6"></span>
        <div class="name">扫描异常</div>
        <div class="code-name">.yrt-saomiao6</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-cangku131"></span>
        <div class="name">仓库131</div>
        <div class="code-name">.yrt-cangku131</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tuopan121"></span>
        <div class="name">托盘121</div>
        <div class="code-name">.yrt-tuopan121</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tuisong1"></span>
        <div class="name">推送</div>
        <div class="code-name">.yrt-tuisong1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-arrow_down_full"></span>
        <div class="name">向下箭头</div>
        <div class="code-name">.yrt-arrow_down_full</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-vertical_line"></span>
        <div class="name">竖线</div>
        <div class="code-name">.yrt-vertical_line</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-iconset0255"></span>
        <div class="name">扫描条形码</div>
        <div class="code-name">.yrt-iconset0255</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-iconset0311"></span>
        <div class="name">购物车-向右移动</div>
        <div class="code-name">.yrt-iconset0311</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-iconset0312"></span>
        <div class="name">购物车-向左移动</div>
        <div class="code-name">.yrt-iconset0312</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-iconset0492"></span>
        <div class="name">圆</div>
        <div class="code-name">.yrt-iconset0492</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-iconset0493"></span>
        <div class="name">圆</div>
        <div class="code-name">.yrt-iconset0493</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhuanyigeitaren"></span>
        <div class="name">转移给他人</div>
        <div class="code-name">.yrt-zhuanyigeitaren</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kefu"></span>
        <div class="name">客服</div>
        <div class="code-name">.yrt-kefu</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tianjia3"></span>
        <div class="name">添加</div>
        <div class="code-name">.yrt-tianjia3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shouye1"></span>
        <div class="name">首页</div>
        <div class="code-name">.yrt-shouye1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-rili"></span>
        <div class="name">日历</div>
        <div class="code-name">.yrt-rili</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-liebiao1"></span>
        <div class="name">列表</div>
        <div class="code-name">.yrt-liebiao1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-saomiaoerweima"></span>
        <div class="name">扫描二维码</div>
        <div class="code-name">.yrt-saomiaoerweima</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-danxuan"></span>
        <div class="name">单选</div>
        <div class="code-name">.yrt-danxuan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-gouwuche1"></span>
        <div class="name">购物车</div>
        <div class="code-name">.yrt-gouwuche1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shizhongfill"></span>
        <div class="name">时钟-fill</div>
        <div class="code-name">.yrt-shizhongfill</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-gouxuan1"></span>
        <div class="name">勾选</div>
        <div class="code-name">.yrt-gouxuan1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-bangdingshouji"></span>
        <div class="name">绑定手机</div>
        <div class="code-name">.yrt-bangdingshouji</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-74wodedingdan"></span>
        <div class="name">我的订单</div>
        <div class="code-name">.yrt-74wodedingdan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-iconfontarrows1"></span>
        <div class="name">下箭头</div>
        <div class="code-name">.yrt-iconfontarrows1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-iconfontarrows"></span>
        <div class="name">下箭头</div>
        <div class="code-name">.yrt-iconfontarrows</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-iconfonti"></span>
        <div class="name">右箭头</div>
        <div class="code-name">.yrt-iconfonti</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-iconfonticonfonti2copycopy"></span>
        <div class="name">右箭头</div>
        <div class="code-name">.yrt-iconfonticonfonti2copycopy</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-danxuankuang-copy"></span>
        <div class="name">单选框</div>
        <div class="code-name">.yrt-danxuankuang-copy</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-weibiaoti1"></span>
        <div class="name">首页</div>
        <div class="code-name">.yrt-weibiaoti1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-huoweizhijian"></span>
        <div class="name">货位质检</div>
        <div class="code-name">.yrt-huoweizhijian</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fuzhi1"></span>
        <div class="name">复制</div>
        <div class="code-name">.yrt-fuzhi1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhongzhi"></span>
        <div class="name">终止</div>
        <div class="code-name">.yrt-zhongzhi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-weibiaoti7"></span>
        <div class="name">上下转换</div>
        <div class="code-name">.yrt-weibiaoti7</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-weibiaoti38"></span>
        <div class="name">圆</div>
        <div class="code-name">.yrt-weibiaoti38</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-weibiaoti40"></span>
        <div class="name">右箭头</div>
        <div class="code-name">.yrt-weibiaoti40</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-youjiantou4"></span>
        <div class="name">右箭头</div>
        <div class="code-name">.yrt-youjiantou4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fahuo"></span>
        <div class="name">发货</div>
        <div class="code-name">.yrt-fahuo</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiaoxi"></span>
        <div class="name">消息</div>
        <div class="code-name">.yrt-xiaoxi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhiding"></span>
        <div class="name">置顶</div>
        <div class="code-name">.yrt-zhiding</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-liebiaolist36"></span>
        <div class="name">列表</div>
        <div class="code-name">.yrt-liebiaolist36</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yuancircle46"></span>
        <div class="name">圆</div>
        <div class="code-name">.yrt-yuancircle46</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zitifont5"></span>
        <div class="name">字体</div>
        <div class="code-name">.yrt-zitifont5</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zitifont6"></span>
        <div class="name">字体</div>
        <div class="code-name">.yrt-zitifont6</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-liebiaolist29"></span>
        <div class="name">列表</div>
        <div class="code-name">.yrt-liebiaolist29</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-liebiaolist46"></span>
        <div class="name">列表</div>
        <div class="code-name">.yrt-liebiaolist46</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-churuliushuichaxun"></span>
        <div class="name">出入流水查询</div>
        <div class="code-name">.yrt-churuliushuichaxun</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-icon21"></span>
        <div class="name">密码</div>
        <div class="code-name">.yrt-icon21</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhuanyi"></span>
        <div class="name">转移</div>
        <div class="code-name">.yrt-zhuanyi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fenpei1"></span>
        <div class="name">分配</div>
        <div class="code-name">.yrt-fenpei1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiaoxi1"></span>
        <div class="name">消息</div>
        <div class="code-name">.yrt-xiaoxi1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tongji1"></span>
        <div class="name">ZS统计1</div>
        <div class="code-name">.yrt-tongji1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yuangou"></span>
        <div class="name">ZS圆勾</div>
        <div class="code-name">.yrt-yuangou</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiangxiajiantou"></span>
        <div class="name">31-向下箭头</div>
        <div class="code-name">.yrt-xiangxiajiantou</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-merge"></span>
        <div class="name">合并</div>
        <div class="code-name">.yrt-merge</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yuanquanjiahao"></span>
        <div class="name">加号（圆圈）</div>
        <div class="code-name">.yrt-yuanquanjiahao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chongzhi"></span>
        <div class="name">重置</div>
        <div class="code-name">.yrt-chongzhi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jiaochacross78"></span>
        <div class="name">交叉_cross78</div>
        <div class="code-name">.yrt-jiaochacross78</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jiaochacross80"></span>
        <div class="name">交叉_cross80</div>
        <div class="code-name">.yrt-jiaochacross80</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yuancircle92"></span>
        <div class="name">圆_circle92</div>
        <div class="code-name">.yrt-yuancircle92</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yuanxingdecircular225"></span>
        <div class="name">圆形的_circular225</div>
        <div class="code-name">.yrt-yuanxingdecircular225</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-weixin"></span>
        <div class="name">微信</div>
        <div class="code-name">.yrt-weixin</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dingdan"></span>
        <div class="name">订单</div>
        <div class="code-name">.yrt-dingdan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shouji1"></span>
        <div class="name">手机</div>
        <div class="code-name">.yrt-shouji1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xingxing"></span>
        <div class="name">星星</div>
        <div class="code-name">.yrt-xingxing</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xingxu"></span>
        <div class="name">星_虚</div>
        <div class="code-name">.yrt-xingxu</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-gouwuche2"></span>
        <div class="name">购物车</div>
        <div class="code-name">.yrt-gouwuche2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-ren"></span>
        <div class="name">人</div>
        <div class="code-name">.yrt-ren</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-gouxuan2"></span>
        <div class="name">勾选</div>
        <div class="code-name">.yrt-gouxuan2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-feiji1"></span>
        <div class="name">飞机</div>
        <div class="code-name">.yrt-feiji1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shouji2"></span>
        <div class="name">手机</div>
        <div class="code-name">.yrt-shouji2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yduigouxuan"></span>
        <div class="name">YDUI-勾选</div>
        <div class="code-name">.yrt-yduigouxuan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chaigai"></span>
        <div class="name">拆改</div>
        <div class="code-name">.yrt-chaigai</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-danxuankuang"></span>
        <div class="name">单选框</div>
        <div class="code-name">.yrt-danxuankuang</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yuandianxiao"></span>
        <div class="name">圆点小</div>
        <div class="code-name">.yrt-yuandianxiao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yuandianzhong"></span>
        <div class="name">圆点中</div>
        <div class="code-name">.yrt-yuandianzhong</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shouye2"></span>
        <div class="name">首页</div>
        <div class="code-name">.yrt-shouye2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chuku"></span>
        <div class="name">出库</div>
        <div class="code-name">.yrt-chuku</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-renminbicaiwuzhifu"></span>
        <div class="name">人民币 财务 支付</div>
        <div class="code-name">.yrt-renminbicaiwuzhifu</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shangpingouwudai2"></span>
        <div class="name">商品 购物袋2</div>
        <div class="code-name">.yrt-shangpingouwudai2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-baogaofenpei"></span>
        <div class="name">报告分配</div>
        <div class="code-name">.yrt-baogaofenpei</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shanchuguanbicha2"></span>
        <div class="name">删除关闭 叉2</div>
        <div class="code-name">.yrt-shanchuguanbicha2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tianjiajiahaowubiankuang"></span>
        <div class="name">添加 加号 无边框</div>
        <div class="code-name">.yrt-tianjiajiahaowubiankuang</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yuandianzhong1"></span>
        <div class="name">圆点中</div>
        <div class="code-name">.yrt-yuandianzhong1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xinjian1"></span>
        <div class="name">新建</div>
        <div class="code-name">.yrt-xinjian1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dayin2"></span>
        <div class="name">打印</div>
        <div class="code-name">.yrt-dayin2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-biaoti"></span>
        <div class="name">标题</div>
        <div class="code-name">.yrt-biaoti</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-rili1"></span>
        <div class="name">日历</div>
        <div class="code-name">.yrt-rili1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fuxuan"></span>
        <div class="name">复选</div>
        <div class="code-name">.yrt-fuxuan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yanjing"></span>
        <div class="name">眼睛</div>
        <div class="code-name">.yrt-yanjing</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zan3"></span>
        <div class="name">赞</div>
        <div class="code-name">.yrt-zan3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-liulan"></span>
        <div class="name">浏览</div>
        <div class="code-name">.yrt-liulan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yrt-service"></span>
        <div class="name">客服电话</div>
        <div class="code-name">.yrt-yrt-service</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yrt-transfer"></span>
        <div class="name">调拨</div>
        <div class="code-name">.yrt-yrt-transfer</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chaku"></span>
        <div class="name">查库</div>
        <div class="code-name">.yrt-chaku</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chaxun"></span>
        <div class="name">查询</div>
        <div class="code-name">.yrt-chaxun</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shanchu11"></span>
        <div class="name">删除 (1)</div>
        <div class="code-name">.yrt-shanchu11</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-ai-list"></span>
        <div class="name">列表</div>
        <div class="code-name">.yrt-ai-list</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-ai-pay-copy"></span>
        <div class="name">银联</div>
        <div class="code-name">.yrt-ai-pay-copy</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tuisong2"></span>
        <div class="name">推送</div>
        <div class="code-name">.yrt-tuisong2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-wuxing"></span>
        <div class="name">五星</div>
        <div class="code-name">.yrt-wuxing</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chuku-copy"></span>
        <div class="name">仓库</div>
        <div class="code-name">.yrt-chuku-copy</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-renzheng"></span>
        <div class="name">认证</div>
        <div class="code-name">.yrt-renzheng</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-guanbi5"></span>
        <div class="name">单选</div>
        <div class="code-name">.yrt-guanbi5</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-guanbi4"></span>
        <div class="name">已完成/加载成功</div>
        <div class="code-name">.yrt-guanbi4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dianhua3"></span>
        <div class="name">电话</div>
        <div class="code-name">.yrt-dianhua3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chuku1"></span>
        <div class="name">出库</div>
        <div class="code-name">.yrt-chuku1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-ruku1"></span>
        <div class="name">入库</div>
        <div class="code-name">.yrt-ruku1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-pandian"></span>
        <div class="name">盘点</div>
        <div class="code-name">.yrt-pandian</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-goods"></span>
        <div class="name">商品</div>
        <div class="code-name">.yrt-goods</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-date-1"></span>
        <div class="name">时间选择</div>
        <div class="code-name">.yrt-date-1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kaiqihuodong"></span>
        <div class="name">开启活动</div>
        <div class="code-name">.yrt-kaiqihuodong</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-toolbar-car"></span>
        <div class="name">送货到家</div>
        <div class="code-name">.yrt-toolbar-car</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chaifen"></span>
        <div class="name">拆分</div>
        <div class="code-name">.yrt-chaifen</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-hebing"></span>
        <div class="name">合并</div>
        <div class="code-name">.yrt-hebing</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yuancircle94"></span>
        <div class="name">圆_circle94</div>
        <div class="code-name">.yrt-yuancircle94</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-cf-c63"></span>
        <div class="name">调拨管理</div>
        <div class="code-name">.yrt-cf-c63</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-cf-c65"></span>
        <div class="name">明细表</div>
        <div class="code-name">.yrt-cf-c65</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-icon05"></span>
        <div class="name">审批</div>
        <div class="code-name">.yrt-icon05</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fukuan"></span>
        <div class="name">付款</div>
        <div class="code-name">.yrt-fukuan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kehufenpei"></span>
        <div class="name">客户分配</div>
        <div class="code-name">.yrt-kehufenpei</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-saomiao21"></span>
        <div class="name">扫描2</div>
        <div class="code-name">.yrt-saomiao21</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fuzhi2"></span>
        <div class="name">复制</div>
        <div class="code-name">.yrt-fuzhi2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-icon2"></span>
        <div class="name">浏览</div>
        <div class="code-name">.yrt-icon2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-sanjiaodown"></span>
        <div class="name">下箭头</div>
        <div class="code-name">.yrt-sanjiaodown</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-sanjiaoright"></span>
        <div class="name">右箭头</div>
        <div class="code-name">.yrt-sanjiaoright</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tongji3"></span>
        <div class="name">统计3</div>
        <div class="code-name">.yrt-tongji3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-liebiao2"></span>
        <div class="name">列表</div>
        <div class="code-name">.yrt-liebiao2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shenpi4"></span>
        <div class="name">审批</div>
        <div class="code-name">.yrt-shenpi4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shenpi5"></span>
        <div class="name">审批</div>
        <div class="code-name">.yrt-shenpi5</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-ai-password"></span>
        <div class="name">密码</div>
        <div class="code-name">.yrt-ai-password</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fenpeixiangmu"></span>
        <div class="name">分配项目</div>
        <div class="code-name">.yrt-fenpeixiangmu</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chaxun1"></span>
        <div class="name">查询</div>
        <div class="code-name">.yrt-chaxun1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-ai-connection"></span>
        <div class="name">人脉</div>
        <div class="code-name">.yrt-ai-connection</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kucunchaxun"></span>
        <div class="name">库存查询</div>
        <div class="code-name">.yrt-kucunchaxun</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-iconfontchaxun"></span>
        <div class="name">查询</div>
        <div class="code-name">.yrt-iconfontchaxun</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jiaochacross79"></span>
        <div class="name">交叉_cross79</div>
        <div class="code-name">.yrt-jiaochacross79</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhongzhiicon"></span>
        <div class="name">终止icon</div>
        <div class="code-name">.yrt-zhongzhiicon</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-bangdingshouji01"></span>
        <div class="name">绑定手机-01</div>
        <div class="code-name">.yrt-bangdingshouji01</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jinxingzhong"></span>
        <div class="name">进行中</div>
        <div class="code-name">.yrt-jinxingzhong</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-untitled96"></span>
        <div class="name">背景实心叉</div>
        <div class="code-name">.yrt-untitled96</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-saomiao7"></span>
        <div class="name">扫描</div>
        <div class="code-name">.yrt-saomiao7</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dingwei3"></span>
        <div class="name">定位</div>
        <div class="code-name">.yrt-dingwei3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tupian"></span>
        <div class="name">图片</div>
        <div class="code-name">.yrt-tupian</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-feiji2"></span>
        <div class="name">飞机</div>
        <div class="code-name">.yrt-feiji2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-anquansaomiao"></span>
        <div class="name">安全扫描</div>
        <div class="code-name">.yrt-anquansaomiao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yujingtongji"></span>
        <div class="name">预警统计</div>
        <div class="code-name">.yrt-yujingtongji</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xialakuang"></span>
        <div class="name">下拉框</div>
        <div class="code-name">.yrt-xialakuang</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yinlian1193427easyiconnet"></span>
        <div class="name">银联</div>
        <div class="code-name">.yrt-yinlian1193427easyiconnet</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-danxuanfuxuan"></span>
        <div class="name">单选-复选</div>
        <div class="code-name">.yrt-danxuanfuxuan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-liudongzijintubiao22"></span>
        <div class="name">流动资金图标</div>
        <div class="code-name">.yrt-liudongzijintubiao22</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-cangku1"></span>
        <div class="name">仓库</div>
        <div class="code-name">.yrt-cangku1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-cangchuguanli"></span>
        <div class="name">仓储管理</div>
        <div class="code-name">.yrt-cangchuguanli</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhifubao1"></span>
        <div class="name">支付宝</div>
        <div class="code-name">.yrt-zhifubao1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-weixin2"></span>
        <div class="name">微信</div>
        <div class="code-name">.yrt-weixin2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fenpei2"></span>
        <div class="name">分配</div>
        <div class="code-name">.yrt-fenpei2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-youxianzijin"></span>
        <div class="name">优先资金</div>
        <div class="code-name">.yrt-youxianzijin</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhihuiliangkuhuoweiguanli"></span>
        <div class="name">智慧粮库－货位管理</div>
        <div class="code-name">.yrt-zhihuiliangkuhuoweiguanli</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dianhua21"></span>
        <div class="name">电话 (2)</div>
        <div class="code-name">.yrt-dianhua21</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-pan"></span>
        <div class="name">盘</div>
        <div class="code-name">.yrt-pan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-querenshouhuo"></span>
        <div class="name">确认收货</div>
        <div class="code-name">.yrt-querenshouhuo</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-bianhaozhuanyi"></span>
        <div class="name">编号转移</div>
        <div class="code-name">.yrt-bianhaozhuanyi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shanchu4"></span>
        <div class="name">删除</div>
        <div class="code-name">.yrt-shanchu4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-daishouhuo"></span>
        <div class="name">待收货</div>
        <div class="code-name">.yrt-daishouhuo</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-icon"></span>
        <div class="name">扫码</div>
        <div class="code-name">.yrt-icon</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dianhua4"></span>
        <div class="name">电话</div>
        <div class="code-name">.yrt-dianhua4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-daochu1"></span>
        <div class="name">导出</div>
        <div class="code-name">.yrt-daochu1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-weixin3"></span>
        <div class="name">微信</div>
        <div class="code-name">.yrt-weixin3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-delivery-truck"></span>
        <div class="name">送货货车</div>
        <div class="code-name">.yrt-delivery-truck</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zantingzijincunqu"></span>
        <div class="name">暂停资金存取</div>
        <div class="code-name">.yrt-zantingzijincunqu</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kaitongwangshangjiaoyi"></span>
        <div class="name">开通网上交易</div>
        <div class="code-name">.yrt-kaitongwangshangjiaoyi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-suodingkucun01"></span>
        <div class="name">锁定库存</div>
        <div class="code-name">.yrt-suodingkucun01</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shouye3"></span>
        <div class="name">首页</div>
        <div class="code-name">.yrt-shouye3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhaohuizijinhao01"></span>
        <div class="name">资金纪录</div>
        <div class="code-name">.yrt-zhaohuizijinhao01</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-piliangtianjia1"></span>
        <div class="name">批量添加</div>
        <div class="code-name">.yrt-piliangtianjia1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-ruku2"></span>
        <div class="name">入库</div>
        <div class="code-name">.yrt-ruku2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-iconfontcustomize"></span>
        <div class="name">自定义</div>
        <div class="code-name">.yrt-iconfontcustomize</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-iconfontpaishe"></span>
        <div class="name">拍摄扫描</div>
        <div class="code-name">.yrt-iconfontpaishe</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yigouxuan"></span>
        <div class="name">已勾选</div>
        <div class="code-name">.yrt-yigouxuan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kuaididangenzong"></span>
        <div class="name">快递单跟踪</div>
        <div class="code-name">.yrt-kuaididangenzong</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dingdan1"></span>
        <div class="name">订单</div>
        <div class="code-name">.yrt-dingdan1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chaxun2"></span>
        <div class="name">查询</div>
        <div class="code-name">.yrt-chaxun2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-payment"></span>
        <div class="name">付款</div>
        <div class="code-name">.yrt-payment</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shangpinruku"></span>
        <div class="name">商品入库</div>
        <div class="code-name">.yrt-shangpinruku</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-mima"></span>
        <div class="name">密码</div>
        <div class="code-name">.yrt-mima</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shouhuodizhi"></span>
        <div class="name">收货地址</div>
        <div class="code-name">.yrt-shouhuodizhi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhuanjifenshimingrenzheng"></span>
        <div class="name">积分商城-实名认证</div>
        <div class="code-name">.yrt-zhuanjifenshimingrenzheng</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xingji"></span>
        <div class="name">星级</div>
        <div class="code-name">.yrt-xingji</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-paizhao1"></span>
        <div class="name">拍照</div>
        <div class="code-name">.yrt-paizhao1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tucenggouxuan"></span>
        <div class="name">勾选</div>
        <div class="code-name">.yrt-tucenggouxuan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shangjiantou"></span>
        <div class="name">上箭头</div>
        <div class="code-name">.yrt-shangjiantou</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jiarugouwuche"></span>
        <div class="name">加入购物车</div>
        <div class="code-name">.yrt-jiarugouwuche</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zan4"></span>
        <div class="name">赞</div>
        <div class="code-name">.yrt-zan4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-top01"></span>
        <div class="name">置顶</div>
        <div class="code-name">.yrt-top01</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-gouwuche3"></span>
        <div class="name">购物车</div>
        <div class="code-name">.yrt-gouwuche3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-wuxing1"></span>
        <div class="name">五星</div>
        <div class="code-name">.yrt-wuxing1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shouhuo"></span>
        <div class="name">收货</div>
        <div class="code-name">.yrt-shouhuo</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shujuguanlisvg42"></span>
        <div class="name">盘管</div>
        <div class="code-name">.yrt-shujuguanlisvg42</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhongzhi1"></span>
        <div class="name">终止</div>
        <div class="code-name">.yrt-zhongzhi1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-weixin-copy"></span>
        <div class="name">微信</div>
        <div class="code-name">.yrt-weixin-copy</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-daishouhuo1"></span>
        <div class="name">待收货</div>
        <div class="code-name">.yrt-daishouhuo1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-daishouhuo2"></span>
        <div class="name">待收货</div>
        <div class="code-name">.yrt-daishouhuo2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jianhuoguanli1"></span>
        <div class="name">拣货管理 (1)</div>
        <div class="code-name">.yrt-jianhuoguanli1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dianhua5"></span>
        <div class="name">电话</div>
        <div class="code-name">.yrt-dianhua5</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiangxiajiantou1"></span>
        <div class="name">向下箭头</div>
        <div class="code-name">.yrt-xiangxiajiantou1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chai"></span>
        <div class="name">拆</div>
        <div class="code-name">.yrt-chai</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-ai247"></span>
        <div class="name">字体</div>
        <div class="code-name">.yrt-ai247</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-iconplsd"></span>
        <div class="name">批量+</div>
        <div class="code-name">.yrt-iconplsd</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-iconddsho"></span>
        <div class="name">确认收货</div>
        <div class="code-name">.yrt-iconddsho</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fahuo1"></span>
        <div class="name">发货</div>
        <div class="code-name">.yrt-fahuo1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dabao"></span>
        <div class="name">打包</div>
        <div class="code-name">.yrt-dabao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shanchuyixuanqunchengyuanchacha"></span>
        <div class="name">删除已选群成员-叉叉</div>
        <div class="code-name">.yrt-shanchuyixuanqunchengyuanchacha</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-saomiaoxinxi"></span>
        <div class="name">扫描信息</div>
        <div class="code-name">.yrt-saomiaoxinxi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tupian1"></span>
        <div class="name">图片</div>
        <div class="code-name">.yrt-tupian1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jinxingzhong1"></span>
        <div class="name">进行中</div>
        <div class="code-name">.yrt-jinxingzhong1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-youjiantou"></span>
        <div class="name">右箭头</div>
        <div class="code-name">.yrt-youjiantou</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhuanyi11"></span>
        <div class="name">转移</div>
        <div class="code-name">.yrt-zhuanyi11</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-wo"></span>
        <div class="name">人</div>
        <div class="code-name">.yrt-wo</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-service"></span>
        <div class="name">客服</div>
        <div class="code-name">.yrt-service</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kefu2"></span>
        <div class="name">客服</div>
        <div class="code-name">.yrt-kefu2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-Id"></span>
        <div class="name">身份证</div>
        <div class="code-name">.yrt-Id</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-youjiantou5"></span>
        <div class="name">右箭头</div>
        <div class="code-name">.yrt-youjiantou5</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-liulan1"></span>
        <div class="name">浏览</div>
        <div class="code-name">.yrt-liulan1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-gouxuan3"></span>
        <div class="name">勾选</div>
        <div class="code-name">.yrt-gouxuan3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yuan"></span>
        <div class="name">圆</div>
        <div class="code-name">.yrt-yuan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-wenjianjia1"></span>
        <div class="name">文件夹</div>
        <div class="code-name">.yrt-wenjianjia1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-asterisks-1-copy"></span>
        <div class="name">星号</div>
        <div class="code-name">.yrt-asterisks-1-copy</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhongzhihuodong"></span>
        <div class="name">终止活动</div>
        <div class="code-name">.yrt-zhongzhihuodong</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shenpi6"></span>
        <div class="name">审批</div>
        <div class="code-name">.yrt-shenpi6</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-haofangtuo400iconfontpai"></span>
        <div class="name">好房拓 4.0.0 iconfont_派</div>
        <div class="code-name">.yrt-haofangtuo400iconfontpai</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-renzhengshangjia"></span>
        <div class="name">认证商家</div>
        <div class="code-name">.yrt-renzhengshangjia</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shenfenzheng"></span>
        <div class="name">身份证</div>
        <div class="code-name">.yrt-shenfenzheng</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yingfeng"></span>
        <div class="name">盈峰</div>
        <div class="code-name">.yrt-yingfeng</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-gouxuan4"></span>
        <div class="name">勾选</div>
        <div class="code-name">.yrt-gouxuan4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fenpei3"></span>
        <div class="name">分配</div>
        <div class="code-name">.yrt-fenpei3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-icon_cut"></span>
        <div class="name">减少</div>
        <div class="code-name">.yrt-icon_cut</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chukumingxi"></span>
        <div class="name">出库明细</div>
        <div class="code-name">.yrt-chukumingxi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-saomiao8"></span>
        <div class="name">扫描</div>
        <div class="code-name">.yrt-saomiao8</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dayin3"></span>
        <div class="name">打印</div>
        <div class="code-name">.yrt-dayin3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-daishouhuo3"></span>
        <div class="name">待收货</div>
        <div class="code-name">.yrt-daishouhuo3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shanchu5"></span>
        <div class="name">删除</div>
        <div class="code-name">.yrt-shanchu5</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-webicon301"></span>
        <div class="name">实名认证</div>
        <div class="code-name">.yrt-webicon301</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-iconcheckbox1"></span>
        <div class="name">复选选中</div>
        <div class="code-name">.yrt-iconcheckbox1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-iconless"></span>
        <div class="name">减少</div>
        <div class="code-name">.yrt-iconless</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-icon234"></span>
        <div class="name">仓库</div>
        <div class="code-name">.yrt-icon234</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-add"></span>
        <div class="name">添加</div>
        <div class="code-name">.yrt-add</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tuihuo3"></span>
        <div class="name">退货</div>
        <div class="code-name">.yrt-tuihuo3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-youjiantou6"></span>
        <div class="name">3.0-右箭头</div>
        <div class="code-name">.yrt-youjiantou6</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yiwancheng"></span>
        <div class="name">已完成</div>
        <div class="code-name">.yrt-yiwancheng</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zan5"></span>
        <div class="name">赞</div>
        <div class="code-name">.yrt-zan5</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-saomiaoguanli"></span>
        <div class="name">下载</div>
        <div class="code-name">.yrt-saomiaoguanli</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-invtaking"></span>
        <div class="name">盘点</div>
        <div class="code-name">.yrt-invtaking</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tuihuozhong"></span>
        <div class="name">退货中</div>
        <div class="code-name">.yrt-tuihuozhong</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shouji3"></span>
        <div class="name">手机</div>
        <div class="code-name">.yrt-shouji3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-qrcode-2"></span>
        <div class="name">扫描二维码</div>
        <div class="code-name">.yrt-qrcode-2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-mima1"></span>
        <div class="name">密码</div>
        <div class="code-name">.yrt-mima1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-liangfanzhuang"></span>
        <div class="name">打包</div>
        <div class="code-name">.yrt-liangfanzhuang</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-saomiao31"></span>
        <div class="name">扫描3</div>
        <div class="code-name">.yrt-saomiao31</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-renyuanjieshao"></span>
        <div class="name">人员介绍</div>
        <div class="code-name">.yrt-renyuanjieshao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-ren111"></span>
        <div class="name">人</div>
        <div class="code-name">.yrt-ren111</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-2"></span>
        <div class="name">名片扫描</div>
        <div class="code-name">.yrt-2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-liulanjilusel"></span>
        <div class="name">浏览记录_sel</div>
        <div class="code-name">.yrt-liulanjilusel</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xinghao"></span>
        <div class="name">星号</div>
        <div class="code-name">.yrt-xinghao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-reset"></span>
        <div class="name">重置</div>
        <div class="code-name">.yrt-reset</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-churuku"></span>
        <div class="name">出入库</div>
        <div class="code-name">.yrt-churuku</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jiance"></span>
        <div class="name">监测</div>
        <div class="code-name">.yrt-jiance</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shipan"></span>
        <div class="name">实盘</div>
        <div class="code-name">.yrt-shipan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yuan1"></span>
        <div class="name">圆</div>
        <div class="code-name">.yrt-yuan1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chaifen1"></span>
        <div class="name">拆分</div>
        <div class="code-name">.yrt-chaifen1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chaifen2"></span>
        <div class="name">拆分</div>
        <div class="code-name">.yrt-chaifen2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dingwei4"></span>
        <div class="name">定位</div>
        <div class="code-name">.yrt-dingwei4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-saoyisao-copy"></span>
        <div class="name">扫一扫</div>
        <div class="code-name">.yrt-saoyisao-copy</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shizhong"></span>
        <div class="name">时钟</div>
        <div class="code-name">.yrt-shizhong</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-iconfontzhizuobiaozhun023147"></span>
        <div class="name">新</div>
        <div class="code-name">.yrt-iconfontzhizuobiaozhun023147</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-gouwuche21"></span>
        <div class="name">购物车</div>
        <div class="code-name">.yrt-gouwuche21</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kuaidi1"></span>
        <div class="name">快递</div>
        <div class="code-name">.yrt-kuaidi1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fenjianchuku"></span>
        <div class="name">分拣出库</div>
        <div class="code-name">.yrt-fenjianchuku</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fenjianruku"></span>
        <div class="name">分拣入库</div>
        <div class="code-name">.yrt-fenjianruku</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dingdangdaishimingrenzheng"></span>
        <div class="name">叮当贷-实名认证</div>
        <div class="code-name">.yrt-dingdangdaishimingrenzheng</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-renyuan"></span>
        <div class="name">人员</div>
        <div class="code-name">.yrt-renyuan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-paizhao2"></span>
        <div class="name">拍照</div>
        <div class="code-name">.yrt-paizhao2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shimingrenzheng"></span>
        <div class="name">实名认证</div>
        <div class="code-name">.yrt-shimingrenzheng</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kefurexian"></span>
        <div class="name">客服热线</div>
        <div class="code-name">.yrt-kefurexian</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dingwei5"></span>
        <div class="name">定位</div>
        <div class="code-name">.yrt-dingwei5</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-saoyisao1"></span>
        <div class="name">扫一扫 (1)</div>
        <div class="code-name">.yrt-saoyisao1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dingdangdaizijinliushui"></span>
        <div class="name">叮当贷-资金流水</div>
        <div class="code-name">.yrt-dingdangdaizijinliushui</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shen"></span>
        <div class="name">身份证</div>
        <div class="code-name">.yrt-shen</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-msg"></span>
        <div class="name">消息</div>
        <div class="code-name">.yrt-msg</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tel"></span>
        <div class="name">电话</div>
        <div class="code-name">.yrt-tel</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-clock"></span>
        <div class="name">时钟</div>
        <div class="code-name">.yrt-clock</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-cir-cny"></span>
        <div class="name">环 人民币</div>
        <div class="code-name">.yrt-cir-cny</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-solid-time"></span>
        <div class="name">时钟 实心</div>
        <div class="code-name">.yrt-solid-time</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kuaidi2"></span>
        <div class="name">快递</div>
        <div class="code-name">.yrt-kuaidi2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-scan-copy"></span>
        <div class="name">扫描</div>
        <div class="code-name">.yrt-scan-copy</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chengbenfenxi"></span>
        <div class="name">成本分析</div>
        <div class="code-name">.yrt-chengbenfenxi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-danxuan2"></span>
        <div class="name">单选2</div>
        <div class="code-name">.yrt-danxuan2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiaoxi2"></span>
        <div class="name">消息</div>
        <div class="code-name">.yrt-xiaoxi2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-mlfp"></span>
        <div class="name">目录分配</div>
        <div class="code-name">.yrt-mlfp</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhifubaozhifu"></span>
        <div class="name">支付宝支付</div>
        <div class="code-name">.yrt-zhifubaozhifu</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-baocun2"></span>
        <div class="name">保存</div>
        <div class="code-name">.yrt-baocun2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shenfenrenzheng"></span>
        <div class="name">身份认证</div>
        <div class="code-name">.yrt-shenfenrenzheng</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-new1"></span>
        <div class="name">新人</div>
        <div class="code-name">.yrt-new1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-39kaiguankai2"></span>
        <div class="name">39开关开2</div>
        <div class="code-name">.yrt-39kaiguankai2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiaoxi3"></span>
        <div class="name">消息</div>
        <div class="code-name">.yrt-xiaoxi3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-gouxuan5"></span>
        <div class="name">勾选</div>
        <div class="code-name">.yrt-gouxuan5</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chongzhi1"></span>
        <div class="name">重置</div>
        <div class="code-name">.yrt-chongzhi1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-liulan2"></span>
        <div class="name">浏览</div>
        <div class="code-name">.yrt-liulan2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-gouwuche4"></span>
        <div class="name">购物车</div>
        <div class="code-name">.yrt-gouwuche4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dingwei6"></span>
        <div class="name">定位</div>
        <div class="code-name">.yrt-dingwei6</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-renminbi1688"></span>
        <div class="name">人民币</div>
        <div class="code-name">.yrt-renminbi1688</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shizhong1"></span>
        <div class="name">时钟</div>
        <div class="code-name">.yrt-shizhong1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-23"></span>
        <div class="name">托盘码－批量</div>
        <div class="code-name">.yrt-23</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-youjiantou7"></span>
        <div class="name">右箭头</div>
        <div class="code-name">.yrt-youjiantou7</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fenpei4"></span>
        <div class="name">分配</div>
        <div class="code-name">.yrt-fenpei4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-saomiaojieguo"></span>
        <div class="name">扫描结果</div>
        <div class="code-name">.yrt-saomiaojieguo</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chacha"></span>
        <div class="name">叉叉</div>
        <div class="code-name">.yrt-chacha</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhongzhi2"></span>
        <div class="name">重置</div>
        <div class="code-name">.yrt-zhongzhi2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-ziti1"></span>
        <div class="name">字体</div>
        <div class="code-name">.yrt-ziti1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dayin4"></span>
        <div class="name">打印</div>
        <div class="code-name">.yrt-dayin4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yuyinsaomiao"></span>
        <div class="name">语音扫描</div>
        <div class="code-name">.yrt-yuyinsaomiao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-716bianjiqi_zitiyanse"></span>
        <div class="name">716编辑器_字体颜色</div>
        <div class="code-name">.yrt-716bianjiqi_zitiyanse</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-728bianjiqi_zitidaxiao"></span>
        <div class="name">728编辑器_字体大小</div>
        <div class="code-name">.yrt-728bianjiqi_zitidaxiao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yrt-yuanxk"></span>
        <div class="name">圆形线条</div>
        <div class="code-name">.yrt-yrt-yuanxk</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yrt-yuanzhuti"></span>
        <div class="name">圆柱体</div>
        <div class="code-name">.yrt-yrt-yuanzhuti</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yrt-yuanzhuiti"></span>
        <div class="name">圆锥体</div>
        <div class="code-name">.yrt-yrt-yuanzhuiti</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-ruku11"></span>
        <div class="name">入库</div>
        <div class="code-name">.yrt-ruku11</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-weixin4"></span>
        <div class="name">微信</div>
        <div class="code-name">.yrt-weixin4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-sekuaigouwuche"></span>
        <div class="name">色块－购物车</div>
        <div class="code-name">.yrt-sekuaigouwuche</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiangao"></span>
        <div class="name">金融&货币－24</div>
        <div class="code-name">.yrt-xiangao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiangao1"></span>
        <div class="name">金融&货币－25</div>
        <div class="code-name">.yrt-xiangao1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiangao2"></span>
        <div class="name">金融&货币－32</div>
        <div class="code-name">.yrt-xiangao2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiangao3"></span>
        <div class="name">金融&货币－36</div>
        <div class="code-name">.yrt-xiangao3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-saomiao9"></span>
        <div class="name">扫描</div>
        <div class="code-name">.yrt-saomiao9</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kuaidi3"></span>
        <div class="name">快递</div>
        <div class="code-name">.yrt-kuaidi3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yanjing-bi"></span>
        <div class="name">眼睛-闭</div>
        <div class="code-name">.yrt-yanjing-bi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-youjiantou8"></span>
        <div class="name">右箭头</div>
        <div class="code-name">.yrt-youjiantou8</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fenjian"></span>
        <div class="name">分拣</div>
        <div class="code-name">.yrt-fenjian</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kaiguanclose"></span>
        <div class="name">开关 开</div>
        <div class="code-name">.yrt-kaiguanclose</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kuaidi4"></span>
        <div class="name">快递</div>
        <div class="code-name">.yrt-kuaidi4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kuaidi5"></span>
        <div class="name">快递</div>
        <div class="code-name">.yrt-kuaidi5</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-4"></span>
        <div class="name">人</div>
        <div class="code-name">.yrt-4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-rili2"></span>
        <div class="name">日历</div>
        <div class="code-name">.yrt-rili2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-redo"></span>
        <div class="name">redo</div>
        <div class="code-name">.yrt-redo</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-undo"></span>
        <div class="name">undo</div>
        <div class="code-name">.yrt-undo</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fenpei5"></span>
        <div class="name">分配</div>
        <div class="code-name">.yrt-fenpei5</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tubiao-"></span>
        <div class="name">客户交易分布</div>
        <div class="code-name">.yrt-tubiao-</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tubiao-1"></span>
        <div class="name">金融交易统计</div>
        <div class="code-name">.yrt-tubiao-1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-plan-plane-aeroplane-fun-office-timepass-eedb"></span>
        <div class="name">计划，飞机</div>
        <div class="code-name">.yrt-plan-plane-aeroplane-fun-office-timepass-eedb</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-cangku2"></span>
        <div class="name">仓库</div>
        <div class="code-name">.yrt-cangku2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fenpei6"></span>
        <div class="name">分配</div>
        <div class="code-name">.yrt-fenpei6</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shangxiajiantou-"></span>
        <div class="name">上下箭头-3</div>
        <div class="code-name">.yrt-shangxiajiantou-</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chai_heidi"></span>
        <div class="name">拆_黑底</div>
        <div class="code-name">.yrt-chai_heidi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhuanyiwenti"></span>
        <div class="name">转移问题</div>
        <div class="code-name">.yrt-zhuanyiwenti</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chaxun3"></span>
        <div class="name">查询</div>
        <div class="code-name">.yrt-chaxun3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kuaididan"></span>
        <div class="name">快递单</div>
        <div class="code-name">.yrt-kuaididan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-suokaiqi"></span>
        <div class="name">锁（开启）</div>
        <div class="code-name">.yrt-suokaiqi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tubiaozhizuomoban"></span>
        <div class="name">减少</div>
        <div class="code-name">.yrt-tubiaozhizuomoban</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jiaoyi"></span>
        <div class="name">交易</div>
        <div class="code-name">.yrt-jiaoyi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tupian2"></span>
        <div class="name">图片</div>
        <div class="code-name">.yrt-tupian2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fenpeimubiao"></span>
        <div class="name">分配目标</div>
        <div class="code-name">.yrt-fenpeimubiao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kuaidi6"></span>
        <div class="name">快递</div>
        <div class="code-name">.yrt-kuaidi6</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zuojiantou"></span>
        <div class="name">左箭头</div>
        <div class="code-name">.yrt-zuojiantou</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chaxun4"></span>
        <div class="name">查询</div>
        <div class="code-name">.yrt-chaxun4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shachu-xue"></span>
        <div class="name">删除</div>
        <div class="code-name">.yrt-shachu-xue</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zijinlicai"></span>
        <div class="name">资金，理财</div>
        <div class="code-name">.yrt-zijinlicai</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shenfenzheng1"></span>
        <div class="name">身份证</div>
        <div class="code-name">.yrt-shenfenzheng1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tianjia4"></span>
        <div class="name">添加</div>
        <div class="code-name">.yrt-tianjia4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dayin_hebing"></span>
        <div class="name">打印_合并</div>
        <div class="code-name">.yrt-dayin_hebing</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-renyuansousuo"></span>
        <div class="name">人员搜索</div>
        <div class="code-name">.yrt-renyuansousuo</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dingdan2"></span>
        <div class="name">订单</div>
        <div class="code-name">.yrt-dingdan2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dingwei7"></span>
        <div class="name">定位</div>
        <div class="code-name">.yrt-dingwei7</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-liebiao3"></span>
        <div class="name">列表</div>
        <div class="code-name">.yrt-liebiao3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zuojiantou1"></span>
        <div class="name">左箭头</div>
        <div class="code-name">.yrt-zuojiantou1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-gouxuan6"></span>
        <div class="name">勾选</div>
        <div class="code-name">.yrt-gouxuan6</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-ziyuan"></span>
        <div class="name">勾选</div>
        <div class="code-name">.yrt-ziyuan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shizhong2"></span>
        <div class="name">时钟1</div>
        <div class="code-name">.yrt-shizhong2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jingwuicon_svg-"></span>
        <div class="name">国旗</div>
        <div class="code-name">.yrt-jingwuicon_svg-</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-guoqi_flag"></span>
        <div class="name">国旗_flag54</div>
        <div class="code-name">.yrt-guoqi_flag</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-gouwuche5"></span>
        <div class="name">购物车</div>
        <div class="code-name">.yrt-gouwuche5</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-renqun"></span>
        <div class="name">人群</div>
        <div class="code-name">.yrt-renqun</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-niantie"></span>
        <div class="name">粘贴</div>
        <div class="code-name">.yrt-niantie</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xinjian2"></span>
        <div class="name">新建</div>
        <div class="code-name">.yrt-xinjian2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt--daima"></span>
        <div class="name">07-代码</div>
        <div class="code-name">.yrt--daima</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-youjiantou1"></span>
        <div class="name">右箭头</div>
        <div class="code-name">.yrt-youjiantou1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiaoxi4"></span>
        <div class="name">消息</div>
        <div class="code-name">.yrt-xiaoxi4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-weixin1"></span>
        <div class="name">微信 (1)</div>
        <div class="code-name">.yrt-weixin1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-clock1"></span>
        <div class="name">时钟</div>
        <div class="code-name">.yrt-clock1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiaoxi5"></span>
        <div class="name">消息</div>
        <div class="code-name">.yrt-xiaoxi5</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-paizhao-xianxing"></span>
        <div class="name">237拍照-线性</div>
        <div class="code-name">.yrt-paizhao-xianxing</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-anniu"></span>
        <div class="name">符号-按钮</div>
        <div class="code-name">.yrt-anniu</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-danhangshurukuang"></span>
        <div class="name">符号-单行输入框</div>
        <div class="code-name">.yrt-danhangshurukuang</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-duohangshurukuang"></span>
        <div class="name">符号-多行输入框</div>
        <div class="code-name">.yrt-duohangshurukuang</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jilianxuanze"></span>
        <div class="name">符号-级联选择</div>
        <div class="code-name">.yrt-jilianxuanze</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kaiguan"></span>
        <div class="name">符号-开关</div>
        <div class="code-name">.yrt-kaiguan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-star1"></span>
        <div class="name">星星</div>
        <div class="code-name">.yrt-star1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yrt-test3"></span>
        <div class="name">组织管理</div>
        <div class="code-name">.yrt-yrt-test3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yrt-test2"></span>
        <div class="name">文件夹</div>
        <div class="code-name">.yrt-yrt-test2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiajiantou"></span>
        <div class="name">下箭头</div>
        <div class="code-name">.yrt-xiajiantou</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shangjiantou1"></span>
        <div class="name">上箭头</div>
        <div class="code-name">.yrt-shangjiantou1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shouye4"></span>
        <div class="name">首页</div>
        <div class="code-name">.yrt-shouye4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-web__bitebiyoujiantou"></span>
        <div class="name">web__比特币右箭头</div>
        <div class="code-name">.yrt-web__bitebiyoujiantou</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-daima"></span>
        <div class="name">符号-代码</div>
        <div class="code-name">.yrt-daima</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jiaoyiguanli"></span>
        <div class="name">后台-交易管理</div>
        <div class="code-name">.yrt-jiaoyiguanli</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-web-yrt-1"></span>
        <div class="name">消息</div>
        <div class="code-name">.yrt-web-yrt-1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-feiyongkemu"></span>
        <div class="name">费用科目</div>
        <div class="code-name">.yrt-feiyongkemu</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-placeholder__"></span>
        <div class="name">定位</div>
        <div class="code-name">.yrt-placeholder__</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xinzengyugengxinxiaoshoudingdan"></span>
        <div class="name">新增与更新销售订单</div>
        <div class="code-name">.yrt-xinzengyugengxinxiaoshoudingdan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shizhongtianjia"></span>
        <div class="name">时钟添加</div>
        <div class="code-name">.yrt-shizhongtianjia</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-renyuantianjia"></span>
        <div class="name">人员添加</div>
        <div class="code-name">.yrt-renyuantianjia</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shizhong3"></span>
        <div class="name">时钟</div>
        <div class="code-name">.yrt-shizhong3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiaoxi6"></span>
        <div class="name">消息</div>
        <div class="code-name">.yrt-xiaoxi6</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-clock2"></span>
        <div class="name">时钟</div>
        <div class="code-name">.yrt-clock2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fq_yingshoukuan"></span>
        <div class="name">fq_应收款</div>
        <div class="code-name">.yrt-fq_yingshoukuan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-wodezijin"></span>
        <div class="name">供方-我的资金</div>
        <div class="code-name">.yrt-wodezijin</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shanchu6"></span>
        <div class="name">删除</div>
        <div class="code-name">.yrt-shanchu6</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yrt-p_rili"></span>
        <div class="name">日历</div>
        <div class="code-name">.yrt-yrt-p_rili</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dingdan3"></span>
        <div class="name">订单</div>
        <div class="code-name">.yrt-dingdan3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-paizhao3"></span>
        <div class="name">拍照</div>
        <div class="code-name">.yrt-paizhao3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-hangbanyanwu"></span>
        <div class="name">航班延误</div>
        <div class="code-name">.yrt-hangbanyanwu</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-hangbandongtai"></span>
        <div class="name">航班动态</div>
        <div class="code-name">.yrt-hangbandongtai</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-wenjianjia2"></span>
        <div class="name">文件夹</div>
        <div class="code-name">.yrt-wenjianjia2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiaoxi7"></span>
        <div class="name">消息</div>
        <div class="code-name">.yrt-xiaoxi7</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-reduce_icon"></span>
        <div class="name">减少</div>
        <div class="code-name">.yrt-reduce_icon</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-feiji3"></span>
        <div class="name">飞机</div>
        <div class="code-name">.yrt-feiji3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-calendar"></span>
        <div class="name">日历</div>
        <div class="code-name">.yrt-calendar</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhuanxiangzijin"></span>
        <div class="name">专项资金</div>
        <div class="code-name">.yrt-zhuanxiangzijin</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zuojiantou3"></span>
        <div class="name">右箭头</div>
        <div class="code-name">.yrt-zuojiantou3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shujutongji"></span>
        <div class="name">数据统计</div>
        <div class="code-name">.yrt-shujutongji</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-credentials_icon"></span>
        <div class="name">身份证</div>
        <div class="code-name">.yrt-credentials_icon</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xing"></span>
        <div class="name">星</div>
        <div class="code-name">.yrt-xing</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shizhong4"></span>
        <div class="name">时钟</div>
        <div class="code-name">.yrt-shizhong4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiangjipaizhao"></span>
        <div class="name">相机拍照</div>
        <div class="code-name">.yrt-xiangjipaizhao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shizhong_l"></span>
        <div class="name">时钟_l</div>
        <div class="code-name">.yrt-shizhong_l</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jianshao_l"></span>
        <div class="name">减少_l</div>
        <div class="code-name">.yrt-jianshao_l</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-batch-reduce"></span>
        <div class="name">批量减少</div>
        <div class="code-name">.yrt-batch-reduce</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-sanjiaoleft"></span>
        <div class="name">左箭头</div>
        <div class="code-name">.yrt-sanjiaoleft</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-sanjiaoleft-copy"></span>
        <div class="name">左箭头</div>
        <div class="code-name">.yrt-sanjiaoleft-copy</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-sanjiaoleft1"></span>
        <div class="name">左箭头</div>
        <div class="code-name">.yrt-sanjiaoleft1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-arrow-left"></span>
        <div class="name">左箭头</div>
        <div class="code-name">.yrt-arrow-left</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-siji-"></span>
        <div class="name">司机-01</div>
        <div class="code-name">.yrt-siji-</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tuihuobaozhang"></span>
        <div class="name">退货保障</div>
        <div class="code-name">.yrt-tuihuobaozhang</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jianshao"></span>
        <div class="name">减少</div>
        <div class="code-name">.yrt-jianshao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zuojiantou2"></span>
        <div class="name">左箭头</div>
        <div class="code-name">.yrt-zuojiantou2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yrt-test"></span>
        <div class="name">签字</div>
        <div class="code-name">.yrt-yrt-test</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yinhang-yinlian-"></span>
        <div class="name">银行-银联-09</div>
        <div class="code-name">.yrt-yinhang-yinlian-</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dingwei8"></span>
        <div class="name">定位</div>
        <div class="code-name">.yrt-dingwei8</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kaiguan1"></span>
        <div class="name">开关</div>
        <div class="code-name">.yrt-kaiguan1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xialakuang1"></span>
        <div class="name">下拉框</div>
        <div class="code-name">.yrt-xialakuang1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jiankongzhongxin"></span>
        <div class="name">监控中心</div>
        <div class="code-name">.yrt-jiankongzhongxin</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shanchu7"></span>
        <div class="name">删除</div>
        <div class="code-name">.yrt-shanchu7</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fl-renshi"></span>
        <div class="name">人事</div>
        <div class="code-name">.yrt-fl-renshi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-star"></span>
        <div class="name">置顶推荐top</div>
        <div class="code-name">.yrt-star</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-liebiao4"></span>
        <div class="name">列表</div>
        <div class="code-name">.yrt-liebiao4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jiaoyichenggong"></span>
        <div class="name">首页-交易成功</div>
        <div class="code-name">.yrt-jiaoyichenggong</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dingwei9"></span>
        <div class="name">定位</div>
        <div class="code-name">.yrt-dingwei9</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-rili3"></span>
        <div class="name">日历</div>
        <div class="code-name">.yrt-rili3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kefu3"></span>
        <div class="name">客服</div>
        <div class="code-name">.yrt-kefu3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shouji-tianchong"></span>
        <div class="name">手机</div>
        <div class="code-name">.yrt-shouji-tianchong</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yanjing1"></span>
        <div class="name">眼睛</div>
        <div class="code-name">.yrt-yanjing1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dingwei10"></span>
        <div class="name">定位</div>
        <div class="code-name">.yrt-dingwei10</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-anniu1"></span>
        <div class="name">按钮</div>
        <div class="code-name">.yrt-anniu1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiaoxi8"></span>
        <div class="name">消息</div>
        <div class="code-name">.yrt-xiaoxi8</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jianshao1"></span>
        <div class="name">减少</div>
        <div class="code-name">.yrt-jianshao1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shizhong5"></span>
        <div class="name">时钟</div>
        <div class="code-name">.yrt-shizhong5</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-liulan3"></span>
        <div class="name">浏览</div>
        <div class="code-name">.yrt-liulan3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shouji4"></span>
        <div class="name">手机</div>
        <div class="code-name">.yrt-shouji4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jiahao1"></span>
        <div class="name">加号</div>
        <div class="code-name">.yrt-jiahao1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zuoduiqi"></span>
        <div class="name">左对齐</div>
        <div class="code-name">.yrt-zuoduiqi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-youduiqi"></span>
        <div class="name">右对齐</div>
        <div class="code-name">.yrt-youduiqi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shangduiqi"></span>
        <div class="name">上对齐</div>
        <div class="code-name">.yrt-shangduiqi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiaduiqi"></span>
        <div class="name">下对齐</div>
        <div class="code-name">.yrt-xiaduiqi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yigouxuan1"></span>
        <div class="name">已勾选32</div>
        <div class="code-name">.yrt-yigouxuan1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shouye5"></span>
        <div class="name">首页</div>
        <div class="code-name">.yrt-shouye5</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-guoqi"></span>
        <div class="name">国旗</div>
        <div class="code-name">.yrt-guoqi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tongji"></span>
        <div class="name">统计</div>
        <div class="code-name">.yrt-tongji</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shenfenzhengfanmian"></span>
        <div class="name">身份证反面</div>
        <div class="code-name">.yrt-shenfenzhengfanmian</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-youjiantou2"></span>
        <div class="name">右箭头</div>
        <div class="code-name">.yrt-youjiantou2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yigouxuan2"></span>
        <div class="name">已勾选40</div>
        <div class="code-name">.yrt-yigouxuan2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jiajianzujianjiahao"></span>
        <div class="name">加减组件 加号</div>
        <div class="code-name">.yrt-jiajianzujianjiahao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-cheliangziliaoshenhe"></span>
        <div class="name">车辆资料审核</div>
        <div class="code-name">.yrt-cheliangziliaoshenhe</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-cheliangziliao"></span>
        <div class="name">车辆资料</div>
        <div class="code-name">.yrt-cheliangziliao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chengyunfangziliaoshenhe"></span>
        <div class="name">承运方资料审核</div>
        <div class="code-name">.yrt-chengyunfangziliaoshenhe</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-feiyongguizeziliao"></span>
        <div class="name">费用规则资料</div>
        <div class="code-name">.yrt-feiyongguizeziliao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chengyunfangziliao"></span>
        <div class="name">承运方资料</div>
        <div class="code-name">.yrt-chengyunfangziliao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yunshujihuashenhe"></span>
        <div class="name">运输计划审核</div>
        <div class="code-name">.yrt-yunshujihuashenhe</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-cheliangyunwei"></span>
        <div class="name">车辆运维</div>
        <div class="code-name">.yrt-cheliangyunwei</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-cheliangdangan"></span>
        <div class="name">车辆档案</div>
        <div class="code-name">.yrt-cheliangdangan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-cheliangweixiubaoyang"></span>
        <div class="name">车辆维修保养</div>
        <div class="code-name">.yrt-cheliangweixiubaoyang</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-cheliangjiankong"></span>
        <div class="name">车辆监控</div>
        <div class="code-name">.yrt-cheliangjiankong</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chengbentongjifenxi"></span>
        <div class="name">成本统计分析</div>
        <div class="code-name">.yrt-chengbentongjifenxi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-cheliangyingxiangshezhi"></span>
        <div class="name">车辆影像设置</div>
        <div class="code-name">.yrt-cheliangyingxiangshezhi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-chengbenjisuangongshi"></span>
        <div class="name">成本计算公式</div>
        <div class="code-name">.yrt-chengbenjisuangongshi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-qitafeiyong"></span>
        <div class="name">其他费用</div>
        <div class="code-name">.yrt-qitafeiyong</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-renyuanguanli"></span>
        <div class="name">人员管理</div>
        <div class="code-name">.yrt-renyuanguanli</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-sijipaiban"></span>
        <div class="name">司机排班</div>
        <div class="code-name">.yrt-sijipaiban</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-sijiguanli"></span>
        <div class="name">司机管理</div>
        <div class="code-name">.yrt-sijiguanli</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zuzhijigou"></span>
        <div class="name">组织机构</div>
        <div class="code-name">.yrt-zuzhijigou</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fuhao-ziti"></span>
        <div class="name">符号-字体</div>
        <div class="code-name">.yrt-fuhao-ziti</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-folder-open"></span>
        <div class="name">文件夹开</div>
        <div class="code-name">.yrt-folder-open</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-guoqi_flag1"></span>
        <div class="name">国旗_flag54</div>
        <div class="code-name">.yrt-guoqi_flag1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-character-mind"></span>
        <div class="name">人物-关注</div>
        <div class="code-name">.yrt-character-mind</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-character-success"></span>
        <div class="name">人物-成功</div>
        <div class="code-name">.yrt-character-success</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-character-cancel"></span>
        <div class="name">人物-取消</div>
        <div class="code-name">.yrt-character-cancel</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-character-minus"></span>
        <div class="name">人物-减去</div>
        <div class="code-name">.yrt-character-minus</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dianhuaweijie"></span>
        <div class="name">电话 未接</div>
        <div class="code-name">.yrt-dianhuaweijie</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-paizhao4"></span>
        <div class="name">拍照</div>
        <div class="code-name">.yrt-paizhao4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhiding1"></span>
        <div class="name">置顶</div>
        <div class="code-name">.yrt-zhiding1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-pingfen"></span>
        <div class="name">评分</div>
        <div class="code-name">.yrt-pingfen</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-web-yrt-"></span>
        <div class="name">派送</div>
        <div class="code-name">.yrt-web-yrt-</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-benpao"></span>
        <div class="name">奔跑</div>
        <div class="code-name">.yrt-benpao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yrt-2"></span>
        <div class="name">开关</div>
        <div class="code-name">.yrt-yrt-2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yrt-3"></span>
        <div class="name">开关</div>
        <div class="code-name">.yrt-yrt-3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yrt-1"></span>
        <div class="name">消息</div>
        <div class="code-name">.yrt-yrt-1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yrt-"></span>
        <div class="name">纸飞机</div>
        <div class="code-name">.yrt-yrt-</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-renxiang"></span>
        <div class="name">人像</div>
        <div class="code-name">.yrt-renxiang</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiuxiyixia"></span>
        <div class="name">休息一下</div>
        <div class="code-name">.yrt-xiuxiyixia</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tuihuochuli"></span>
        <div class="name">退货处理</div>
        <div class="code-name">.yrt-tuihuochuli</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-wenjian"></span>
        <div class="name">文件</div>
        <div class="code-name">.yrt-wenjian</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xing1"></span>
        <div class="name">星</div>
        <div class="code-name">.yrt-xing1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zan6"></span>
        <div class="name">赞</div>
        <div class="code-name">.yrt-zan6</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-weiqianzi"></span>
        <div class="name">未签字</div>
        <div class="code-name">.yrt-weiqianzi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yiqianzi"></span>
        <div class="name">已签字</div>
        <div class="code-name">.yrt-yiqianzi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-rili4"></span>
        <div class="name">日历</div>
        <div class="code-name">.yrt-rili4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhcc_xiangxiajiantou"></span>
        <div class="name">zhcc_向下箭头</div>
        <div class="code-name">.yrt-zhcc_xiangxiajiantou</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shouji5"></span>
        <div class="name">手机</div>
        <div class="code-name">.yrt-shouji5</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fuzhi3"></span>
        <div class="name">复制</div>
        <div class="code-name">.yrt-fuzhi3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tubiaolunkuo-"></span>
        <div class="name">客服</div>
        <div class="code-name">.yrt-tubiaolunkuo-</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dingwei11"></span>
        <div class="name">定位</div>
        <div class="code-name">.yrt-dingwei11</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-feiji4"></span>
        <div class="name">飞机</div>
        <div class="code-name">.yrt-feiji4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt--"></span>
        <div class="name">统计</div>
        <div class="code-name">.yrt--</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-gouxuan7"></span>
        <div class="name">勾选</div>
        <div class="code-name">.yrt-gouxuan7</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shizhong6"></span>
        <div class="name">时钟</div>
        <div class="code-name">.yrt-shizhong6</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-ren1"></span>
        <div class="name">人</div>
        <div class="code-name">.yrt-ren1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-daimamoshi"></span>
        <div class="name">代码模式</div>
        <div class="code-name">.yrt-daimamoshi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-liebiao5"></span>
        <div class="name">列表</div>
        <div class="code-name">.yrt-liebiao5</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-feijihangban"></span>
        <div class="name">飞机航班</div>
        <div class="code-name">.yrt-feijihangban</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-clock3"></span>
        <div class="name">时钟手表</div>
        <div class="code-name">.yrt-clock3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-feiji5"></span>
        <div class="name">飞机</div>
        <div class="code-name">.yrt-feiji5</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-_fuzhi-"></span>
        <div class="name">时钟</div>
        <div class="code-name">.yrt-_fuzhi-</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-gouwuche6"></span>
        <div class="name">购物车</div>
        <div class="code-name">.yrt-gouwuche6</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt--zhishengfeiji"></span>
        <div class="name">100-直升飞机</div>
        <div class="code-name">.yrt--zhishengfeiji</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shizhong7"></span>
        <div class="name">时钟</div>
        <div class="code-name">.yrt-shizhong7</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhcc_xiangxiajiantou1"></span>
        <div class="name">zhcc_向下箭头1</div>
        <div class="code-name">.yrt-zhcc_xiangxiajiantou1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt--daxiajiantou"></span>
        <div class="name">017-大下箭头</div>
        <div class="code-name">.yrt--daxiajiantou</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zhcc_jiahao"></span>
        <div class="name">zhcc_加号</div>
        <div class="code-name">.yrt-zhcc_jiahao</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yidong"></span>
        <div class="name">移动</div>
        <div class="code-name">.yrt-yidong</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-mn_xiuxi"></span>
        <div class="name">AK-MN休息</div>
        <div class="code-name">.yrt-mn_xiuxi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-im_dianhua2"></span>
        <div class="name">AK-IM电话2</div>
        <div class="code-name">.yrt-im_dianhua2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-paobu"></span>
        <div class="name">跑步</div>
        <div class="code-name">.yrt-paobu</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dianhua6"></span>
        <div class="name">电话</div>
        <div class="code-name">.yrt-dianhua6</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-shijianxuanzeqi"></span>
        <div class="name">时间选择器</div>
        <div class="code-name">.yrt-shijianxuanzeqi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yiwancheng1"></span>
        <div class="name">已完成</div>
        <div class="code-name">.yrt-yiwancheng1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-liulan-tianchong"></span>
        <div class="name">浏览-填充</div>
        <div class="code-name">.yrt-liulan-tianchong</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fuzhi4"></span>
        <div class="name">复制</div>
        <div class="code-name">.yrt-fuzhi4</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-biaodanzujian-xialakuang"></span>
        <div class="name">表单组件-下拉框</div>
        <div class="code-name">.yrt-biaodanzujian-xialakuang</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yidong1"></span>
        <div class="name">移动</div>
        <div class="code-name">.yrt-yidong1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xiaoxi9"></span>
        <div class="name">消息</div>
        <div class="code-name">.yrt-xiaoxi9</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xing2"></span>
        <div class="name">星</div>
        <div class="code-name">.yrt-xing2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-biangengcheliangyanse"></span>
        <div class="name">变更车辆颜色</div>
        <div class="code-name">.yrt-biangengcheliangyanse</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-qianzi"></span>
        <div class="name">签字12</div>
        <div class="code-name">.yrt-qianzi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-dabiaoti"></span>
        <div class="name">大标题</div>
        <div class="code-name">.yrt-dabiaoti</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-anniuzu"></span>
        <div class="name">按钮组</div>
        <div class="code-name">.yrt-anniuzu</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-tupian3"></span>
        <div class="name">图片</div>
        <div class="code-name">.yrt-tupian3</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-wenjian1"></span>
        <div class="name">文件</div>
        <div class="code-name">.yrt-wenjian1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-liebiao6"></span>
        <div class="name">列表</div>
        <div class="code-name">.yrt-liebiao6</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-xin1"></span>
        <div class="name">新</div>
        <div class="code-name">.yrt-xin1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-ziyuan1"></span>
        <div class="name">支付宝</div>
        <div class="code-name">.yrt-ziyuan1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fuxuankuang"></span>
        <div class="name">复选框</div>
        <div class="code-name">.yrt-fuxuankuang</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-huakuai"></span>
        <div class="name">滑块</div>
        <div class="code-name">.yrt-huakuai</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-jiantou_shangxiaqiehuan"></span>
        <div class="name">箭头_上下切换</div>
        <div class="code-name">.yrt-jiantou_shangxiaqiehuan</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yanjing_xianshi"></span>
        <div class="name">眼睛_显示</div>
        <div class="code-name">.yrt-yanjing_xianshi</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-layout-custom"></span>
        <div class="name">自定义布局</div>
        <div class="code-name">.yrt-layout-custom</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yrt-test1"></span>
        <div class="name">复选-选中</div>
        <div class="code-name">.yrt-yrt-test1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fuxuankuang_xuanzhong"></span>
        <div class="name">复选框_选中</div>
        <div class="code-name">.yrt-fuxuankuang_xuanzhong</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yuandaima"></span>
        <div class="name">源代码</div>
        <div class="code-name">.yrt-yuandaima</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-danxuankuang1"></span>
        <div class="name">单选框</div>
        <div class="code-name">.yrt-danxuankuang1</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fuhao-shuzishurukuang"></span>
        <div class="name">符号-数字输入框</div>
        <div class="code-name">.yrt-fuhao-shuzishurukuang</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yanse"></span>
        <div class="name">颜色</div>
        <div class="code-name">.yrt-yanse</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-wenjianjiazhankai"></span>
        <div class="name">文件夹展开</div>
        <div class="code-name">.yrt-wenjianjiazhankai</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-yanjing2"></span>
        <div class="name">眼睛2</div>
        <div class="code-name">.yrt-yanjing2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-wenjianjiashanchu"></span>
        <div class="name">文件夹删除</div>
        <div class="code-name">.yrt-wenjianjiashanchu</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-kaiguan2"></span>
        <div class="name">开关</div>
        <div class="code-name">.yrt-kaiguan2</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-zitidaima"></span>
        <div class="name">字体代码</div>
        <div class="code-name">.yrt-zitidaima</div>
      </li>

      <li class="dib">
        <span class="icon icon-yrt yrt-fuxuankuang1"></span>
        <div class="name">复选框</div>
        <div class="code-name">.yrt-fuxuankuang1</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  methods: {
    onSelectIcon(evt) {
      var icon = evt.target.innerText;
      if (icon && icon.indexOf('.') >= 0) {
        this.$emit('onSelectIcon', icon.replace('.', ''), evt);
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
.fontclass {
  cursor: pointer;
}
.markdown li.dib {
  cursor: pointer;
}
</style>
