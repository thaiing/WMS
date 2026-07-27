<template>
  <div class="scan-container">
    <el-card class="scan-card no-print">
      <template #header>
        <div class="flex flex-between">
          <div class="clearfix justify-start">
            <span class="title">{{ $tt('出库打包校验') }}</span>
          </div>
          <el-button link @click="state.outSetting.visible = true">{{ $tt('场景设置') }}</el-button>
        </div>
      </template>
      <el-row>
        <el-col :xl="11" :md="14" :xs="24">
          <el-form ref="form" :model="state.formData" label-width="120px" class="scan-form" @submit.prevent>
            <el-form-item :label="$tt('快递号/出库单号')">
              <el-input ref="orderCode" v-model="state.formData.orderCode" autofocus class="input-300" @keyup.enter.stop="getOutOrderData"></el-input>
            </el-form-item>
            <el-form-item v-if="state.scanSetting.isOpenCase" :label="$tt('箱号')">
              <el-input v-model="state.formData.caseNumber" class="input-300 margin-right-5" @keyup.enter.stop="onKeyupCaseNumber"></el-input>
            </el-form-item>
            <el-form-item v-if="state.scanSetting.isValidateProductCode" :label="$tt('商品条码')">
              <el-input ref="productModel" v-model="state.formData.productModel" class="input-300" @keyup.enter.stop="checkPackingBarcode"></el-input>
            </el-form-item>
            <el-form-item v-if="state.scanSetting.isOpenWrapperBarcode" :label="$tt('包材条码')">
              <el-input ref="txtwrapperBarcode" v-model="state.formData.wrapperBarcode" :type="state.scanSetting.isManyWrapperBarcode ? 'textarea' : 'text'" class="w-300"></el-input>
            </el-form-item>
            <el-form-item v-if="state.scanSetting.isValidateProductCode" :label="$tt('扫描数量')">
              <el-input-number ref="scanQty" v-model="state.formData.scanQty" :min="0" :disabled="!state.scanSetting.isValidateProductCode || state.formData.isScanSn" controls-position="right" class="input-120" @change="base.setScanQty"></el-input-number>
              <span class="sub-item">
                <span class="sub-label">{{ $tt('称重') }}：</span>
                <el-input-number v-model="state.formData.weight" :min="0" controls-position="right" class="input-120" @change="changeWeight"></el-input-number>
              </span>
            </el-form-item>
            <el-form-item>
              <el-button type="success" :loading="state.isSubmiting" @click="openPackage">
                <template #icon>
                  <i class="yrt-yduigouxuan mr-5"></i>
                </template>
                {{ $tt('复核提交') }}
              </el-button>
              <el-button v-if="state.scanSetting.isOpenCase" @click="changeBox">{{ $tt('换箱') }}</el-button>
              <!-- @click="printCarNum" -->
              <!-- <el-button v-if="state.scanSetting.isOpenCase" class="success margin-right-10" @click="printCaseLabel">{{ $tt('打印箱标签') }}</el-button> -->
              <el-button class="margin-right-10" @click="onReset">{{ $tt('重置') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="state.formData.isScanSn" :xl="12" :md="10" :xs="24">
          <el-form ref="formSn" :model="state.formData" label-position="top" label-width="120px" class="scan-sn-form">
            <el-form-item :label="$tt('扫描SN')">
              <el-input ref="snList" v-model="state.formData.snList" type="textarea" :rows="6" class="input-500" @blur="base.scanSn()" @keyup.stop="base.scanSn"></el-input>
              <div class="color-666">
                {{ $tt('SN条数') }}：
                <span>{{ state.formData.scanQty }}</span>
              </div>
            </el-form-item>
          </el-form>
          <el-form ref="formSn-hold" :model="state.formData" label-position="top" label-width="120px" class="scan-sn-form">
            <el-form-item :label="$tt('核验SN列表（拣货SN）')">
              <el-input ref="checkSnList" v-model="state.formData.checkSnList" type="textarea" :disabled="true" :rows="6" class="input-500" @blur="base.scanSn()" @keyup.stop="base.scanSn"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="scan-result body-no-padding no-print">
      <template #header>
        <div class="scan-result-header">
          <span class="padding-top-10">
            {{ $tt('扫描结果') }}
          </span>
          <el-button link class="floatRight" @click="state.setting.visible = true">{{ $tt('字段设置') }}</el-button>
        </div>
      </template>

      <el-table ref="scan-table" :data="base.state.tableData" :row-class-name="base.rowClass" stripe style="width: 100%" size="small" max-height="500px" class="scan-table" @row-dblclick="base.setCurrent" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <template v-for="(item, index) in state.setting.fields">
          <template v-if="['unFinishedQuantity', 'finishedQuantity'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" align="center">
              <template #default="{ row }">
                <template v-if="!state.scanSetting.isValidateProductCode">
                  <el-input-number v-model="row[item.prop]" :min="0" :max="row['quantityOrder']" size="small" class="w-100pc" controls-position="right" @change="base.rowChangeQty(item.prop, row)"></el-input-number>
                </template>
                <template v-else>
                  {{ row[item.prop] }}
                </template>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="['length', 'width', 'height'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" align="center">
              <template #default="{ row }">
                <el-input-number v-model="row[item.prop]" class="w-100pc" controls-position="right" @change="base.rowChangeQty(item.prop, row)"></el-input-number>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'positionName,scanWeight'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" align="center">
              <template #default="{ row }">
                <el-input v-model="row[item.prop]" size="small" class="w-100pc"></el-input>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'produceDate,limitDate'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" align="center">
              <template #default="{ row }">
                <el-date-picker v-model="row[item.prop]" size="small" type="date" :placeholder="$tt('选择日期')" class="w-110" value-format="YYYY-MM-DD"></el-date-picker>
              </template>
            </el-table-column>
          </template>
          <!--SN序列号-->
          <template v-else-if="'bigQty'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width">
              <template #default="{ row }">
                <!-- {{ row }} -->
                <!-- <span class="sn-text">{{ row.bigQty || 0 }}{{ row.bigUnit || '' }}{{ row.bigQty || 0 }}{{ '瓶' }}</span> -->
                <span class="sn-text">{{
                  common.formatData(row, {
                    prop: 'bigQty',
                    formatter: '大单位格式化',
                  })
                }}</span>
              </template>
            </el-table-column>
          </template>
          <!--SN序列号-->
          <template v-else-if="'singleSignCode'.indexOf(item.prop) >= 0 && state.formData.isScanSn">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" align="center">
              <template #default="{ row }">
                <span class="sn-text">{{ row.singleSignCode }}</span>
                <span class="sn-count">[{{ $tt('SN数') }}：{{ row.singleSignCode ? row.singleSignCode.split(',').length : 0 }}]</span>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="'caseNumber'.indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible && state.scanSetting.isOpenCase" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" align="center"></el-table-column>
          </template>
          <template v-else-if="['rowPackage', 'rowWeight', 'rowCube'].indexOf(item.prop) >= 0">
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" align="center">
              <template #default="{ row }">
                <el-input-number v-model="row[item.prop]" :min="0" size="small" class="w-100pc" controls-position="right" @change="base.rowChangeQty(item.prop, row)"></el-input-number>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column v-if="item.visible" :key="index" :prop="item.prop" :label="$tt(item.label)" :width="item.width" :min-width="item.minWidth" align="center">
              <template #default="{ row, column, $index }">
                <template v-if="item.type === 'input'">
                  <template v-if="['int', 'bigint'].indexOf(item.dataType) >= 0">
                    <el-input-number v-model.number="row[item.prop]" controls-position="right" size="small" class="w-100pc"></el-input-number>
                  </template>
                  <template v-else-if="['bigDecimal', 'float', 'double'].indexOf(item.dataType) >= 0">
                    <el-input-number v-model="row[item.prop]" :precision="2" controls-position="right" size="small" class="w-100pc"></el-input-number>
                  </template>
                  <template v-else>
                    <el-input v-model="row[item.prop]" small="mini" class="w-100pc"></el-input>
                  </template>
                </template>
                <template v-else>
                  {{ row[item.prop] }}
                </template>
              </template>
            </el-table-column>
          </template>
        </template>
      </el-table>

      <!--装箱信息-->
      <div v-if="state.scanSetting.isOpenCase" style="font-size: 16px; font-weight: bolder; padding-left: 10px; display: flex; align-items: center; gap: 10px; margin-bottom: 10px">
        <span>{{ $tt('出库单装箱结果记录') }}</span>
        <el-button type="primary" size="small" @click="printCaseList">{{ $tt('打印装箱清单') }}</el-button>
        <el-button type="primary" size="small" @click="printCaseLabel">{{ $tt('打印箱标签') }}</el-button>
      </div>
      <el-table v-if="state.scanSetting.isOpenCase" :data="state.tableDataCase" style="width: 100%" max-height="500px" @selection-change="handleCaseSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" width="50" />
        <el-table-column prop="caseNumber" :label="$tt('箱号')" width="160" />
        <el-table-column prop="orderCode" :label="$tt('出库单号')" width="140" />
        <el-table-column prop="totalQuantityOrder" :label="$tt('合计数量')" width="80" />
        <el-table-column prop="totalWeight" :label="$tt('合计重量')" width="80" />
        <el-table-column prop="clientShortName" :label="$tt('客户名称')" width="100" />
        <el-table-column prop="shippingName" :label="$tt('收货人')" width="80" />
        <el-table-column prop="mobile" :label="$tt('收货电话')" width="130" />
        <el-table-column prop="shippingAddress" :label="$tt('收货地址')" />
        <el-table-column prop="consignorName" :label="$tt('货主')" width="80" />
        <el-table-column prop="storageName" :label="$tt('仓库名称')" width="80" />
        <el-table-column prop="remark" :label="$tt('备注')" width="80" />
      </el-table>
    </el-card>

    <!--自定义装箱信息-->
    <!-- <out-box v-if="state.scanSetting.openCustomBox" ref="outBox" :form-data="state.formData" :order-info="orderInfo"></out-box> -->

    <!-- 显示打印模板 -->
    <!-- <print v-if="state.scanSetting.isOuter_PrintBill" ref="printRef" :ids="'' + state.formData.orderId" type="express"></print> -->
    <!-- 显示打印订单详情模板 -->
    <!-- <print2 v-if="state.scanSetting.isDetail_PrintBill && state.formData.orderId" ref="printRef2" :ids="'' + state.formData.orderId" type="express"></print2> -->
    <!-- 打印内容控制 -->
    <div v-if="shouldShowPrintToolBar" class="print-tool-bar no-print">
      <el-button v-if="hasAnyPrintContent" size="small" @click="clearAllPrintTemplates">{{ $tt('清空全部打印') }}</el-button>
      <el-button v-if="hasExpressBillSetting" size="small" @click="toggleExpressBill">
        {{ state.printStatus.expressBill ? $tt('清空物流面单') : $tt('重打物流面单') }}
      </el-button>
      <el-button v-if="hasOrderListSetting" size="small" @click="toggleOrderListBill">
        {{ state.printStatus.orderList ? $tt('清空出库清单') : $tt('重打出库清单') }}
      </el-button>
      <el-button v-if="hasCaseListPrint" size="small" @click="clearCaseListTemplatesOnly">{{ $tt('清空装箱清单') }}</el-button>
      <el-button v-if="hasCaseLabelPrint" size="small" @click="clearCaseLabelTemplatesOnly">{{ $tt('清空箱标签') }}</el-button>
    </div>

    <!-- 显示打印装箱清单模板 -->
    <div id="mount-print"></div>

    <!-- 扫描明细字段设置 -->
    <scan-setting-dialog ref="setting-dialog" v-model:visible="state.setting.visible" :fields="state.setting.fields" :name="state.setting.name"></scan-setting-dialog>

    <!-- 应用场景设置 -->
    <out-setting-dialog ref="outSettingDialog" v-model:visible="state.outSetting.visible" :scanSetting="state.scanSetting" @scan-setting-change="scanSettingChange"></out-setting-dialog>

    <!--声音文件-->
    <audio ref="sound_error" controls style="display: none">
      <source src="/public/sounds/error2.mp3" type="audio/mpeg" />
    </audio>
    <audio ref="sound_correct" controls style="display: none">
      <source src="/public/sounds/feixin.mp3" type="audio/mpeg" />
    </audio>
    <audio controls style="display: none">
      <source ref="sound_scan" src="/public/sounds/saomiao.wav" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script setup lang="ts" name="outbound-scan-out">
import { ComponentInternalInstance, createVNode, render, nextTick, computed } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import { DataType, QueryType } from '/@/types/common';
const ScanSettingDialog = defineAsyncComponent(() => import('/@/components/common/components/scanSettingDialog.vue'));
const OutSettingDialog = defineAsyncComponent(() => import('./components/out-setting-dialog.vue'));
import baseTemplateId from '/@/views/system/print/base-template-id.vue';
import scanHook from '/@/components/hooks/scanHook';
import to from 'await-to-js';
import _ from 'lodash';
import common from '/@/utils/common';
import { UserCacheEnum } from '/@/enums/UserCacheEnum';

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const config = ref({
  outer_printOrderDetail: true,
  // 是否启用装箱操作
  in_caseNumber: false,
  // 支持一品多码
  sku_productToMultiBarcode: true,
  // 打印面单
  outer_printBill: true,
  // 打印装箱清单
  outer_Packinglist: true,
  // 称重阈值
  outer_weightWhreshold: 0,
  // 是否体积，件数
  outer_openPackage: false,
  // 拣货框码
  outer_cartCode: false,
  // 扫描明细必填项
  outer_scanDetails: [],
  // 自动提交
  outer_autoConfirm: false,
  // 默认重量单位
  global_weightUnit: null,
  // 默认体积单位
  global_cubeUnit: null,
  // 按拣货数量打包开启
  outer_pickQuantity: false,
});

const base = scanHook({
  config,
  // 配置参数自定义处理
  doData: (item: any, hookOptions: any) => {
    let configKey = item.configKey; // 字段名称
    let configValue = item.configValue;

    if (proxy.common.isNumber(item.configValue)) {
      configValue = parseInt(item.configValue);
    }

    // 扫描明细必填项
    if (configKey === 'outer_scanDetails') {
      hookOptions.config.value[configKey] = typeof configValue === 'string' ? configValue.split(',') : [];
    }
    // 重量单位、体积单位、称重阈值，保留为字符串格式
    else if (['global_weightUnit', 'global_cubeUnit', 'outer_weightWhreshold'].indexOf(item.value02) >= 0) {
      hookOptions.config.value[configKey] = configValue;
    } else {
      hookOptions.config.value[configKey] = !!configValue;
    }
  },
});

//#region 定义变量
const state = reactive({
  // 配置参数
  config: config.value,
  formData: {
    ...toRefs(base.state.formData),
    orderId: 0,
    orderCode: '', // 扫描单号
    caseNumber: '',
    weight: 0, // 称重
    wrapperBarcode: '', // 包材
  },
  scanSetting: {
    isValidateProductCode: false, // 是否校验商品
    isManyWrapperBarcode: false, // 开启多包材
    isOpenWrapperBarcode: false, // 开启包材输入框
    isOpenCase: false, // 开启装箱
    // 装箱方式：0：常规扫描，1：一品一箱，2：多品一箱
    caseMode: 0,
    // 打印单据勾选列表
    printBill: [] as string[],
    // 是否自动打印勾选列表
    autoPrintBill: [] as string[],
    // 打印模板设置
    billPrintSettings: [
      {
        index: 1,
        name: '打印物流面单',
        templateType: '物流单',
        templateName: '',
        printName: '',
      },
      {
        index: 2,
        name: '打印箱标签',
        templateType: '箱标签',
        templateName: '',
        printName: '',
      },
      {
        index: 3,
        name: '打印装箱清单',
        templateType: '订单详情',
        templateName: '',
        printName: '',
      },
      {
        index: 4,
        name: '打印出库清单',
        templateType: '订单详情',
        templateName: '',
        printName: '',
      },
    ] as Array<{
      index: number;
      name: string;
      templateType: string;
      templateName: string | number;
      printName: string;
    }>,
  },
  multipleSelection: [],
  // 订单信息
  orderInfo: {} as EmptyObjectType,
  /**
   * 装箱列表
   * 1. 箱号
   * 2. 出库单号
   * 3. 合计数量
   * 4. 合计重量
   * 5. 客户名称
   * 6. 收货人
   * 7. 收货电话
   * 8. 收货地址
   */
  tableDataCase: [] as any[],
  // 装箱结果勾选
  selectedCaseRows: [] as any[],
  // 打印模板缓存 key（用于清空对应模板数据）
  printTemplateKeys: {
    caseList: [] as string[],
    caseLabel: [] as string[],
  },
  // 已经找到的数据
  existRows: [],
  // 一次扫描的数量
  scanCount: 1,
  // 打印机设备列表
  printList: [] as any[],
  // 扫描列设置对话框参数
  setting: {
    visible: false,
    name: 'outbound-scan-out',
    fields: [
      {
        prop: 'productModel',
        label: '条形码',
        visible: true,
        width: 130,
        minWidth: 130,
        dataType: 'string',
        type: 'none',
        order: 1,
      },
      {
        prop: 'quantityOrder',
        label: '商品数量',
        visible: true,
        width: 70,
        order: 2,
      },
      {
        prop: 'pickQuantity',
        label: '拣货数量',
        visible: false,
        width: 70,
        order: 2,
      },
      {
        prop: 'matchQty',
        label: '配货数量',
        visible: false,
        width: 70,
        order: 2,
      },
      {
        prop: 'quantityOuted',
        label: '已出库数量',
        visible: true,
        width: 80,
        order: 3,
      },
      {
        prop: 'finishedQuantity',
        label: '扫描数量',
        visible: true,
        width: 70,
        order: 4,
      },
      {
        prop: 'unFinishedQuantity',
        label: '未扫描数量',
        visible: true,
        width: 80,
        order: 5,
      },
      {
        prop: 'productCode',
        label: '商品编号',
        visible: true,
        width: 100,
        order: 6,
      },
      {
        prop: 'bigUnit',
        label: '大单位',
        visible: true,
        width: 70,
        order: 8,
      },
      {
        prop: 'bigQty',
        label: '大单位数量',
        visible: true,
        width: 80,
        order: 8,
      },
      {
        prop: 'brandName',
        label: '品牌',
        visible: false,
        width: 80,
        order: 8,
      },
      {
        prop: 'salePrice',
        label: '单价',
        visible: true,
        width: 90,
        order: 6,
      },
      {
        prop: 'singleSignCode',
        label: '序列号(SN)',
        visible: true,
        width: 200,
        order: 7,
      },
      {
        prop: 'rowPackage',
        label: '明细件数',
        visible: true,
        width: 100,
        order: 8,
      },
      {
        prop: 'rowWeight',
        label: '小计重量',
        visible: true,
        width: 90,
        order: 9,
      },
      {
        prop: 'rowCube',
        label: '小计体积',
        visible: true,
        width: 90,
        order: 10,
      },
      {
        prop: 'caseNumber',
        label: '箱号',
        visible: true,
        width: 135,
        order: 11,
      },
      {
        prop: 'productSpec',
        label: '商品规格',
        visible: true,
        width: 80,
        order: 12,
      },
      {
        prop: 'weight',
        label: '单位毛重',
        visible: false,
        width: 80,
        order: 13,
      },
      {
        prop: 'scanWeight',
        label: '已扫重量',
        visible: false,
        width: 80,
        order: 14,
      },
      {
        prop: 'productName',
        label: '商品名称',
        visible: true,
        width: undefined,
        minWidth: 200,
        order: 15,
      },
    ],
  },
  packageLabelOptions: [
    {
      value: '箱标签1',
      label: '箱标签1',
    },
    {
      value: '箱标签2',
      label: '箱标签2',
    },
  ],
  formSave: {
    isOpenPackage: false, // 弹出框
    expressCorpName: '', // 运单中的快递名称
    totalPackage: 0, // 合计件数
    totalCube: 0, // 合计体积
    totalWeight: 0, // 合计重量
    packageLabelType: '', // 箱标签类型
    closeWindow: false, // 是否打印后自动关闭页面
  },
  // 正在提交
  isSubmiting: false,
  // 应用设置
  outSetting: {
    visible: false,
  },
  // 打印状态，用于切换按钮显示"重打"或"清空"
  printStatus: {
    expressBill: false,
    orderList: false,
  },
  // 打印内容存在状态
  hasPrintContent: {
    caseList: false,
    caseLabel: false,
  },
});
//#endregion

type PrintTemplateType = 'expressBill' | 'orderList' | 'caseList' | 'caseLabel' | 'caseNumber';

const printTypeConfigMap: Record<
  PrintTemplateType,
  {
    name: string;
    menuId: number;
    tag: PrintTemplateType;
  }
> = {
  expressBill: { name: '打印物流面单', menuId: 1671, tag: 'expressBill' },
  orderList: { name: '打印出库清单', menuId: 1671, tag: 'orderList' },
  caseList: { name: '打印装箱清单', menuId: 1671, tag: 'caseList' },
  caseLabel: { name: '打印箱标签', menuId: 1671, tag: 'caseLabel' },
  caseNumber: { name: '打印箱号', menuId: 1671, tag: 'caseNumber' },
};

//#region onMounted
onMounted(async () => {
  // printBill(); // 测试，记得删除掉

  // 字段设置
  const setting = localStorage[state.setting.name + '-setting'];
  if (setting) {
    state.setting.fields = JSON.parse(setting);
  }
  // 加载打印模板信息
  const cachedScanSetting = (await common.getUserCache(UserCacheEnum.SCAN_OUT_SETTING)) || {};
  state.scanSetting = { ...state.scanSetting, ...cachedScanSetting };
  // 确保 autoPrintBill 有默认值
  if (!state.scanSetting.autoPrintBill) {
    state.scanSetting.autoPrintBill = [];
  }
});
//#endregion

// 箱号回车
const onKeyupCaseNumber = () => {
  base.focus('productModel');
};

// 获取扫描数据
const getOutOrderData = async () => {
  base.state.currentRow = {};
  let orderCode = state.formData.orderCode;
  orderCode = orderCode.trim();
  state.formData.orderCode = orderCode;
  if (!orderCode) {
    proxy.$message.error('扫描单号不能为空!');
    return;
  }

  clearPrintContainers();
  resetPrintStatus();

  const url = '/outbound/out/outScanOrder/getOutOrderData';
  const params = {
    orderCode: orderCode,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    base.focus('orderCode');
    return false;
  }
  proxy.common.showMsg(res);

  // 控制打包校验 对话框下的三个按钮
  if (res.result) {
    if (state.scanSetting.caseMode === 3) {
      if (!state.formData.caseNumber) {
        state.formData.caseNumber = res.data.caseNumber; // 初始化箱号
      }
      state.formData.caseNumber = state.formData.caseNumber.replace('SO', 'HX');
    } else {
      state.formData.caseNumber = res.data.caseNumber; // 初始化箱号
    }

    state.orderInfo = res.data.orderInfo;
    base.state.tableData = res.data.detailList.map((row: any) => {
      row.quantityOrder = Math.Round(row.quantityOrder);
      row.bigQty = Math.Round(row.bigQty);
      row.salePrice = Math.Round(row.salePrice);
      row.quantityOuted = Math.Round(row.quantityOuted || 0);

      let unFinishedQuantity = Math.Round(row.quantityOrder - row.quantityOuted, 4);
      if (state.config.outer_pickQuantity) {
        unFinishedQuantity = Math.Round(row.pickQuantity - row.quantityOuted, 4);
      }
      let finishedQuantity = 0;
      let scanWeight = 0;
      if (!state.scanSetting.isValidateProductCode) {
        unFinishedQuantity = 0;
        finishedQuantity = Math.Round(row.quantityOrder - row.quantityOuted, 4);
        scanWeight = row.rowWeight;
      }
      row.unFinishedQuantity = unFinishedQuantity;
      row.finishedQuantity = finishedQuantity;
      row.scanWeight = scanWeight;
      row.sortIndex = 0;
      row.caseNumber = state.formData.caseNumber; // 箱号
      row.singleSignCodeOrigin = row.singleSignCode; // 备份源SN
      row.validQuantity = unFinishedQuantity; // 原始可扫描数量

      row.weight = Number(row.weight);
      row.rowWeight = Number(row.rowWeight);
      row.unitCube = Number(row.unitCube);
      row.rowCube = Number(row.rowCube);
      if (typeof row.expandFields === 'string') {
        row.expandFields = JSON.parse(row.expandFields);
      }

      // 清空条码信息
      row.singleSignCode = '';

      return row;
    });

    state.formData.orderId = res.data.orderInfo?.orderId || (base.state.tableData.length ? base.state.tableData[0].orderId : 0);

    // 条码框获得焦点
    if (state.scanSetting.isValidateProductCode) {
      base.focus('productModel');
    } else if (state.scanSetting.isOpenWrapperBarcode) {
      base.focus('txtwrapperBarcode');
    } else {
      base.focus('orderCode');
    }

    autoPrintSelectedTemplates();
  } else {
    onReset();
  }

  clearCaseList(); // 清空装箱出库单列表
};

// 判断扫描包装条码
const checkPackingBarcode = async () => {
  const code = state.formData.productModel;
  if (!code) {
    base.focus('productModel');
    proxy.$message.error('商品条码不能为空!');
    return;
  }
  if (state.scanSetting.isOpenCase && state.scanSetting.caseMode <= 0) {
    base.focus('productModel');
    proxy.$message.error('请选择装箱方式!');
    return;
  }
  // 清空SN
  state.formData.snList = '';
  state.formData.checkSnList = '';

  // 装箱操作
  if (state.scanSetting.isOpenCase) {
    if (state.scanSetting.caseMode === 1) {
      // 一品一箱
      addRow_1();
    } else if ([2, 3].indexOf(state.scanSetting.caseMode) >= 0) {
      // 多品一箱
      addRow_2();
    }
  } else {
    // 常规扫描
    base.checkPackingProductModel(base.state.tableData);
  }
  base.focus('productModel');
  if (base.state.currentRow) {
    state.formData.scanQty = base.state.currentRow.finishedQuantity;

    const sn = base.state.currentRow.singleSignCodeOrigin;
    let snList = [];
    if (sn) {
      snList = sn.split(',');
    }
    let validSnList = snList.filter((item: any) => item); // 有效SN
    validSnList = validSnList.map((item: any) => item.trim());
    validSnList.push('');
    state.formData.checkSnList = validSnList.join('\n');
  }

  await autoSumit(); // 扫描完成后自动提交

  // 更新出库单装箱结果记录：按箱号分组并计算每个箱号的总数量
  if (state.scanSetting.isOpenCase && base.state.tableData && base.state.tableData.length > 0) {
    // 按 caseNumber 进行分组
    const groupedByCaseNumber = base.state.tableData.reduce((acc: Record<string, any[]>, item: any) => {
      const caseNumber = item.caseNumber;
      if (!caseNumber) return acc; // 跳过没有箱号的数据

      if (!acc[caseNumber]) {
        acc[caseNumber] = [];
      }
      acc[caseNumber].push(item);
      return acc;
    }, {});

    // 遍历每个箱号，计算总数量并更新到 tableDataCase
    Object.keys(groupedByCaseNumber).forEach((caseNumber) => {
      const caseItems = groupedByCaseNumber[caseNumber];

      // 计算该箱号下所有 finishedQuantity 的总和
      const totalQuantityOrder = caseItems.reduce((sum: number, item: any) => {
        return sum + (Number(item.finishedQuantity) || 0);
      }, 0);

      // 查找 tableDataCase 中是否已存在该箱号的记录
      const existingCase = state.tableDataCase.find((item: any) => item.caseNumber === caseNumber);

      if (existingCase) {
        // 如果存在，更新总数量
        existingCase.totalQuantityOrder = totalQuantityOrder;
        // 如果订单信息存在，也更新其他字段
        if (state.orderInfo && Object.keys(state.orderInfo).length > 0) {
          existingCase.orderCode = state.orderInfo.orderCode || existingCase.orderCode;
          existingCase.totalWeight = state.orderInfo.totalWeight || existingCase.totalWeight;
          existingCase.clientShortName = state.orderInfo.clientShortName || existingCase.clientShortName;
          existingCase.shippingName = state.orderInfo.shippingName || existingCase.shippingName;
          existingCase.mobile = state.orderInfo.mobile || existingCase.mobile;
          existingCase.shippingAddress = state.orderInfo.shippingAddress || existingCase.shippingAddress;
          existingCase.consignorName = state.orderInfo.consignorName || existingCase.consignorName;
          existingCase.storageName = state.orderInfo.storageName || existingCase.storageName;
          existingCase.remark = state.orderInfo.remark || existingCase.remark;
        }
      } else {
        // 如果不存在，创建新记录
        const newCaseRecord: any = {
          caseNumber: caseNumber,
          totalQuantityOrder: totalQuantityOrder,
        };

        // 如果订单信息存在，添加订单相关字段
        if (state.orderInfo && Object.keys(state.orderInfo).length > 0) {
          newCaseRecord.orderCode = state.orderInfo.orderCode || '';
          newCaseRecord.orderId = state.orderInfo.orderId || state.formData.orderId || '';
          newCaseRecord.totalWeight = state.orderInfo.totalWeight || 0;
          newCaseRecord.clientShortName = state.orderInfo.clientShortName || '';
          newCaseRecord.shippingName = state.orderInfo.shippingName || '';
          newCaseRecord.mobile = state.orderInfo.mobile || '';
          newCaseRecord.shippingAddress = state.orderInfo.shippingAddress || '';
          newCaseRecord.consignorName = state.orderInfo.consignorName || '';
          newCaseRecord.storageName = state.orderInfo.storageName || '';
          newCaseRecord.remark = state.orderInfo.remark || '';
        }

        state.tableDataCase.push(newCaseRecord);
      }
    });
  }
};

// 扫描完成后自动提交
const autoSumit = async () => {
  // 判断是否开启自动提交
  if (!state.config.outer_autoConfirm) return;

  // 判断是否全部扫描完成
  const allFinished = base.state.tableData.every((item) => item.unFinishedQuantity === 0);
  if (allFinished) {
    await partialSave();
  }
};
// 设置扫描数量
const setScanCount = (barcode: any, count: any, isAdd: any) => {
  if (!count || count < 0) {
    proxy.$message.error('数量不正确');
    return;
  }
  if (!barcode) {
    proxy.$message.error('条码不能为空');
    return;
  }
};

// 扫描数量手工改变
const changeScanQty = () => {
  if (base.state.currentRow) {
    let finishedQuantity = 0; // 当前商品所有分箱的出库数量求和
    base.state.tableData
      .filter((item) => {
        return item.orderList_Id === base.state.currentRow!.orderList_Id;
      })
      .forEach((item) => {
        finishedQuantity += item.finishedQuantity;
      });

    // 不包含当前行完成数量
    finishedQuantity -= base.state.currentRow.finishedQuantity;
    const unFinishedQuantity = Math.Round(base.state.currentRow.quantityOrder - base.state.currentRow.quantityOuted - finishedQuantity, 4);
    if (state.formData.scanQty <= unFinishedQuantity) {
      base.state.currentRow.unFinishedQuantity = Math.Round(unFinishedQuantity - state.formData.scanQty, 4);
      base.state.currentRow.finishedQuantity = state.formData.scanQty;
      base.state.currentRow.scanWeight = Math.Round(base.state.currentRow.weight * base.state.currentRow.finishedQuantity, 2);
    } else {
      proxy.$message.error('没有足够的数量!');
    }
  }
};

// 校验是否显示弹出框
const openPackage = async () => {
  const orderCode = state.formData.orderCode;
  // 出单号或者快递单号
  if (base.state.tableData.filter((t) => t.orderCode !== orderCode && t.expressCode !== orderCode && t.storeOrderCode !== orderCode).length > 0 || base.state.tableData.length === 0) {
    proxy.$message.error('当前单号和明细不一致，请先扫描（或者操作回车）单号重新加载数据！');
    return;
  }

  if (state.config.outer_openPackage) {
    const result = await getOrderInfo();
    if (!result) {
      proxy.$message.error('未获取到出库单数据！');
      return;
    }
    // 清空合计重新计算
    state.formSave.totalWeight = 0;
    state.formSave.totalPackage = 0;
    state.formSave.totalCube = 0;
    // 合计数量
    for (const item of base.state.tableData) {
      state.formSave.totalWeight += item.rowWeight;
      state.formSave.totalPackage += item.rowPackage;
      state.formSave.totalCube += item.rowCube;
    }
    state.formSave.isOpenPackage = true;
  } else {
    await partialSave();
  }
};

// 按件数打印面单
const createFace = () => {
  let cpbianhao = '';
  let cpmingcheng = '';
  let cpxinghao = '';
  let abbreviation = '';
  if (state.orderInfo.expandFields) {
    const expandFields = JSON.parse(state.orderInfo.expandFields);
    cpbianhao = expandFields.cpbianhao ? expandFields.cpbianhao : '';
    cpmingcheng = expandFields.cpmingcheng ? expandFields.cpmingcheng : '';
    cpxinghao = expandFields.cpxinghao ? expandFields.cpxinghao : '';
    abbreviation = expandFields.abbreviation ? expandFields.abbreviation : '';
  }
  localStorage.setItem('cpbianhao', cpbianhao);
  localStorage.setItem('cpmingcheng', cpmingcheng);
  localStorage.setItem('cpxinghao', cpxinghao);
  localStorage.setItem('abbreviation', abbreviation);
  localStorage.setItem('clientShortName', state.orderInfo.clientShortName);
  localStorage.setItem('totalPackage', '' + state.formSave.totalPackage);
  localStorage.setItem('outBatchCode', state.formData.orderCode);
  // 库区
  if (base.state.tableData.length) {
    localStorage.setItem('areaCode', base.state.tableData[0].areaCode);
  }
  localStorage.setItem('printType', '按件数打印面单');
  sessionStorage.setItem('packageLabelType', state.formSave.packageLabelType);

  // 全部字段数据
  const v = state.orderInfo.expandFields;
  if (v && v !== '[object Object]') {
    const expandFields = JSON.parse(v);
    if (expandFields) {
      for (const field in expandFields) {
        if (typeof state.orderInfo[field] === 'undefined') {
          state.orderInfo[field] = expandFields[field];
        }
      }
    }
  }
  const key = proxy.common.getGUID();
  sessionStorage.setItem(key, JSON.stringify(state.orderInfo));

  const url = '/inbound/purchase/print-barcode?key=' + key + '&closeWindow=' + (state.formSave.closeWindow ? 1 : 0);
  window.open(url);
};

// 按件数打印并提交
const createFaceSave = async () => {
  if (!state.formSave.totalPackage) {
    proxy.$message.error('请填写合计件数');
    return;
  }
  if (!state.formSave.packageLabelType) {
    proxy.$message.error('请选择模板选项');
    return;
  }

  let result = await partialSave();
  if (result) {
    // 打印
    createFace();
    // 重置
    onReset();
  }
};

// 复核提交，封箱（部分打包），然后计算已打包数量，设置 新快递单号为 “可用”
const partialSave = async (saveStatus?: any) => {
  if (state.config.outer_openPackage) {
    if (!state.formSave.totalPackage) {
      proxy.$message.error('合计件数！!');
      return false;
    }

    if (!state.formSave.packageLabelType) {
      proxy.$message.error('请选择模板选项');
      return false;
    }
  }

  // 扫描明细必填项验证
  if (state.config.outer_scanDetails.length > 0) {
    for (const i of state.config.outer_scanDetails) {
      // 0 ： 明细件数
      if (i === '0' && base.state.tableData.find((item) => !item.rowPackage)) {
        proxy.$message.error('没有填写明细件数！');
        return false;
      }
      // 1 : 小计重量
      if (i === '1' && base.state.tableData.find((item) => !item.rowWeight)) {
        proxy.$message.error('没有填写小计重量！');
        return false;
      }
      // 2 : 小计体积
      if (i === '2' && base.state.tableData.find((item) => !item.subtotalCube)) {
        proxy.$message.error('没有填写小计体积！');
        return false;
      }
    }
  }

  const orderCode = state.formData.orderCode; // 快递单号
  const wrapperBarcode = state.formData.wrapperBarcode; // 包材条码
  const newExpressCode = ''; // 新快递单号
  const totalWeight = state.formSave.totalWeight; // 合计重量
  if (!orderCode) {
    proxy.$message.error('快递单号不能为空!');
    return false;
  }

  const dataList = base.state.tableData.filter((item) => {
    return item.finishedQuantity > 0;
  });
  if (!dataList.length) {
    proxy.$message.error('请先扫描条码！');
    return false;
  }
  // 明细理论求和值
  let theoryweight = 0;
  // 明细实际求和值
  let scanWeight = 0;
  // 得到设置的阈值，阈值大于0进行校验
  const outer_weightWhreshold = state.config.outer_weightWhreshold;
  // 对明细已扫描数量求和算出理论值
  dataList.forEach((item) => {
    theoryweight += item.finishedQuantity * item.weight;
  });
  // 直接扫描重量
  dataList.forEach((item) => {
    scanWeight += Math.Round(item.rowWeight, 2);
  });
  const absWeight = Math.abs(theoryweight - scanWeight);
  if (outer_weightWhreshold > 0 && absWeight > outer_weightWhreshold) {
    proxy.$message.error('商品实际重量与商品理论重量差值超过设定阈值' + outer_weightWhreshold + '，不允许出库');
    return false;
  }

  state.isSubmiting = true; // 正在提交
  const url = '/outbound/out/outScanOrder/normalOutSave';
  const params = {
    scanInType: 'PC_ORDER_OUT', // 标记常规扫描出库
    orderId: state.orderInfo.orderId,
    orderCode,
    wrapperBarcode,
    newExpressCode,
    dataList,
    totalWeight,
    totalPackage: state.formSave.totalPackage,
    totalCube: state.formSave.totalCube || 0,
    factWeight: state.formData.weight,
  };
  const [err, res] = await to(postData(url, params));
  state.isSubmiting = false; // 结束提交
  if (err) {
    base.focus('orderCode');
    return false;
  }

  proxy.common.showMsg(res);
  if (!res.result) return false;

  // addCaseList(); // 增加装箱出库单列表

  state.formSave.isOpenPackage = false;
  // 区分点击的是提交还是按件数提交
  // 其他客户，使用时不需要显示件数和体积弹框，所以没有开启【复核提交时打开件数、体积录入框】时，打包成功后也要执行一下重置方法。
  if (saveStatus || !state.config.outer_openPackage) {
    onReset();
  }
  // // 自动打印，系统配置中心开启，且勾选打印复选框
  // if (state.config.outer_printBill === true && state.scanSetting.isOuter_PrintBill) {
  //   proxy.$refs.printRef.lodopPrint();
  // }
  // // 自动打印，系统配置中心开启，且勾选打印复选框
  // if (state.config.outer_printOrderDetail === true && state.scanSetting.isDetail_PrintBill) {
  //   proxy.$refs.printRef2.lodopPrint();
  // }

  return true;
};

// 重置
const onReset = () => {
  clearCaseList(); // 清空装箱出库单列表
  clearAllPrintTemplates(); // 清空全部打印
  // 初始化formData数据
  state.formData.orderId = 0;
  state.formData.orderCode = '';
  state.formData.orderCode = '';
  if (state.scanSetting.caseMode !== 3) {
    state.formData.caseNumber = '';
  }
  state.formData.productModel = '';
  state.formData.scanQty = 0;
  state.formData.weight = 0;
  state.formData.wrapperBarcode = '';
  state.formData.snList = '';
  state.formData.checkSnList = '';

  // 扫描数据
  base.state.tableData = [];
  // 当前正在扫描的数据
  base.state.currentRow = {};
  // 已经找到的数据
  state.existRows = [];
  // 一次扫描的数量
  state.scanCount = 1;
  // // 配置参数
  // state.config.outer_printOrderDetail = true;
  // // 是否启用装箱操作
  // state.config.in_caseNumber = false;
  // // 支持一品多码
  // state.config.sku_productToMultiBarcode = true;
  // // 打印面单
  // state.config.outer_printBill = true;
  // // 打印装箱清单
  // state.config.outer_Packinglist = true;
  // // 称重阈值
  // state.config.outer_weightWhreshold = 0;

  // 弹出框
  state.formSave.isOpenPackage = false;
  state.formSave.totalPackage = 0;
  state.formSave.totalCube = 0;
  state.formSave.totalWeight = 0;
  proxy.$refs.orderCode.focus();

  // 清空自定义明细
  proxy.$refs.outBox.clear();
};

// 换箱
const changeBox = () => {
  // printBill('1671', '1720', '61010', '导出为WPS PDF', true);
  if (state.scanSetting.caseMode === 3) {
    if (base.state.tableData.length) {
      proxy.$message.warning('当前扫描出库单未提，不允许换箱!');
      return;
    }
    if (!state.tableDataCase.length) {
      proxy.$message.warning('没有扫描任何出库单，不允许换箱!');
      return;
    }
  } else {
    if (!state.formData.orderCode) {
      proxy.$message.error('请先扫描出库单号!');
      return;
    }
    // 单品一箱、多品一箱，需要先扫描才能换箱
    if (common.isEmptyObject(base.state.currentRow)) {
      proxy.$message.warning('没有扫描任何商品，不允许换箱!');
      return;
    }
  }

  // 打印装箱单
  // if (!printCase()) return;
  // 重新生成箱号
  generateCaseNumber();
  // clearCaseList(); // 清空装箱出库单列表
};
// 生成箱号
const generateCaseNumber = () => {
  let batchNo = state.formData.orderCode;
  if (state.scanSetting.caseMode === 3) {
    batchNo = state.formData.caseNumber;
  }
  let max = 1;
  let num = state.formData.caseNumber;
  if (num.indexOf('-') >= 0) {
    const nums = num.split('-');
    num = nums[nums.length - 1];
    batchNo = nums[0];
  } else {
    num = num.substring(num.length - 4);
  }
  let _num = parseInt(num);
  ++_num;
  if (_num > max) max = _num;
  let _max = '00000' + max;
  _max = _max.substring(_max.length - 2);
  const caseNumber = batchNo + '-' + _max;
  state.formData.caseNumber = caseNumber;
};

// 一品一箱
const addRow_1 = () => {
  const rowData = base.state.tableData.find((item) => {
    const exist = base.checkProductModelExist(state.formData.productModel, item);
    return exist && item.unFinishedQuantity > 0;
  });
  if (!rowData) {
    proxy.$message.error('没有可扫描的商品条码');
    base.playError();
    return;
  }
  base.selectRow(rowData); // 选中后行

  base.state.currentRow = rowData;
  if (!base.state.currentRow) {
    proxy.$message.error('没有可扫描的数据');
    return;
  }

  // 箱号存在
  const existCaseRow = base.state.tableData.find((item) => {
    return item.caseNumber === state.formData.caseNumber && item.unFinishedQuantity > 0;
  });
  if (!existCaseRow) {
    const newRow = JSON.parse(JSON.stringify(rowData));
    rowData.unFinishedQuantity = 0;

    base.state.currentRow = newRow;
    const scanQty = base.getScanQty(); // 默认扫描数量为1
    newRow.finishedQuantity = scanQty;
    newRow.unFinishedQuantity -= scanQty;
    newRow.caseNumber = state.formData.caseNumber;
    base.state.tableData.splice(0, 0, newRow);
  } else {
    base.state.currentRow = existCaseRow;
    const scanQty = base.getScanQty(); // 默认扫描数量为1
    existCaseRow.finishedQuantity = scanQty;
    existCaseRow.unFinishedQuantity -= scanQty;
  }
  base.state.currentRow!.scanWeight = Math.Round(base.state.currentRow?.weight * base.state.currentRow?.finishedQuantity, 2);
  generateCaseNumber();
  base.play();
};

// 多品一箱
const addRow_2 = () => {
  const rowData = base.state.tableData.find((item) => {
    const exist = base.checkProductModelExist(state.formData.productModel, item);
    return exist && item.unFinishedQuantity > 0;
  });
  if (!rowData) {
    proxy.$message.error('没有可扫描的商品条码');
    base.playError();
    return;
  }
  base.state.currentRow = rowData;

  const scanQty = base.getScanQty(); // 默认扫描数量为1
  if (rowData.caseNumber === state.formData.caseNumber) {
    base.state.currentRow = rowData;
    rowData.unFinishedQuantity -= scanQty;
    rowData.finishedQuantity += scanQty;
  } else {
    if (!rowData.caseNumber) {
      rowData.unFinishedQuantity -= scanQty;
      rowData.finishedQuantity += scanQty;
      rowData.caseNumber = state.formData.caseNumber;
      base.state.currentRow = rowData;
      if (rowData.finishedQuantity <= 0) {
        const idx = base.state.tableData.indexOf(rowData);
        if (idx > -1) {
          base.state.tableData.splice(idx, 1);
        }
      }
    } else {
      const newRow = JSON.parse(JSON.stringify(rowData));
      rowData.unFinishedQuantity = 0;

      newRow.finishedQuantity = scanQty;
      newRow.unFinishedQuantity -= scanQty;
      newRow.caseNumber = state.formData.caseNumber;
      base.state.tableData.splice(0, 0, newRow);
      base.state.currentRow = newRow;
      if (rowData.finishedQuantity <= 0) {
        const idx = base.state.tableData.indexOf(rowData);
        if (idx > -1) {
          base.state.tableData.splice(idx, 1);
        }
      }
    }
  }
  base.state.currentRow!.scanWeight = Math.Round(base.state.currentRow!.weight * base.state.currentRow!.finishedQuantity, 2);
  base.play();

  base.state.currentRow!.sortIndex = 1;
  // 置顶排序
  base.state.tableData.sort(function (a: any, b: any) {
    return b.sortIndex - a.sortIndex;
  });

  base.state.tableData.forEach((element: any) => {
    element.sortIndex = 0;
  });
};

// 打印装箱单
const printCase = () => {
  // if (_.isEmpty(state.printCaseVueData)) {
  //   proxy.$message.error(`装箱打印模板menuId=200013不存在`);
  //   return false;
  // }
  let billDataInfo = {};
  // 获取装箱数据
  if (state.scanSetting.caseMode === 3) {
    if (!state.tableDataCase.length) {
      proxy.$message.error('没有可打印的数据');
      return false;
    }
    // 箱号
    const mainInfo = {
      caseNumber: state.tableDataCase[0].caseNumber,
    };
    billDataInfo = {
      mainInfo: mainInfo,
      detailList: {
        total: state.tableDataCase.length,
        rows: state.tableDataCase,
      },
    };
  } else {
    const caseDataList = base.state.tableData.filter((item: any) => {
      item.rowTotal = item.finishedQuantity * item.salePrice;
      return item.caseNumber === state.formData.caseNumber;
    });
    if (!caseDataList.length) {
      proxy.$message.error('没有可打印的数据');
      return false;
    }
    // 箱号
    state.orderInfo.caseNumber = state.formData.caseNumber;
    billDataInfo = {
      mainInfo: state.orderInfo,
      detailList: {
        total: caseDataList.length,
        rows: caseDataList,
      },
    };
    return true;
  }

  return true;
};

// 打印箱标签
const printCarNum = () => {
  // if (state.multipleSelection.length === 0) {
  //   proxy.$message.error("至少勾选一行打印。");
  //   return;
  // }
  state.orderInfo.multipleSelection = state.multipleSelection;
  state.orderInfo.caseNumber = state.formData.caseNumber;
  const packageCaseInfo = JSON.stringify(state.orderInfo);
  localStorage.setItem('packageCaseInfo', packageCaseInfo);
  localStorage.setItem('printType', '单/多品一箱标签');
  const url = '/inbound/purchase/print-barcode';
  window.open(url);
};

const handleSelectionChange = (val: any) => {
  state.multipleSelection = val;
};

// 获取出库单信息
const getOrderInfo = async () => {
  if (!state.formData.orderCode) {
    proxy.$message.error('快递单号不能为空!');
    return false;
  }

  const url = '/api/outbound/order/getOrderInfo';
  const params = {
    orderCode: state.formData.orderCode.trim(),
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    base.focus('orderCode');
    return false;
  }
  proxy.common.showMsg(res);
  if (res.result) {
    state.formSave.expressCorpName = res.data.expressCorpName;
  }
  return true;
};

// 打印后关闭窗口 保存用户设置
const changeCloseWindow = () => {
  localStorage['closeWindow'] = state.formSave.closeWindow;
};

// 称重扫描数量
const changeWeight = () => {
  if (base.state.currentRow) {
    // 当前扫描数量
    base.state.currentRow.scanWeight = state.formData.weight;
  }
};

// 增加装箱出库单列表
const addCaseList = () => {
  const existOrder = state.tableDataCase.find((item) => item.orderCode === state.formData.orderCode);
  if (!existOrder) {
    state.tableDataCase.push({
      caseNumber: state.formData.caseNumber,
      orderCode: state.orderInfo.orderCode,
      totalQuantityOrder: state.orderInfo.totalQuantityOrder,
      totalWeight: state.orderInfo.totalWeight,
      clientShortName: state.orderInfo.clientShortName,
      shippingName: state.orderInfo.shippingName,
      mobile: state.orderInfo.mobile,
      shippingAddress: state.orderInfo.shippingAddress,
      consignorName: state.orderInfo.consignorName,
      storageName: state.orderInfo.storageName,
      remark: state.orderInfo.remark,
    });
  }
};

// 清空装箱出库单列表
const clearCaseList = () => {
  state.tableDataCase = [];
};

const clearPrintContainers = (type?: PrintTemplateType) => {
  const mountRoot = document.getElementById('mount-print');
  if (!mountRoot) return;
  if (!type) {
    mountRoot.innerHTML = '';
    return;
  }
  const nodes = mountRoot.querySelectorAll(`.print-container[data-print-type="${type}"]`);
  nodes.forEach((node) => node.remove());
};

const handleCaseSelectionChange = (rows: any[]) => {
  state.selectedCaseRows = rows || [];
};

const getPrintableCaseRows = () => {
  return state.selectedCaseRows.length > 0 ? state.selectedCaseRows : state.tableDataCase;
};

const registerPrintTemplateKey = (type: 'caseList' | 'caseLabel', storageKey: string) => {
  state.printTemplateKeys[type].push(storageKey);
};

const clearPrintTemplateData = (type: 'caseList' | 'caseLabel') => {
  const keys = state.printTemplateKeys[type];
  keys.forEach((key) => sessionStorage.removeItem(key));
  state.printTemplateKeys[type] = [];
  clearPrintContainers(type);
  state.hasPrintContent[type] = false;
};

// 应用场景设置改变
const scanSettingChange = async ({ config }: { config: any }) => {
  // 合并配置，保留场景信息
  state.scanSetting = { ...state.scanSetting, ...config };
  // 确保 autoPrintBill 有默认值
  if (!state.scanSetting.autoPrintBill) {
    state.scanSetting.autoPrintBill = [];
  }
  // 保存到缓存（config 已经包含场景信息）
  await common.setUserCache(UserCacheEnum.SCAN_OUT_SETTING, config);
};

const autoPrintSelectedTemplates = () => {
  if (!state.formData.orderId) return;
  if (!state.scanSetting.printBill || state.scanSetting.printBill.length === 0) return;

  const billPrintSettings = state.scanSetting.billPrintSettings || [];
  const autoPrintBill = state.scanSetting.autoPrintBill || [];
  clearPrintContainers();
  // 重置打印内容状态
  state.hasPrintContent.caseList = false;
  state.hasPrintContent.caseLabel = false;
  // 重置打印状态
  resetPrintStatus();

  state.scanSetting.printBill.forEach((printType: string) => {
    const config = printTypeConfigMap[printType as PrintTemplateType];
    if (!config) return;
    const printSetting = billPrintSettings.find((item: any) => item.name === config.name);
    if (!printSetting) return;

    const templateId = Number(printSetting.templateName);
    if (!templateId || Number.isNaN(templateId)) return;

    // 检查当前打印类型是否勾选了自动打印
    const isAutoPrint = autoPrintBill.includes(printType);

    const printName = printSetting.printName || undefined;
    printBill(config.menuId as any, templateId as any, state.formData.orderId as any, printName as any, isAutoPrint, undefined, true, undefined, config.tag);

    // 更新打印状态，标记已打印
    if (printType === 'expressBill') {
      state.printStatus.expressBill = true;
    } else if (printType === 'orderList') {
      state.printStatus.orderList = true;
    }
  });
};

// 动态打印
const printBill = (menuId: string, tid: string, ids: string, printName: string | undefined, isAutoPrint: boolean, keyName?: string, isAutoLoad: boolean = true, onLoaded?: () => void, printTypeTag?: PrintTemplateType) => {
  const mountRoot = document.getElementById('mount-print');
  if (!mountRoot) return;

  const container = document.createElement('div');
  container.className = 'print-container';
  if (printTypeTag) {
    container.dataset.printType = printTypeTag;
  }
  mountRoot.appendChild(container);

  const componentProps: Record<string, any> = {
    menuId: String(menuId),
    tid: String(tid),
    ids: String(ids),
    isAutoPrint,
    isAutoLoad,
  };

  if (printName) {
    componentProps.printName = printName;
  }

  if (keyName) {
    componentProps.keyName = keyName;
  }
  if (onLoaded) {
    componentProps.onLoaded = onLoaded;
  }

  const instance = createVNode(baseTemplateId, componentProps);
  render(instance, container);
};

// 打印装箱清单
const printCaseList = async () => {
  // 检查是否有装箱记录数据
  const targetCases = getPrintableCaseRows();
  if (!targetCases || targetCases.length === 0) {
    proxy.$message.warning('没有可打印的装箱记录');
    return;
  }

  clearPrintTemplateData('caseList');

  // 检查是否有扫描结果数据
  if (!base.state.tableData || base.state.tableData.length === 0) {
    proxy.$message.warning('没有扫描结果数据');
    return;
  }

  // 从应用场景设置中获取打印装箱清单的配置
  const billPrintSettings = state.scanSetting.billPrintSettings || [];
  const printSetting = billPrintSettings.find((item: any) => item.name === '打印装箱清单');

  if (!printSetting) {
    proxy.$message.error('请先在应用场景设置中配置打印装箱清单的模板');
    return;
  }

  const templateId = String(printSetting.templateName);
  if (!templateId) {
    proxy.$message.error('请先在应用场景设置中关联打印装箱清单的模板');
    return;
  }

  // 获取打印机名称
  const printName = printSetting.printName || '';

  // 使用打印装箱清单的配置
  const config = printTypeConfigMap.caseList;
  if (!config) {
    proxy.$message.error('打印装箱清单配置不存在');
    return;
  }

  // 顺序处理每个箱号
  for (let index = 0; index < targetCases.length; index++) {
    const caseRecord = targetCases[index];
    const caseNumber = caseRecord.caseNumber;
    if (!caseNumber) continue;

    // 根据箱号筛选扫描明细
    const caseDetailData = base.state.tableData.filter((item: any) => item.caseNumber === caseNumber && Number(item.finishedQuantity) > 0);
    if (!caseDetailData || caseDetailData.length === 0) continue;

    // 生成唯一 keyName
    const keyName = `caseList_${caseNumber}_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 8)}`;

    // 组装静态数据
    const totalFinishedQty = caseDetailData.reduce((sum: number, item: any) => sum + (Number(item.finishedQuantity) || 0), 0);

    const mainRecord = {
      ...caseRecord,
      totalQuantityOrder: totalFinishedQty,
    };
    const detailRecords = caseDetailData.map((item: any, idx: number) => ({
      ...item,
      index: idx + 1,
      quantityOrder: item.finishedQuantity,
    }));

    const printData: any = {};
    printData['mainData'] = mainRecord;
    printData['out_order_detail'] = detailRecords;
    Object.assign(printData, mainRecord); // 兼容模板直接访问字段的场景

    // 保存到 sessionStorage，供 loadStaticBillData 使用
    const storageKey = `static_${keyName}`;
    sessionStorage.setItem(storageKey, JSON.stringify([printData]));
    registerPrintTemplateKey('caseList', storageKey);

    // 调用打印，使用静态数据，并等待组件加载完成
    await new Promise<void>((resolve) => {
      printBill(
        config.menuId as any,
        templateId,
        '',
        printName || undefined,
        true,
        keyName,
        false,
        () => {
          resolve();
        },
        'caseList'
      );
    });

    await nextTick();
  }
  // 标记装箱清单已打印
  state.hasPrintContent.caseList = true;
};

// 打印箱标签
const printCaseLabel = async () => {
  const targetCases = getPrintableCaseRows();
  if (!targetCases || targetCases.length === 0) {
    proxy.$message.warning('没有可打印的装箱记录');
    return;
  }

  clearPrintTemplateData('caseLabel');

  const billPrintSettings = state.scanSetting.billPrintSettings || [];
  const printSetting = billPrintSettings.find((item: any) => item.name === '打印箱标签');
  if (!printSetting) {
    proxy.$message.error('请先在应用场景设置中配置打印箱标签的模板');
    return;
  }

  const templateId = String(printSetting.templateName);
  if (!templateId) {
    proxy.$message.error('请先在应用场景设置中关联打印箱标签的模板');
    return;
  }
  const printName = printSetting.printName || '';
  const config = printTypeConfigMap.caseNumber;
  if (!config) {
    proxy.$message.error('打印箱标签配置不存在');
    return;
  }

  // 顺序处理每个箱号
  for (let index = 0; index < targetCases.length; index++) {
    const caseRecord = targetCases[index];
    const caseNumber = caseRecord.caseNumber;
    if (!caseNumber) continue;

    // 根据箱号筛选扫描明细
    const caseDetailData = base.state.tableData.filter((item: any) => item.caseNumber === caseNumber && Number(item.finishedQuantity) > 0);
    if (!caseDetailData || caseDetailData.length === 0) continue;

    // 生成唯一 keyName
    const keyName = `caseList_${caseNumber}_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 8)}`;

    // 组装静态数据
    const totalFinishedQty = caseDetailData.reduce((sum: number, item: any) => sum + (Number(item.finishedQuantity) || 0), 0);

    const mainRecord = {
      ...caseRecord,
      totalQuantityOrder: totalFinishedQty,
    };
    const detailRecords = caseDetailData.map((item: any, idx: number) => ({
      ...item,
      index: idx + 1,
      quantityOrder: item.finishedQuantity,
    }));

    const printData: any = {};
    printData['mainData'] = mainRecord;
    printData['out_order_detail'] = detailRecords;
    Object.assign(printData, mainRecord); // 兼容模板直接访问字段的场景

    // 保存到 sessionStorage，供 loadStaticBillData 使用
    const storageKey = `static_${keyName}`;
    sessionStorage.setItem(storageKey, JSON.stringify([printData]));
    registerPrintTemplateKey('caseLabel', storageKey);

    // 调用打印，使用静态数据，并等待组件加载完成
    await new Promise<void>((resolve) => {
      printBill(
        config.menuId as any,
        templateId,
        '',
        printName || undefined,
        true,
        keyName,
        false,
        () => {
          resolve();
        },
        'caseLabel'
      );
    });

    await nextTick();
  }
  // 标记箱标签已打印
  state.hasPrintContent.caseLabel = true;
};

const clearAllPrintTemplates = () => {
  clearPrintTemplateData('caseList');
  clearPrintTemplateData('caseLabel');
  clearPrintContainers('expressBill');
  clearPrintContainers('orderList');
  clearPrintContainers('caseNumber');
  clearPrintContainers();
  resetPrintStatus();
  state.hasPrintContent.caseList = false;
  state.hasPrintContent.caseLabel = false;
};

const toggleExpressBill = async () => {
  if (state.printStatus.expressBill) {
    clearPrintContainers('expressBill');
    state.printStatus.expressBill = false;
    return;
  }
  const success = await reprintBillByType('expressBill');
  if (success) {
    state.printStatus.expressBill = true;
  }
};

const toggleOrderListBill = async () => {
  if (state.printStatus.orderList) {
    clearPrintContainers('orderList');
    state.printStatus.orderList = false;
    return;
  }
  const success = await reprintBillByType('orderList');
  if (success) {
    state.printStatus.orderList = true;
  }
};

const clearCaseListTemplatesOnly = () => {
  clearPrintTemplateData('caseList');
};

const clearCaseLabelTemplatesOnly = () => {
  clearPrintTemplateData('caseLabel');
};

const reprintBillByType = async (type: 'expressBill' | 'orderList') => {
  if (!state.formData.orderId) {
    proxy.$message.warning('请先加载出库单号');
    return false;
  }

  const config = printTypeConfigMap[type];
  if (!config) return false;

  const billPrintSettings = state.scanSetting.billPrintSettings || [];
  const printSetting = billPrintSettings.find((item: any) => item.name === config.name);
  if (!printSetting) {
    proxy.$message.warning(`请在应用场景设置中配置${config.name}`);
    return false;
  }

  const templateId = Number(printSetting.templateName);
  if (!templateId || Number.isNaN(templateId)) {
    proxy.$message.warning(`请在应用场景设置中关联${config.name}模板`);
    return false;
  }

  clearPrintContainers(config.tag);

  await new Promise<void>((resolve) => {
    printBill(config.menuId as any, templateId as any, state.formData.orderId as any, (printSetting.printName as any) || undefined, true, undefined, true, () => resolve(), config.tag);
  });
  return true;
};

const resetPrintStatus = () => {
  state.printStatus.expressBill = false;
  state.printStatus.orderList = false;
};

// 检查是否有任何打印内容
const hasAnyPrintContent = computed(() => {
  return state.printStatus.expressBill || state.printStatus.orderList || state.hasPrintContent.caseList || state.hasPrintContent.caseLabel;
});

// 检查是否应该显示打印工具栏（只要有勾选的打印单据或已有打印内容）
const shouldShowPrintToolBar = computed(() => {
  return hasExpressBillSetting.value || hasOrderListSetting.value || hasAnyPrintContent.value;
});

// 检查是否勾选了打印物流面单（需要先扫描出库单号）
const hasExpressBillSetting = computed(() => {
  return state.formData.orderId && state.scanSetting.printBill && state.scanSetting.printBill.includes('expressBill');
});

// 检查是否勾选了打印出库清单（需要先扫描出库单号）
const hasOrderListSetting = computed(() => {
  return state.formData.orderId && state.scanSetting.printBill && state.scanSetting.printBill.includes('orderList');
});

// 检查是否有打印装箱清单的内容
const hasCaseListPrint = computed(() => {
  return state.hasPrintContent.caseList;
});

// 检查是否有打印箱标签的内容
const hasCaseLabelPrint = computed(() => {
  return state.hasPrintContent.caseLabel;
});
</script>

<style lang="scss" scoped>
@import '/@/theme/scan.scss';

.justify-start {
  display: flex;
  justify-content: flex-start;
  position: relative;
}

.msg-tip {
  margin-left: 20px !important;
  max-width: 400px;
  position: absolute !important;
  top: -5px;
  left: 120px;
}

.dialog-footer {
  text-align: left;
}

.scan-result {
  margin-top: 10px;

  ::v-deep .el-card__header {
    padding: 8px 20px 10px;
  }

  .scan-result-header {
    font-size: 14px;
  }

  ::v-deep .el-button--medium {
    padding: 5px 20px;
  }

  ::v-deep .el-input-number.is-controls-right .el-input__inner {
    padding-left: 2px;
    padding-right: 28px;
  }
}

.print-tool-bar {
  margin: 10px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
