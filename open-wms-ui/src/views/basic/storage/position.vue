<template>
  <div class="biz-container">
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
                <el-tree ref="tree" :data="state.dataTree" :load="(node, resolve) => loadTreeNode(node, resolve)" :expand-on-click-node="false" :filter-node-method="filterTreeNode" :default-expand-all="false" :props="state.props" node-key="treeKey" highlight-current lazy @node-click="nodeClick">
                  <template #default="{ node, data }">
                    <span class="custom-tree-node" @mouseover="() => treeNodeOver(node, data)" @mouseout="() => treeNodeOut(node, data)">
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
        <div class="biz-container">
          <transition name="slide-right" mode="out-in">
            <!--数据Table-->
            <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :on-delete-before="onDeleteBefore" :fixed-where="state.fixedWhere"> </yrt-data-list>
          </transition>
          <!--数据编辑器Editor-->
          <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="detailButtonClick" :auth-nodes="state.authNodes" @on-change="base.onChange" @on-save-after="base.onSaveAfter" :on-save-before="base.onSaveBefore"> </yrt-editor>
        </div>
      </template>
    </split-pane>
  </div>
</template>

<script setup lang="ts" name="basic-storage-position">
import YrtDataList from '/@/components/common/yrtDataList.vue';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
import { BaseProperties } from '/@/types/base-type';
import { ComponentInternalInstance } from 'vue';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import { QueryBo, QueryType, DataType, OrderItem, OrderByType } from '/@/types/common';
const base = baseHook();

const { baseState, dataListRefName, editorRefName, detailButtonClick, editorInfo } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  filterText: '',
  dataTree: [] as any[],
  hasDataTree: false,
  // 编辑级联是否加载完毕
  isTreeLoaded: false,
  props: {
    label: 'label',
    children: 'children',
    isLeaf: 'isLeaf',
  },
  // 鼠标滑过的ID
  treeNodeOverId: 0,
  fixedWhere: {},
});
//#endregion

onMounted(() => {});

