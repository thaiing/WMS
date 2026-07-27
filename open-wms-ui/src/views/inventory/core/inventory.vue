<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :fixed-where="state.fixedWhere">
      <template #common-column-slot="{ row, col }">
        <template v-if="col.prop == state.dataOptions.linkColumn">
          <el-link type="primary">
            {{ common.formatData(row, col) }}
          </el-link>
        </template>
        <template v-else-if="col.prop == 'holderStorage'">
          <detailstate-flow :load-options="state.stateLoadOptions" :where="{ inventoryId: row[state.dataOptions.idField] }">
            <template #content>
              {{ proxy.common.formatData(row, col) }}
            </template>
          </detailstate-flow>
        </template>
        <!-- 自定义SN显示 -->
        <template v-else-if="col.prop === 'singleSignCode'">
          <span class="sn-text">{{ row.singleSignCode }}</span>
          <span v-if="row.singleSignCode" class="sn-count">[SN数：{{ row.singleSignCode ? row.singleSignCode.split(',').length : 0 }}]</span>
          <el-link v-if="row.singleSignCode || row.isSn" type="primary" @click="viewSn(row)">查看</el-link>
        </template>
        <!--自定义显示图片-->
        <template v-else-if="col.prop === 'images'">
          <el-image v-for="(pic, index) in base.getPicList(row[col.prop])" :src="base.showSmallPic(pic)" class="pic-small" fit="contain" preview-teleported :preview-src-list="base.getPicList(row[col.prop])" />
        </template>
        <template v-else>
          <!-- 通用标签颜色着色 -->
          <template v-if="col.tagColorList && col.tagColorList.length && row[col.prop] !== undefined">
            <el-tag :color="common.getTagBgColor(row, col, row[col.prop])" :style="common.getTagColor(row, col, row[col.prop])">
              {{ common.formatData(row, col) }}
            </el-tag>
          </template>
          <template v-else>
            {{ common.formatData(row, col) }}
          </template>
        </template>
      </template>

      <template #button-tool2-slot>
        <el-checkbox v-model="state.showAll" @change="onShowAll" label="显示全部" />
      </template>
    </yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter"></yrt-editor>

    <!--查看SN列表-->
    <sn-dialog v-model:visible="state.snVisible" :sn-data-list="state.snDataList"></sn-dialog>

    <!--属性转换-->
    <el-dialog v-model="state.dialogFormAttribute" title="属性转换" width="25%" append-to-body>
      <el-form :model="state.transferAttrForm" label-width="85px">
        <el-form-item label="目标属性">
          <el-select v-model="state.transferAttrForm.productAttribute" placeholder="请选择目标属性" style="width: 195px">
            <el-option v-for="(item, index) in state.dropDownList_DestAttr" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="state.transferAttrForm.validStorage" autocomplete="off" placeholder="请选择数量" style="width: 195px" clearable> </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div slot="footer" class="dialog-footer">
          <el-button @click="state.dialogFormAttribute = false">取 消</el-button>
          <el-button type="primary" @click="sSZH()">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <!--货位转移-->
    <el-dialog v-model="state.dialogFormPositionName" title="货位转移" width="25%" append-to-body>
      <el-form :model="state.positionTransferForm" label-width="85px">
        <el-form-item label="仓库">
          <el-input v-model="state.positionTransferForm.storageName" autocomplete="off" style="width: 195px" :disabled="true" clearable> </el-input>
        </el-form-item>
        <el-form-item label="原货位">
          <el-input v-model="state.positionTransferForm.originalPositionName" autocomplete="off" style="width: 195px" :disabled="true" clearable> </el-input>
        </el-form-item>
        <el-form-item label="转换日期">
          <el-date-picker v-model="state.positionTransferForm.convertDate" type="date" placeholder="选择日期" style="width: 195px" value-format="YYYY-MM-DD"></el-date-picker>
        </el-form-item>
        <el-form-item label="目标货位">
          <el-select v-model="state.positionTransferForm.targetPositionName" filterable placeholder="请选择目标货位" style="width: 195px">
            <el-option v-for="(item, index) in state.positionNameList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="state.positionTransferForm.validStorage" autocomplete="off" placeholder="请选择数量" style="width: 195px" clearable> </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div slot="footer" class="dialog-footer">
          <el-button @click="state.dialogFormPositionName = false">取 消</el-button>
          <el-button type="primary" @click="save()">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="inventory-core-inventory">
import { ComponentInternalInstance, nextTick } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import { QueryType, DataType } from '/@/types/common';
import baseHook from '/@/components/hooks/baseHook';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import YrtDataList from '/@/components/common/yrtDataList.vue';
import { ElMessageBox } from 'element-plus';
import useDropdownStore from '/@/stores/modules/dropdown';
import moment from 'moment';
const detailstateFlow = defineAsyncComponent(() => import('/@/components/common/components/detailstateflow.vue'));

const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
const SnDialog = defineAsyncComponent(() => import('/@/components/common/sn-dialog.vue'));

