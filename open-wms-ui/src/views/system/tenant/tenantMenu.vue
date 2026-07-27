<template>
  <div class="app-container">
    <div class="app-left">
      <el-anchor :container="containerRef" direction="vertical" type="default" :marker="false" :offset="0" @change="handleChange" @click="handleClick">
        <template v-for="(item, index) in state.packageList">
          <el-anchor-link :href="item.href">
            <div :class="['link-item', (!state.currentHref && index === 0) || state.currentHref === item.href ? 'active' : '']">{{ item.packageName }}</div>
          </el-anchor-link>
        </template>
      </el-anchor>
    </div>
    <div ref="containerRef" class="app-right">
      <div ref="container" class="biz-container">
        <split-pane :max-width="500" :default-width="260" split="vertical">
          <template #paneL>
            <div class="left-container">
              <el-form class="form-tool">
                <el-form-item class="margin-bottom-0">
                  <el-input v-model="state.filterText" placeholder="搜索名称" class="search-input">
                    <template #append>
                      <el-button title="刷新" @click="treeRefresh"><i class="yrt-chaxun2"></i></el-button>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item class="padding-right-0 margin-bottom-0">
                  <el-scrollbar :noresize="false" :native="false" wrap-class="tree scrollbar-wrap">
                    <!--数据tree-->
                    <el-tree ref="tree" :data="state.dataTree" :expand-on-click-node="false" :load="loadTreeNode" :filter-node-method="filterTreeNode" :props="state.props" :default-expand-all="false" highlight-current lazy node-key="menuId" @node-click="nodeClick">
                      <template #default="{ node, data }">
                        <span class="custom-tree-node">
                          <span>
                            <i v-if="data.hasChild" class="el-icon-menu"></i>
                            <i v-else class="el-icon-tickets"></i>
                            {{ node.label }}
                          </span>
                        </span>
                      </template>
                    </el-tree>
                  </el-scrollbar>
                </el-form-item>
              </el-form>
            </div>
          </template>
          <!--右侧主区-->
          <template #paneR>
            <div class="right-container">
              <!--数据编辑器Editor-->
              <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="detailButtonClick" :auth-nodes="state.authNodes" @on-save-after="onSaveAfter" @on-change="onChange">
                <!--自定义按钮插槽-->
                <template #footer-button-region="{ formData, details }">
                  <el-button type="success" @click="resetDefault(formData, details)"> <i class="icon-reset mr-5"></i> 重置为标准菜单 </el-button>
                  <el-button type="success" @click="moduleNameClick"> <i class="yrt-addplus mr-2"></i> 从标准菜单添加 </el-button>
                  <el-button type="success" @click="createBrotherNode(formData, details)"> <i class="yrt-tianjia mr-2"></i> 添加同级 </el-button>
                  <el-button type="success" @click="createSonNode(formData, details)"> <i class="yrt-addplus mr-2"></i> 添加下级 </el-button>
                  <el-button type="success" @click="copyNode(formData, details)"> <i class="yrt-fuzhi2 mr-2"></i> 复制 </el-button>
                  <el-button type="success" @click="deleteNode(formData, details)"> <i class="yrt-shanchu1 mr-2"></i> 删除 </el-button>
                </template>
              </yrt-editor>
            </div>
          </template>
        </split-pane>
      </div>
    </div>

    <!--选择器-->
    <yrt-selector ref="selectorDialog" :config="state.selectorConfig" v-model:visible="state.selectorConfig.visible" @on-selected="onSelected"></yrt-selector>
  </div>
</template>

<script setup lang="ts" name="system-tenant-tenantMenu">
import { ComponentInternalInstance, ref } from 'vue';
import { BaseProperties, ResultInfo } from '/@/types/base-type';
import { QueryBo, QueryType, DataType, OrderItem, OrderByType } from '/@/types/common';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';

const splitPane = defineAsyncComponent(() => import('/@/components/splitPane/index.vue'));
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const containerRef = ref<HTMLElement | null>(null);
const base = baseHook();