watch(
  () => state.filterText,
  (val) => {
    proxy.$refs.tree.filter(val);
  }
);
// 获得左侧类目导航节点数据
const loadTreeNode = async (node: any, resolve: any) => {
  let whereList: Array<QueryBo> = []; // 查询条件
  let params: any;
  let orderByList: Array<OrderItem> = []; // 排序提交
  let url = '/system/core/common/loadTreeNode';
  if (node.level === 0) {
    orderByList.push({
      column: 'orderNum',
      orderByType: OrderByType.DESC,
    });
    // 仓库
    whereList.push({
      column: 'parentId',
      values: 0,
      queryType: QueryType.EQ,
      dataType: DataType.LONG,
    });
    params = {
      tableName: 'base_storage',
      keyName: 'storageId',
      nodeName: 'storageName',
      fixHasChild: true,
      showOutsideNode: false,
      parentName: 'parentId',
      whereList: whereList, // 查询条件
      orderByList: orderByList, // 排序字段
      extendColumns: '',
    };
  } else if (node.level === 1) {
    orderByList.push({
      column: 'orderNum,areaCode,shelveMode',
      orderByType: OrderByType.DESC,
    });

    // 库区
    whereList.push({
      column: 'storageId',
      values: node.data.storageId,
      queryType: QueryType.EQ,
      dataType: DataType.LONG,
    });

    params = {
      tableName: 'base_storageArea',
      keyName: 'storageAreaId',
      nodeName: 'areaCode',
      fixHasChild: true,
      showOutsideNode: false,
      parentName: 'parentId',
      whereList: whereList, // 查询条件
      orderByList: orderByList, // 排序字段
      extendColumns: 'storageId',
    };
  } else if (node.level === 2) {
    orderByList.push({
      column: 'orderNum,positionName',
      orderByType: OrderByType.DESC,
    });
    if (node.data.areaCode === '非标准库区') {
      // 非标准库区
      whereList.push({
        column: 'storageId',
        values: node.data.storageId,
        queryType: QueryType.EQ,
        dataType: DataType.LONG,
      });
      whereList.push({
        column: 'areaCode',
        values: '',
        queryType: QueryType.EQ,
        dataType: DataType.STRING,
      });
      params = {
        tableName: 'base_position',
        keyName: 'positionId',
        nodeName: 'positionName',
        fixHasChild: true,
        showOutsideNode: false,
        parentName: 'parentId',
        whereList: whereList, // 查询条件
        orderByList: orderByList, // 排序字段
        extendColumns: 'storageId,areaCode',
      };
    } else {
      // 通道
      url = '/basic/storage/position/selectAreaCodeList';
      params = {
        storageId: node.data.storageId,
        areaCode: node.data.areaCode,
      };
    }
  } else if (node.level === 3) {
    if (node.data.shelveMode === '地堆') {
      orderByList.push({
        column: 'orderNum,positionName',
        orderByType: OrderByType.DESC,
      });
      // 地堆没有货架直接显示货位
      whereList.push({
        column: 'storageId',
        values: node.data.storageId,
        queryType: QueryType.EQ,
        dataType: DataType.LONG,
      });
      whereList.push({
        column: 'areaCode',
        values: node.data.areaCode,
        queryType: QueryType.EQ,
        dataType: DataType.STRING,
      });
      whereList.push({
        column: 'channelCode',
        values: node.data.channelCode,
        queryType: QueryType.EQ,
        dataType: DataType.STRING,
      });
      params = {
        tableName: 'base_position',
        keyName: 'positionId',
        nodeName: 'positionName',
        fixHasChild: true,
        showOutsideNode: false,
        parentName: 'parentId',
        orderByList: orderByList,
        whereList: whereList,
        extendColumns: 'storageId,areaCode,shelveMode',
      };
    } else {
      url = '/basic/storage/position/selectShelveCodeList';
      params = {
        storageId: node.data.storageId,
        areaCode: node.data.areaCode,
        channelCode: node.data.channelCode,
      };
    }
  } else if (node.level === 4) {
    orderByList.push({
      column: 'orderNum,positionName',
      orderByType: OrderByType.DESC,
    });
    // 货位
    if (!node.data.areaCode) {
      // 非标准，直接加载货位
      whereList.push({
        column: 'parentId',
        values: node.data.storageId,
        queryType: QueryType.EQ,
        dataType: DataType.LONG,
      });
      params = {
        tableName: 'base_position',
        keyName: 'positionId',
        nodeName: 'positionName',
        fixHasChild: true,
        showOutsideNode: false,
        parentName: 'parentId',
        orderByList: orderByList,
        whereList: whereList,
        extendColumns: 'storageId,areaCode,channelCode,shelveMode',
      };
    } else {
      whereList.push({
        column: 'storageId',
        values: node.data.storageId,
        queryType: QueryType.EQ,
        dataType: DataType.LONG,
      });
      whereList.push({
        column: 'areaCode',
        values: node.data.areaCode,
        queryType: QueryType.EQ,
        dataType: DataType.STRING,
      });
      whereList.push({
        column: 'channelCode',
        values: node.data.channelCode,
        queryType: QueryType.EQ,
        dataType: DataType.LONG,
      });
      whereList.push({
        column: 'shelveCode',
        values: node.data.shelveCode,
        queryType: QueryType.EQ,
        dataType: DataType.STRING,
      });
      params = {
        tableName: 'base_position',
        keyName: 'positionId',
        nodeName: 'positionName',
        fixHasChild: true,
        showOutsideNode: false,
        parentName: 'parentId',
        orderByList: orderByList,
        whereList: whereList,
        extendColumns: 'storageId,areaCode,channelCode,shelveMode',
      };
    }
  } else {
    whereList.push({
      column: 'storageId',
      values: node.data.storageId,
      queryType: QueryType.EQ,
      dataType: DataType.LONG,
    });
    whereList.push({
      column: 'parentId',
      values: node.data.positionId,
      queryType: QueryType.EQ,
      dataType: DataType.LONG,
    });
    params = {
      tableName: 'base_position',
      keyName: 'positionId',
      nodeName: 'positionName',
      fixHasChild: true,
      showOutsideNode: false,
      parentName: 'parentId',
      orderByList: orderByList,
      whereList: whereList,
      extendColumns: '',
    };
  }
  let [err, res] = await to(postData(url, params));
  if (err) return;

  if (res?.result) {
    res?.data.forEach((element: any) => {
      element.isLeaf = !element.hasChild;
      if (element.storageAreaId !== -1 && node.level === 1) {
        element.label = element.label + '区';
      } else if (element.areaCode && node.level === 2) {
        element.label = (element.channelCode || '无') + '通道';
        element.isLeaf = false;
        element.hasChild = 1;
      } else if (element.shelveCode && node.level === 3) {
        element.label = (element.shelveCode || '无') + '货架';
        element.isLeaf = false;
        element.hasChild = 1;
      }
    });
    resolve(res.data);
  } else {
    proxy.$message.error(res?.data.msg);
  }
};
// 搜索导航
const filterTreeNode = (value: any, data: any) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
// 点击tree导航节点
const nodeClick = (data: any, node: any, el: any) => {
  let where: any = {};
  switch (node.level) {
    case 1: // 仓库
      where.storageId = node.data.storageId;
      break;
    case 2: // 库区
      if (node.data.areaCode === '非标准库区') {
        // 非标准库区
        where.parentId = 0;
        where.storageId = node.data.storageId;
        where.channelCode = null;
      } else {
        where.storageId = node.data.storageId;
        where.areaCode = node.data.areaCode;
      }
      break;
    case 3: // 通道
      if (!node.data.channelCode) {
        // 非标准库区
        where.parentId = 0;
        where.storageId = node.data.storageId;
        where.positionName = node.data.positionName;
      } else {
        where.storageId = node.data.storageId;
        where.areaCode = node.data.areaCode;
        where.channelCode = node.data.channelCode;
      }
      break;
    case 4: // 货架
      if (!node.data.shelveCode) {
        if (node.data.shelveMode === '地堆') {
          // 地堆
          where.positionId = node.data.positionId;
        } else {
          // 非标准库区
          where.parentId = 0;
          where.storageId = node.data.storageId;
          where.shelveCode = null;
        }
      } else {
        where.storageId = node.data.storageId;
        where.areaCode = node.data.areaCode;
        where.channelCode = node.data.channelCode;
        where.shelveCode = node.data.shelveCode;
      }
      break;
    default:
      where.positionId = node.data.positionId;
      break;
  }
  state.fixedWhere = where;
  proxy.$nextTick(() => {
    base.dataListRef.value.loadData();
  });
};

