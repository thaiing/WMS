<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" :on-save-before="base.onSaveBefore" :detailRemoteMethod="base.detailRemoteMethod" @on-save-after="base.onSaveAfter" @on-change="base.onChange" @on-detail-change="base.onDetailChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" @on-blur="base.onBlur" @on-detail-delete-after="base.onDetailDeleteAfter" :use-detail-slot="['images']">
      <!--自定义字段插槽-->
      <template #detail-column-slot="{ row, col }">
        <template v-if="col.prop === 'images'">
          <el-image v-for="(pic, index) in base.getPicList(row[col.prop])" :src="base.showSmallPic(pic)" class="pic-small" fit="contain" preview-teleported :preview-src-list="base.getPicList(row[col.prop])" />
        </template>
      </template>
    </yrt-editor>
    <!-- 商品选择器 -->
    <yrt-selector ref="selector-dialog" :config="state.selectorConfig" v-model:visible="state.selectorConfig.visible" @on-selected="onSelected"></yrt-selector>
  </div>
</template>

<script setup lang="ts" name="inbound-in-orderPlan">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import baseHook from '/@/components/hooks/baseHook';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import YrtDataList from '/@/components/common/yrtDataList.vue';
import { DeleteBo, DetailDataBo, DetailInfo, EditorOptions } from '/@/api/types';
import useDropdownStore from '/@/stores/modules/dropdown';
import { ElMessageBox } from 'element-plus';
import { PositionTypeEnum } from '/@/enums/PositionTypeEnum';
const yrtSelector = defineAsyncComponent(() => import('/@/components/common/yrtSelector.vue'));

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const dropdownStore = useDropdownStore();

const base = baseHook();
const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  selectorConfig: {
    title: '商品选择器',
    width: '1000px',
    visible: false,
    // 配置路由
    router: '/selector/product',
  },
});
//#endregion

onMounted(() => {});

// 将选择器选择中的数据填充到明细表中
const onSelected = async (rows: Array<any>) => {
  // rows.forEach((item) => {
  // 	;
  // 	if (item.providerId) {
  // 		var val = {
  // 			providerShortName: item.providerShortName,
  // 		};
  // 		var rate = getProviderInfo(val);
  // 		;
  // 		rate;
  // 	}
  // });

  for (let item of rows) {
    const url = '/basic/product/provider/getByShortName';
    const params = {
      providerShortName: item.providerShortName,
    };
    let [err, res] = await to(postData(url, params));
    if (err) {
      return;
    }
    if (res?.result) {
      let data = res.data;
      if (data) {
        item.rate = Number(data.rate);
      }
    }
  }
  base.editorRef.value.addDetailDataRow(rows);
  state.selectorConfig.visible = false;
  // for (let item of base.detailRows.value) {
  // 	setTimeout(async () => {

  // 	}, 100);
  // }
};

const getProviderInfo = async (val: any) => {
  const url = '/basic/product/provider/getByShortName';
  const params = {
    providerShortName: val.providerShortName,
  };
  let [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res?.result) {
    let data = res.data;
    if (data) {
      return Number(data.rate);
    }
  }
};
// 编辑页面按钮事件
base.detailButtonClick = (authNode: string) => {
  switch (authNode) {
    case 'detailAdd':
      detailAdd();
      return true;
  }
};
// 主表按钮事件
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    case 'auditing':
      // 批量审核
      if (state.dataListSelections.length !== 1) {
        proxy.$message.error('请选择一条数据！');
        return;
      }
      multiAuditing(state.dataListSelections);
      return true;

    case 'toPurchase':
      // 转预到货单
      if (state.dataListSelections.length !== 1) {
        proxy.$message.error('请选择一条数据！');
        return;
      }
      if (state.dataListSelections.filter((item) => item.returnStatus != '审核成功').length > 0) {
        proxy.$message.error('只允许审核成功的单据操作！');
        return;
      }
      toPurchase();
      return true;
    case 'confirmIn':
      // 确认入库
      if (state.dataListSelections.length !== 1) {
        proxy.$message.error('请选择一条数据！');
        return;
      }
      if (state.dataListSelections.filter((item) => item.returnStatus != '审核成功').length > 0) {
        proxy.$message.error('只允许审核成功的单据操作！');
        return;
      }
      confirmIn();
      return true;
    case 'returnConfirm':
      // 退货确认
      if (state.dataListSelections.length !== 1) {
        proxy.$message.error('请选择一条数据！');
        return;
      }
      if (state.dataListSelections.filter((item) => item.returnStatus != '审核成功').length > 0) {
        proxy.$message.error('只允许审核成功的单据操作！');
        return;
      }
      returnConfirm();
      return true;
    case 'returnReject':
      // 退货驳回
      if (state.dataListSelections.length !== 1) {
        proxy.$message.error('请选择一条数据！');
        return;
      }
      if (state.dataListSelections.filter((item) => item.returnStatus != '审核成功').length > 0) {
        proxy.$message.error('只允许审核成功的单据操作！');
        return;
      }
      returnReject();
      return true;
  }
};