const { baseState, dataListRefName, editorRef, buttonClick, detailButtonClick, editorInfo } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  filterText: '',
  dataTree: [],
  props: {
    label: 'label',
    children: 'children',
    isLeaf: 'isLeaf',
  },
  // 当前选中项
  currentNode: null,
  addLevel: 'brother',

  currentHref: '#part0',
  currentPackage: {
    packageId: 1,
    packageName: '易软通仓配一体化系统',
    href: '#part0',
  } as { packageId: number; packageName: string; href: string } | undefined,
  packageList: [
    {
      packageId: 1,
      packageName: '易软通仓配一体化系统',
      href: '#part0',
    },
  ],
  // 当前选择器
  selectorConfig: {
    title: '功能模块选择器',
    width: '1000px',
    visible: false,
    // 配置路由
    router: '/selector/menu',
  },
});
//#endregion

onMounted(() => {
  getPackageList();
});

// 获得左侧类目导航节点数据
const loadTreeNode = async (node: any, resolve: any) => {
  let whereList: Array<QueryBo> = []; // 查询条件
  if (node.level === 0) {
    whereList.push({
      column: 'parentId',
      values: 0,
      queryType: QueryType.EQ,
      dataType: DataType.INT,
    });
    whereList.push({
      column: 'packageId',
      values: state.currentPackage?.packageId || 1,
      queryType: QueryType.EQ,
      dataType: DataType.INT,
    });
  } else {
    whereList.push({
      column: 'parentId',
      values: node.data.menuId,
      queryType: QueryType.EQ,
      dataType: DataType.INT,
    });
    whereList.push({
      column: 'packageId',
      values: state.currentPackage?.packageId || 1,
      queryType: QueryType.EQ,
      dataType: DataType.INT,
    });
  }

  let orderByList: Array<OrderItem> = []; // 排序提交
  orderByList.push({
    column: 'orderNum',
    orderByType: OrderByType.DESC,
  });
  let url = '/system/core/common/loadTreeNode';
  let params = {
    tableName: 'sys_tenant_menu',
    keyName: 'menuId',
    nodeName: 'menuName',
    fixHasChild: false,
    showOutsideNode: false,
    parentName: 'parentId',
    whereList: whereList, // 查询条件
    orderByList: orderByList, // 排序字段
    extendColumns: 'tentantMenuId',
  };
  let res = await postData(url, params);

  if (res.result) {
    if (node.level === 0) {
      res.data.push({
        menuId: -1,
        hasChild: 1,
        menuName: '[未使用节点]',
      });
    }
    res.data.forEach((element: any) => {
      element.label = element['menuName'];
      element.isLeaf = !element.hasChild;
    });
    resolve(res.data);
  } else {
    proxy.$message.error(res.msg);
  }
};

// 搜索导航
const filterTreeNode = (value: any, data: any) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};

// 点击tree导航节点
const nodeClick = (data: any, node?: any, el?: any) => {
  if (editorRef) {
    editorRef.value.loadEditData(data.tentantMenuId);
  } else {
    proxy.$message.error('编辑器正在初始化');
  }
};

// 刷新tree
const treeRefresh = () => {
  state.filterText = '';
  let root = proxy.$refs.tree.store.root;
  while (root.childNodes.length) {
    proxy.$refs.tree.remove(root.childNodes[0]);
  }
  loadTreeNode(root, (data: any) => {
    root.doCreateChildren(data);
  });
};

// 保存后事件
const onSaveAfter = (master: any) => {
  let node = proxy.$refs.tree.getCurrentNode();
  if (node.menuId !== master.menuId) {
    let parentNode = proxy.$refs.tree.getNode(master.parentId);
    if (state.addLevel === 'son') {
      parentNode = proxy.$refs.tree.getNode(node.menuId);
    }
    proxy.$refs.tree.append(
      {
        hasChild: false,
        isLeaf: true,
        menuId: master.menuId,
        menuName: master.menuName,
        label: master.menuName,
      },
      parentNode
    );
    proxy.$refs.tree.setCurrentKey(master.menuId);
    nodeClick(master);
  } else {
    node.menuName = master.menuName;
    node.label = master.menuName;
  }
};