// 刷新tree
const treeRefresh = () => {
  state.filterText = '';
  var root = proxy.$refs.tree.store.root;
  while (root.childNodes.length) {
    proxy.$refs.tree.remove(root.childNodes[0]);
  }

  loadTreeNode(root, (data: any) => {
    root.doCreateChildren(data);
  });

  state.isTreeLoaded = false;
};
// 新建节点
const treeNodeAppend = (node?: any, data?: any) => {
  base.editorRef.value.addData();
};
// 编辑节点
const treeNodeEdit = (node: any, data: any) => {
  base.editorRef.value.loadEditData(data.typeId);
};
// 删除
const treeNodeRemove = (node: any, data: any) => {
  base.dataListRef.value.deleteData([data], () => {
    treeRefresh();
  });
};
const treeNodeOver = (node: any, data: any) => {
  state.treeNodeOverId = data.value;
};
const treeNodeOut = (node: any, data: any) => {
  state.treeNodeOverId = -1;
};

// 级联改变数据
base.onChange = (ref: any, val: any, field: any) => {
  // // 设置表单数据
  // if (field.options.prop === 'fullTypeId') {
  // 	base.masterData.value.parentId = val[val.length - 1];
  // 	setTimeout(() => {
  // 		base.masterData.value.parentId.fullPathName = ref.inputValue;
  // 	}, 500);
  // } else if (field.options.prop === 'storageName') {
  // 	const storageId = base.masterData.value.storageId;
  // 	loadChildrenNode(storageId);
  // }
};
// const loadChildrenNode = (storageId: any) => {
// 	var editorRef = this.$refs[this.editorRef];
// 	var where = { storageId: storageId };
// 	var url = '/system/core/common/loadTreeNode';
// 	var params = {
// 		folder: 'basicInfo/base',
// 		DBServer: 'Sys',
// 		tableName: 'base_storageArea',
// 		tableView: 'base_storageArea',
// 		keyName: 'storageAreaId',
// 		nodeName: 'areaCode',
// 		fixHasChild: false,
// 		isBreakWay: false,
// 		displayBreakWay: false,
// 		parentName: 'storageId',
// 		orderBy: 'orderNo DESC,storageAreaId',
// 		where: where,
// 		extendColumns: '',
// 	};
// 	// alert(storageId);
// 	this.common.ajax(
// 		url,
// 		params,
// 		(res) => {
// 			if (res.result) {
// 				const data = res.data.map((item) => {
// 					const list = {
// 						areaCode: item.label,
// 						value: item.value,
// 						label: item.label,
// 					};
// 					return list;
// 				});
// 				editorRef.setDropdownData(1053, data);
// 			} else {
// 				this.$message.error(res.msg);
// 			}
// 		},
// 		true
// 	);
// };
// 级联加载子集数据
// const cascaderLoadNode = (ref: any, val: any, field: any) => {
// 	var where = 'parentId=0';
// 	var url = '/api/common/loadTreeNodeAll';
// 	var params = {
// 		dbServer: 'Sys',
// 		tableName: 'base_position',
// 		tableView: 'base_position',
// 		keyName: 'positionId',
// 		nodeName: 'positionName',
// 		fixHasChild: false,
// 		isBreakWay: false,
// 		displayBreakWay: false,
// 		parentName: 'parentId',
// 		orderBy: 'orderNo desc, positionId',
// 		where: where,
// 		extendColumns: '',
// 	};
// 	this.common.ajax(
// 		url,
// 		params,
// 		(res) => {
// 			if (res.result) {
// 				var items = [
// 					{
// 						value: 0,
// 						label: '根',
// 						children: res.data,
// 					},
// 				];

// 				field.options.options = items;
// 			} else {
// 				this.$message.error(res.msg);
// 			}
// 		},
// 		true
// 	);
// };
// 保存后
base.onSaveAfter = () => {
  treeRefresh();
};
// 删除前事件
const onDeleteBefore = (dataOptions: any, rows: any[]) => {
  dataOptions.deleteUrl = '/composite/basic/basePositionComposite/remove';
  return true;
};
// // 保存前事件
// base.onSaveBefore = (formData: any) => {
// 	if (('' + formData.maxCapacity).length > 10) {
// 		proxy.$message.error('超过最大容量');
// 		return false;
// 	}
// };
</script>
