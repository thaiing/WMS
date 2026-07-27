<template>
  <div class="main markdown">
    <h1>IconFont 图标</h1>
    <ul class="icon_lists clear" @click="onSelectIcon">
      <li>
        <i class="icon iconfont icon-xin"></i>
        <div class="name">新</div>
        <div class="fontclass">.icon-xin</div>
      </li>

      <li>
        <i class="icon iconfont icon-ziti"></i>
        <div class="name">字体</div>
        <div class="fontclass">.icon-ziti</div>
      </li>

      <li>
        <i class="icon iconfont icon-baocun"></i>
        <div class="name">保存</div>
        <div class="fontclass">.icon-baocun</div>
      </li>

      <li>
        <i class="icon iconfont icon-bangzhu"></i>
        <div class="name">帮助</div>
        <div class="fontclass">.icon-bangzhu</div>
      </li>

      <li>
        <i class="icon iconfont icon-hebingdanyuan"></i>
        <div class="name">合并单元</div>
        <div class="fontclass">.icon-hebingdanyuan</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhifubao"></i>
        <div class="name">支付宝</div>
        <div class="fontclass">.icon-zhifubao</div>
      </li>

      <li>
        <i class="icon iconfont icon-bianji"></i>
        <div class="name">编辑</div>
        <div class="fontclass">.icon-bianji</div>
      </li>

      <li>
        <i class="icon iconfont icon-shezhi"></i>
        <div class="name">设置</div>
        <div class="fontclass">.icon-shezhi</div>
      </li>

      <li>
        <i class="icon iconfont icon-shezhi1"></i>
        <div class="name">设置</div>
        <div class="fontclass">.icon-shezhi1</div>
      </li>

      <li>
        <i class="icon iconfont icon-shuaxin"></i>
        <div class="name">刷新</div>
        <div class="fontclass">.icon-shuaxin</div>
      </li>

      <li>
        <i class="icon iconfont icon-shuaxin1"></i>
        <div class="name">刷新</div>
        <div class="fontclass">.icon-shuaxin1</div>
      </li>

      <li>
        <i class="icon iconfont icon-bianji1"></i>
        <div class="name">编辑</div>
        <div class="fontclass">.icon-bianji1</div>
      </li>

      <li>
        <i class="icon iconfont icon-import"></i>
        <div class="name">导入</div>
        <div class="fontclass">.icon-import</div>
      </li>

      <li>
        <i class="icon iconfont icon-shanchu"></i>
        <div class="name">删除</div>
        <div class="fontclass">.icon-shanchu</div>
      </li>

      <li>
        <i class="icon iconfont icon-shuaxin2"></i>
        <div class="name">刷新</div>
        <div class="fontclass">.icon-shuaxin2</div>
      </li>

      <li>
        <i class="icon iconfont icon-print"></i>
        <div class="name">打印</div>
        <div class="fontclass">.icon-print</div>
      </li>

      <li>
        <i class="icon iconfont yrt-shanchu1"></i>
        <div class="name">删除</div>
        <div class="fontclass">.yrt-shanchu1</div>
      </li>

      <li>
        <i class="icon iconfont yrt-shanchu2"></i>
        <div class="name">删除</div>
        <div class="fontclass">.yrt-shanchu2</div>
      </li>

      <li>
        <i class="icon iconfont icon-kaiqi"></i>
        <div class="name">开启</div>
        <div class="fontclass">.icon-kaiqi</div>
      </li>

      <li>
        <i class="icon iconfont icon-f14"></i>
        <div class="name">刷新</div>
        <div class="fontclass">.icon-f14</div>
      </li>

      <li>
        <i class="icon iconfont icon-daoru"></i>
        <div class="name">导入</div>
        <div class="fontclass">.icon-daoru</div>
      </li>

      <li>
        <i class="icon iconfont icon-daoru1"></i>
        <div class="name">导入</div>
        <div class="fontclass">.icon-daoru1</div>
      </li>

      <li>
        <i class="icon iconfont icon-guanbi"></i>
        <div class="name">关闭</div>
        <div class="fontclass">.icon-guanbi</div>
      </li>

      <li>
        <i class="icon iconfont icon-rukushangjia"></i>
        <div class="name">入库上架</div>
        <div class="fontclass">.icon-rukushangjia</div>
      </li>

      <li>
        <i class="icon iconfont icon-zan"></i>
        <div class="name">赞</div>
        <div class="fontclass">.icon-zan</div>
      </li>

      <li>
        <i class="icon iconfont icon-feiji"></i>
        <div class="name">飞机</div>
        <div class="fontclass">.icon-feiji</div>
      </li>

      <li>
        <i class="icon iconfont icon-tianjia2"></i>
        <div class="name">添加</div>
        <div class="fontclass">.icon-tianjia2</div>
      </li>

      <li>
        <i class="icon iconfont icon-settings2"></i>
        <div class="name">设置</div>
        <div class="fontclass">.icon-settings2</div>
      </li>

      <li>
        <i class="icon iconfont icon-tubiao"></i>
        <div class="name">设置</div>
        <div class="fontclass">.icon-tubiao</div>
      </li>

      <li>
        <i class="icon iconfont icon-guanbi1"></i>
        <div class="name">关闭</div>
        <div class="fontclass">.icon-guanbi1</div>
      </li>

      <li>
        <i class="icon iconfont icon-daoru2"></i>
        <div class="name">导入</div>
        <div class="fontclass">.icon-daoru2</div>
      </li>

      <li>
        <i class="icon iconfont icon-rukuguanli"></i>
        <div class="name">入库管理-</div>
        <div class="fontclass">.icon-rukuguanli</div>
      </li>

      <li>
        <i class="icon iconfont icon-baocun1"></i>
        <div class="name">保存</div>
        <div class="fontclass">.icon-baocun1</div>
      </li>

      <li>
        <i class="icon iconfont icon-ordinaryprint"></i>
        <div class="name">打印</div>
        <div class="fontclass">.icon-ordinaryprint</div>
      </li>

      <li>
        <i class="icon iconfont icon-daochu"></i>
        <div class="name">导出</div>
        <div class="fontclass">.icon-daochu</div>
      </li>

      <li>
        <i class="icon iconfont yrt-pandianliebiao"></i>
        <div class="name">盘点列表</div>
        <div class="fontclass">.yrt-pandianliebiao</div>
      </li>

      <li>
        <i class="icon iconfont icon-quehuobuhuo"></i>
        <div class="name">缺货补货</div>
        <div class="fontclass">.icon-quehuobuhuo</div>
      </li>

      <li>
        <i class="icon iconfont icon-yiweiguanli"></i>
        <div class="name">移位管理</div>
        <div class="fontclass">.icon-yiweiguanli</div>
      </li>

      <li>
        <i class="icon iconfont icon-import1"></i>
        <div class="name">导入</div>
        <div class="fontclass">.icon-import1</div>
      </li>

      <li>
        <i class="icon iconfont icon-04"></i>
        <div class="name">定位</div>
        <div class="fontclass">.icon-04</div>
      </li>

      <li>
        <i class="icon iconfont icon-27"></i>
        <div class="name">购物车</div>
        <div class="fontclass">.icon-27</div>
      </li>

      <li>
        <i class="icon iconfont icon-kucun"></i>
        <div class="name">库存</div>
        <div class="fontclass">.icon-kucun</div>
      </li>

      <li>
        <i class="icon iconfont icon-kuaidi"></i>
        <div class="name">快递</div>
        <div class="fontclass">.icon-kuaidi</div>
      </li>

      <li>
        <i class="icon iconfont icon-88"></i>
        <div class="name">微信</div>
        <div class="fontclass">.icon-88</div>
      </li>

      <li>
        <i class="icon iconfont icon-dayin"></i>
        <div class="name">打印</div>
        <div class="fontclass">.icon-dayin</div>
      </li>

      <li>
        <i class="icon iconfont icon-xiaoxituisongshezhi"></i>
        <div class="name">消息推送设置</div>
        <div class="fontclass">.icon-xiaoxituisongshezhi</div>
      </li>

      <li>
        <i class="icon iconfont icon-cogs3"></i>
        <div class="name">设置</div>
        <div class="fontclass">.icon-cogs3</div>
      </li>

      <li>
        <i class="icon iconfont icon-suo"></i>
        <div class="name">锁</div>
        <div class="fontclass">.icon-suo</div>
      </li>

      <li>
        <i class="icon iconfont icon-chazishanchudaibiankuang"></i>
        <div class="name">叉子删除带边框</div>
        <div class="fontclass">.icon-chazishanchudaibiankuang</div>
      </li>

      <li>
        <i class="icon iconfont icon-zan1"></i>
        <div class="name">赞</div>
        <div class="fontclass">.icon-zan1</div>
      </li>

      <li>
        <i class="icon iconfont icon-msnui-shezhi"></i>
        <div class="name">设置</div>
        <div class="fontclass">.icon-msnui-shezhi</div>
      </li>

      <li>
        <i class="icon iconfont icon-msnui-rmb"></i>
        <div class="name">人民币</div>
        <div class="fontclass">.icon-msnui-rmb</div>
      </li>

      <li>
        <i class="icon iconfont icon-saomiao"></i>
        <div class="name">扫描</div>
        <div class="fontclass">.icon-saomiao</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon1"></i>
        <div class="name">加入购物车</div>
        <div class="fontclass">.icon-icon1</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon27"></i>
        <div class="name">删除</div>
        <div class="fontclass">.icon-icon27</div>
      </li>

      <li>
        <i class="icon iconfont icon-dianhua"></i>
        <div class="name">电话</div>
        <div class="fontclass">.icon-dianhua</div>
      </li>

      <li>
        <i class="icon iconfont icon-saomiao1"></i>
        <div class="name">扫描</div>
        <div class="fontclass">.icon-saomiao1</div>
      </li>

      <li>
        <i class="icon iconfont icon-edit"></i>
        <div class="name">编辑</div>
        <div class="fontclass">.icon-edit</div>
      </li>

      <li>
        <i class="icon iconfont icon-dunhuo"></i>
        <div class="name">囤货</div>
        <div class="fontclass">.icon-dunhuo</div>
      </li>

      <li>
        <i class="icon iconfont icon-rmb"></i>
        <div class="name">人民币</div>
        <div class="fontclass">.icon-rmb</div>
      </li>

      <li>
        <i class="icon iconfont icon-setup"></i>
        <div class="name">设置</div>
        <div class="fontclass">.icon-setup</div>
      </li>

      <li>
        <i class="icon iconfont icon-iconfontcolor32"></i>
        <div class="name">编辑</div>
        <div class="fontclass">.icon-iconfontcolor32</div>
      </li>

      <li>
        <i class="icon iconfont icon-guanbi2"></i>
        <div class="name">关闭</div>
        <div class="fontclass">.icon-guanbi2</div>
      </li>

      <li>
        <i class="icon iconfont icon-zan2"></i>
        <div class="name">赞</div>
        <div class="fontclass">.icon-zan2</div>
      </li>

      <li>
        <i class="icon iconfont icon-msnui-info"></i>
        <div class="name">帮助</div>
        <div class="fontclass">.icon-msnui-info</div>
      </li>

      <li>
        <i class="icon iconfont icon-caigoujihua"></i>
        <div class="name">采购计划</div>
        <div class="fontclass">.icon-caigoujihua</div>
      </li>

      <li>
        <i class="icon iconfont icon-shenpi"></i>
        <div class="name">审批</div>
        <div class="fontclass">.icon-shenpi</div>
      </li>

      <li>
        <i class="icon iconfont icon-bianji2"></i>
        <div class="name">编辑</div>
        <div class="fontclass">.icon-bianji2</div>
      </li>

      <li>
        <i class="icon iconfont icon-dingwei"></i>
        <div class="name">定位</div>
        <div class="fontclass">.icon-dingwei</div>
      </li>

      <li>
        <i class="icon iconfont icon-liebiaotuodong"></i>
        <div class="name">列表拖动</div>
        <div class="fontclass">.icon-liebiaotuodong</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhuanyi1"></i>
        <div class="name">转移</div>
        <div class="fontclass">.icon-zhuanyi1</div>
      </li>

      <li>
        <i class="icon iconfont icon-wuliuguanliicon"></i>
        <div class="name">物流管理icon</div>
        <div class="fontclass">.icon-wuliuguanliicon</div>
      </li>

      <li>
        <i class="icon iconfont icon-jinlingyingcaiwangtubiao20"></i>
        <div class="name">删除</div>
        <div class="fontclass">.icon-jinlingyingcaiwangtubiao20</div>
      </li>

      <li>
        <i class="icon iconfont icon-jinlingyingcaiwangtubiao35"></i>
        <div class="name">帮助</div>
        <div class="fontclass">.icon-jinlingyingcaiwangtubiao35</div>
      </li>

      <li>
        <i class="icon iconfont icon-jinlingyingcaiwangtubiao68"></i>
        <div class="name">打印</div>
        <div class="fontclass">.icon-jinlingyingcaiwangtubiao68</div>
      </li>

      <li>
        <i class="icon iconfont yrt-addplus"></i>
        <div class="name">添加</div>
        <div class="fontclass">.yrt-addplus</div>
      </li>

      <li>
        <i class="icon iconfont icon-jinhuo"></i>
        <div class="name">进货</div>
        <div class="fontclass">.icon-jinhuo</div>
      </li>

      <li>
        <i class="icon iconfont yrt-tianjia"></i>
        <div class="name">添加</div>
        <div class="fontclass">.yrt-tianjia</div>
      </li>

      <li>
        <i class="icon iconfont icon-saomiao2"></i>
        <div class="name">扫描</div>
        <div class="fontclass">.icon-saomiao2</div>
      </li>

      <li>
        <i class="icon iconfont icon-kaiqi1"></i>
        <div class="name">开启</div>
        <div class="fontclass">.icon-kaiqi1</div>
      </li>

      <li>
        <i class="icon iconfont icon-peihuo"></i>
        <div class="name">配货</div>
        <div class="fontclass">.icon-peihuo</div>
      </li>

      <li>
        <i class="icon iconfont icon-tuihuo"></i>
        <div class="name">退货</div>
        <div class="fontclass">.icon-tuihuo</div>
      </li>

      <li>
        <i class="icon iconfont icon-saozi"></i>
        <div class="name">扫字</div>
        <div class="fontclass">.icon-saozi</div>
      </li>

      <li>
        <i class="icon iconfont icon-kaiqi2"></i>
        <div class="name">开启</div>
        <div class="fontclass">.icon-kaiqi2</div>
      </li>

      <li>
        <i class="icon iconfont icon-shouji"></i>
        <div class="name">手机</div>
        <div class="fontclass">.icon-shouji</div>
      </li>

      <li>
        <i class="icon iconfont icon-shenfenzhengrenzheng"></i>
        <div class="name">身份证认证</div>
        <div class="fontclass">.icon-shenfenzhengrenzheng</div>
      </li>

      <li>
        <i class="icon iconfont icon-shenfenzhengrenzheng1"></i>
        <div class="name">身份证认证</div>
        <div class="fontclass">.icon-shenfenzhengrenzheng1</div>
      </li>

      <li>
        <i class="icon iconfont icon-chazhaoshiyao"></i>
        <div class="name">全盘扫描</div>
        <div class="fontclass">.icon-chazhaoshiyao</div>
      </li>

      <li>
        <i class="icon iconfont icon-weixinsaomiao"></i>
        <div class="name">微信扫描</div>
        <div class="fontclass">.icon-weixinsaomiao</div>
      </li>

      <li>
        <i class="icon iconfont icon-daoru3"></i>
        <div class="name">导入</div>
        <div class="fontclass">.icon-daoru3</div>
      </li>

      <li>
        <i class="icon iconfont icon-daoru4"></i>
        <div class="name">导入</div>
        <div class="fontclass">.icon-daoru4</div>
      </li>

      <li>
        <i class="icon iconfont icon-toupiao"></i>
        <div class="name">投票</div>
        <div class="fontclass">.icon-toupiao</div>
      </li>

      <li>
        <i class="icon iconfont icon-hebingumerger"></i>
        <div class="name">合并uMerger</div>
        <div class="fontclass">.icon-hebingumerger</div>
      </li>

      <li>
        <i class="icon iconfont icon-bianji3"></i>
        <div class="name">编辑</div>
        <div class="fontclass">.icon-bianji3</div>
      </li>

      <li>
        <i class="icon iconfont icon-gerenzhongxindingdantuihuozhong"></i>
        <div class="name">个人中心-订单-退货中</div>
        <div class="fontclass">.icon-gerenzhongxindingdantuihuozhong</div>
      </li>

      <li>
        <i class="icon iconfont icon-guanbi3"></i>
        <div class="name">关闭</div>
        <div class="fontclass">.icon-guanbi3</div>
      </li>

      <li>
        <i class="icon iconfont icon-fuzhi"></i>
        <div class="name">复制</div>
        <div class="fontclass">.icon-fuzhi</div>
      </li>

      <li>
        <i class="icon iconfont icon-iconfontguanlibumen1111"></i>
        <div class="name">入库</div>
        <div class="fontclass">.icon-iconfontguanlibumen1111</div>
      </li>

      <li>
        <i class="icon iconfont icon-icozhuanhuan"></i>
        <div class="name">购物车</div>
        <div class="fontclass">.icon-icozhuanhuan</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhanweifu"></i>
        <div class="name">占位符</div>
        <div class="fontclass">.icon-zhanweifu</div>
      </li>

      <li>
        <i class="icon iconfont icon-fenpei"></i>
        <div class="name">分配</div>
        <div class="fontclass">.icon-fenpei</div>
      </li>

      <li>
        <i class="icon iconfont icon-paper-airplane"></i>
        <div class="name">纸飞机</div>
        <div class="fontclass">.icon-paper-airplane</div>
      </li>

      <li>
        <i class="icon iconfont icon-iconfontadd"></i>
        <div class="name">加号</div>
        <div class="fontclass">.icon-iconfontadd</div>
      </li>

      <li>
        <i class="icon iconfont icon-jiahao"></i>
        <div class="name">加号</div>
        <div class="fontclass">.icon-jiahao</div>
      </li>

      <li>
        <i class="icon iconfont icon-quancha"></i>
        <div class="name">圈叉</div>
        <div class="fontclass">.icon-quancha</div>
      </li>

      <li>
        <i class="icon iconfont icon-saomiao3"></i>
        <div class="name">扫描</div>
        <div class="fontclass">.icon-saomiao3</div>
      </li>

      <li>
        <i class="icon iconfont icon-piliangtianjia"></i>
        <div class="name">批量添加</div>
        <div class="fontclass">.icon-piliangtianjia</div>
      </li>

      <li>
        <i class="icon iconfont icon-pingtaishouquanzhongzhi"></i>
        <div class="name">平台授权终止</div>
        <div class="fontclass">.icon-pingtaishouquanzhongzhi</div>
      </li>

      <li>
        <i class="icon iconfont icon-jingxiaoshangzhongzhi"></i>
        <div class="name">经销商终止</div>
        <div class="fontclass">.icon-jingxiaoshangzhongzhi</div>
      </li>

      <li>
        <i class="icon iconfont icon-zijinguanli"></i>
        <div class="name">群蜂资金管理</div>
        <div class="fontclass">.icon-zijinguanli</div>
      </li>

      <li>
        <i class="icon iconfont icon-dianhua1"></i>
        <div class="name">群蜂电话</div>
        <div class="fontclass">.icon-dianhua1</div>
      </li>

      <li>
        <i class="icon iconfont icon-youjiantou3"></i>
        <div class="name">右箭头</div>
        <div class="fontclass">.icon-youjiantou3</div>
      </li>

      <li>
        <i class="icon iconfont icon-font29"></i>
        <div class="name">打印</div>
        <div class="fontclass">.icon-font29</div>
      </li>

      <li>
        <i class="icon iconfont icon-zijintixian"></i>
        <div class="name">群蜂资金提现</div>
        <div class="fontclass">.icon-zijintixian</div>
      </li>

      <li>
        <i class="icon iconfont icon-cangku"></i>
        <div class="name">仓库</div>
        <div class="fontclass">.icon-cangku</div>
      </li>

      <li>
        <i class="icon iconfont icon-ruku"></i>
        <div class="name">入库</div>
        <div class="fontclass">.icon-ruku</div>
      </li>

      <li>
        <i class="icon iconfont icon-30"></i>
        <div class="name">金融锁</div>
        <div class="fontclass">.icon-30</div>
      </li>

      <li>
        <i class="icon iconfont icon-19"></i>
        <div class="name">金融</div>
        <div class="fontclass">.icon-19</div>
      </li>

      <li>
        <i class="icon iconfont icon-bangzhu1"></i>
        <div class="name">帮助</div>
        <div class="fontclass">.icon-bangzhu1</div>
      </li>

      <li>
        <i class="icon iconfont icon-qiyong"></i>
        <div class="name">启用</div>
        <div class="fontclass">.icon-qiyong</div>
      </li>

      <li>
        <i class="icon iconfont icon-rfidsaomiao"></i>
        <div class="name">RFID扫描</div>
        <div class="fontclass">.icon-rfidsaomiao</div>
      </li>

      <li>
        <i class="icon iconfont icon-wenjianjia"></i>
        <div class="name">文件夹</div>
        <div class="fontclass">.icon-wenjianjia</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon08"></i>
        <div class="name">仓库-08</div>
        <div class="fontclass">.icon-icon08</div>
      </li>

      <li>
        <i class="icon iconfont icon-shenpi1"></i>
        <div class="name">审批</div>
        <div class="fontclass">.icon-shenpi1</div>
      </li>

      <li>
        <i class="icon iconfont icon-tianjia1"></i>
        <div class="name">添加</div>
        <div class="fontclass">.icon-tianjia1</div>
      </li>

      <li>
        <i class="icon iconfont icon-shangpinguanli"></i>
        <div class="name">商品管理</div>
        <div class="fontclass">.icon-shangpinguanli</div>
      </li>

      <li>
        <i class="icon iconfont icon-xinjian"></i>
        <div class="name">新建</div>
        <div class="fontclass">.icon-xinjian</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhantiepeizhi"></i>
        <div class="name">粘贴配置</div>
        <div class="fontclass">.icon-zhantiepeizhi</div>
      </li>

      <li>
        <i class="icon iconfont icon-paizhao"></i>
        <div class="name">拍照</div>
        <div class="fontclass">.icon-paizhao</div>
      </li>

      <li>
        <i class="icon iconfont icon-gouwuche"></i>
        <div class="name">购物车</div>
        <div class="fontclass">.icon-gouwuche</div>
      </li>

      <li>
        <i class="icon iconfont icon-jihuadan"></i>
        <div class="name">计划单</div>
        <div class="fontclass">.icon-jihuadan</div>
      </li>

      <li>
        <i class="icon iconfont icon-arrow-left1"></i>
        <div class="name">左箭头</div>
        <div class="fontclass">.icon-arrow-left1</div>
      </li>

      <li>
        <i class="icon iconfont icon-arrow-down"></i>
        <div class="name">下箭头</div>
        <div class="fontclass">.icon-arrow-down</div>
      </li>

      <li>
        <i class="icon iconfont icon-zaihaijianceshujuku"></i>
        <div class="name">灾害监测数据库</div>
        <div class="fontclass">.icon-zaihaijianceshujuku</div>
      </li>

      <li>
        <i class="icon iconfont icon-kehutuisong"></i>
        <div class="name">客户推送</div>
        <div class="fontclass">.icon-kehutuisong</div>
      </li>

      <li>
        <i class="icon iconfont icon-shenpi2"></i>
        <div class="name">审批</div>
        <div class="fontclass">.icon-shenpi2</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhengquegouxuan"></i>
        <div class="name">正确，勾选</div>
        <div class="fontclass">.icon-zhengquegouxuan</div>
      </li>

      <li>
        <i class="icon iconfont icon-liulanjilu"></i>
        <div class="name">浏览记录</div>
        <div class="fontclass">.icon-liulanjilu</div>
      </li>

      <li>
        <i class="icon iconfont icon-saoyisao"></i>
        <div class="name">扫一扫</div>
        <div class="fontclass">.icon-saoyisao</div>
      </li>

      <li>
        <i class="icon iconfont icon-shouye"></i>
        <div class="name">首页</div>
        <div class="fontclass">.icon-shouye</div>
      </li>

      <li>
        <i class="icon iconfont icon-liebiao"></i>
        <div class="name">列表</div>
        <div class="fontclass">.icon-liebiao</div>
      </li>

      <li>
        <i class="icon iconfont icon-yu"></i>
        <div class="name">预</div>
        <div class="fontclass">.icon-yu</div>
      </li>

      <li>
        <i class="icon iconfont icon-dayin1"></i>
        <div class="name">打印</div>
        <div class="fontclass">.icon-dayin1</div>
      </li>

      <li>
        <i class="icon iconfont icon-tuihuo1"></i>
        <div class="name">退货</div>
        <div class="fontclass">.icon-tuihuo1</div>
      </li>

      <li>
        <i class="icon iconfont icon-shengdanjianhuagouwuche"></i>
        <div class="name">圣诞简化-购物车</div>
        <div class="fontclass">.icon-shengdanjianhuagouwuche</div>
      </li>

      <li>
        <i class="icon iconfont icon-my-help"></i>
        <div class="name">帮助</div>
        <div class="fontclass">.icon-my-help</div>
      </li>

      <li>
        <i class="icon iconfont icon-saomiao4"></i>
        <div class="name">扫描</div>
        <div class="fontclass">.icon-saomiao4</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon10"></i>
        <div class="name">调拨</div>
        <div class="fontclass">.icon-icon10</div>
      </li>

      <li>
        <i class="icon iconfont icon-gouxuan"></i>
        <div class="name">勾选</div>
        <div class="fontclass">.icon-gouxuan</div>
      </li>

      <li>
        <i class="icon iconfont icon-dianhua2"></i>
        <div class="name">电话</div>
        <div class="fontclass">.icon-dianhua2</div>
      </li>

      <li>
        <i class="icon iconfont icon-hexiaotiaoxingmasaomiao"></i>
        <div class="name">核销_条形码扫描</div>
        <div class="fontclass">.icon-hexiaotiaoxingmasaomiao</div>
      </li>

      <li>
        <i class="icon iconfont icon-dingwei1"></i>
        <div class="name">定位</div>
        <div class="fontclass">.icon-dingwei1</div>
      </li>

      <li>
        <i class="icon iconfont icon-saomiao5"></i>
        <div class="name">扫描</div>
        <div class="fontclass">.icon-saomiao5</div>
      </li>

      <li>
        <i class="icon iconfont icon-daifenpei"></i>
        <div class="name">待分配</div>
        <div class="fontclass">.icon-daifenpei</div>
      </li>

      <li>
        <i class="icon iconfont icon-dingwei2"></i>
        <div class="name">定位</div>
        <div class="fontclass">.icon-dingwei2</div>
      </li>

      <li>
        <i class="icon iconfont icon-fenpei-copy"></i>
        <div class="name">分配</div>
        <div class="fontclass">.icon-fenpei-copy</div>
      </li>

      <li>
        <i class="icon iconfont icon-shanchu3"></i>
        <div class="name">删除</div>
        <div class="fontclass">.icon-shanchu3</div>
      </li>

      <li>
        <i class="icon iconfont icon-guoqiflag50"></i>
        <div class="name">国旗_flag50</div>
        <div class="fontclass">.icon-guoqiflag50</div>
      </li>

      <li>
        <i class="icon iconfont icon-tuihuo2"></i>
        <div class="name">退货</div>
        <div class="fontclass">.icon-tuihuo2</div>
      </li>

      <li>
        <i class="icon iconfont icon-shourumingxi"></i>
        <div class="name">收入明细</div>
        <div class="fontclass">.icon-shourumingxi</div>
      </li>

      <li>
        <i class="icon iconfont icon-zanwushourumingxi"></i>
        <div class="name">暂无收入明细</div>
        <div class="fontclass">.icon-zanwushourumingxi</div>
      </li>

      <li>
        <i class="icon iconfont icon-paizhaotubiao"></i>
        <div class="name">拍照图标</div>
        <div class="fontclass">.icon-paizhaotubiao</div>
      </li>

      <li>
        <i class="icon iconfont icon-tuisong"></i>
        <div class="name">推送</div>
        <div class="fontclass">.icon-tuisong</div>
      </li>

      <li>
        <i class="icon iconfont icon-shenpi3"></i>
        <div class="name">审批</div>
        <div class="fontclass">.icon-shenpi3</div>
      </li>

      <li>
        <i class="icon iconfont icon-save"></i>
        <div class="name">保存</div>
        <div class="fontclass">.icon-save</div>
      </li>

      <li>
        <i class="icon iconfont icon-12312"></i>
        <div class="name">叉车</div>
        <div class="fontclass">.icon-12312</div>
      </li>

      <li>
        <i class="icon iconfont icon-121212122"></i>
        <div class="name">托盘箱子</div>
        <div class="fontclass">.icon-121212122</div>
      </li>

      <li>
        <i class="icon iconfont icon-123"></i>
        <div class="name">叉车</div>
        <div class="fontclass">.icon-123</div>
      </li>

      <li>
        <i class="icon iconfont icon-saomiao6"></i>
        <div class="name">扫描异常</div>
        <div class="fontclass">.icon-saomiao6</div>
      </li>

      <li>
        <i class="icon iconfont icon-cangku131"></i>
        <div class="name">仓库131</div>
        <div class="fontclass">.icon-cangku131</div>
      </li>

      <li>
        <i class="icon iconfont icon-tuopan121"></i>
        <div class="name">托盘121</div>
        <div class="fontclass">.icon-tuopan121</div>
      </li>

      <li>
        <i class="icon iconfont icon-tuisong1"></i>
        <div class="name">推送</div>
        <div class="fontclass">.icon-tuisong1</div>
      </li>

      <li>
        <i class="icon iconfont icon-arrow_down_full"></i>
        <div class="name">向下箭头</div>
        <div class="fontclass">.icon-arrow_down_full</div>
      </li>

      <li>
        <i class="icon iconfont icon-iconset0255"></i>
        <div class="name">扫描条形码</div>
        <div class="fontclass">.icon-iconset0255</div>
      </li>

      <li>
        <i class="icon iconfont icon-iconset0311"></i>
        <div class="name">购物车-向右移动</div>
        <div class="fontclass">.icon-iconset0311</div>
      </li>

      <li>
        <i class="icon iconfont icon-iconset0312"></i>
        <div class="name">购物车-向左移动</div>
        <div class="fontclass">.icon-iconset0312</div>
      </li>

      <li>
        <i class="icon iconfont icon-iconset0492"></i>
        <div class="name">圆</div>
        <div class="fontclass">.icon-iconset0492</div>
      </li>

      <li>
        <i class="icon iconfont icon-iconset0493"></i>
        <div class="name">圆</div>
        <div class="fontclass">.icon-iconset0493</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhuanyigeitaren"></i>
        <div class="name">转移给他人</div>
        <div class="fontclass">.icon-zhuanyigeitaren</div>
      </li>

      <li>
        <i class="icon iconfont icon-kefu"></i>
        <div class="name">客服</div>
        <div class="fontclass">.icon-kefu</div>
      </li>

      <li>
        <i class="icon iconfont icon-tianjia3"></i>
        <div class="name">添加</div>
        <div class="fontclass">.icon-tianjia3</div>
      </li>

      <li>
        <i class="icon iconfont icon-shouye1"></i>
        <div class="name">首页</div>
        <div class="fontclass">.icon-shouye1</div>
      </li>

      <li>
        <i class="icon iconfont icon-rili"></i>
        <div class="name">日历</div>
        <div class="fontclass">.icon-rili</div>
      </li>

      <li>
        <i class="icon iconfont icon-liebiao1"></i>
        <div class="name">列表</div>
        <div class="fontclass">.icon-liebiao1</div>
      </li>

      <li>
        <i class="icon iconfont icon-saomiaoerweima"></i>
        <div class="name">扫描二维码</div>
        <div class="fontclass">.icon-saomiaoerweima</div>
      </li>

      <li>
        <i class="icon iconfont icon-danxuan"></i>
        <div class="name">单选</div>
        <div class="fontclass">.icon-danxuan</div>
      </li>

      <li>
        <i class="icon iconfont icon-gouwuche1"></i>
        <div class="name">购物车</div>
        <div class="fontclass">.icon-gouwuche1</div>
      </li>

      <li>
        <i class="icon iconfont icon-shizhongfill"></i>
        <div class="name">时钟-fill</div>
        <div class="fontclass">.icon-shizhongfill</div>
      </li>

      <li>
        <i class="icon iconfont icon-gouxuan1"></i>
        <div class="name">勾选</div>
        <div class="fontclass">.icon-gouxuan1</div>
      </li>

      <li>
        <i class="icon iconfont icon-bangdingshouji"></i>
        <div class="name">绑定手机</div>
        <div class="fontclass">.icon-bangdingshouji</div>
      </li>

      <li>
        <i class="icon iconfont icon-74wodedingdan"></i>
        <div class="name">我的订单</div>
        <div class="fontclass">.icon-74wodedingdan</div>
      </li>

      <li>
        <i class="icon iconfont icon-iconfontarrows1"></i>
        <div class="name">下箭头</div>
        <div class="fontclass">.icon-iconfontarrows1</div>
      </li>

      <li>
        <i class="icon iconfont icon-iconfontarrows"></i>
        <div class="name">下箭头</div>
        <div class="fontclass">.icon-iconfontarrows</div>
      </li>

      <li>
        <i class="icon iconfont icon-iconfonti"></i>
        <div class="name">右箭头</div>
        <div class="fontclass">.icon-iconfonti</div>
      </li>

      <li>
        <i class="icon iconfont icon-iconfonticonfonti2copycopy"></i>
        <div class="name">右箭头</div>
        <div class="fontclass">.icon-iconfonticonfonti2copycopy</div>
      </li>

      <li>
        <i class="icon iconfont icon-danxuankuang-copy"></i>
        <div class="name">单选框</div>
        <div class="fontclass">.icon-danxuankuang-copy</div>
      </li>

      <li>
        <i class="icon iconfont icon-weibiaoti1"></i>
        <div class="name">首页</div>
        <div class="fontclass">.icon-weibiaoti1</div>
      </li>

      <li>
        <i class="icon iconfont icon-huoweizhijian"></i>
        <div class="name">货位质检</div>
        <div class="fontclass">.icon-huoweizhijian</div>
      </li>

      <li>
        <i class="icon iconfont icon-fuzhi1"></i>
        <div class="name">复制</div>
        <div class="fontclass">.icon-fuzhi1</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhongzhi"></i>
        <div class="name">终止</div>
        <div class="fontclass">.icon-zhongzhi</div>
      </li>

      <li>
        <i class="icon iconfont icon-weibiaoti7"></i>
        <div class="name">上下转换</div>
        <div class="fontclass">.icon-weibiaoti7</div>
      </li>

      <li>
        <i class="icon iconfont icon-weibiaoti38"></i>
        <div class="name">圆</div>
        <div class="fontclass">.icon-weibiaoti38</div>
      </li>

      <li>
        <i class="icon iconfont icon-weibiaoti40"></i>
        <div class="name">右箭头</div>
        <div class="fontclass">.icon-weibiaoti40</div>
      </li>

      <li>
        <i class="icon iconfont icon-youjiantou4"></i>
        <div class="name">右箭头</div>
        <div class="fontclass">.icon-youjiantou4</div>
      </li>

      <li>
        <i class="icon iconfont icon-fahuo"></i>
        <div class="name">发货</div>
        <div class="fontclass">.icon-fahuo</div>
      </li>

      <li>
        <i class="icon iconfont icon-xiaoxi"></i>
        <div class="name">消息</div>
        <div class="fontclass">.icon-xiaoxi</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhiding"></i>
        <div class="name">置顶</div>
        <div class="fontclass">.icon-zhiding</div>
      </li>

      <li>
        <i class="icon iconfont icon-liebiaolist36"></i>
        <div class="name">列表</div>
        <div class="fontclass">.icon-liebiaolist36</div>
      </li>

      <li>
        <i class="icon iconfont icon-yuancircle46"></i>
        <div class="name">圆</div>
        <div class="fontclass">.icon-yuancircle46</div>
      </li>

      <li>
        <i class="icon iconfont icon-zitifont5"></i>
        <div class="name">字体</div>
        <div class="fontclass">.icon-zitifont5</div>
      </li>

      <li>
        <i class="icon iconfont icon-zitifont6"></i>
        <div class="name">字体</div>
        <div class="fontclass">.icon-zitifont6</div>
      </li>

      <li>
        <i class="icon iconfont icon-liebiaolist29"></i>
        <div class="name">列表</div>
        <div class="fontclass">.icon-liebiaolist29</div>
      </li>

      <li>
        <i class="icon iconfont icon-liebiaolist46"></i>
        <div class="name">列表</div>
        <div class="fontclass">.icon-liebiaolist46</div>
      </li>

      <li>
        <i class="icon iconfont icon-churuliushuichaxun"></i>
        <div class="name">出入流水查询</div>
        <div class="fontclass">.icon-churuliushuichaxun</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon21"></i>
        <div class="name">密码</div>
        <div class="fontclass">.icon-icon21</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhuanyi"></i>
        <div class="name">转移</div>
        <div class="fontclass">.icon-zhuanyi</div>
      </li>

      <li>
        <i class="icon iconfont icon-fenpei1"></i>
        <div class="name">分配</div>
        <div class="fontclass">.icon-fenpei1</div>
      </li>

      <li>
        <i class="icon iconfont icon-xiaoxi1"></i>
        <div class="name">消息</div>
        <div class="fontclass">.icon-xiaoxi1</div>
      </li>

      <li>
        <i class="icon iconfont icon-tongji1"></i>
        <div class="name">ZS统计1</div>
        <div class="fontclass">.icon-tongji1</div>
      </li>

      <li>
        <i class="icon iconfont icon-yuangou"></i>
        <div class="name">ZS圆勾</div>
        <div class="fontclass">.icon-yuangou</div>
      </li>

      <li>
        <i class="icon iconfont icon-xiangxiajiantou"></i>
        <div class="name">31-向下箭头</div>
        <div class="fontclass">.icon-xiangxiajiantou</div>
      </li>

      <li>
        <i class="icon iconfont icon-merge"></i>
        <div class="name">合并</div>
        <div class="fontclass">.icon-merge</div>
      </li>

      <li>
        <i class="icon iconfont icon-yuanquanjiahao"></i>
        <div class="name">加号（圆圈）</div>
        <div class="fontclass">.icon-yuanquanjiahao</div>
      </li>

      <li>
        <i class="icon iconfont icon-chongzhi"></i>
        <div class="name">重置</div>
        <div class="fontclass">.icon-chongzhi</div>
      </li>

      <li>
        <i class="icon iconfont icon-jiaochacross78"></i>
        <div class="name">交叉_cross78</div>
        <div class="fontclass">.icon-jiaochacross78</div>
      </li>

      <li>
        <i class="icon iconfont icon-jiaochacross80"></i>
        <div class="name">交叉_cross80</div>
        <div class="fontclass">.icon-jiaochacross80</div>
      </li>

      <li>
        <i class="icon iconfont icon-yuancircle92"></i>
        <div class="name">圆_circle92</div>
        <div class="fontclass">.icon-yuancircle92</div>
      </li>

      <li>
        <i class="icon iconfont icon-yuanxingdecircular225"></i>
        <div class="name">圆形的_circular225</div>
        <div class="fontclass">.icon-yuanxingdecircular225</div>
      </li>

      <li>
        <i class="icon iconfont icon-weixin"></i>
        <div class="name">微信</div>
        <div class="fontclass">.icon-weixin</div>
      </li>

      <li>
        <i class="icon iconfont icon-dingdan"></i>
        <div class="name">订单</div>
        <div class="fontclass">.icon-dingdan</div>
      </li>

      <li>
        <i class="icon iconfont icon-shouji1"></i>
        <div class="name">手机</div>
        <div class="fontclass">.icon-shouji1</div>
      </li>

      <li>
        <i class="icon iconfont icon-xingxing"></i>
        <div class="name">星星</div>
        <div class="fontclass">.icon-xingxing</div>
      </li>

      <li>
        <i class="icon iconfont icon-xingxu"></i>
        <div class="name">星_虚</div>
        <div class="fontclass">.icon-xingxu</div>
      </li>

      <li>
        <i class="icon iconfont icon-gouwuche2"></i>
        <div class="name">购物车</div>
        <div class="fontclass">.icon-gouwuche2</div>
      </li>

      <li>
        <i class="icon iconfont icon-ren"></i>
        <div class="name">人</div>
        <div class="fontclass">.icon-ren</div>
      </li>

      <li>
        <i class="icon iconfont icon-gouxuan2"></i>
        <div class="name">勾选</div>
        <div class="fontclass">.icon-gouxuan2</div>
      </li>

      <li>
        <i class="icon iconfont icon-feiji1"></i>
        <div class="name">飞机</div>
        <div class="fontclass">.icon-feiji1</div>
      </li>

      <li>
        <i class="icon iconfont icon-shouji2"></i>
        <div class="name">手机</div>
        <div class="fontclass">.icon-shouji2</div>
      </li>

      <li>
        <i class="icon iconfont icon-yduigouxuan"></i>
        <div class="name">YDUI-勾选</div>
        <div class="fontclass">.icon-yduigouxuan</div>
      </li>

      <li>
        <i class="icon iconfont icon-chaigai"></i>
        <div class="name">拆改</div>
        <div class="fontclass">.icon-chaigai</div>
      </li>

      <li>
        <i class="icon iconfont icon-danxuankuang"></i>
        <div class="name">单选框</div>
        <div class="fontclass">.icon-danxuankuang</div>
      </li>

      <li>
        <i class="icon iconfont icon-yuandianxiao"></i>
        <div class="name">圆点小</div>
        <div class="fontclass">.icon-yuandianxiao</div>
      </li>

      <li>
        <i class="icon iconfont icon-yuandianzhong"></i>
        <div class="name">圆点中</div>
        <div class="fontclass">.icon-yuandianzhong</div>
      </li>

      <li>
        <i class="icon iconfont icon-shouye2"></i>
        <div class="name">首页</div>
        <div class="fontclass">.icon-shouye2</div>
      </li>

      <li>
        <i class="icon iconfont icon-chuku"></i>
        <div class="name">出库</div>
        <div class="fontclass">.icon-chuku</div>
      </li>

      <li>
        <i class="icon iconfont icon-renminbicaiwuzhifu"></i>
        <div class="name">人民币 财务 支付</div>
        <div class="fontclass">.icon-renminbicaiwuzhifu</div>
      </li>

      <li>
        <i class="icon iconfont icon-shangpingouwudai2"></i>
        <div class="name">商品 购物袋2</div>
        <div class="fontclass">.icon-shangpingouwudai2</div>
      </li>

      <li>
        <i class="icon iconfont icon-baogaofenpei"></i>
        <div class="name">报告分配</div>
        <div class="fontclass">.icon-baogaofenpei</div>
      </li>

      <li>
        <i class="icon iconfont icon-shanchuguanbicha2"></i>
        <div class="name">删除关闭 叉2</div>
        <div class="fontclass">.icon-shanchuguanbicha2</div>
      </li>

      <li>
        <i class="icon iconfont icon-tianjiajiahaowubiankuang"></i>
        <div class="name">添加 加号 无边框</div>
        <div class="fontclass">.icon-tianjiajiahaowubiankuang</div>
      </li>

      <li>
        <i class="icon iconfont icon-yuandianzhong1"></i>
        <div class="name">圆点中</div>
        <div class="fontclass">.icon-yuandianzhong1</div>
      </li>

      <li>
        <i class="icon iconfont icon-xinjian1"></i>
        <div class="name">新建</div>
        <div class="fontclass">.icon-xinjian1</div>
      </li>

      <li>
        <i class="icon iconfont icon-dayin2"></i>
        <div class="name">打印</div>
        <div class="fontclass">.icon-dayin2</div>
      </li>

      <li>
        <i class="icon iconfont icon-biaoti"></i>
        <div class="name">标题</div>
        <div class="fontclass">.icon-biaoti</div>
      </li>

      <li>
        <i class="icon iconfont icon-rili1"></i>
        <div class="name">日历</div>
        <div class="fontclass">.icon-rili1</div>
      </li>

      <li>
        <i class="icon iconfont icon-fuxuan"></i>
        <div class="name">复选</div>
        <div class="fontclass">.icon-fuxuan</div>
      </li>

      <li>
        <i class="icon iconfont icon-zan3"></i>
        <div class="name">赞</div>
        <div class="fontclass">.icon-zan3</div>
      </li>

      <li>
        <i class="icon iconfont icon-liulan"></i>
        <div class="name">浏览</div>
        <div class="fontclass">.icon-liulan</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon-service"></i>
        <div class="name">客服电话</div>
        <div class="fontclass">.icon-icon-service</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon-transfer"></i>
        <div class="name">调拨</div>
        <div class="fontclass">.icon-icon-transfer</div>
      </li>

      <li>
        <i class="icon iconfont icon-chaku"></i>
        <div class="name">查库</div>
        <div class="fontclass">.icon-chaku</div>
      </li>

      <li>
        <i class="icon iconfont icon-chaxun"></i>
        <div class="name">查询</div>
        <div class="fontclass">.icon-chaxun</div>
      </li>

      <li>
        <i class="icon iconfont icon-shanchu11"></i>
        <div class="name">删除 (1)</div>
        <div class="fontclass">.icon-shanchu11</div>
      </li>

      <li>
        <i class="icon iconfont icon-ai-list"></i>
        <div class="name">列表</div>
        <div class="fontclass">.icon-ai-list</div>
      </li>

      <li>
        <i class="icon iconfont icon-ai-pay-copy"></i>
        <div class="name">银联</div>
        <div class="fontclass">.icon-ai-pay-copy</div>
      </li>

      <li>
        <i class="icon iconfont icon-tuisong2"></i>
        <div class="name">推送</div>
        <div class="fontclass">.icon-tuisong2</div>
      </li>

      <li>
        <i class="icon iconfont icon-wuxing"></i>
        <div class="name">五星</div>
        <div class="fontclass">.icon-wuxing</div>
      </li>

      <li>
        <i class="icon iconfont icon-chuku-copy"></i>
        <div class="name">仓库</div>
        <div class="fontclass">.icon-chuku-copy</div>
      </li>

      <li>
        <i class="icon iconfont icon-renzheng"></i>
        <div class="name">认证</div>
        <div class="fontclass">.icon-renzheng</div>
      </li>

      <li>
        <i class="icon iconfont icon-guanbi5"></i>
        <div class="name">单选</div>
        <div class="fontclass">.icon-guanbi5</div>
      </li>

      <li>
        <i class="icon iconfont icon-guanbi4"></i>
        <div class="name">已完成/加载成功</div>
        <div class="fontclass">.icon-guanbi4</div>
      </li>

      <li>
        <i class="icon iconfont icon-dianhua3"></i>
        <div class="name">电话</div>
        <div class="fontclass">.icon-dianhua3</div>
      </li>

      <li>
        <i class="icon iconfont icon-chuku1"></i>
        <div class="name">出库</div>
        <div class="fontclass">.icon-chuku1</div>
      </li>

      <li>
        <i class="icon iconfont icon-ruku1"></i>
        <div class="name">入库</div>
        <div class="fontclass">.icon-ruku1</div>
      </li>

      <li>
        <i class="icon iconfont icon-pandian"></i>
        <div class="name">盘点</div>
        <div class="fontclass">.icon-pandian</div>
      </li>

      <li>
        <i class="icon iconfont icon-goods"></i>
        <div class="name">商品</div>
        <div class="fontclass">.icon-goods</div>
      </li>

      <li>
        <i class="icon iconfont icon-date-1"></i>
        <div class="name">时间选择</div>
        <div class="fontclass">.icon-date-1</div>
      </li>

      <li>
        <i class="icon iconfont icon-kaiqihuodong"></i>
        <div class="name">开启活动</div>
        <div class="fontclass">.icon-kaiqihuodong</div>
      </li>

      <li>
        <i class="icon iconfont icon-toolbar-car"></i>
        <div class="name">送货到家</div>
        <div class="fontclass">.icon-toolbar-car</div>
      </li>

      <li>
        <i class="icon iconfont icon-chaifen"></i>
        <div class="name">拆分</div>
        <div class="fontclass">.icon-chaifen</div>
      </li>

      <li>
        <i class="icon iconfont icon-hebing"></i>
        <div class="name">合并</div>
        <div class="fontclass">.icon-hebing</div>
      </li>

      <li>
        <i class="icon iconfont icon-yuancircle94"></i>
        <div class="name">圆_circle94</div>
        <div class="fontclass">.icon-yuancircle94</div>
      </li>

      <li>
        <i class="icon iconfont icon-cf-c63"></i>
        <div class="name">调拨管理</div>
        <div class="fontclass">.icon-cf-c63</div>
      </li>

      <li>
        <i class="icon iconfont icon-cf-c65"></i>
        <div class="name">明细表</div>
        <div class="fontclass">.icon-cf-c65</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon05"></i>
        <div class="name">审批</div>
        <div class="fontclass">.icon-icon05</div>
      </li>

      <li>
        <i class="icon iconfont icon-fukuan"></i>
        <div class="name">付款</div>
        <div class="fontclass">.icon-fukuan</div>
      </li>

      <li>
        <i class="icon iconfont icon-kehufenpei"></i>
        <div class="name">客户分配</div>
        <div class="fontclass">.icon-kehufenpei</div>
      </li>

      <li>
        <i class="icon iconfont icon-saomiao21"></i>
        <div class="name">扫描2</div>
        <div class="fontclass">.icon-saomiao21</div>
      </li>

      <li>
        <i class="icon iconfont yrt-fuzhi2"></i>
        <div class="name">复制</div>
        <div class="fontclass">.yrt-fuzhi2</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon2"></i>
        <div class="name">浏览</div>
        <div class="fontclass">.icon-icon2</div>
      </li>

      <li>
        <i class="icon iconfont icon-sanjiaodown"></i>
        <div class="name">下箭头</div>
        <div class="fontclass">.icon-sanjiaodown</div>
      </li>

      <li>
        <i class="icon iconfont icon-sanjiaoright"></i>
        <div class="name">右箭头</div>
        <div class="fontclass">.icon-sanjiaoright</div>
      </li>

      <li>
        <i class="icon iconfont icon-tongji3"></i>
        <div class="name">统计3</div>
        <div class="fontclass">.icon-tongji3</div>
      </li>

      <li>
        <i class="icon iconfont icon-liebiao2"></i>
        <div class="name">列表</div>
        <div class="fontclass">.icon-liebiao2</div>
      </li>

      <li>
        <i class="icon iconfont icon-shenpi4"></i>
        <div class="name">审批</div>
        <div class="fontclass">.icon-shenpi4</div>
      </li>

      <li>
        <i class="icon iconfont icon-shenpi5"></i>
        <div class="name">审批</div>
        <div class="fontclass">.icon-shenpi5</div>
      </li>

      <li>
        <i class="icon iconfont icon-ai-password"></i>
        <div class="name">密码</div>
        <div class="fontclass">.icon-ai-password</div>
      </li>

      <li>
        <i class="icon iconfont icon-fenpeixiangmu"></i>
        <div class="name">分配项目</div>
        <div class="fontclass">.icon-fenpeixiangmu</div>
      </li>

      <li>
        <i class="icon iconfont icon-chaxun1"></i>
        <div class="name">查询</div>
        <div class="fontclass">.icon-chaxun1</div>
      </li>

      <li>
        <i class="icon iconfont icon-ai-connection"></i>
        <div class="name">人脉</div>
        <div class="fontclass">.icon-ai-connection</div>
      </li>

      <li>
        <i class="icon iconfont icon-kucunchaxun"></i>
        <div class="name">库存查询</div>
        <div class="fontclass">.icon-kucunchaxun</div>
      </li>

      <li>
        <i class="icon iconfont icon-iconfontchaxun"></i>
        <div class="name">查询</div>
        <div class="fontclass">.icon-iconfontchaxun</div>
      </li>

      <li>
        <i class="icon iconfont icon-jiaochacross79"></i>
        <div class="name">交叉_cross79</div>
        <div class="fontclass">.icon-jiaochacross79</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhongzhiicon"></i>
        <div class="name">终止icon</div>
        <div class="fontclass">.icon-zhongzhiicon</div>
      </li>

      <li>
        <i class="icon iconfont icon-bangdingshouji01"></i>
        <div class="name">绑定手机-01</div>
        <div class="fontclass">.icon-bangdingshouji01</div>
      </li>

      <li>
        <i class="icon iconfont icon-jinxingzhong"></i>
        <div class="name">进行中</div>
        <div class="fontclass">.icon-jinxingzhong</div>
      </li>

      <li>
        <i class="icon iconfont icon-untitled96"></i>
        <div class="name">背景实心叉</div>
        <div class="fontclass">.icon-untitled96</div>
      </li>

      <li>
        <i class="icon iconfont icon-saomiao7"></i>
        <div class="name">扫描</div>
        <div class="fontclass">.icon-saomiao7</div>
      </li>

      <li>
        <i class="icon iconfont icon-dingwei3"></i>
        <div class="name">定位</div>
        <div class="fontclass">.icon-dingwei3</div>
      </li>

      <li>
        <i class="icon iconfont icon-tupian"></i>
        <div class="name">图片</div>
        <div class="fontclass">.icon-tupian</div>
      </li>

      <li>
        <i class="icon iconfont icon-feiji2"></i>
        <div class="name">飞机</div>
        <div class="fontclass">.icon-feiji2</div>
      </li>

      <li>
        <i class="icon iconfont icon-anquansaomiao"></i>
        <div class="name">安全扫描</div>
        <div class="fontclass">.icon-anquansaomiao</div>
      </li>

      <li>
        <i class="icon iconfont icon-yujingtongji"></i>
        <div class="name">预警统计</div>
        <div class="fontclass">.icon-yujingtongji</div>
      </li>

      <li>
        <i class="icon iconfont icon-xialakuang"></i>
        <div class="name">下拉框</div>
        <div class="fontclass">.icon-xialakuang</div>
      </li>

      <li>
        <i class="icon iconfont icon-yinlian1193427easyiconnet"></i>
        <div class="name">银联</div>
        <div class="fontclass">.icon-yinlian1193427easyiconnet</div>
      </li>

      <li>
        <i class="icon iconfont icon-danxuanfuxuan"></i>
        <div class="name">单选-复选</div>
        <div class="fontclass">.icon-danxuanfuxuan</div>
      </li>

      <li>
        <i class="icon iconfont icon-liudongzijintubiao22"></i>
        <div class="name">流动资金图标</div>
        <div class="fontclass">.icon-liudongzijintubiao22</div>
      </li>

      <li>
        <i class="icon iconfont icon-cangku1"></i>
        <div class="name">仓库</div>
        <div class="fontclass">.icon-cangku1</div>
      </li>

      <li>
        <i class="icon iconfont icon-cangchuguanli"></i>
        <div class="name">仓储管理</div>
        <div class="fontclass">.icon-cangchuguanli</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhifubao1"></i>
        <div class="name">支付宝</div>
        <div class="fontclass">.icon-zhifubao1</div>
      </li>

      <li>
        <i class="icon iconfont icon-weixin2"></i>
        <div class="name">微信</div>
        <div class="fontclass">.icon-weixin2</div>
      </li>

      <li>
        <i class="icon iconfont icon-fenpei2"></i>
        <div class="name">分配</div>
        <div class="fontclass">.icon-fenpei2</div>
      </li>

      <li>
        <i class="icon iconfont icon-youxianzijin"></i>
        <div class="name">优先资金</div>
        <div class="fontclass">.icon-youxianzijin</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhihuiliangkuhuoweiguanli"></i>
        <div class="name">智慧粮库－货位管理</div>
        <div class="fontclass">.icon-zhihuiliangkuhuoweiguanli</div>
      </li>

      <li>
        <i class="icon iconfont icon-dianhua21"></i>
        <div class="name">电话 (2)</div>
        <div class="fontclass">.icon-dianhua21</div>
      </li>

      <li>
        <i class="icon iconfont icon-pan"></i>
        <div class="name">盘</div>
        <div class="fontclass">.icon-pan</div>
      </li>

      <li>
        <i class="icon iconfont icon-querenshouhuo"></i>
        <div class="name">确认收货</div>
        <div class="fontclass">.icon-querenshouhuo</div>
      </li>

      <li>
        <i class="icon iconfont icon-bianhaozhuanyi"></i>
        <div class="name">编号转移</div>
        <div class="fontclass">.icon-bianhaozhuanyi</div>
      </li>

      <li>
        <i class="icon iconfont icon-shanchu4"></i>
        <div class="name">删除</div>
        <div class="fontclass">.icon-shanchu4</div>
      </li>

      <li>
        <i class="icon iconfont icon-daishouhuo"></i>
        <div class="name">待收货</div>
        <div class="fontclass">.icon-daishouhuo</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon"></i>
        <div class="name">扫码</div>
        <div class="fontclass">.icon-icon</div>
      </li>

      <li>
        <i class="icon iconfont icon-dianhua4"></i>
        <div class="name">电话</div>
        <div class="fontclass">.icon-dianhua4</div>
      </li>

      <li>
        <i class="icon iconfont icon-daochu1"></i>
        <div class="name">导出</div>
        <div class="fontclass">.icon-daochu1</div>
      </li>

      <li>
        <i class="icon iconfont icon-weixin3"></i>
        <div class="name">微信</div>
        <div class="fontclass">.icon-weixin3</div>
      </li>

      <li>
        <i class="icon iconfont icon-delivery-truck"></i>
        <div class="name">送货货车</div>
        <div class="fontclass">.icon-delivery-truck</div>
      </li>

      <li>
        <i class="icon iconfont icon-zantingzijincunqu"></i>
        <div class="name">暂停资金存取</div>
        <div class="fontclass">.icon-zantingzijincunqu</div>
      </li>

      <li>
        <i class="icon iconfont icon-kaitongwangshangjiaoyi"></i>
        <div class="name">开通网上交易</div>
        <div class="fontclass">.icon-kaitongwangshangjiaoyi</div>
      </li>

      <li>
        <i class="icon iconfont icon-suodingkucun01"></i>
        <div class="name">锁定库存</div>
        <div class="fontclass">.icon-suodingkucun01</div>
      </li>

      <li>
        <i class="icon iconfont icon-shouye3"></i>
        <div class="name">首页</div>
        <div class="fontclass">.icon-shouye3</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhaohuizijinhao01"></i>
        <div class="name">资金纪录</div>
        <div class="fontclass">.icon-zhaohuizijinhao01</div>
      </li>

      <li>
        <i class="icon iconfont icon-piliangtianjia1"></i>
        <div class="name">批量添加</div>
        <div class="fontclass">.icon-piliangtianjia1</div>
      </li>

      <li>
        <i class="icon iconfont icon-ruku2"></i>
        <div class="name">入库</div>
        <div class="fontclass">.icon-ruku2</div>
      </li>

      <li>
        <i class="icon iconfont icon-iconfontcustomize"></i>
        <div class="name">自定义</div>
        <div class="fontclass">.icon-iconfontcustomize</div>
      </li>

      <li>
        <i class="icon iconfont icon-iconfontpaishe"></i>
        <div class="name">拍摄扫描</div>
        <div class="fontclass">.icon-iconfontpaishe</div>
      </li>

      <li>
        <i class="icon iconfont icon-yigouxuan"></i>
        <div class="name">已勾选</div>
        <div class="fontclass">.icon-yigouxuan</div>
      </li>

      <li>
        <i class="icon iconfont icon-kuaididangenzong"></i>
        <div class="name">快递单跟踪</div>
        <div class="fontclass">.icon-kuaididangenzong</div>
      </li>

      <li>
        <i class="icon iconfont icon-dingdan1"></i>
        <div class="name">订单</div>
        <div class="fontclass">.icon-dingdan1</div>
      </li>

      <li>
        <i class="icon iconfont yrt-chaxun2"></i>
        <div class="name">查询</div>
        <div class="fontclass">.yrt-chaxun2</div>
      </li>

      <li>
        <i class="icon iconfont icon-payment"></i>
        <div class="name">付款</div>
        <div class="fontclass">.icon-payment</div>
      </li>

      <li>
        <i class="icon iconfont icon-shangpinruku"></i>
        <div class="name">商品入库</div>
        <div class="fontclass">.icon-shangpinruku</div>
      </li>

      <li>
        <i class="icon iconfont icon-mima"></i>
        <div class="name">密码</div>
        <div class="fontclass">.icon-mima</div>
      </li>

      <li>
        <i class="icon iconfont icon-shouhuodizhi"></i>
        <div class="name">收货地址</div>
        <div class="fontclass">.icon-shouhuodizhi</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhuanjifenshimingrenzheng"></i>
        <div class="name">积分商城-实名认证</div>
        <div class="fontclass">.icon-zhuanjifenshimingrenzheng</div>
      </li>

      <li>
        <i class="icon iconfont icon-xingji"></i>
        <div class="name">星级</div>
        <div class="fontclass">.icon-xingji</div>
      </li>

      <li>
        <i class="icon iconfont icon-paizhao1"></i>
        <div class="name">拍照</div>
        <div class="fontclass">.icon-paizhao1</div>
      </li>

      <li>
        <i class="icon iconfont icon-tucenggouxuan"></i>
        <div class="name">勾选</div>
        <div class="fontclass">.icon-tucenggouxuan</div>
      </li>

      <li>
        <i class="icon iconfont icon-shangjiantou"></i>
        <div class="name">上箭头</div>
        <div class="fontclass">.icon-shangjiantou</div>
      </li>

      <li>
        <i class="icon iconfont icon-jiarugouwuche"></i>
        <div class="name">加入购物车</div>
        <div class="fontclass">.icon-jiarugouwuche</div>
      </li>

      <li>
        <i class="icon iconfont icon-zan4"></i>
        <div class="name">赞</div>
        <div class="fontclass">.icon-zan4</div>
      </li>

      <li>
        <i class="icon iconfont icon-top01"></i>
        <div class="name">置顶</div>
        <div class="fontclass">.icon-top01</div>
      </li>

      <li>
        <i class="icon iconfont icon-gouwuche3"></i>
        <div class="name">购物车</div>
        <div class="fontclass">.icon-gouwuche3</div>
      </li>

      <li>
        <i class="icon iconfont icon-wuxing1"></i>
        <div class="name">五星</div>
        <div class="fontclass">.icon-wuxing1</div>
      </li>

      <li>
        <i class="icon iconfont icon-shouhuo"></i>
        <div class="name">收货</div>
        <div class="fontclass">.icon-shouhuo</div>
      </li>

      <li>
        <i class="icon iconfont icon-shujuguanlisvg42"></i>
        <div class="name">盘管</div>
        <div class="fontclass">.icon-shujuguanlisvg42</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhongzhi1"></i>
        <div class="name">终止</div>
        <div class="fontclass">.icon-zhongzhi1</div>
      </li>

      <li>
        <i class="icon iconfont icon-weixin-copy"></i>
        <div class="name">微信</div>
        <div class="fontclass">.icon-weixin-copy</div>
      </li>

      <li>
        <i class="icon iconfont icon-daishouhuo1"></i>
        <div class="name">待收货</div>
        <div class="fontclass">.icon-daishouhuo1</div>
      </li>

      <li>
        <i class="icon iconfont icon-daishouhuo2"></i>
        <div class="name">待收货</div>
        <div class="fontclass">.icon-daishouhuo2</div>
      </li>

      <li>
        <i class="icon iconfont icon-jianhuoguanli1"></i>
        <div class="name">拣货管理 (1)</div>
        <div class="fontclass">.icon-jianhuoguanli1</div>
      </li>

      <li>
        <i class="icon iconfont icon-dianhua5"></i>
        <div class="name">电话</div>
        <div class="fontclass">.icon-dianhua5</div>
      </li>

      <li>
        <i class="icon iconfont icon-xiangxiajiantou1"></i>
        <div class="name">向下箭头</div>
        <div class="fontclass">.icon-xiangxiajiantou1</div>
      </li>

      <li>
        <i class="icon iconfont icon-chai"></i>
        <div class="name">拆</div>
        <div class="fontclass">.icon-chai</div>
      </li>

      <li>
        <i class="icon iconfont icon-ai247"></i>
        <div class="name">字体</div>
        <div class="fontclass">.icon-ai247</div>
      </li>

      <li>
        <i class="icon iconfont icon-iconplsd"></i>
        <div class="name">批量+</div>
        <div class="fontclass">.icon-iconplsd</div>
      </li>

      <li>
        <i class="icon iconfont icon-iconddsho"></i>
        <div class="name">确认收货</div>
        <div class="fontclass">.icon-iconddsho</div>
      </li>

      <li>
        <i class="icon iconfont icon-fahuo1"></i>
        <div class="name">发货</div>
        <div class="fontclass">.icon-fahuo1</div>
      </li>

      <li>
        <i class="icon iconfont icon-dabao"></i>
        <div class="name">打包</div>
        <div class="fontclass">.icon-dabao</div>
      </li>

      <li>
        <i class="icon iconfont icon-shanchuyixuanqunchengyuanchacha"></i>
        <div class="name">删除已选群成员-叉叉</div>
        <div class="fontclass">.icon-shanchuyixuanqunchengyuanchacha</div>
      </li>

      <li>
        <i class="icon iconfont icon-saomiaoxinxi"></i>
        <div class="name">扫描信息</div>
        <div class="fontclass">.icon-saomiaoxinxi</div>
      </li>

      <li>
        <i class="icon iconfont icon-tupian1"></i>
        <div class="name">图片</div>
        <div class="fontclass">.icon-tupian1</div>
      </li>

      <li>
        <i class="icon iconfont icon-jinxingzhong1"></i>
        <div class="name">进行中</div>
        <div class="fontclass">.icon-jinxingzhong1</div>
      </li>

      <li>
        <i class="icon iconfont icon-youjiantou"></i>
        <div class="name">右箭头</div>
        <div class="fontclass">.icon-youjiantou</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhuanyi11"></i>
        <div class="name">转移</div>
        <div class="fontclass">.icon-zhuanyi11</div>
      </li>

      <li>
        <i class="icon iconfont icon-wo"></i>
        <div class="name">人</div>
        <div class="fontclass">.icon-wo</div>
      </li>

      <li>
        <i class="icon iconfont icon-service"></i>
        <div class="name">客服</div>
        <div class="fontclass">.icon-service</div>
      </li>

      <li>
        <i class="icon iconfont icon-kefu2"></i>
        <div class="name">客服</div>
        <div class="fontclass">.icon-kefu2</div>
      </li>

      <li>
        <i class="icon iconfont icon-Id"></i>
        <div class="name">身份证</div>
        <div class="fontclass">.icon-Id</div>
      </li>

      <li>
        <i class="icon iconfont icon-youjiantou5"></i>
        <div class="name">右箭头</div>
        <div class="fontclass">.icon-youjiantou5</div>
      </li>

      <li>
        <i class="icon iconfont icon-liulan1"></i>
        <div class="name">浏览</div>
        <div class="fontclass">.icon-liulan1</div>
      </li>

      <li>
        <i class="icon iconfont icon-gouxuan3"></i>
        <div class="name">勾选</div>
        <div class="fontclass">.icon-gouxuan3</div>
      </li>

      <li>
        <i class="icon iconfont icon-yuan"></i>
        <div class="name">圆</div>
        <div class="fontclass">.icon-yuan</div>
      </li>

      <li>
        <i class="icon iconfont icon-wenjianjia1"></i>
        <div class="name">文件夹</div>
        <div class="fontclass">.icon-wenjianjia1</div>
      </li>

      <li>
        <i class="icon iconfont icon-asterisks-1-copy"></i>
        <div class="name">星号</div>
        <div class="fontclass">.icon-asterisks-1-copy</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhongzhihuodong"></i>
        <div class="name">终止活动</div>
        <div class="fontclass">.icon-zhongzhihuodong</div>
      </li>

      <li>
        <i class="icon iconfont icon-shenpi6"></i>
        <div class="name">审批</div>
        <div class="fontclass">.icon-shenpi6</div>
      </li>

      <li>
        <i class="icon iconfont icon-haofangtuo400iconfontpai"></i>
        <div class="name">好房拓 4.0.0 iconfont_派</div>
        <div class="fontclass">.icon-haofangtuo400iconfontpai</div>
      </li>

      <li>
        <i class="icon iconfont icon-renzhengshangjia"></i>
        <div class="name">认证商家</div>
        <div class="fontclass">.icon-renzhengshangjia</div>
      </li>

      <li>
        <i class="icon iconfont icon-shenfenzheng"></i>
        <div class="name">身份证</div>
        <div class="fontclass">.icon-shenfenzheng</div>
      </li>

      <li>
        <i class="icon iconfont icon-yingfeng"></i>
        <div class="name">盈峰</div>
        <div class="fontclass">.icon-yingfeng</div>
      </li>

      <li>
        <i class="icon iconfont icon-gouxuan4"></i>
        <div class="name">勾选</div>
        <div class="fontclass">.icon-gouxuan4</div>
      </li>

      <li>
        <i class="icon iconfont icon-fenpei3"></i>
        <div class="name">分配</div>
        <div class="fontclass">.icon-fenpei3</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon_cut"></i>
        <div class="name">减少</div>
        <div class="fontclass">.icon-icon_cut</div>
      </li>

      <li>
        <i class="icon iconfont icon-chukumingxi"></i>
        <div class="name">出库明细</div>
        <div class="fontclass">.icon-chukumingxi</div>
      </li>

      <li>
        <i class="icon iconfont icon-saomiao8"></i>
        <div class="name">扫描</div>
        <div class="fontclass">.icon-saomiao8</div>
      </li>

      <li>
        <i class="icon iconfont icon-dayin3"></i>
        <div class="name">打印</div>
        <div class="fontclass">.icon-dayin3</div>
      </li>

      <li>
        <i class="icon iconfont icon-daishouhuo3"></i>
        <div class="name">待收货</div>
        <div class="fontclass">.icon-daishouhuo3</div>
      </li>

      <li>
        <i class="icon iconfont icon-shanchu5"></i>
        <div class="name">删除</div>
        <div class="fontclass">.icon-shanchu5</div>
      </li>

      <li>
        <i class="icon iconfont icon-webicon301"></i>
        <div class="name">实名认证</div>
        <div class="fontclass">.icon-webicon301</div>
      </li>

      <li>
        <i class="icon iconfont icon-iconcheckbox1"></i>
        <div class="name">复选选中</div>
        <div class="fontclass">.icon-iconcheckbox1</div>
      </li>

      <li>
        <i class="icon iconfont icon-iconless"></i>
        <div class="name">减少</div>
        <div class="fontclass">.icon-iconless</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon234"></i>
        <div class="name">仓库</div>
        <div class="fontclass">.icon-icon234</div>
      </li>

      <li>
        <i class="icon iconfont icon-add"></i>
        <div class="name">添加</div>
        <div class="fontclass">.icon-add</div>
      </li>

      <li>
        <i class="icon iconfont icon-tuihuo3"></i>
        <div class="name">退货</div>
        <div class="fontclass">.icon-tuihuo3</div>
      </li>

      <li>
        <i class="icon iconfont icon-youjiantou6"></i>
        <div class="name">3.0-右箭头</div>
        <div class="fontclass">.icon-youjiantou6</div>
      </li>

      <li>
        <i class="icon iconfont icon-yiwancheng"></i>
        <div class="name">已完成</div>
        <div class="fontclass">.icon-yiwancheng</div>
      </li>

      <li>
        <i class="icon iconfont icon-zan5"></i>
        <div class="name">赞</div>
        <div class="fontclass">.icon-zan5</div>
      </li>

      <li>
        <i class="icon iconfont icon-saomiaoguanli"></i>
        <div class="name">下载</div>
        <div class="fontclass">.icon-saomiaoguanli</div>
      </li>

      <li>
        <i class="icon iconfont icon-invtaking"></i>
        <div class="name">盘点</div>
        <div class="fontclass">.icon-invtaking</div>
      </li>

      <li>
        <i class="icon iconfont icon-tuihuozhong"></i>
        <div class="name">退货中</div>
        <div class="fontclass">.icon-tuihuozhong</div>
      </li>

      <li>
        <i class="icon iconfont icon-shouji3"></i>
        <div class="name">手机</div>
        <div class="fontclass">.icon-shouji3</div>
      </li>

      <li>
        <i class="icon iconfont icon-qrcode-2"></i>
        <div class="name">扫描二维码</div>
        <div class="fontclass">.icon-qrcode-2</div>
      </li>

      <li>
        <i class="icon iconfont icon-mima1"></i>
        <div class="name">密码</div>
        <div class="fontclass">.icon-mima1</div>
      </li>

      <li>
        <i class="icon iconfont icon-liangfanzhuang"></i>
        <div class="name">打包</div>
        <div class="fontclass">.icon-liangfanzhuang</div>
      </li>

      <li>
        <i class="icon iconfont icon-saomiao31"></i>
        <div class="name">扫描3</div>
        <div class="fontclass">.icon-saomiao31</div>
      </li>

      <li>
        <i class="icon iconfont icon-renyuanjieshao"></i>
        <div class="name">人员介绍</div>
        <div class="fontclass">.icon-renyuanjieshao</div>
      </li>

      <li>
        <i class="icon iconfont icon-ren111"></i>
        <div class="name">人</div>
        <div class="fontclass">.icon-ren111</div>
      </li>

      <li>
        <i class="icon iconfont icon-2"></i>
        <div class="name">名片扫描</div>
        <div class="fontclass">.icon-2</div>
      </li>

      <li>
        <i class="icon iconfont icon-liulanjilusel"></i>
        <div class="name">浏览记录_sel</div>
        <div class="fontclass">.icon-liulanjilusel</div>
      </li>

      <li>
        <i class="icon iconfont icon-xinghao"></i>
        <div class="name">星号</div>
        <div class="fontclass">.icon-xinghao</div>
      </li>

      <li>
        <i class="icon iconfont icon-reset"></i>
        <div class="name">重置</div>
        <div class="fontclass">.icon-reset</div>
      </li>

      <li>
        <i class="icon iconfont icon-churuku"></i>
        <div class="name">出入库</div>
        <div class="fontclass">.icon-churuku</div>
      </li>

      <li>
        <i class="icon iconfont icon-jiance"></i>
        <div class="name">监测</div>
        <div class="fontclass">.icon-jiance</div>
      </li>

      <li>
        <i class="icon iconfont icon-shipan"></i>
        <div class="name">实盘</div>
        <div class="fontclass">.icon-shipan</div>
      </li>

      <li>
        <i class="icon iconfont icon-yuan1"></i>
        <div class="name">圆</div>
        <div class="fontclass">.icon-yuan1</div>
      </li>

      <li>
        <i class="icon iconfont icon-chaifen1"></i>
        <div class="name">拆分</div>
        <div class="fontclass">.icon-chaifen1</div>
      </li>

      <li>
        <i class="icon iconfont icon-chaifen2"></i>
        <div class="name">拆分</div>
        <div class="fontclass">.icon-chaifen2</div>
      </li>

      <li>
        <i class="icon iconfont icon-dingwei4"></i>
        <div class="name">定位</div>
        <div class="fontclass">.icon-dingwei4</div>
      </li>

      <li>
        <i class="icon iconfont icon-saoyisao-copy"></i>
        <div class="name">扫一扫</div>
        <div class="fontclass">.icon-saoyisao-copy</div>
      </li>

      <li>
        <i class="icon iconfont icon-shizhong"></i>
        <div class="name">时钟</div>
        <div class="fontclass">.icon-shizhong</div>
      </li>

      <li>
        <i class="icon iconfont icon-iconfontzhizuobiaozhun023147"></i>
        <div class="name">新</div>
        <div class="fontclass">.icon-iconfontzhizuobiaozhun023147</div>
      </li>

      <li>
        <i class="icon iconfont icon-gouwuche21"></i>
        <div class="name">购物车</div>
        <div class="fontclass">.icon-gouwuche21</div>
      </li>

      <li>
        <i class="icon iconfont icon-kuaidi1"></i>
        <div class="name">快递</div>
        <div class="fontclass">.icon-kuaidi1</div>
      </li>

      <li>
        <i class="icon iconfont icon-fenjianchuku"></i>
        <div class="name">分拣出库</div>
        <div class="fontclass">.icon-fenjianchuku</div>
      </li>

      <li>
        <i class="icon iconfont icon-fenjianruku"></i>
        <div class="name">分拣入库</div>
        <div class="fontclass">.icon-fenjianruku</div>
      </li>

      <li>
        <i class="icon iconfont icon-dingdangdaishimingrenzheng"></i>
        <div class="name">叮当贷-实名认证</div>
        <div class="fontclass">.icon-dingdangdaishimingrenzheng</div>
      </li>

      <li>
        <i class="icon iconfont icon-renyuan"></i>
        <div class="name">人员</div>
        <div class="fontclass">.icon-renyuan</div>
      </li>

      <li>
        <i class="icon iconfont icon-paizhao2"></i>
        <div class="name">拍照</div>
        <div class="fontclass">.icon-paizhao2</div>
      </li>

      <li>
        <i class="icon iconfont icon-shimingrenzheng"></i>
        <div class="name">实名认证</div>
        <div class="fontclass">.icon-shimingrenzheng</div>
      </li>

      <li>
        <i class="icon iconfont icon-kefurexian"></i>
        <div class="name">客服热线</div>
        <div class="fontclass">.icon-kefurexian</div>
      </li>

      <li>
        <i class="icon iconfont icon-dingwei5"></i>
        <div class="name">定位</div>
        <div class="fontclass">.icon-dingwei5</div>
      </li>

      <li>
        <i class="icon iconfont icon-saoyisao1"></i>
        <div class="name">扫一扫 (1)</div>
        <div class="fontclass">.icon-saoyisao1</div>
      </li>

      <li>
        <i class="icon iconfont icon-dingdangdaizijinliushui"></i>
        <div class="name">叮当贷-资金流水</div>
        <div class="fontclass">.icon-dingdangdaizijinliushui</div>
      </li>

      <li>
        <i class="icon iconfont icon-shen"></i>
        <div class="name">身份证</div>
        <div class="fontclass">.icon-shen</div>
      </li>

      <li>
        <i class="icon iconfont icon-msg"></i>
        <div class="name">消息</div>
        <div class="fontclass">.icon-msg</div>
      </li>

      <li>
        <i class="icon iconfont icon-tel"></i>
        <div class="name">电话</div>
        <div class="fontclass">.icon-tel</div>
      </li>

      <li>
        <i class="icon iconfont icon-clock"></i>
        <div class="name">时钟</div>
        <div class="fontclass">.icon-clock</div>
      </li>

      <li>
        <i class="icon iconfont icon-cir-cny"></i>
        <div class="name">环 人民币</div>
        <div class="fontclass">.icon-cir-cny</div>
      </li>

      <li>
        <i class="icon iconfont icon-solid-time"></i>
        <div class="name">时钟 实心</div>
        <div class="fontclass">.icon-solid-time</div>
      </li>

      <li>
        <i class="icon iconfont icon-kuaidi2"></i>
        <div class="name">快递</div>
        <div class="fontclass">.icon-kuaidi2</div>
      </li>

      <li>
        <i class="icon iconfont icon-scan-copy"></i>
        <div class="name">扫描</div>
        <div class="fontclass">.icon-scan-copy</div>
      </li>

      <li>
        <i class="icon iconfont icon-chengbenfenxi"></i>
        <div class="name">成本分析</div>
        <div class="fontclass">.icon-chengbenfenxi</div>
      </li>

      <li>
        <i class="icon iconfont icon-danxuan2"></i>
        <div class="name">单选2</div>
        <div class="fontclass">.icon-danxuan2</div>
      </li>

      <li>
        <i class="icon iconfont icon-xiaoxi2"></i>
        <div class="name">消息</div>
        <div class="fontclass">.icon-xiaoxi2</div>
      </li>

      <li>
        <i class="icon iconfont icon-mlfp"></i>
        <div class="name">目录分配</div>
        <div class="fontclass">.icon-mlfp</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhifubaozhifu"></i>
        <div class="name">支付宝支付</div>
        <div class="fontclass">.icon-zhifubaozhifu</div>
      </li>

      <li>
        <i class="icon iconfont icon-baocun2"></i>
        <div class="name">保存</div>
        <div class="fontclass">.icon-baocun2</div>
      </li>

      <li>
        <i class="icon iconfont icon-shenfenrenzheng"></i>
        <div class="name">身份认证</div>
        <div class="fontclass">.icon-shenfenrenzheng</div>
      </li>

      <li>
        <i class="icon iconfont icon-new1"></i>
        <div class="name">新人</div>
        <div class="fontclass">.icon-new1</div>
      </li>

      <li>
        <i class="icon iconfont icon-39kaiguankai2"></i>
        <div class="name">39开关开2</div>
        <div class="fontclass">.icon-39kaiguankai2</div>
      </li>

      <li>
        <i class="icon iconfont icon-xiaoxi3"></i>
        <div class="name">消息</div>
        <div class="fontclass">.icon-xiaoxi3</div>
      </li>

      <li>
        <i class="icon iconfont icon-gouxuan5"></i>
        <div class="name">勾选</div>
        <div class="fontclass">.icon-gouxuan5</div>
      </li>

      <li>
        <i class="icon iconfont icon-chongzhi1"></i>
        <div class="name">重置</div>
        <div class="fontclass">.icon-chongzhi1</div>
      </li>

      <li>
        <i class="icon iconfont icon-liulan2"></i>
        <div class="name">浏览</div>
        <div class="fontclass">.icon-liulan2</div>
      </li>

      <li>
        <i class="icon iconfont icon-gouwuche4"></i>
        <div class="name">购物车</div>
        <div class="fontclass">.icon-gouwuche4</div>
      </li>

      <li>
        <i class="icon iconfont icon-dingwei6"></i>
        <div class="name">定位</div>
        <div class="fontclass">.icon-dingwei6</div>
      </li>

      <li>
        <i class="icon iconfont icon-renminbi1688"></i>
        <div class="name">人民币</div>
        <div class="fontclass">.icon-renminbi1688</div>
      </li>

      <li>
        <i class="icon iconfont icon-shizhong1"></i>
        <div class="name">时钟</div>
        <div class="fontclass">.icon-shizhong1</div>
      </li>

      <li>
        <i class="icon iconfont icon-23"></i>
        <div class="name">托盘码－批量</div>
        <div class="fontclass">.icon-23</div>
      </li>

      <li>
        <i class="icon iconfont icon-youjiantou7"></i>
        <div class="name">右箭头</div>
        <div class="fontclass">.icon-youjiantou7</div>
      </li>

      <li>
        <i class="icon iconfont icon-fenpei4"></i>
        <div class="name">分配</div>
        <div class="fontclass">.icon-fenpei4</div>
      </li>

      <li>
        <i class="icon iconfont icon-saomiaojieguo"></i>
        <div class="name">扫描结果</div>
        <div class="fontclass">.icon-saomiaojieguo</div>
      </li>

      <li>
        <i class="icon iconfont icon-chacha"></i>
        <div class="name">叉叉</div>
        <div class="fontclass">.icon-chacha</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhongzhi2"></i>
        <div class="name">重置</div>
        <div class="fontclass">.icon-zhongzhi2</div>
      </li>

      <li>
        <i class="icon iconfont icon-ziti1"></i>
        <div class="name">字体</div>
        <div class="fontclass">.icon-ziti1</div>
      </li>

      <li>
        <i class="icon iconfont icon-dayin4"></i>
        <div class="name">打印</div>
        <div class="fontclass">.icon-dayin4</div>
      </li>

      <li>
        <i class="icon iconfont icon-yuyinsaomiao"></i>
        <div class="name">语音扫描</div>
        <div class="fontclass">.icon-yuyinsaomiao</div>
      </li>

      <li>
        <i class="icon iconfont icon-716bianjiqi_zitiyanse"></i>
        <div class="name">716编辑器_字体颜色</div>
        <div class="fontclass">.icon-716bianjiqi_zitiyanse</div>
      </li>

      <li>
        <i class="icon iconfont icon-728bianjiqi_zitidaxiao"></i>
        <div class="name">728编辑器_字体大小</div>
        <div class="fontclass">.icon-728bianjiqi_zitidaxiao</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon-yuanxk"></i>
        <div class="name">圆形线条</div>
        <div class="fontclass">.icon-icon-yuanxk</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon-yuanzhuti"></i>
        <div class="name">圆柱体</div>
        <div class="fontclass">.icon-icon-yuanzhuti</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon-yuanzhuiti"></i>
        <div class="name">圆锥体</div>
        <div class="fontclass">.icon-icon-yuanzhuiti</div>
      </li>

      <li>
        <i class="icon iconfont icon-ruku11"></i>
        <div class="name">入库</div>
        <div class="fontclass">.icon-ruku11</div>
      </li>

      <li>
        <i class="icon iconfont icon-weixin4"></i>
        <div class="name">微信</div>
        <div class="fontclass">.icon-weixin4</div>
      </li>

      <li>
        <i class="icon iconfont icon-sekuaigouwuche"></i>
        <div class="name">色块－购物车</div>
        <div class="fontclass">.icon-sekuaigouwuche</div>
      </li>

      <li>
        <i class="icon iconfont icon-xiangao"></i>
        <div class="name">金融&货币－24</div>
        <div class="fontclass">.icon-xiangao</div>
      </li>

      <li>
        <i class="icon iconfont icon-xiangao1"></i>
        <div class="name">金融&货币－25</div>
        <div class="fontclass">.icon-xiangao1</div>
      </li>

      <li>
        <i class="icon iconfont icon-xiangao2"></i>
        <div class="name">金融&货币－32</div>
        <div class="fontclass">.icon-xiangao2</div>
      </li>

      <li>
        <i class="icon iconfont icon-xiangao3"></i>
        <div class="name">金融&货币－36</div>
        <div class="fontclass">.icon-xiangao3</div>
      </li>

      <li>
        <i class="icon iconfont icon-saomiao9"></i>
        <div class="name">扫描</div>
        <div class="fontclass">.icon-saomiao9</div>
      </li>

      <li>
        <i class="icon iconfont icon-kuaidi3"></i>
        <div class="name">快递</div>
        <div class="fontclass">.icon-kuaidi3</div>
      </li>

      <li>
        <i class="icon iconfont icon-youjiantou8"></i>
        <div class="name">右箭头</div>
        <div class="fontclass">.icon-youjiantou8</div>
      </li>

      <li>
        <i class="icon iconfont icon-fenjian"></i>
        <div class="name">分拣</div>
        <div class="fontclass">.icon-fenjian</div>
      </li>

      <li>
        <i class="icon iconfont icon-kaiguanclose"></i>
        <div class="name">开关 开</div>
        <div class="fontclass">.icon-kaiguanclose</div>
      </li>

      <li>
        <i class="icon iconfont icon-kuaidi4"></i>
        <div class="name">快递</div>
        <div class="fontclass">.icon-kuaidi4</div>
      </li>

      <li>
        <i class="icon iconfont icon-kuaidi5"></i>
        <div class="name">快递</div>
        <div class="fontclass">.icon-kuaidi5</div>
      </li>

      <li>
        <i class="icon iconfont icon-4"></i>
        <div class="name">人</div>
        <div class="fontclass">.icon-4</div>
      </li>

      <li>
        <i class="icon iconfont icon-rili2"></i>
        <div class="name">日历</div>
        <div class="fontclass">.icon-rili2</div>
      </li>

      <li>
        <i class="icon iconfont icon-fenpei5"></i>
        <div class="name">分配</div>
        <div class="fontclass">.icon-fenpei5</div>
      </li>

      <li>
        <i class="icon iconfont icon-tubiao-"></i>
        <div class="name">客户交易分布</div>
        <div class="fontclass">.icon-tubiao-</div>
      </li>

      <li>
        <i class="icon iconfont icon-tubiao-1"></i>
        <div class="name">金融交易统计</div>
        <div class="fontclass">.icon-tubiao-1</div>
      </li>

      <li>
        <i class="icon iconfont icon-plan-plane-aeroplane-fun-office-timepass-eedb"></i>
        <div class="name">计划，飞机</div>
        <div class="fontclass">.icon-plan-plane-aeroplane-fun-office-timepass-eedb</div>
      </li>

      <li>
        <i class="icon iconfont icon-cangku2"></i>
        <div class="name">仓库</div>
        <div class="fontclass">.icon-cangku2</div>
      </li>

      <li>
        <i class="icon iconfont icon-fenpei6"></i>
        <div class="name">分配</div>
        <div class="fontclass">.icon-fenpei6</div>
      </li>

      <li>
        <i class="icon iconfont icon-shangxiajiantou-"></i>
        <div class="name">上下箭头-3</div>
        <div class="fontclass">.icon-shangxiajiantou-</div>
      </li>

      <li>
        <i class="icon iconfont icon-chai_heidi"></i>
        <div class="name">拆_黑底</div>
        <div class="fontclass">.icon-chai_heidi</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhuanyiwenti"></i>
        <div class="name">转移问题</div>
        <div class="fontclass">.icon-zhuanyiwenti</div>
      </li>

      <li>
        <i class="icon iconfont icon-chaxun3"></i>
        <div class="name">查询</div>
        <div class="fontclass">.icon-chaxun3</div>
      </li>

      <li>
        <i class="icon iconfont icon-kuaididan"></i>
        <div class="name">快递单</div>
        <div class="fontclass">.icon-kuaididan</div>
      </li>

      <li>
        <i class="icon iconfont icon-suokaiqi"></i>
        <div class="name">锁（开启）</div>
        <div class="fontclass">.icon-suokaiqi</div>
      </li>

      <li>
        <i class="icon iconfont icon-tubiaozhizuomoban"></i>
        <div class="name">减少</div>
        <div class="fontclass">.icon-tubiaozhizuomoban</div>
      </li>

      <li>
        <i class="icon iconfont icon-jiaoyi"></i>
        <div class="name">交易</div>
        <div class="fontclass">.icon-jiaoyi</div>
      </li>

      <li>
        <i class="icon iconfont icon-tupian2"></i>
        <div class="name">图片</div>
        <div class="fontclass">.icon-tupian2</div>
      </li>

      <li>
        <i class="icon iconfont icon-fenpeimubiao"></i>
        <div class="name">分配目标</div>
        <div class="fontclass">.icon-fenpeimubiao</div>
      </li>

      <li>
        <i class="icon iconfont icon-kuaidi6"></i>
        <div class="name">快递</div>
        <div class="fontclass">.icon-kuaidi6</div>
      </li>

      <li>
        <i class="icon iconfont icon-zuojiantou"></i>
        <div class="name">左箭头</div>
        <div class="fontclass">.icon-zuojiantou</div>
      </li>

      <li>
        <i class="icon iconfont icon-chaxun4"></i>
        <div class="name">查询</div>
        <div class="fontclass">.icon-chaxun4</div>
      </li>

      <li>
        <i class="icon iconfont icon-shachu-xue"></i>
        <div class="name">删除</div>
        <div class="fontclass">.icon-shachu-xue</div>
      </li>

      <li>
        <i class="icon iconfont icon-zijinlicai"></i>
        <div class="name">资金，理财</div>
        <div class="fontclass">.icon-zijinlicai</div>
      </li>

      <li>
        <i class="icon iconfont icon-shenfenzheng1"></i>
        <div class="name">身份证</div>
        <div class="fontclass">.icon-shenfenzheng1</div>
      </li>

      <li>
        <i class="icon iconfont icon-tianjia4"></i>
        <div class="name">添加</div>
        <div class="fontclass">.icon-tianjia4</div>
      </li>

      <li>
        <i class="icon iconfont icon-dayin_hebing"></i>
        <div class="name">打印_合并</div>
        <div class="fontclass">.icon-dayin_hebing</div>
      </li>

      <li>
        <i class="icon iconfont icon-renyuansousuo"></i>
        <div class="name">人员搜索</div>
        <div class="fontclass">.icon-renyuansousuo</div>
      </li>

      <li>
        <i class="icon iconfont icon-dingdan2"></i>
        <div class="name">订单</div>
        <div class="fontclass">.icon-dingdan2</div>
      </li>

      <li>
        <i class="icon iconfont icon-dingwei7"></i>
        <div class="name">定位</div>
        <div class="fontclass">.icon-dingwei7</div>
      </li>

      <li>
        <i class="icon iconfont icon-liebiao3"></i>
        <div class="name">列表</div>
        <div class="fontclass">.icon-liebiao3</div>
      </li>

      <li>
        <i class="icon iconfont icon-zuojiantou1"></i>
        <div class="name">左箭头</div>
        <div class="fontclass">.icon-zuojiantou1</div>
      </li>

      <li>
        <i class="icon iconfont icon-gouxuan6"></i>
        <div class="name">勾选</div>
        <div class="fontclass">.icon-gouxuan6</div>
      </li>

      <li>
        <i class="icon iconfont icon-ziyuan"></i>
        <div class="name">勾选</div>
        <div class="fontclass">.icon-ziyuan</div>
      </li>

      <li>
        <i class="icon iconfont icon-shizhong2"></i>
        <div class="name">时钟1</div>
        <div class="fontclass">.icon-shizhong2</div>
      </li>

      <li>
        <i class="icon iconfont icon-jingwuicon_svg-"></i>
        <div class="name">国旗</div>
        <div class="fontclass">.icon-jingwuicon_svg-</div>
      </li>

      <li>
        <i class="icon iconfont icon-guoqi_flag"></i>
        <div class="name">国旗_flag54</div>
        <div class="fontclass">.icon-guoqi_flag</div>
      </li>

      <li>
        <i class="icon iconfont icon-gouwuche5"></i>
        <div class="name">购物车</div>
        <div class="fontclass">.icon-gouwuche5</div>
      </li>

      <li>
        <i class="icon iconfont icon-renqun"></i>
        <div class="name">人群</div>
        <div class="fontclass">.icon-renqun</div>
      </li>

      <li>
        <i class="icon iconfont icon-niantie"></i>
        <div class="name">粘贴</div>
        <div class="fontclass">.icon-niantie</div>
      </li>

      <li>
        <i class="icon iconfont icon-xinjian2"></i>
        <div class="name">新建</div>
        <div class="fontclass">.icon-xinjian2</div>
      </li>

      <li>
        <i class="icon iconfont icon--daima"></i>
        <div class="name">07-代码</div>
        <div class="fontclass">.icon--daima</div>
      </li>

      <li>
        <i class="icon iconfont icon-youjiantou1"></i>
        <div class="name">右箭头</div>
        <div class="fontclass">.icon-youjiantou1</div>
      </li>

      <li>
        <i class="icon iconfont icon-xiaoxi4"></i>
        <div class="name">消息</div>
        <div class="fontclass">.icon-xiaoxi4</div>
      </li>

      <li>
        <i class="icon iconfont icon-weixin1"></i>
        <div class="name">微信 (1)</div>
        <div class="fontclass">.icon-weixin1</div>
      </li>

      <li>
        <i class="icon iconfont icon-clock1"></i>
        <div class="name">时钟</div>
        <div class="fontclass">.icon-clock1</div>
      </li>

      <li>
        <i class="icon iconfont icon-xiaoxi5"></i>
        <div class="name">消息</div>
        <div class="fontclass">.icon-xiaoxi5</div>
      </li>

      <li>
        <i class="icon iconfont icon-paizhao-xianxing"></i>
        <div class="name">237拍照-线性</div>
        <div class="fontclass">.icon-paizhao-xianxing</div>
      </li>

      <li>
        <i class="icon iconfont icon-anniu"></i>
        <div class="name">符号-按钮</div>
        <div class="fontclass">.icon-anniu</div>
      </li>

      <li>
        <i class="icon iconfont yrt-danhangshurukuang"></i>
        <div class="name">符号-单行输入框</div>
        <div class="fontclass">.yrt-danhangshurukuang</div>
      </li>

      <li>
        <i class="icon iconfont icon-duohangshurukuang"></i>
        <div class="name">符号-多行输入框</div>
        <div class="fontclass">.icon-duohangshurukuang</div>
      </li>

      <li>
        <i class="icon iconfont icon-jilianxuanze"></i>
        <div class="name">符号-级联选择</div>
        <div class="fontclass">.icon-jilianxuanze</div>
      </li>

      <li>
        <i class="icon iconfont icon-kaiguan"></i>
        <div class="name">符号-开关</div>
        <div class="fontclass">.icon-kaiguan</div>
      </li>

      <li>
        <i class="icon iconfont icon-star1"></i>
        <div class="name">星星</div>
        <div class="fontclass">.icon-star1</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon-test3"></i>
        <div class="name">组织管理</div>
        <div class="fontclass">.icon-icon-test3</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon-test2"></i>
        <div class="name">文件夹</div>
        <div class="fontclass">.icon-icon-test2</div>
      </li>

      <li>
        <i class="icon iconfont icon-xiajiantou"></i>
        <div class="name">下箭头</div>
        <div class="fontclass">.icon-xiajiantou</div>
      </li>

      <li>
        <i class="icon iconfont icon-shangjiantou1"></i>
        <div class="name">上箭头</div>
        <div class="fontclass">.icon-shangjiantou1</div>
      </li>

      <li>
        <i class="icon iconfont icon-shouye4"></i>
        <div class="name">首页</div>
        <div class="fontclass">.icon-shouye4</div>
      </li>

      <li>
        <i class="icon iconfont icon-web__bitebiyoujiantou"></i>
        <div class="name">web__比特币右箭头</div>
        <div class="fontclass">.icon-web__bitebiyoujiantou</div>
      </li>

      <li>
        <i class="icon iconfont icon-daima"></i>
        <div class="name">符号-代码</div>
        <div class="fontclass">.icon-daima</div>
      </li>

      <li>
        <i class="icon iconfont icon-jiaoyiguanli"></i>
        <div class="name">后台-交易管理</div>
        <div class="fontclass">.icon-jiaoyiguanli</div>
      </li>

      <li>
        <i class="icon iconfont icon-web-icon-1"></i>
        <div class="name">消息</div>
        <div class="fontclass">.icon-web-icon-1</div>
      </li>

      <li>
        <i class="icon iconfont icon-feiyongkemu"></i>
        <div class="name">费用科目</div>
        <div class="fontclass">.icon-feiyongkemu</div>
      </li>

      <li>
        <i class="icon iconfont icon-placeholder__"></i>
        <div class="name">定位</div>
        <div class="fontclass">.icon-placeholder__</div>
      </li>

      <li>
        <i class="icon iconfont icon-xinzengyugengxinxiaoshoudingdan"></i>
        <div class="name">新增与更新销售订单</div>
        <div class="fontclass">.icon-xinzengyugengxinxiaoshoudingdan</div>
      </li>

      <li>
        <i class="icon iconfont icon-shizhongtianjia"></i>
        <div class="name">时钟添加</div>
        <div class="fontclass">.icon-shizhongtianjia</div>
      </li>

      <li>
        <i class="icon iconfont icon-renyuantianjia"></i>
        <div class="name">人员添加</div>
        <div class="fontclass">.icon-renyuantianjia</div>
      </li>

      <li>
        <i class="icon iconfont icon-shizhong3"></i>
        <div class="name">时钟</div>
        <div class="fontclass">.icon-shizhong3</div>
      </li>

      <li>
        <i class="icon iconfont icon-xiaoxi6"></i>
        <div class="name">消息</div>
        <div class="fontclass">.icon-xiaoxi6</div>
      </li>

      <li>
        <i class="icon iconfont icon-clock2"></i>
        <div class="name">时钟</div>
        <div class="fontclass">.icon-clock2</div>
      </li>

      <li>
        <i class="icon iconfont icon-fq_yingshoukuan"></i>
        <div class="name">fq_应收款</div>
        <div class="fontclass">.icon-fq_yingshoukuan</div>
      </li>

      <li>
        <i class="icon iconfont icon-wodezijin"></i>
        <div class="name">供方-我的资金</div>
        <div class="fontclass">.icon-wodezijin</div>
      </li>

      <li>
        <i class="icon iconfont icon-shanchu6"></i>
        <div class="name">删除</div>
        <div class="fontclass">.icon-shanchu6</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon-p_rili"></i>
        <div class="name">日历</div>
        <div class="fontclass">.icon-icon-p_rili</div>
      </li>

      <li>
        <i class="icon iconfont icon-dingdan3"></i>
        <div class="name">订单</div>
        <div class="fontclass">.icon-dingdan3</div>
      </li>

      <li>
        <i class="icon iconfont icon-paizhao3"></i>
        <div class="name">拍照</div>
        <div class="fontclass">.icon-paizhao3</div>
      </li>

      <li>
        <i class="icon iconfont icon-hangbanyanwu"></i>
        <div class="name">航班延误</div>
        <div class="fontclass">.icon-hangbanyanwu</div>
      </li>

      <li>
        <i class="icon iconfont icon-hangbandongtai"></i>
        <div class="name">航班动态</div>
        <div class="fontclass">.icon-hangbandongtai</div>
      </li>

      <li>
        <i class="icon iconfont icon-wenjianjia2"></i>
        <div class="name">文件夹</div>
        <div class="fontclass">.icon-wenjianjia2</div>
      </li>

      <li>
        <i class="icon iconfont icon-xiaoxi7"></i>
        <div class="name">消息</div>
        <div class="fontclass">.icon-xiaoxi7</div>
      </li>

      <li>
        <i class="icon iconfont icon-reduce_icon"></i>
        <div class="name">减少</div>
        <div class="fontclass">.icon-reduce_icon</div>
      </li>

      <li>
        <i class="icon iconfont icon-feiji3"></i>
        <div class="name">飞机</div>
        <div class="fontclass">.icon-feiji3</div>
      </li>

      <li>
        <i class="icon iconfont icon-calendar"></i>
        <div class="name">日历</div>
        <div class="fontclass">.icon-calendar</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhuanxiangzijin"></i>
        <div class="name">专项资金</div>
        <div class="fontclass">.icon-zhuanxiangzijin</div>
      </li>

      <li>
        <i class="icon iconfont icon-zuojiantou3"></i>
        <div class="name">右箭头</div>
        <div class="fontclass">.icon-zuojiantou3</div>
      </li>

      <li>
        <i class="icon iconfont icon-shujutongji"></i>
        <div class="name">数据统计</div>
        <div class="fontclass">.icon-shujutongji</div>
      </li>

      <li>
        <i class="icon iconfont icon-credentials_icon"></i>
        <div class="name">身份证</div>
        <div class="fontclass">.icon-credentials_icon</div>
      </li>

      <li>
        <i class="icon iconfont icon-xing"></i>
        <div class="name">星</div>
        <div class="fontclass">.icon-xing</div>
      </li>

      <li>
        <i class="icon iconfont icon-shizhong4"></i>
        <div class="name">时钟</div>
        <div class="fontclass">.icon-shizhong4</div>
      </li>

      <li>
        <i class="icon iconfont icon-xiangjipaizhao"></i>
        <div class="name">相机拍照</div>
        <div class="fontclass">.icon-xiangjipaizhao</div>
      </li>

      <li>
        <i class="icon iconfont icon-shizhong_l"></i>
        <div class="name">时钟_l</div>
        <div class="fontclass">.icon-shizhong_l</div>
      </li>

      <li>
        <i class="icon iconfont icon-jianshao_l"></i>
        <div class="name">减少_l</div>
        <div class="fontclass">.icon-jianshao_l</div>
      </li>

      <li>
        <i class="icon iconfont icon-batch-reduce"></i>
        <div class="name">批量减少</div>
        <div class="fontclass">.icon-batch-reduce</div>
      </li>

      <li>
        <i class="icon iconfont icon-sanjiaoleft"></i>
        <div class="name">左箭头</div>
        <div class="fontclass">.icon-sanjiaoleft</div>
      </li>

      <li>
        <i class="icon iconfont icon-sanjiaoleft-copy"></i>
        <div class="name">左箭头</div>
        <div class="fontclass">.icon-sanjiaoleft-copy</div>
      </li>

      <li>
        <i class="icon iconfont icon-sanjiaoleft1"></i>
        <div class="name">左箭头</div>
        <div class="fontclass">.icon-sanjiaoleft1</div>
      </li>

      <li>
        <i class="icon iconfont icon-arrow-left"></i>
        <div class="name">左箭头</div>
        <div class="fontclass">.icon-arrow-left</div>
      </li>

      <li>
        <i class="icon iconfont icon-siji-"></i>
        <div class="name">司机-01</div>
        <div class="fontclass">.icon-siji-</div>
      </li>

      <li>
        <i class="icon iconfont icon-tuihuobaozhang"></i>
        <div class="name">退货保障</div>
        <div class="fontclass">.icon-tuihuobaozhang</div>
      </li>

      <li>
        <i class="icon iconfont icon-jianshao"></i>
        <div class="name">减少</div>
        <div class="fontclass">.icon-jianshao</div>
      </li>

      <li>
        <i class="icon iconfont icon-zuojiantou2"></i>
        <div class="name">左箭头</div>
        <div class="fontclass">.icon-zuojiantou2</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon-test"></i>
        <div class="name">签字</div>
        <div class="fontclass">.icon-icon-test</div>
      </li>

      <li>
        <i class="icon iconfont icon-yinhang-yinlian-"></i>
        <div class="name">银行-银联-09</div>
        <div class="fontclass">.icon-yinhang-yinlian-</div>
      </li>

      <li>
        <i class="icon iconfont icon-dingwei8"></i>
        <div class="name">定位</div>
        <div class="fontclass">.icon-dingwei8</div>
      </li>

      <li>
        <i class="icon iconfont icon-kaiguan1"></i>
        <div class="name">开关</div>
        <div class="fontclass">.icon-kaiguan1</div>
      </li>

      <li>
        <i class="icon iconfont icon-xialakuang1"></i>
        <div class="name">下拉框</div>
        <div class="fontclass">.icon-xialakuang1</div>
      </li>

      <li>
        <i class="icon iconfont icon-jiankongzhongxin"></i>
        <div class="name">监控中心</div>
        <div class="fontclass">.icon-jiankongzhongxin</div>
      </li>

      <li>
        <i class="icon iconfont icon-shanchu7"></i>
        <div class="name">删除</div>
        <div class="fontclass">.icon-shanchu7</div>
      </li>

      <li>
        <i class="icon iconfont icon-fl-renshi"></i>
        <div class="name">人事</div>
        <div class="fontclass">.icon-fl-renshi</div>
      </li>

      <li>
        <i class="icon iconfont icon-star"></i>
        <div class="name">置顶推荐top</div>
        <div class="fontclass">.icon-star</div>
      </li>

      <li>
        <i class="icon iconfont icon-liebiao4"></i>
        <div class="name">列表</div>
        <div class="fontclass">.icon-liebiao4</div>
      </li>

      <li>
        <i class="icon iconfont icon-jiaoyichenggong"></i>
        <div class="name">首页-交易成功</div>
        <div class="fontclass">.icon-jiaoyichenggong</div>
      </li>

      <li>
        <i class="icon iconfont icon-dingwei9"></i>
        <div class="name">定位</div>
        <div class="fontclass">.icon-dingwei9</div>
      </li>

      <li>
        <i class="icon iconfont icon-rili3"></i>
        <div class="name">日历</div>
        <div class="fontclass">.icon-rili3</div>
      </li>

      <li>
        <i class="icon iconfont icon-kefu3"></i>
        <div class="name">客服</div>
        <div class="fontclass">.icon-kefu3</div>
      </li>

      <li>
        <i class="icon iconfont icon-shouji-tianchong"></i>
        <div class="name">手机</div>
        <div class="fontclass">.icon-shouji-tianchong</div>
      </li>

      <li>
        <i class="icon iconfont icon-dingwei10"></i>
        <div class="name">定位</div>
        <div class="fontclass">.icon-dingwei10</div>
      </li>

      <li>
        <i class="icon iconfont icon-anniu1"></i>
        <div class="name">按钮</div>
        <div class="fontclass">.icon-anniu1</div>
      </li>

      <li>
        <i class="icon iconfont icon-xiaoxi8"></i>
        <div class="name">消息</div>
        <div class="fontclass">.icon-xiaoxi8</div>
      </li>

      <li>
        <i class="icon iconfont icon-jianshao1"></i>
        <div class="name">减少</div>
        <div class="fontclass">.icon-jianshao1</div>
      </li>

      <li>
        <i class="icon iconfont icon-shizhong5"></i>
        <div class="name">时钟</div>
        <div class="fontclass">.icon-shizhong5</div>
      </li>

      <li>
        <i class="icon iconfont icon-liulan3"></i>
        <div class="name">浏览</div>
        <div class="fontclass">.icon-liulan3</div>
      </li>

      <li>
        <i class="icon iconfont icon-shouji4"></i>
        <div class="name">手机</div>
        <div class="fontclass">.icon-shouji4</div>
      </li>

      <li>
        <i class="icon iconfont icon-jiahao1"></i>
        <div class="name">加号</div>
        <div class="fontclass">.icon-jiahao1</div>
      </li>

      <li>
        <i class="icon iconfont icon-yigouxuan1"></i>
        <div class="name">已勾选32</div>
        <div class="fontclass">.icon-yigouxuan1</div>
      </li>

      <li>
        <i class="icon iconfont icon-shouye5"></i>
        <div class="name">首页</div>
        <div class="fontclass">.icon-shouye5</div>
      </li>

      <li>
        <i class="icon iconfont icon-guoqi"></i>
        <div class="name">国旗</div>
        <div class="fontclass">.icon-guoqi</div>
      </li>

      <li>
        <i class="icon iconfont icon-tongji"></i>
        <div class="name">统计</div>
        <div class="fontclass">.icon-tongji</div>
      </li>

      <li>
        <i class="icon iconfont icon-shenfenzhengfanmian"></i>
        <div class="name">身份证反面</div>
        <div class="fontclass">.icon-shenfenzhengfanmian</div>
      </li>

      <li>
        <i class="icon iconfont icon-youjiantou2"></i>
        <div class="name">右箭头</div>
        <div class="fontclass">.icon-youjiantou2</div>
      </li>

      <li>
        <i class="icon iconfont icon-yigouxuan2"></i>
        <div class="name">已勾选40</div>
        <div class="fontclass">.icon-yigouxuan2</div>
      </li>

      <li>
        <i class="icon iconfont icon-jiajianzujianjiahao"></i>
        <div class="name">加减组件 加号</div>
        <div class="fontclass">.icon-jiajianzujianjiahao</div>
      </li>

      <li>
        <i class="icon iconfont icon-cheliangziliaoshenhe"></i>
        <div class="name">车辆资料审核</div>
        <div class="fontclass">.icon-cheliangziliaoshenhe</div>
      </li>

      <li>
        <i class="icon iconfont icon-cheliangziliao"></i>
        <div class="name">车辆资料</div>
        <div class="fontclass">.icon-cheliangziliao</div>
      </li>

      <li>
        <i class="icon iconfont icon-chengyunfangziliaoshenhe"></i>
        <div class="name">承运方资料审核</div>
        <div class="fontclass">.icon-chengyunfangziliaoshenhe</div>
      </li>

      <li>
        <i class="icon iconfont icon-feiyongguizeziliao"></i>
        <div class="name">费用规则资料</div>
        <div class="fontclass">.icon-feiyongguizeziliao</div>
      </li>

      <li>
        <i class="icon iconfont icon-chengyunfangziliao"></i>
        <div class="name">承运方资料</div>
        <div class="fontclass">.icon-chengyunfangziliao</div>
      </li>

      <li>
        <i class="icon iconfont icon-yunshujihuashenhe"></i>
        <div class="name">运输计划审核</div>
        <div class="fontclass">.icon-yunshujihuashenhe</div>
      </li>

      <li>
        <i class="icon iconfont icon-cheliangyunwei"></i>
        <div class="name">车辆运维</div>
        <div class="fontclass">.icon-cheliangyunwei</div>
      </li>

      <li>
        <i class="icon iconfont icon-cheliangdangan"></i>
        <div class="name">车辆档案</div>
        <div class="fontclass">.icon-cheliangdangan</div>
      </li>

      <li>
        <i class="icon iconfont icon-cheliangweixiubaoyang"></i>
        <div class="name">车辆维修保养</div>
        <div class="fontclass">.icon-cheliangweixiubaoyang</div>
      </li>

      <li>
        <i class="icon iconfont icon-cheliangjiankong"></i>
        <div class="name">车辆监控</div>
        <div class="fontclass">.icon-cheliangjiankong</div>
      </li>

      <li>
        <i class="icon iconfont icon-chengbentongjifenxi"></i>
        <div class="name">成本统计分析</div>
        <div class="fontclass">.icon-chengbentongjifenxi</div>
      </li>

      <li>
        <i class="icon iconfont icon-cheliangyingxiangshezhi"></i>
        <div class="name">车辆影像设置</div>
        <div class="fontclass">.icon-cheliangyingxiangshezhi</div>
      </li>

      <li>
        <i class="icon iconfont icon-chengbenjisuangongshi"></i>
        <div class="name">成本计算公式</div>
        <div class="fontclass">.icon-chengbenjisuangongshi</div>
      </li>

      <li>
        <i class="icon iconfont icon-qitafeiyong"></i>
        <div class="name">其他费用</div>
        <div class="fontclass">.icon-qitafeiyong</div>
      </li>

      <li>
        <i class="icon iconfont icon-renyuanguanli"></i>
        <div class="name">人员管理</div>
        <div class="fontclass">.icon-renyuanguanli</div>
      </li>

      <li>
        <i class="icon iconfont icon-sijipaiban"></i>
        <div class="name">司机排班</div>
        <div class="fontclass">.icon-sijipaiban</div>
      </li>

      <li>
        <i class="icon iconfont icon-sijiguanli"></i>
        <div class="name">司机管理</div>
        <div class="fontclass">.icon-sijiguanli</div>
      </li>

      <li>
        <i class="icon iconfont icon-zuzhijigou"></i>
        <div class="name">组织机构</div>
        <div class="fontclass">.icon-zuzhijigou</div>
      </li>

      <li>
        <i class="icon iconfont icon-fuhao-ziti"></i>
        <div class="name">符号-字体</div>
        <div class="fontclass">.icon-fuhao-ziti</div>
      </li>

      <li>
        <i class="icon iconfont icon-folder-open"></i>
        <div class="name">文件夹开</div>
        <div class="fontclass">.icon-folder-open</div>
      </li>

      <li>
        <i class="icon iconfont icon-guoqi_flag1"></i>
        <div class="name">国旗_flag54</div>
        <div class="fontclass">.icon-guoqi_flag1</div>
      </li>

      <li>
        <i class="icon iconfont icon-character-mind"></i>
        <div class="name">人物-关注</div>
        <div class="fontclass">.icon-character-mind</div>
      </li>

      <li>
        <i class="icon iconfont icon-character-success"></i>
        <div class="name">人物-成功</div>
        <div class="fontclass">.icon-character-success</div>
      </li>

      <li>
        <i class="icon iconfont icon-character-cancel"></i>
        <div class="name">人物-取消</div>
        <div class="fontclass">.icon-character-cancel</div>
      </li>

      <li>
        <i class="icon iconfont icon-character-minus"></i>
        <div class="name">人物-减去</div>
        <div class="fontclass">.icon-character-minus</div>
      </li>

      <li>
        <i class="icon iconfont icon-dianhuaweijie"></i>
        <div class="name">电话 未接</div>
        <div class="fontclass">.icon-dianhuaweijie</div>
      </li>

      <li>
        <i class="icon iconfont icon-paizhao4"></i>
        <div class="name">拍照</div>
        <div class="fontclass">.icon-paizhao4</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhiding1"></i>
        <div class="name">置顶</div>
        <div class="fontclass">.icon-zhiding1</div>
      </li>

      <li>
        <i class="icon iconfont icon-pingfen"></i>
        <div class="name">评分</div>
        <div class="fontclass">.icon-pingfen</div>
      </li>

      <li>
        <i class="icon iconfont icon-web-icon-"></i>
        <div class="name">派送</div>
        <div class="fontclass">.icon-web-icon-</div>
      </li>

      <li>
        <i class="icon iconfont icon-benpao"></i>
        <div class="name">奔跑</div>
        <div class="fontclass">.icon-benpao</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon-2"></i>
        <div class="name">开关</div>
        <div class="fontclass">.icon-icon-2</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon-3"></i>
        <div class="name">开关</div>
        <div class="fontclass">.icon-icon-3</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon-1"></i>
        <div class="name">消息</div>
        <div class="fontclass">.icon-icon-1</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon-"></i>
        <div class="name">纸飞机</div>
        <div class="fontclass">.icon-icon-</div>
      </li>

      <li>
        <i class="icon iconfont icon-renxiang"></i>
        <div class="name">人像</div>
        <div class="fontclass">.icon-renxiang</div>
      </li>

      <li>
        <i class="icon iconfont icon-xiuxiyixia"></i>
        <div class="name">休息一下</div>
        <div class="fontclass">.icon-xiuxiyixia</div>
      </li>

      <li>
        <i class="icon iconfont icon-tuihuochuli"></i>
        <div class="name">退货处理</div>
        <div class="fontclass">.icon-tuihuochuli</div>
      </li>

      <li>
        <i class="icon iconfont icon-wenjian"></i>
        <div class="name">文件</div>
        <div class="fontclass">.icon-wenjian</div>
      </li>

      <li>
        <i class="icon iconfont icon-xing1"></i>
        <div class="name">星</div>
        <div class="fontclass">.icon-xing1</div>
      </li>

      <li>
        <i class="icon iconfont icon-zan6"></i>
        <div class="name">赞</div>
        <div class="fontclass">.icon-zan6</div>
      </li>

      <li>
        <i class="icon iconfont icon-weiqianzi"></i>
        <div class="name">未签字</div>
        <div class="fontclass">.icon-weiqianzi</div>
      </li>

      <li>
        <i class="icon iconfont icon-yiqianzi"></i>
        <div class="name">已签字</div>
        <div class="fontclass">.icon-yiqianzi</div>
      </li>

      <li>
        <i class="icon iconfont icon-rili4"></i>
        <div class="name">日历</div>
        <div class="fontclass">.icon-rili4</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhcc_xiangxiajiantou"></i>
        <div class="name">zhcc_向下箭头</div>
        <div class="fontclass">.icon-zhcc_xiangxiajiantou</div>
      </li>

      <li>
        <i class="icon iconfont icon-shouji5"></i>
        <div class="name">手机</div>
        <div class="fontclass">.icon-shouji5</div>
      </li>

      <li>
        <i class="icon iconfont icon-fuzhi3"></i>
        <div class="name">复制</div>
        <div class="fontclass">.icon-fuzhi3</div>
      </li>

      <li>
        <i class="icon iconfont icon-tubiaolunkuo-"></i>
        <div class="name">客服</div>
        <div class="fontclass">.icon-tubiaolunkuo-</div>
      </li>

      <li>
        <i class="icon iconfont icon-dingwei11"></i>
        <div class="name">定位</div>
        <div class="fontclass">.icon-dingwei11</div>
      </li>

      <li>
        <i class="icon iconfont icon-feiji4"></i>
        <div class="name">飞机</div>
        <div class="fontclass">.icon-feiji4</div>
      </li>

      <li>
        <i class="icon iconfont icon--"></i>
        <div class="name">统计</div>
        <div class="fontclass">.icon--</div>
      </li>

      <li>
        <i class="icon iconfont icon-gouxuan7"></i>
        <div class="name">勾选</div>
        <div class="fontclass">.icon-gouxuan7</div>
      </li>

      <li>
        <i class="icon iconfont icon-shizhong6"></i>
        <div class="name">时钟</div>
        <div class="fontclass">.icon-shizhong6</div>
      </li>

      <li>
        <i class="icon iconfont icon-ren1"></i>
        <div class="name">人</div>
        <div class="fontclass">.icon-ren1</div>
      </li>

      <li>
        <i class="icon iconfont icon-daimamoshi"></i>
        <div class="name">代码模式</div>
        <div class="fontclass">.icon-daimamoshi</div>
      </li>

      <li>
        <i class="icon iconfont icon-liebiao5"></i>
        <div class="name">列表</div>
        <div class="fontclass">.icon-liebiao5</div>
      </li>

      <li>
        <i class="icon iconfont icon-feijihangban"></i>
        <div class="name">飞机航班</div>
        <div class="fontclass">.icon-feijihangban</div>
      </li>

      <li>
        <i class="icon iconfont icon-clock3"></i>
        <div class="name">时钟手表</div>
        <div class="fontclass">.icon-clock3</div>
      </li>

      <li>
        <i class="icon iconfont icon-feiji5"></i>
        <div class="name">飞机</div>
        <div class="fontclass">.icon-feiji5</div>
      </li>

      <li>
        <i class="icon iconfont icon-_fuzhi-"></i>
        <div class="name">时钟</div>
        <div class="fontclass">.icon-_fuzhi-</div>
      </li>

      <li>
        <i class="icon iconfont icon-gouwuche6"></i>
        <div class="name">购物车</div>
        <div class="fontclass">.icon-gouwuche6</div>
      </li>

      <li>
        <i class="icon iconfont icon--zhishengfeiji"></i>
        <div class="name">100-直升飞机</div>
        <div class="fontclass">.icon--zhishengfeiji</div>
      </li>

      <li>
        <i class="icon iconfont icon-shizhong7"></i>
        <div class="name">时钟</div>
        <div class="fontclass">.icon-shizhong7</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhcc_xiangxiajiantou1"></i>
        <div class="name">zhcc_向下箭头1</div>
        <div class="fontclass">.icon-zhcc_xiangxiajiantou1</div>
      </li>

      <li>
        <i class="icon iconfont icon--daxiajiantou"></i>
        <div class="name">017-大下箭头</div>
        <div class="fontclass">.icon--daxiajiantou</div>
      </li>

      <li>
        <i class="icon iconfont icon-zhcc_jiahao"></i>
        <div class="name">zhcc_加号</div>
        <div class="fontclass">.icon-zhcc_jiahao</div>
      </li>

      <li>
        <i class="icon iconfont icon-yidong"></i>
        <div class="name">移动</div>
        <div class="fontclass">.icon-yidong</div>
      </li>

      <li>
        <i class="icon iconfont icon-mn_xiuxi"></i>
        <div class="name">AK-MN休息</div>
        <div class="fontclass">.icon-mn_xiuxi</div>
      </li>

      <li>
        <i class="icon iconfont icon-im_dianhua2"></i>
        <div class="name">AK-IM电话2</div>
        <div class="fontclass">.icon-im_dianhua2</div>
      </li>

      <li>
        <i class="icon iconfont icon-paobu"></i>
        <div class="name">跑步</div>
        <div class="fontclass">.icon-paobu</div>
      </li>

      <li>
        <i class="icon iconfont icon-dianhua6"></i>
        <div class="name">电话</div>
        <div class="fontclass">.icon-dianhua6</div>
      </li>

      <li>
        <i class="icon iconfont icon-shijianxuanzeqi"></i>
        <div class="name">时间选择器</div>
        <div class="fontclass">.icon-shijianxuanzeqi</div>
      </li>

      <li>
        <i class="icon iconfont icon-yiwancheng1"></i>
        <div class="name">已完成</div>
        <div class="fontclass">.icon-yiwancheng1</div>
      </li>

      <li>
        <i class="icon iconfont icon-liulan-tianchong"></i>
        <div class="name">浏览-填充</div>
        <div class="fontclass">.icon-liulan-tianchong</div>
      </li>

      <li>
        <i class="icon iconfont yrt-fuzhi4"></i>
        <div class="name">复制</div>
        <div class="fontclass">.yrt-fuzhi4</div>
      </li>

      <li>
        <i class="icon iconfont icon-biaodanzujian-xialakuang"></i>
        <div class="name">表单组件-下拉框</div>
        <div class="fontclass">.icon-biaodanzujian-xialakuang</div>
      </li>

      <li>
        <i class="icon iconfont yrt-yidong1"></i>
        <div class="name">移动</div>
        <div class="fontclass">.yrt-yidong1</div>
      </li>

      <li>
        <i class="icon iconfont icon-xiaoxi9"></i>
        <div class="name">消息</div>
        <div class="fontclass">.icon-xiaoxi9</div>
      </li>

      <li>
        <i class="icon iconfont icon-xing2"></i>
        <div class="name">星</div>
        <div class="fontclass">.icon-xing2</div>
      </li>

      <li>
        <i class="icon iconfont icon-biangengcheliangyanse"></i>
        <div class="name">变更车辆颜色</div>
        <div class="fontclass">.icon-biangengcheliangyanse</div>
      </li>

      <li>
        <i class="icon iconfont icon-qianzi"></i>
        <div class="name">签字12</div>
        <div class="fontclass">.icon-qianzi</div>
      </li>

      <li>
        <i class="icon iconfont icon-dabiaoti"></i>
        <div class="name">大标题</div>
        <div class="fontclass">.icon-dabiaoti</div>
      </li>

      <li>
        <i class="icon iconfont icon-anniuzu"></i>
        <div class="name">按钮组</div>
        <div class="fontclass">.icon-anniuzu</div>
      </li>

      <li>
        <i class="icon iconfont icon-tupian3"></i>
        <div class="name">图片</div>
        <div class="fontclass">.icon-tupian3</div>
      </li>

      <li>
        <i class="icon iconfont icon-wenjian1"></i>
        <div class="name">文件</div>
        <div class="fontclass">.icon-wenjian1</div>
      </li>

      <li>
        <i class="icon iconfont icon-liebiao6"></i>
        <div class="name">列表</div>
        <div class="fontclass">.icon-liebiao6</div>
      </li>

      <li>
        <i class="icon iconfont icon-xin1"></i>
        <div class="name">新</div>
        <div class="fontclass">.icon-xin1</div>
      </li>

      <li>
        <i class="icon iconfont icon-ziyuan1"></i>
        <div class="name">支付宝</div>
        <div class="fontclass">.icon-ziyuan1</div>
      </li>

      <li>
        <i class="icon iconfont icon-fuxuankuang"></i>
        <div class="name">复选框</div>
        <div class="fontclass">.icon-fuxuankuang</div>
      </li>

      <li>
        <i class="icon iconfont icon-huakuai"></i>
        <div class="name">滑块</div>
        <div class="fontclass">.icon-huakuai</div>
      </li>

      <li>
        <i class="icon iconfont icon-jiantou_shangxiaqiehuan"></i>
        <div class="name">箭头_上下切换</div>
        <div class="fontclass">.icon-jiantou_shangxiaqiehuan</div>
      </li>

      <li>
        <i class="icon iconfont icon-layout-custom"></i>
        <div class="name">自定义布局</div>
        <div class="fontclass">.icon-layout-custom</div>
      </li>

      <li>
        <i class="icon iconfont icon-icon-test1"></i>
        <div class="name">复选-选中</div>
        <div class="fontclass">.icon-icon-test1</div>
      </li>

      <li>
        <i class="icon iconfont icon-fuxuankuang_xuanzhong"></i>
        <div class="name">复选框_选中</div>
        <div class="fontclass">.icon-fuxuankuang_xuanzhong</div>
      </li>

      <li>
        <i class="icon iconfont icon-yuandaima"></i>
        <div class="name">源代码</div>
        <div class="fontclass">.icon-yuandaima</div>
      </li>

      <li>
        <i class="icon iconfont icon-danxuankuang1"></i>
        <div class="name">单选框</div>
        <div class="fontclass">.icon-danxuankuang1</div>
      </li>

      <li>
        <i class="icon iconfont icon-fuhao-shuzishurukuang"></i>
        <div class="name">符号-数字输入框</div>
        <div class="fontclass">.icon-fuhao-shuzishurukuang</div>
      </li>

      <li>
        <i class="icon iconfont icon-yanse"></i>
        <div class="name">颜色</div>
        <div class="fontclass">.icon-yanse</div>
      </li>

      <li>
        <i class="icon iconfont icon-wenjianjiazhankai"></i>
        <div class="name">文件夹展开</div>
        <div class="fontclass">.icon-wenjianjiazhankai</div>
      </li>

      <li>
        <i class="icon iconfont icon-wenjianjiashanchu"></i>
        <div class="name">文件夹删除</div>
        <div class="fontclass">.icon-wenjianjiashanchu</div>
      </li>

      <li>
        <i class="icon iconfont icon-kaiguan2"></i>
        <div class="name">开关</div>
        <div class="fontclass">.icon-kaiguan2</div>
      </li>

      <li>
        <i class="icon iconfont icon-zitidaima"></i>
        <div class="name">字体代码</div>
        <div class="fontclass">.icon-zitidaima</div>
      </li>

      <li>
        <i class="icon iconfont icon-fuxuankuang1"></i>
        <div class="name">复选框</div>
        <div class="fontclass">.icon-fuxuankuang1</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  methods: {
    onSelectIcon(evt) {
      var icon = evt.srcElement.innerText;
      if (icon && icon.indexOf('.') >= 0) {
        this.$emit('onSelectIcon', icon.replace('.', ''));
        this.$message.success('选择成功！');
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