// 创建同级
const createBrotherNode = (formData: any, details: any) => {
  formData.menuId = 0;
  formData.menuName = null;
  formData.description = null;
  formData.tentantMenuId = 0;
  formData.path = null;
  formData.component = null;
  formData.componentName = null;
  formData.activeMenu = null;
  formData.perms = 'browse=浏览';
  formData.orderNum = 0;
  formData.visible = 1;
  formData.isCache = 1;
  formData.enable = 1;
  state.addLevel = 'brother';
};

// 创建子级同级
const createSonNode = (formData: any, details: any) => {
  formData.parentId = formData.tentantMenuId;
  formData.tentantMenuId = 0;
  formData.menuId = 0;
  formData.menuName = null;
  formData.description = null;
  formData.path = null;
  formData.component = null;
  formData.componentName = null;
  formData.activeMenu = null;
  formData.perms = 'browse=浏览';
  formData.orderNum = 0;
  formData.visible = 1;
  formData.isCache = 1;
  formData.enable = 1;
  state.addLevel = 'son';
};

// 删除节点
const deleteNode = async (formData: any, details: any) => {
  if (!state.currentPackage?.packageId) {
    proxy.$message.error('请选择账套！');
    return;
  }

  let whereList: Array<QueryBo> = [];
  whereList.push({
    column: 'packageId',
    values: state.currentPackage.packageId,
    queryType: QueryType.EQ,
    dataType: DataType.INT,
  });

  const _deleteNode = async () => {
    let url = '/system/tenant/tenantMenu/deleteTreeNode';
    let params = {
      tableName: 'sys_tenant_menu',
      keyName: 'menuId',
      keyValue: formData.menuId,
      nodeName: 'menuName',
      parentName: 'parentId',
      extendColumns: '',
      whereList: whereList,
    };
    let res = await postData(url, params);
    proxy.common.showMsg(res);
    if (res.result) {
      let currentNode = proxy.$refs.tree.currentNode;
      let nextNode = getAfterNode(currentNode.parent.childNodes, currentNode);
      proxy.$refs.tree.remove(formData.menuId);
      if (nextNode) {
        proxy.$refs.tree.setCurrentKey(nextNode.data.menuId);
        nodeClick(nextNode.data);
      }
    }
  };
  proxy
    .$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      await _deleteNode();
    })
    .catch(() => {
      proxy.$message.info('已取消删除');
    });
};

// 获取下一节点
const getAfterNode = (childNodes: Array<any>, node: any): any => {
  //获取同级后一个节点，node父节点的所有子节点，node当前节点
  for (let i = 0; i < childNodes.length; i++) {
    if (childNodes[i].id == node.id) {
      if (i < childNodes.length - 1) {
        return childNodes[i + 1];
      } else {
        //没有后面一个节点
        return null;
      }
    } else if (childNodes[i].children) {
      //有下级，递归查询
      return getAfterNode(childNodes[i].children, node);
    }
  }
  return null;
};

// 复制节点
const copyNode = (formData: any, details: any) => {
  // 调用editor中的复制方法
  editorRef.value.copy((res: any) => {
    let node = proxy.$refs.tree.currentNode;
    let parentNode = node.parent;
    let dataInfo = res.data;
    proxy.$refs.tree.append(
      {
        hasChild: false,
        isLeaf: true,
        menuId: dataInfo.menuId,
        sql: formData.sql,
        menuName: dataInfo.menuName,
        label: dataInfo.menuName,
      },
      parentNode
    );
    proxy.$refs.tree.setCurrentKey(dataInfo.menuId);
    nodeClick(dataInfo);
  });
};

