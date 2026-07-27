<template>
  <div ref="container" class="biz-container">
    <div class="biz-container">
      <el-main>
        <el-date-picker v-model="state.pickerDate" type="month" placeholder="选择月" @change="pickerChange"> </el-date-picker>
        <el-calendar v-model="state.calendar">
          <!--插槽-->
          <template #date-cell="{ data }">
            <div style="height: 120%; padding: 8px" @click="showDialogForm(data)" :class="{ backColor: isBackColor(data.day) }">
              <div class="data" :class="{ textColor: isBackColor(data.day) }">{{ data.day.split('-')[1] }}月{{ data.day.split('-')[2] }}日</div>
              <draggable :list="getDistributionList(data.day)" item-key="label" group="distribution" ghost-class="chosen-item" :animation="300" tag="ul" class="dist-ul">
                <template #item="{ element }">
                  <li class="dist-item" style="color: #ffffff">{{ element.sourceCode }}</li>
                </template>
              </draggable>
            </div>
          </template>
        </el-calendar>
      </el-main>
    </div>

    <el-dialog dialogDrag title="排班编辑" draggable v-model="state.dialogFormVisible" append-to-body>
      <el-table ref="schedTable" :data="state.selectTableData" style="width: 100%">
        <el-table-column property="orderCode" label="预到货单号"></el-table-column>
        <el-table-column property="sourceCode" label="ERP采购单号" width="150"> </el-table-column>
        <el-table-column property="providerShortName" label="供应商名称"> </el-table-column>
        <el-table-column property="arrivedDate" label="预计到货日期"></el-table-column>
        <el-table-column property="orderStatus" label="订单状态"></el-table-column>
      </el-table>

      <template class="right" #footer>
        <span>
          <el-button @click="state.dialogFormVisible = false">取 消</el-button>
          <el-button @click="state.dialogFormVisible = false" type="primary">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="tms-vehicle-tms-scheduling">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import moment from 'moment';

// 导入draggable组件
import draggable from 'vuedraggable';
import baseHook from '/@/components/hooks/baseHook';

const base = baseHook();
const { baseState } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  tableTable: [] as any,
  selectTableData: [] as any[],
  // 选中后的日期
  calendar: new Date(),
  // 选中后的日期
  pickerDate: new Date(),
  dialogFormVisible: false,
});
onMounted(() => {
  getList();
});

// 获取数据
const getList = async () => {
  const url = '/inbound/in/order/pageList';
  const params = {
    menuId: 1001,
    pageSize: 100000,
    pageIndex: 1,
    queryBoList: [
      {
        column: 'orderStatus',
        values: '送货完成',
        dataType: 'STRING',
        queryType: 'NE',
      },
      {
        column: 'orderStatus',
        values: '审核成功',
        queryType: 'LIKE',
        dataType: 'STRING',
      },
    ],
    isAsc: 'desc',
    orderByColumn: 'orderId',
    prefixRouter: '/inbound/in/order',
    tableName: 'in_order',
    sumColumnNames: [],
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  proxy.common.showMsg(res);

  if (res.result) {
    res.rows.forEach((item: any) => {
      item.arrivedDate = moment(item.arrivedDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
      return item;
    });
    state.tableTable = res.rows;
  }
};

// 显示排班对话框
const showDialogForm = (currentCell: any) => {
  state.selectTableData = state.tableTable.filter((item: any) => item.arrivedDate === currentCell.day);
  if (!state.selectTableData.length) {
    proxy.$message.error('占无数据');
    return;
  }
  state.dialogFormVisible = true;
};

const pickerChange = () => {
  state.calendar = state.pickerDate;
};

// 获取当前日期下的排版数据
const getDistributionList = (day: any) => {
  if (state.tableTable.length > 0) {
    const list = state.tableTable.filter((item: any) => item.arrivedDate === day);
    if (list) {
      return list.slice(0, 2);
    } else {
      return [];
    }
  }
};

const isBackColor = (day: any) => {
  const info = state.tableTable.find((item: any) => item.arrivedDate === day);
  if (info) {
    return true;
  }
  return false;
};
</script>

<style lang="scss" scoped>
.el-aside {
  text-align: center;
  padding: 5px;
  height: calc(100vh - 122px);
  background-color: white;
}
.biz-container {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.el-main {
  text-align: left;
}
.is-selected {
  color: #1989fa;
}
.left-item {
  background-color: white;
  text-align: left;
  line-height: 25px;
  font-size: 14px;
  border-radius: 5px;
  padding: 5px 5px 5px 15px;
  border: 2px solid silver;
  + .left-item {
    margin-top: 5px;
  }
  &.ghost {
    border: 1px dashed #1989fa !important;
    position: relative;
    height: 40px;
    overflow: hidden;
    &::after {
      content: '释放鼠标添加';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      text-align: center;
      line-height: 40px;
      background-color: white;
    }
  }
}
.dist-group {
  background-color: white;
  font-size: 12px;
  position: relative;
  padding: 0 5px 5px 2px;
  min-height: 70px;
  width: 100%;
  .dist-ul {
    min-height: 50px;
  }
  .dist-item {
    line-height: 1.5;
  }
}

.importantSty {
  color: red;
}
.secondarySty {
  color: tan;
}

:deep(.el-calendar-day) {
  overflow: hidden;
  padding: 0px;
}
.backColor {
  background-color: #4578e2;
}
.textColor {
  color: white;
}
</style>
