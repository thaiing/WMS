<template>
  <div class="dialog-container">
    <el-dialog draggable v-model="currentVisible" title="拆分出库单" width="1200px" append-to-body @opened="init">
      <el-alert width="90%" title="提示：下面可改变需要拆分到新订单的实际数量。注意：拆单成功后，请及时审核，否则再次同步该订单，会覆盖该订单明细，导致明细重复。" type="info"> </el-alert>
      <el-table ref="spltTable" :data="state.dataList" style="width: 100%" size="small" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="orderCode" label="出库单号" width="140"></el-table-column>

        <el-table-column prop="productCode" label="商品编号" width="120"></el-table-column>
        <!-- <el-table-column prop="productModel" label="条形码" width="120"></el-table-column> -->
        <el-table-column prop="productName" label="商品名称" width="220"></el-table-column>
        <el-table-column prop="productSpec" label="商品规格" width="150"></el-table-column>
        <el-table-column prop="sourceDetailId" label="客户单号" width="110"></el-table-column>
        <el-table-column prop="lackStorage" label="缺货数量" width="80"></el-table-column>
        <el-table-column prop="quantityOrderOrgin" label="待转数量" width="80"></el-table-column>
        <el-table-column prop="quantityOrder" label="转出数量" width="80">
          <template #default="{ row }">
            <el-input v-show="true" v-model="row.quantityOrder" placeholder="请输入拆分数量" size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="orderList_Id" label="明细id" width="80"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="currentVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSplitOrder()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="order-split-dialog">
import { ComponentInternalInstance } from 'vue';

import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:visible', 'on-closed']);

//#region 定义属性
const props = defineProps({
  visible: Boolean,
  // 显示对话框
  // visible: {
  // 	type: Boolean,
  // 	default: false,
  // 	required: true
  // },
  // 订单ID集合
  ids: {
    type: Array,
    default: () => {
      return [];
    },
    required: true,
  },
  // 选中明细集合
  selectedDetails: {
    type: Array,
    default: () => {
      return [] as any[];
    },
    required: true,
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  dataList: [] as any[], // 数据集合
  multipleSelection: [
    {
      orderId: 0,
      orderDetailId: 0,
      productModel: '',
      quantityOrder: 0,
    },
  ],
  // 订单ID
  orderId: 0,
});

// 是否显示dialog
const currentVisible = computed({
  get() {
    return props.visible;
  },
  set(newValue) {
    emit('update:visible', newValue); // 双向绑定prop.action，通知父级组件变量值同步更新
  },
});

// 初始化数据
const init = async () => {
  const ids = state.orderId;
  const url = '/outbound/out/orderDetail/selectDetailSplitList';
  const params = {
    orderId: ids,
  };

  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  state.dataList = res.data.map((row: any) => {
    row.quantityOrderOrgin = Math.Round(row.quantityOrder, 2);
    row.quantityOrder = Math.Round(row.quantityOrder, 2);
    row.lackStorage = Math.Round(row.lackStorage, 2);
    return row;
  });
  // 明细进入自动选中
  const rows = state.dataList.filter((item) => props.selectedDetails.some((d: any) => d.orderDetailId === item.orderDetailId));
  proxy.$refs.spltTable.clearSelection();
  rows.forEach((row) => {
    proxy.$refs.spltTable.toggleRowSelection(row);
  });
};

// 接受预到货单主表信息
const initData = (orderId: any) => {
  state.orderId = orderId;
};

// 确认拆分订单
const addSplitOrder = async () => {
  props.ids;
  let productList = state.dataList.map((m) => {
    return {
      orderId: m.orderId,
      orderDetailId: m.orderDetailId,
      productModel: m.productModel,
      quantityOrder: m.quantityOrder,
    };
  });

  let multipleSelection = state.multipleSelection.filter((p: any) => parseFloat(p.quantityOrder) > 0);
  if (multipleSelection.length > 0) {
    productList = state.multipleSelection.map((m) => {
      return {
        orderId: m.orderId,
        orderDetailId: m.orderDetailId,
        productModel: m.productModel,
        quantityOrder: m.quantityOrder,
      };
    });
  }
  if (!productList.length) {
    proxy.$message.error('至少选择一行！');
    return;
  }

  let dataList = productList.filter((p: any) => parseFloat(p.quantityOrder) > 0);

  // 判断转出数量商品不能为0
  if (dataList.length <= 0) {
    proxy.$message.error('拆分的商品转出数量不能为小于0！');
    return;
  }
  // 判断转出总数量不能大于等于订单总数量
  if (state.dataList.filter((p: any) => parseFloat(p.quantityOrder) > parseFloat(p.quantityOrderOrgin)).length > 0) {
    proxy.$message.error('转出的总数量必须小于订单总数量！');
    return;
  }
  productList = dataList;

  proxy
    .$confirm('确定要进行拆分操作吗?', '拆分单据', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      const url = '/outbound/out/orderDetail/splitOrder';
      const params = {
        productList,
        orderId: state.orderId,
      };

      const [err, res] = await to(postData(url, params));
      if (err) {
        proxy.$message.error(err.message);
        return;
      }
      proxy.$message.success('拆分成功！');

      //  刷新列表
      currentVisible.value = false;
      emit('on-closed'); // 关闭窗口事件
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};
const handleSelectionChange = (val: any) => {
  state.multipleSelection = val;
};

defineExpose({
  initData,
});
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