// 转到预到货单
const toPurchase = async () => {
  proxy
    .$confirm('确定要转到预到货单吗?', '转预到货单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      // const formData = state.dataListSelections[0];
      const ids = state.dataListSelections.map((item: any) => item.returnId);
      const url = '/composite/out/return/toInOrder';
      const params = {
        ids: ids.join(','),
      };
      const [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }
      proxy.common.showMsg(res);

      if (res.result) {
        base.dataListRef.value.reload(); // 刷新列表数据
      }
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};

// 确认入库
const confirmIn = async () => {
  proxy
    .$confirm('确定要确认入库吗?', '确认入库', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      // const formData = state.dataListSelections[0];
      const ids = state.dataListSelections.map((item: any) => item.returnId);
      const url = '/composite/out/return/saveCheck';
      const params = {
        ids: ids.join(','),
      };
      const [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }
      proxy.common.showMsg(res);

      if (res.result) {
        base.dataListRef.value.reload(); // 刷新列表数据
      }
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};
// 退货确认
const returnConfirm = async () => {
  proxy
    .$confirm('确定要执行吗?', '退货确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      // const formData = state.dataListSelections[0];
      const ids = state.dataListSelections.map((item: any) => item.returnId);
      const url = '/outbound/service/return/returnConfirm';
      const params = ids;
      const [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }
      proxy.common.showMsg(res);

      if (res.result) {
        base.dataListRef.value.reload(); // 刷新列表数据
      }
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};
// 退货驳回
const returnReject = async () => {
  proxy
    .$confirm('确定要执行吗?', '退货驳回', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      // const formData = state.dataListSelections[0];
      const ids = state.dataListSelections.map((item: any) => item.returnId);
      const url = '/outbound/service/return/returnReject';
      const params = ids;
      const [err, res] = await to(postData(url, params));
      if (err) {
        return;
      }
      proxy.common.showMsg(res);

      if (res.result) {
        base.dataListRef.value.reload(); // 刷新列表数据
      }
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};
// 批量审核
const multiAuditing = async (selections: Array<any>) => {
  let isQty = true;
  let isProviderShortName = true;

  base.detailRows.value?.forEach((item) => {
    if (item.actualReturnQuantity <= 0 || !item.actualReturnQuantity) {
      isQty = false;
    }
    if (!item.providerShortName) {
      isProviderShortName = false;
    }
  });
  if (!isQty) {
    proxy.$message.error('实退数量必须大于0！');
    return false;
  }
  if (!isProviderShortName) {
    proxy.$message.error('明细供应商必填！');
    return false;
  }
  for (const row of state.dataListSelections) {
    if (!row['returnId']) {
      proxy.$message.error('请先保存表单，再执行审核操作！');
      return;
    }
  }
  // 选中行id
  let ids = selections.map((item) => item.returnId);

  ElMessageBox.confirm('确定操作当前选中的单据吗', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const url = '/outbound/service/return/multiAuditing';

      const params = ids;
      const [err, res] = await to(postData(url, params));
      if (err) {
        proxy.$message.error(err.message);
        return;
      }
      if (res.result) {
        proxy.common.showMsg(res);
        base.dataListRef.value.reload(); // 刷新列表数据
      }
    })
    .catch(() => {});
};

// 明细添加
const detailAdd = () => {
  state.selectorConfig.visible = true;
};

// 输入遇到货单号失去焦点加载主表信息
base.onBlur = async (ref: any, val: any, event: any, field: any) => {
  if (field.label === '出库单号' && val) {
    const url = '/outbound/service/return/onBlurGetByCode';
    const params = {
      orderCode: val,
    };
    const [err, res] = await to(postData(url, params));

    if (err) {
      return;
    }
    if (res?.result) {
      if (field.options.prop === 'orderCode') {
        base.masterData.value.storeOrderCode = res.data.order.sourceCode;
        base.masterData.value.orderId = res.data.order.orderId;
        base.masterData.value.orderCode = res.data.order.orderCode;
        base.masterData.value.storageId = res.data.order.storageId;
        base.masterData.value.storageName = res.data.order.storageName;
        base.masterData.value.consignorId = res.data.order.consignorId;
        base.masterData.value.consignorCode = res.data.order.consignorCode;
        base.masterData.value.consignorName = res.data.order.consignorName;
        base.masterData.value.clientId = res.data.order.clientId;
        base.masterData.value.clientShortName = res.data.order.clientShortName;
      } else {
        proxy.masterData.field = res.data.order[field];
      }

      // });
      if (res.data.detailsVo) {
        // 默认为第一个明细表名称
        // var subTableView = base.editorRef.value.detailFields[0].subTableView;
        res.data.detailsVo.forEach((item: any) => {
          item.actualReturnQuantity = item.quantityOrder;

          item.orderQuantity = item.quantityOuted;
          item.returnQuantity = item.quantityOuted;
        });
        base.editorRef.value.clearDetailDataRow();

        // base.editorRef.value.formData[subTableView].rows = []; // 清空数据
        base.editorRef.value.addDetailDataRow(res.data.detailsVo);
      }

      setTotal(base.detailRows.value);
    }
  }
};

// 明细字段触发改变
base.onDetailChange = (ref: any, val: any, row: any, field: DetailField, detailRows: Array<any>) => {
  setTotal(detailRows);
};

// 求和
const setTotal = (detailRows: Array<any>) => {
  // 合计数量求和
  let totalReturnQuantity = 0; // 退货数量
  let totalSaleAmount = 0; // 退货金额
  let bigOtyTotal = 0.0; // 大单位数量
  let totalWeight = 0.0; // 合计重量
  let totalCube = 0.0; // 合计体积
  let totalAmount = 0.0; // 成本金额
  let totalRateAmount = 0.0; // 成本含税金额
  detailRows &&
    detailRows.forEach((item: any) => {
      item.saleAmount = Math.Round((item.salePrice || 0) * (item.actualReturnQuantity || 0));
      item.purchaseAmount = Math.Round((item.purchasePrice || 0) * (item.actualReturnQuantity || 0));

      totalReturnQuantity += Number(item.actualReturnQuantity) || 0;
      totalSaleAmount += Number(item.saleAmount) || 0;
      if (Number(item.actualReturnQuantity) == 0 || Number(item.unitConvert) == 0) {
        item.bigQty = 0;
      } else {
        item.bigQty = (Number(item.actualReturnQuantity) || 0) / (Number(item.unitConvert) || 0);
      }
      bigOtyTotal += Number(item.bigQty || 0);

      item.rowWeight = Math.Round((item.weight || 0) * (item.actualReturnQuantity || 0)); // 小计毛重
      item.rowCube = Math.Round((item.actualReturnQuantity || 0) * (item.unitCube || 0), 6); // 小计体积

      item.ratePrice = Math.Round((Number(item.purchasePrice) || 0) * (1 + (Number(item.rate) || 0)), 5); // 含税单价 = 单价*（1+税率）
      item.rateAmount = Math.Round((item.actualReturnQuantity || 0) * (item.ratePrice || 0), 2); // 含税金额 = 数量 * 含税单价；

      totalWeight += Number(item.rowWeight) || 0;
      totalCube += Number(item.rowCube) || 0;

      totalAmount += Number(item.purchaseAmount) || 0;
      totalRateAmount += Number(item.rateAmount) || 0;
    });
  totalSaleAmount;
  masterData.value.totalReturnQuantity = Math.Round(totalReturnQuantity, 2);
  masterData.value.totalSaleAmount = Math.Round(totalSaleAmount, 2); // 退款金额
  masterData.value.bigOtyTotal = Math.Round(bigOtyTotal, 4);
  masterData.value.totalWeight = Math.Round(totalWeight, 2);
  masterData.value.totalCube = Math.Round(totalCube, 2);

  masterData.value.totalUnrefundAmount = Math.Round(totalSaleAmount - masterData.value.totalRefundAmount, 2);
  masterData.value.totalAmount = Math.Round(totalAmount, 2);
  masterData.value.totalRateAmount = Math.Round(totalRateAmount, 2);
};

// 加载完毕后事件
base.onEditLoadAfter = async (masterData: any) => {
  positionNameQuery();
};
// 明细下拉框搜索
base.detailRemoteMethod = async (query: string, row: any, col: any) => {
  if (col.prop === 'positionName') {
    await positionNameQuery(query);
  }
};
const positionNameQuery = async (query?: string) => {
  const url = '/basic/storage/position/getList';
  const params = {
    storageId: masterData.value.storageId,
    name: query,
    positionType: PositionTypeEnum.NORMAL, // 上架货位
  };
  const [err, res] = await to(postData(url, params, false));
  if (res?.result) {
    let dataList = res.data.map((m: any) => {
      m.value = m.positionId;
      m.label = m.positionName;
      return m;
    });
    dropdownStore.setDropDown(544, dataList); // 更新货位下拉框值
  }
};
// 加载完毕后事件
base.onChange = async (masterData: any) => {
  // positionNameQuery();
};

// 明细删除后事件
base.onDetailDeleteAfter = (deletedRows: Array<any>, detailInfo: DetailInfo) => {
  let detailRows: any = base.detailRows.value;
  setTotal(detailRows);
};
</script>