// 字段值改变事件
const onChange = (ref: any, val: any, field: any, master: any) => {
  if (field.options.prop === 'path' && val) {
    let node = proxy.$refs.tree.currentNode;
    master.visible = 1;
    master.isCache = 1;
    master.enable = 1;
    master.isFrame = 0;
    if (node.childNodes && node.childNodes.length) {
      master.component = '/layout/routerView/parent';
    } else if (val && val.indexOf('?') >= 0) {
      let vals = val.split('?');
      val = vals[0];
      master.component = val + '.vue';
    } else if (val && val.indexOf(':') >= 0) {
      let vals = val.split(':');
      let file = vals[0];
      val = file.substring(0, file.length - 1);
      master.component = val + '.vue';
    } else {
      if (master.dynamicPath) {
        let vals = master.dynamicPath.split(':');
        let file = vals[0];
        let val = file.substring(0, file.length - 1);
        master.component = val + '.vue';
      } else {
        master.component = val + '.vue';
      }
    }
    master.componentName = val.replace(/\//gi, '-').replace(/^-/gi, '');
    if (master.path?.includes('/amis/amis-engine')) {
      master.component = '/amis/amis-engine.vue';
      master.dynamicPath = '/amis/amis-engine/:id';
    }
  } else if (field.options.prop === 'isLink' && val) {
    if (val.indexOf('http') >= 0) {
      master.component = '/layout/routerView/iframes.vue';
      master.isFrame = 1;
    }
  }
};

// 获取套餐列表
const getPackageList = async () => {
  // 查询条件
  let queryBoList: Array<QueryBo> = [
    {
      column: 'packageId',
      values: 'packageId,packageName', // 查询指定字段
      queryType: QueryType.SELECT,
      dataType: DataType.STRING,
    },
    {
      column: 'status',
      values: 1,
      queryType: QueryType.EQ,
      dataType: DataType.BYTE,
    },
  ];

  let url = '/system/tenant/tenantPackage/getMapList';
  let params = queryBoList;

  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }

  if (res.result) {
    state.packageList = res.data.map((item: Record<string, string>, index: number) => {
      return {
        packageId: item.packageId,
        packageName: item.packageName,
        href: '#part' + index,
      };
    });
  }
};

const handleChange = (href: string) => {
  state.currentHref = href;
  state.currentPackage = state.packageList.find((p) => p.href == href);
  treeRefresh(); // 刷新菜单
};

const handleClick = (e: MouseEvent, href?: string) => {
  e.preventDefault();
};

// 重置为标准菜单
const resetDefault = (formData: any, details: any) => {
  const _resetDefault = async () => {
    let url = '/system/tenant/tenantMenu/resetDefault';
    let params = {
      packageId: state.currentPackage?.packageId,
    };
    let res = await postData(url, params);
    proxy.common.showMsg(res);
    if (res.result) {
      treeRefresh(); // 刷新菜单
    }
  };
  proxy
    .$confirm('此操作将清除现有菜单，重置为标准菜单, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      await _resetDefault();
    })
    .catch(() => {
      proxy.$message.info('已取消删除');
    });
};

// 模块选择器
const moduleNameClick = () => {
  // proxy.$refs.selectorDialog.init();
  state.selectorConfig.visible = true;
};

const onSelected = async (rows: any) => {
  let url = '/system/tenant/tenantMenu/addMenu';
  let params = {
    packageId: state.currentPackage?.packageId,
    menuIdList: rows.map((m: any) => m.menuId),
  };
  let res = await postData(url, params);
  if (res.result) {
    treeRefresh(); // 刷新菜单
  }
  state.selectorConfig.visible = false;
};
</script>

<style lang="scss" scoped>
.biz-container {
  margin: 0px;
  ::v-deep .splitter-pane-resizer.vertical {
    background-color: #9e9e9e;
  }
}
</style>

<style scoped lang="scss">
.app-container {
  display: flex;
  width: 100%;
  background-color: var(--next-bg-main-color);
  padding: 15px;
  .app-left {
    flex: 0 0 auto; /* 当右侧内容超出时会拉伸左侧宽度，设置此样式可解决 */
    padding-top: 10px;
    padding-left: 0px;
    width: 130px;
    background-color: white;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    border-right: 1px solid #e5e5e5;
    .link-item {
      height: 50px;
      width: 100px;
      border-radius: 5px;
      background-color: rgb(186, 235, 231);
      color: rgb(4, 148, 136);
      padding: 8px 10px;
      word-break: break-all;
      text-wrap: pretty;
      line-height: 1.5;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      font-size: 12px !important;
      &.active {
        background-color: rgb(4, 148, 136);
        color: white;
      }
    }
  }
  .app-right {
    width: 100%;
    background-color: white;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
}
</style>