let ins = getCurrentInstance() as ComponentInternalInstance;
const dropdownStore = useDropdownStore();
let proxy = ins.proxy as BaseProperties;
const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  // 显示SN列表对话框
  snVisible: false,
  // sn数据列表
  snDataList: [] as any[],
  fixedWhere: {
    productStorage: {
      queryType: QueryType.GT,
      value: 0,
    },
  },
  //显示全部
  showAll: false,
  // 明细分拣状态流加载参数
  stateLoadOptions: {
    prefixRouter: 'inventory/core/inventoryHolder',
    folder: 'inventory/core',
    // projectName: 'ERP.Storage',
    tableName: 'core_inventory_holder',
    idField: 'holder_id',
    orderBy: 'holder_id DESC, holder_id',
    pageIndex: 1,
    pageSize: 100,
    menuId: -1,
    codeType: 'inventory',
  },
  dialogFormAttribute: false,
  dialogFormPositionName: false,
  dropDownList_DestAttr: [] as any,
  transferAttrForm: {
    productAttribute: '',
    validStorage: 0,
    maxValidStorage: 0,
  },
  positionNameList: [] as any,
  positionTransferForm: {
    convertDate: new Date(),
    productAttribute: '',
    validStorage: 0,
    maxValidStorage: 0,
    storageName: '',
    storageId: '',
    originalPositionName: '',
    targetPositionName: '',
  },
  checkList: [],
  groupFields: [],
});
//#endregion

onMounted(async () => {
  await dropdownStore.loadDropDownById([834]);
  state.dropDownList_DestAttr = (await dropdownStore.getDropdown(834)?.value) || [];
});

// 查看SN列表
const viewSn = async (row: any) => {
  state.snDataList = [];
  state.snVisible = true;
  const url = '/inventory/core/inventorySn/selectListByInventoryId/' + row.inventoryId;
  const params = {};
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res?.result) {
    state.snDataList = res.data.map((item: any) => {
      item.enable = item.enable === 1 ? '是' : '否';
      item.createDate = proxy.common.formatDate(item.createDate, 'YYYY-MM-DD HH:mm:ss');
      if (item.outDate) {
        item.outDate = proxy.common.formatDate(item.outDate, 'YYYY-MM-DD HH:mm:ss');
      }
      return item;
    });
    state.snDataList.sort((a, b) => {
      return a.enable > b.enable ? -1 : 1;
    });
  }
};

const onShowAll = () => {
  if (!state.showAll) {
    state.fixedWhere = {
      productStorage: {
        queryType: QueryType.GT,
        value: 0,
      },
    };
  } else {
    state.fixedWhere = {} as any;
  }
  nextTick(() => {
    base.dataListRef.value.loadData();
  });
};
// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    // 属性转换
    case 'attributeConvert':
      attributeConvert();
      return true;
    // 锁定
    case 'lock':
      lock();
      return true;
    // 解锁
    case 'unlock':
      unlock();
      return true;
  }
};

// 货位转移弹窗
const positionTransfer = () => {
  if (state.dataListSelections.length != 1) {
    proxy.$message.error('请选择一项！');
    return;
  }
  state.positionTransferForm.targetPositionName = '';
  getPositionList(state.dataListSelections[0].storageId, state.positionTransferForm.targetPositionName);
  state.dialogFormPositionName = true;
  state.positionTransferForm.storageName = state.dataListSelections[0].storageName;
  state.positionTransferForm.storageId = state.dataListSelections[0].storageId;
  state.positionTransferForm.originalPositionName = state.dataListSelections[0].positionName;
  state.positionTransferForm.validStorage = Number(state.dataListSelections[0].validStorage);
  state.positionTransferForm.maxValidStorage = Number(state.dataListSelections[0].validStorage);
};

// 获得仓库和货位信息
const getPositionList = async (storageId: any, val: any) => {
  var url = '/basic/storage/position/getPositionList';
  var params = {
    storageId: storageId,
    isOnShelve: false,
    positionTypes: ' 13,12,8,1,2,14', //存储货位,高架货位,次品货位,常规货位,残品货位,临期货位
  } as any;

  if (val) {
    params = {
      storageId: storageId,
      name: val,
      isOnShelve: false,
      positionTypes: ' 13,12,8,1,2,14', //存储货位,高架货位,次品货位,常规货位,残品货位,临期货位
    };
  }
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    state.positionNameList = res.data.map((m: any) => {
      m.value = m.positionName;
      m.label = m.positionName;
      return m;
    });
    // if (state.positionNameList.length) {
    // 	state.positionTransferForm.targetPositionName = state.positionNameList[0].positionName;
    // }
  } else {
    state.positionNameList = [];
  }
};
// 属性转换弹窗
const attributeConvert = () => {
  if (state.dataListSelections.length != 1) {
    proxy.$message.error('请选择一项！');
    return;
  }
  state.dialogFormAttribute = true;
  state.transferAttrForm.validStorage = Number(state.dataListSelections[0].validStorage);
  state.transferAttrForm.maxValidStorage = Number(state.dataListSelections[0].validStorage);
};

// 提交数据
const save = async () => {
  var dataList: any[] = state.dataListSelections.map((element: any) => {
    element.targetPositionName = state.positionTransferForm.targetPositionName;
    element.finishedQuantity = Math.Round(state.positionTransferForm.validStorage, 4);
    element.unFinishedQuantity = Math.Round(element.validStorage - state.positionTransferForm.validStorage, 4);
    element.validQuantity = element.validStorage; // 原始可扫描数量
    element.rowWeight = Math.Round(element.rowWeight, 4);
    element.produceDate = element.produceDate ? moment(element.produceDate).format('YYYY-MM-DD') : null;
    element.singleSignCodeOrigin = element.singleSignCode; // 备份源SN
    element.sortIndex = 0;
    element.isManageSn = element.singleSignCodeOrigin ? 1 : '';
    element.sourceDetailId = element.inventoryId;
    // 清空条码信息
    element.singleSignCode = '';

    return element;
  });
  dataList = dataList.filter((f) => f.finishedQuantity > 0);
  if (dataList.length <= 0) {
    proxy.$message.error('已扫描数量不能为0！');
    return;
  }
  for (const item of dataList) {
    if (item.storageStatus === '理货待上架') {
      proxy.$message.error('理货待上架不能货位转移！');
    }
  }
  proxy
    .$confirm('您确定要[转移]扫描的数据吗？', '货位转移', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      var url = '/inventory/operation/positionTransfer/savePositionTransfer';
      var params = {
        transferType: 'STORAGE_POSITION_TRANSFTER', // 标记货位转移
        storageId: state.positionTransferForm.storageId,
        dataList: dataList,
        originalPositionName: state.positionTransferForm.originalPositionName,
        targetPositionName: state.positionTransferForm.targetPositionName,
      };

      const [err, res] = await to(postData(url, params));
      if (err) {
        proxy.$message.error(err.message);
        return;
      }

      if (res.result) {
        proxy.common.showMsg(res);
        base.dataListRef.value.loadData();
      }
    })
    .catch(() => {
      proxy.$message.info('已取消删除');
    });
};
// 属性转换方法
const sSZH = () => {
  if (!state.transferAttrForm.productAttribute) {
    proxy.$message.error('请选择目标属性');
    return;
  }
  if (state.transferAttrForm.validStorage > state.transferAttrForm.maxValidStorage) {
    state.transferAttrForm.validStorage = state.transferAttrForm.maxValidStorage;
    proxy.$message.error('转移数量不能大于有效库存！');
    return;
  }

  const url = '/composite/inventoryAttribute/attributeConvert';
  ElMessageBox.confirm('您确定要将选中的数据进行属性转换吗？', '属性转换', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const params = {
        productAttribute: state.transferAttrForm.productAttribute,
        validStorage: state.transferAttrForm.validStorage,
        inventoryId: state.dataListSelections[0].inventoryId,
      };

      const [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }

      proxy.common.showMsg(res);

      if (res.result) {
        state.transferAttrForm.productAttribute = '';
        state.dialogFormAttribute = false;
        base.dataListRef.value.loadData();
      }
    })
    .catch(() => {});
};
// 锁定
const lock = () => {
  // 获得已选中的ID
  let selectInfos: Array<any> = state.dataListSelections;
  let ids = selectInfos.map((item) => item.inventoryId);
  const url = '/inventory/core/inventory/lock';

  let flag = false;
  for (const item of selectInfos) {
    if (['正常'].indexOf(item.storageStatus) == -1) {
      flag = true;
    }
  }
  if (flag) {
    proxy.$message.error('只有库存属性为 "正常" 的单据才可以执行锁定操作！');
    return;
  }
  ElMessageBox.confirm('您确定要将选中的数据进行锁定操作？', '锁定', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const params = {
        ids: ids,
      };
      const [err, res] = await to(postData(url, params));
      if (err) {
        proxy.$message.error(err.message);
        return;
      }

      if (res.result) {
        base.dataListRef.value.loadData();
      }
    })
    .catch(() => {});
};
// 解锁
const unlock = () => {
  // 获得已选中的ID
  let selectInfos: Array<any> = state.dataListSelections;
  let ids = selectInfos.map((item) => item.inventoryId);
  const url = '/inventory/core/inventory/unlock';
  let flag = false;
  for (const item of selectInfos) {
    if (['锁定'].indexOf(item.storageStatus) == -1) {
      flag = true;
    }
  }
  if (flag) {
    proxy.$message.error('只有库存属性为 "锁定" 的单据才可以执行解锁操作！');
    return;
  }
  ElMessageBox.confirm('您确定要将选中的数据进行解锁操作？', '解锁', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const params = {
        ids: ids,
      };
      const [err, res] = await to(postData(url, params));
      if (err) {
        proxy.$message.error(err.message);
        return;
      }

      if (res.result) {
        base.dataListRef.value.loadData();
      }
    })
    .catch(() => {});
};
</script>
