<template>
  <div>
    <div v-if="state.billDataList.length" ref="container" :print-name="printName" class="print-list-container">
      <!-- 循环单据数据 -->
      <template v-for="(billDataInfo, index0) in state.billDataList">
        <!-- 循环每个单据明细分页, pageIndex从1开始 -->
        <template v-for="pageIndex of pageCount(billDataInfo)">
          <div :id="'page_' + index0 + '_' + pageIndex" :dataindex="index0" :style="canvasStyle" class="canvas-container page-next">
            <div class="canvas-content">
              <draggable v-model="state.vueData.fields" item-key="index" group="people" ghost-class="ghost" filter=".detail-table" class="drag-list">
                <template #item="{ element, index }">
                  <draggableResizable v-if="methods.fieldShow(element, pageIndex, pageCount(billDataInfo))" :style="'z-index:' + element.options.z" :resizable="false" :draggable="false" v-bind="methods.elementOptions(element, pageIndex, pageCount(billDataInfo), index0)" class="resable-item">
                    <template v-if="element.type == 'table'">
                      <!-- 显示为文本 -->
                      <div v-if="element.onlyOnline">
                        <span v-for="(detailRow, index3) in billDataInfo[element.tableName]">
                          {{ methods.detailShowString(element, detailRow) }}
                          <template v-if="index3 < billDataInfo[element.tableName].length - 1">{{ element.rowSplit || '' }}</template>
                        </span>
                      </div>
                      <!-- 显示为表格 -->
                      <table v-else class="detail-table">
                        <template v-if="pageIndex === 1 || !element.secondHeaderHidden">
                          <thead v-if="element.showHeader">
                            <draggable v-model="element.fields" item-key="index" :class="{ 'drag-th': true }" group="detail" ghost-class="ghost" :animation="300" chosen-class="chosen-item" tag="tr">
                              <template #item="th">
                                <th :style="{ 'border-color': element.borderColor }">
                                  <div :style="methods.getHeaderDivStyle(th.element)" class="cell" v-html="th.element.label"></div>
                                </th>
                              </template>
                            </draggable>
                          </thead>
                        </template>
                        <tbody>
                          <template v-if="!billDataInfo[element.tableName] || !billDataInfo[element.tableName] || !billDataInfo[element.tableName].length">
                            <tr>
                              <td :colspan="element.fields.length" :style="{ 'border-color': element.borderColor }" class="no-detail-row">
                                <div class="cell">没有明细数据</div>
                              </td>
                            </tr>
                          </template>
                          <template v-else>
                            <tr v-for="(detailRow, index3) in currentPageData(element.tableName, billDataInfo[element.tableName], pageIndex)">
                              <td v-for="(field, thIndex) in element.fields" :style="methods.getBodyTdStyle(element, field)">
                                <div :style="methods.getBodyDivStyle(field)" class="cell">{{ methods.showDetailData(detailRow, field, index3, thIndex, pageIndex) }}</div>
                              </td>
                            </tr>
                          </template>
                        </tbody>
                        <!--最后一页显示footer-->
                        <template v-if="isLastPage(billDataInfo, pageIndex) && showFoot(element.tableName, element.fields)">
                          <tfoot>
                            <draggable v-model="element.fields" item-key="index" :class="{ 'drag-th': true }" group="detail" ghost-class="ghost" :animation="300" chosen-class="chosen-item" tag="tr">
                              <template #item="field">
                                <td v-if="field.index !== 1" :colspan="field.index === 0 ? 2 : 1" :style="{ 'border-color': element.borderColor }">
                                  <div :style="methods.getFootDivStyle(field.element)" class="cell">{{ footSum(element.tableName, field.element, field.index, billDataInfo) }}</div>
                                </td>
                              </template>
                            </draggable>
                          </tfoot>
                        </template>
                      </table>
                      <!-- 表格脚本容器，最后一页显示，已改成根据设置来显示 -->
                      <draggable v-model="element.footFields" item-key="index" group="people" ghost-class="ghost" class="widget-container" filter="widget-grid-container">
                        <!-- 循环footFields元素 -->
                        <template #item="subField">
                          <template v-if="subField.element.type === 'grid'">
                            <div v-if="subField.element && subField.element.key && methods.fieldShow(subField.element, pageIndex, pageCount(billDataInfo))" class="widget-grid-container data-grid" style="position: relative">
                              <el-row :id="subField.element.key" :justify="subField.element.options.justify" :align="subField.element.options.align" :gutter="subField.element.options.gutter ? subField.element.options.gutter : 0" :style="{ 'background-color': subField.element.isMain ? '#b2f9ec' : '' }" class="widget-grid" type="flex">
                                <!-- 循环栅格col -->
                                <el-col v-for="(col, colIndex) in subField.element.columns" :span="col.span ? col.span : 0">
                                  <draggable v-model="col.fields" item-key="index" :options="{ group: 'people', ghostClass: 'ghost' }" :style="subField.element.colStyles" class="widget-form-list grid-list" filter="widget-grid-container">
                                    <!-- 循环栅格col元素 -->
                                    <template #item="colField">
                                      <template v-if="colField.element.type == 'field'">
                                        <div class="table-container">
                                          <div :style="colField.element.styles" class="text-box">
                                            <div :style="colField.element.label.styles" class="label">
                                              {{ colField.element.label.title }}
                                              <template v-if="colField.element.label.showColon">：</template>
                                            </div>
                                            <div :style="colField.element.text.styles" class="text">{{ methods.getMainData(billDataInfo, state.vueData, colField.element.text.prop, colField.element) }}</div>
                                          </div>
                                        </div>
                                      </template>
                                      <template v-else-if="colField.element.type == 'input'">
                                        <div class="table-container">
                                          <div :style="colField.element.styles" class="text-box">
                                            <div :style="colField.element.styles" class="label">{{ colField.element.label.title }}</div>
                                          </div>
                                        </div>
                                      </template>
                                    </template>
                                  </draggable>
                                </el-col>
                              </el-row>
                            </div>
                          </template>
                          <template v-else-if="subField.element.type == 'field'">
                            <div v-if="methods.fieldShow(subField.element, pageIndex, pageCount(billDataInfo))" :id="subField.element.key" class="widget-grid-container data-grid">
                              <div :style="subField.element.styles" class="text-box">
                                <div :style="subField.element.label.styles" class="label">
                                  {{ subField.element.label.title }}
                                  <template v-if="subField.element.label.showColon">：</template>
                                </div>
                                <div :style="subField.element.text.styles" class="text">{{ subField.element.text.prop }}</div>
                              </div>
                            </div>
                          </template>
                          <template v-else>
                            <div v-if="methods.fieldShow(subField.element, pageIndex, pageCount(billDataInfo))" class="widget-grid-container data-grid">
                              <div :style="subField.element.styles" class="text-box">
                                <div :style="subField.element.label.styles" class="label">{{ subField.element.label.title }}</div>
                              </div>
                            </div>
                          </template>
                        </template>
                      </draggable>
                    </template>
                    <template v-else-if="element.type == 'field'">
                      <div :style="element.styles" class="text-box">
                        <div :style="element.label.styles" class="label">
                          {{ element.label.title }}
                          <template v-if="element.label.showColon">：</template>
                        </div>
                        <div :style="element.text.styles" class="text">{{ methods.getMainData(billDataInfo, state.vueData, element.text.prop, element) }}</div>
                      </div>
                    </template>
                    <!--一维码-->
                    <template v-else-if="element.type === 'barcode' && methods.getMainData(billDataInfo, state.vueData, element.barcode.value, element)">
                      <div :style="element.styles" class="text-box">
                        <vue-barcode :value="methods.getMainData(billDataInfo, state.vueData, element.barcode.value, element)" :options="element.barcode.options" />
                      </div>
                    </template>
                    <!--二维码-->
                    <template v-else-if="element.type == 'qrcode' && methods.getMainData(billDataInfo, state.vueData, element.qrOptions.value, element)">
                      <div :style="element.styles" class="text-box">
                        <vue-qrcode :value="methods.getMainData(billDataInfo, state.vueData, element.qrOptions.value, element)" :options="element.qrOptions" />
                      </div>
                    </template>
                    <template v-else-if="element.type == 'image'">
                      <div :id="element.key" :style="element.styles" class="text-box">
                        <img v-if="element.image.imageUrl" :src="element.image.imageUrl" :style="{ width: element.image.width + 'mm', height: element.image.height + 'mm' }" class="img" />
                      </div>
                    </template>
                    <template v-else-if="['line-horizontal', 'line-vertical'].indexOf(element.type) >= 0">
                      <div :style="element.styles" class="text-box" />
                    </template>
                    <template v-else-if="['pagination'].indexOf(element.type) >= 0">
                      <div :style="element.styles" class="pagination-box">
                        <div v-if="element.layout === '第1/5页'" class="label">第{{ pageIndex }}/{{ pageCount(billDataInfo) }}页</div>
                        <div v-else-if="element.layout === '第1页/共5页'" class="label">第{{ pageIndex }}页/共{{ pageCount(billDataInfo) }}页</div>
                        <div v-else class="label">{{ pageIndex }}/{{ pageCount(billDataInfo) }}</div>
                      </div>
                      <div :style="element.styles" class="text-box" />
                    </template>
                    <template v-else>
                      <div :style="element.styles" class="text-box">
                        <div :style="element.label.styles" class="label">{{ element.label.title }}</div>
                      </div>
                    </template>
                  </draggableResizable>
                </template>
              </draggable>
            </div>
          </div>
        </template>
      </template>
    </div>

    <el-form class="print-tool no-print" :style="!props.menuId && !state.isPda ? 'position: fixed; left: 20px; bottom: 10px' : 'margin: 0 20px'">
      <el-form-item style="margin-bottom: 0">
        <el-button v-if="!onlyLodop && !props.menuId && !state.isPda" type="primary" @click="methods.printBill">打印</el-button>
        <el-button v-if="props.menuId" type="primary" @click="methods.printBill()">LODOP直接打印</el-button>
        <span v-if="!props.menuId && !state.isPda" class="ml-10">共：{{ state.billDataList.length }}张</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="base-template-id">
import { toRefs, reactive, getCurrentInstance, ComponentInternalInstance, onMounted, computed, ref } from 'vue';
import draggable from 'vuedraggable';
import draggableResizable from '/@/components/base/draggable-resizable/index.js';
import vueBarcode from '/@/utils/vue-barcode.js';
import vueQrcode from '@chenfengyuan/vue-qrcode';
import $ from 'jquery';
import moment from 'moment';
import { DataType, QueryType, QueryBo } from '/@/types/common';

import { BaseProperties } from '/@/types/base-type';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import common from '/@/utils/common';
import { getLodop } from '/@/utils/lodopFuncs.js';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

// 定义模板 ref
const container = ref<HTMLElement | null>(null);
const emit = defineEmits(['loaded']);

//#region 定义属性
const props = defineProps({
  // 打印模板ID
  menuId: {
    type: String,
    required: false,
    default: '',
  },
  // 打印模板明细ID
  tid: {
    type: [String, Number],
    required: false,
    default: '',
  },
  // 打印单据ID List
  ids: {
    type: String,
    required: false,
    default: '',
  },
  // 打印机名称
  printName: {
    type: String,
    required: false,
    default: 'print-page',
  },
  // lodop自动打印
  isAutoPrint: {
    type: Boolean,
    default: false,
  },
  // 自动加载数据
  isAutoLoad: {
    type: Boolean,
    default: true,
  },
  // 仅显示lodop按钮
  onlyLodop: {
    type: Boolean,
    default: false,
  },
  // 键名
  keyName: {
    type: String,
    required: false,
  },
  // 自定义查询条件
  printQuery: {
    type: Array,
    required: false,
  },
  // 是否为PDA设备
  isPda: {
    type: Boolean,
    required: false,
    default: false,
  },
});
//#endregion

//#region 变量
const state = reactive({
  // 打印布局数据结构
  vueData: {
    fields: [] as any[],
    dataOptions: {} as EmptyObjectType,
  },
  // 打印参数
  printInfo: {
    vueData: '',
  },
  // 单据数据列表
  billDataList: [] as any[],
  outerHTML: '',
  isPda: false,
  webAutoPrint: false,
  hasAutoPrinted: false,
  hasLoaded: false,
});

const notifyLoaded = () => {
  if (!state.hasLoaded && state.billDataList.length) {
    state.hasLoaded = true;
    emit('loaded');
  }
};
//#endregion

//#region 计算属性
// 画布样式设置
const canvasStyle = computed(() => {
  const opts = state.vueData.dataOptions;
  if (!opts) return {};

  return {
    width: opts.width + 'mm',
    height: opts.height + 'mm',
    'padding-top': opts.paddingTop + 'mm',
    'padding-bottom': opts.paddingBottom + 'mm',
    'padding-left': opts.paddingLeft + 'mm',
    'padding-right': opts.paddingRight + 'mm',
  };
});

// 获得分页大小
const pageSize = computed(() => {
  const subTableInfo = state.vueData.fields.find((item: any) => item.type === 'table'); // 明细表参数
  if (!subTableInfo) {
    return 1;
  }

  const pageSize = subTableInfo.pageSize || 10;
  return pageSize;
});
// 获得首页分页大小
const firstPageSize = computed(() => {
  const subTableInfo = state.vueData.fields.find((item: any) => item.type === 'table'); // 明细表参数
  if (!subTableInfo) {
    return 1;
  }

  return subTableInfo.firstPageSize || pageSize.value;
});
// 获得尾页分页大小
const lastPageSize = computed(() => {
  const subTableInfo = state.vueData.fields.find((item: any) => item.type === 'table'); // 明细表参数
  if (!subTableInfo) {
    return 1;
  }

  return subTableInfo.lastPageSize || pageSize.value;
});

// 根据明细表获得分页数，没有明细表默认为1页
const pageCount = computed(() => {
  return function (billDataInfo: any) {
    const subTableInfo = state.vueData.fields.find((item: any) => item.type === 'table'); // 明细表参数
    if (!subTableInfo || !subTableInfo.tableName) {
      return 1;
    }

    const subTableData = billDataInfo[subTableInfo.tableName];
    if (!subTableData) {
      return 1;
    }
    let pageSize = subTableInfo.pageSize || 10;
    let fixedCount = 0;
    let rowCount = subTableData.length;
    if (rowCount > firstPageSize.value) {
      rowCount -= firstPageSize.value;
      fixedCount++;
    }
    const count = Math.ceil((1.0 * rowCount) / pageSize);
    const lastFactSize = rowCount - (count - 1) * pageSize; // 最后一页实际大小
    if (lastFactSize > lastPageSize.value) {
      fixedCount++;
    }

    pageSize = count + fixedCount;
    if (pageSize === 1 && rowCount > subTableInfo.onePageSize) {
      pageSize = pageSize + 1;
    }

    return pageSize;
  };
});

// 是否为最后一页
const isLastPage = computed(() => {
  return function (billDataInfo: any, pageIndex: number) {
    return pageIndex === pageCount.value(billDataInfo);
  };
});

// 获得明细分页当前页数据
const currentPageData = computed(() => {
  return function (tableName: any, rows: Array<any>, pageIndex: number) {
    const subTableInfo = state.vueData.fields.find((item: any) => item.type === 'table' && item.tableName === tableName); // 明细表参数
    if (!subTableInfo) {
      return [];
    }

    let pageSize = subTableInfo.pageSize || 10;
    let offset = 0;
    if (pageIndex === 1) {
      pageSize = firstPageSize.value;
      // 强制分页
      if (rows.length > subTableInfo.onePageSize && rows.length <= firstPageSize.value) {
        pageSize = subTableInfo.onePageSize;
      }
      const dataList = rows.filter((item: any) => item.index >= 0 && item.index <= pageSize);
      dataList.sort((a, b) => {
        return a.index > b.index ? 1 : -1;
      });
      formattingData(subTableInfo, dataList);

      return dataList;
    } else {
      let newRows = rows.filter((item: any) => item.index > firstPageSize.value);
      // 强制分页
      if (rows.length > subTableInfo.onePageSize && rows.length < firstPageSize.value) {
        newRows = rows.filter((item: any) => item.index > subTableInfo.onePageSize);
      }

      newRows.sort((a, b) => {
        return a.index > b.index ? 1 : -1;
      });
      newRows.forEach((item, index) => {
        item.subIndex = index;
      });

      offset = (pageIndex - 2) * pageSize;
      pageSize = offset + pageSize >= newRows.length ? newRows.length : offset + pageSize;
      const dataList = newRows.filter((item) => item.subIndex >= offset && item.subIndex < pageSize);
      formattingData(subTableInfo, dataList);
      return dataList;
    }
  };
});

//数据格式化
const formattingData = (subTableInfo: any, dataList: any) => {
  for (const item of dataList) {
    // 确保expandFields已经合并到item中
    mergeExpandFields(item);

    Object.keys(item).forEach((key) => {
      let keyInfo = subTableInfo.fields.find((i: any) => i.prop.toLowerCase() == key.toLowerCase());
      //查询只在页面显示的列,并且还配置了格式化
      if (keyInfo && keyInfo.body.formatter) {
        keyInfo.body.prop = key;
        item[key] = common.formatData(item, keyInfo.body);
      }
    });
  }
};

// 根据是否存在求和列，决定是否显示foot
const showFoot = computed(() => {
  return function (tableName: any, fields: any) {
    const subTableInfo = state.vueData.fields.find((item: any) => item.type === 'table' && item.tableName === tableName); // 明细表参数
    if (!subTableInfo) {
      return false;
    }

    const hasSum = fields.some((s: any) => s.body.showSum);
    return hasSum;
  };
});

// 获得列求和
const footSum = computed(() => {
  return function (tableName: any, field: any, thIndex: number, billDataInfo: any) {
    if (thIndex === 0) {
      return '合计：';
    }
    if (!field.body.showSum) return '';

    const subTableInfo = state.vueData.fields.find((item: any) => item.type === 'table' && item.tableName === tableName); // 明细表参数
    if (!subTableInfo || !subTableInfo.tableName) {
      return 0;
    }

    const subTableData = billDataInfo[subTableInfo.tableName];
    if (!subTableData) {
      return 0;
    }

    let sumData = 0;
    subTableData.forEach((item: any) => {
      try {
        sumData += Number(item[field.prop]) || 0;
      } catch (error: any) {
        proxy.$message.error(field.label + '求和错误：' + error.message);
      }
    });
    const formatter = field.body.formatter || '0.####';
    let sumData2 = common.formatNumber(sumData, formatter);
    return sumData2;
  };
});

// 自定义打印条件
const printQuery = computed(() => {
  if (props.printQuery) return props.printQuery;

  const _printQuery: string = proxy.$route?.query?.printQuery as any;
  if (_printQuery) {
    return JSON.parse(_printQuery);
  } else {
    return null;
  }
});

// 打印重复数量
const printQtys = computed(() => {
  const _printQtys: string = proxy.$route?.query?.printQtys as any;
  if (_printQtys) {
    return JSON.parse(_printQtys);
  } else {
    return null;
  }
});

// 自动打印
const webAutoPrint = computed(() => {
  const autoPrint = proxy.$route?.query?.autoPrint === 'true';
  return autoPrint;
});
//#endregion

//#region onMounted
onMounted(async () => {
  // 优先使用 props 传入的参数，如果没有则使用 URL 参数
  if (typeof props.isPda !== 'undefined') {
    state.isPda = props.isPda;
  } else if (proxy.$route?.query?.isPda) {
    state.isPda = proxy.$route.query.isPda === 'true';
  }
  state.billDataList = [];
  await methods.loadModuleData();
  await methods.loadStaticBillData(); // 加载静态数据

  // 如果只加载静态数据，也需要检查自动打印
  if (state.billDataList.length > 0) {
    methods.checkAutoPrint();
  }
});
//#endregion

//#region 方法

/**
 * 合并expandFields到主对象
 * 将JSON字符串或对象形式的expandFields字段合并到主数据对象中
 * 这样在打印时就可以直接访问expandFields中的字段
 * @param item 包含expandFields的数据对象
 * @returns 合并后的数据对象
 */
const mergeExpandFields = (item: any) => {
  if (item.expandFields) {
    let expandFields = item.expandFields;
    if (typeof expandFields !== 'object') {
      try {
        expandFields = JSON.parse(expandFields);
      } catch (error) {
        console.warn('解析expandFields失败:', error);
        expandFields = {};
      }
    }
    Object.assign(item, expandFields);
  }
  return item;
};

let methods = {
  // 加载打印模板信息
  async loadModuleData() {
    const propTid = props.tid ? Number(props.tid) : 0;
    const routeTid = proxy.$route?.params?.tid ? Number(proxy.$route?.params?.tid) : 0;
    const tid = propTid > 0 ? propTid : routeTid;
    const menuId: any = props.menuId || proxy.$route?.params?.menuId;
    // 查询条件
    let queryBoList: Array<QueryBo> = [];
    if (tid > 0) {
      queryBoList = [
        {
          column: 'printTemplateId',
          values: '' + tid,
          queryType: QueryType.EQ,
          dataType: DataType.LONG,
        },
      ];
    } else {
      queryBoList = [
        {
          column: 'menuId',
          values: menuId,
          queryType: QueryType.EQ,
          dataType: DataType.LONG,
        },
      ];
    }
    let url = '/system/core/printTemplate/selectOne';
    const [err, res] = await to(postData(url, queryBoList, { repeatSubmit: false }));
    if (err) {
      return;
    }

    if (res.result) {
      let data = res.data;
      if (!data) {
        proxy.$message.error('没有加载到打印配置信息！');
        return;
      }
      state.printInfo = data;
      state.vueData = JSON.parse(state.printInfo.vueData);
      // 处理二维码
      let getTempTokenUrl = '';
      for (let item of state.vueData.fields) {
        if (item.type === 'qrcode') {
          let tempTokenUrl = item.qrOptions.value;
          // 设置为接口时，需要请求接口
          if (tempTokenUrl && tempTokenUrl.indexOf('/') === 0) {
            getTempTokenUrl = item.qrOptions.value;
            item.qrOptions.value = 'qrcode';
          }
        }
      }
      // 优先使用 props 传入的参数，如果没有则使用 URL 参数
      let isAutoLoad: Boolean = false;
      if (typeof props.isAutoLoad !== 'undefined') {
        // 组件使用传参
        isAutoLoad = props.isAutoLoad;
      } else if (proxy.$route?.query && typeof proxy.$route.query.isAutoLoad !== 'undefined') {
        // 如果url传参，使用url参数
        isAutoLoad = proxy.$route.query.isAutoLoad === 'true';
      }
      if (isAutoLoad) {
        // 从标准通用接口里面获取数据
        await methods.loadStandardBillData();
        // 处理二维码数据
        for (let row of state.billDataList) {
          if (!state.vueData || !state.vueData.dataOptions || !state.vueData.dataOptions.idField) {
            const errorMsg = '未设置主键！';
            if (proxy.$message) {
              proxy.$message.error(errorMsg);
            } else {
              console.error(errorMsg);
            }
            return '';
          }
          let idValue = row[state.vueData.dataOptions.idField];
          if (!idValue) {
            const errorMsg = '主键值不存在！';
            if (proxy.$message) {
              proxy.$message.error(errorMsg);
            } else {
              console.error(errorMsg);
            }
            return '';
          }
          if (getTempTokenUrl) {
            getTempTokenUrl += '/' + idValue;
            // 获取临时登录二维码
            let [err, res] = await to(postData(getTempTokenUrl));
            if (err || !res) return 'error';

            row.qrcode = location.origin + '/login-sso-scan?token=' + res.data.token;
          }
        }
      }
    } else {
      proxy.$message.error(res.msg);
    }
  },
  // 加载标准通用单据数据
  async loadStandardBillData() {
    if (!state.vueData || !state.vueData.dataOptions) {
      console.error('打印模板数据未加载');
      return;
    }
    const url = state.vueData.dataOptions.router;
    if (!url) return;
    let ids: any = props.ids || proxy.$route?.params?.ids;
    if (!ids) return;

    let idList = ids.split(',');
    if (state.vueData.dataOptions.isMergePrint) {
      idList = [ids];
    }
    for (let mainId of idList) {
      // 查询条件
      let queryBoList: Array<QueryBo> = [
        {
          column: state.vueData.dataOptions.idField,
          values: mainId,
          queryType: QueryType.IN,
          dataType: DataType.LONG,
        },
      ];
      // 自定义扩展查询条件
      if (printQuery && printQuery.value) {
        queryBoList.push(...printQuery.value);
      }

      const [err, res] = await to(postData(url, queryBoList));
      if (err) {
        continue;
      }
      if (res.result) {
        if (res.data.isCustomData) {
          // 自定义数据
          if (Array.isArray(res.data.dataList)) {
            // 集合数据
            state.billDataList.push(...res.data.dataList);
          }
          if (common.isObject(res.data.dataInfo)) {
            // 单条数据
            state.billDataList.push(res.data.dataInfo);
          }
          // 扩展字段处理
          state.billDataList.forEach((item) => {
            mergeExpandFields(item);
          });
          continue;
        }
        let mainData = res.data;
        mainData = mergeExpandFields(mainData);

        if (!mainData) {
          proxy.$message.error('没有加载到标准打印配置信息！');
          continue;
        }

        // 获取明细数据
        const subTableList = state.vueData.fields.filter((item: any) => item.type === 'table'); // 明细表集合
        for (let subTable of subTableList) {
          await this.loadStandardBillDetailData(mainId, mainData, subTable);
        }

        let printQtyItem = null;
        if (printQtys && printQtys.value) {
          printQtyItem = printQtys.value.find((item: any) => item.id === Number(mainId));
        }
        let printQty = 1;
        if (printQtyItem) printQty = printQtyItem.qty; // 自定义打印重复数量

        for (let index = 0; index < printQty; index++) {
          mainData.index = index + 1;
          state.billDataList.push(common.deepCopy(mainData));
        }

        // web 自动打印
        if (state.webAutoPrint) {
          window.setTimeout(() => {
            methods.printCount(); // 记录打印次数
          }, 800);
        }

        // 检查是否需要自动打印（根据 props.isAutoPrint）
        methods.checkAutoPrint();
        notifyLoaded();
      } else {
        proxy.$message.error(res.msg);
      }
    }
  },
  // 加载静态数据
  loadStaticBillData() {
    let keyName = props.keyName || proxy.$route?.query?.key;
    if (!keyName) return;

    let key = ('static_' + keyName) as string;
    let data = sessionStorage.getItem(key);
    if (data) {
      let mainData = JSON.parse(data);
      if (Array.isArray(mainData)) {
        // 处理数组中的每个对象的expandFields
        mainData.forEach((item: any) => {
          mergeExpandFields(item);
        });
        state.billDataList.push(...mainData);
      } else {
        // 处理单个对象的expandFields
        mergeExpandFields(mainData);
        state.billDataList.push(mainData);
      }
      notifyLoaded();
    }
  },
  // 加载标准通用单据明细数据
  async loadStandardBillDetailData(mainId: any, mainData: any, subTableInfo: any) {
    const tableName = subTableInfo.tableName; // 明细表明细
    const url = subTableInfo.detailApiUrl; // 明细接口地址
    // 查询条件
    let queryBoList: Array<QueryBo> = [
      {
        column: state.vueData.dataOptions.idField,
        values: mainId,
        queryType: QueryType.EQ,
        dataType: DataType.LONG,
      },
    ];

    const [err, res] = await to(postData(url, queryBoList));
    if (err) {
      return;
    }
    if (res.result) {
      let subTableData = res.data;
      if (!subTableData) {
        proxy.$message.error('没有加载到标准通用打印配置信息！');
        return;
      }

      subTableData.forEach((item: any) => {
        mergeExpandFields(item);
      });

      this.sortData(subTableInfo.tableName, subTableData); // 先按照指定字段排序

      subTableData.forEach((item: any, index: number) => {
        item.index = index + 1; // 序号
      });
      subTableData.sort((a: any, b: any) => {
        return a.index > b.index ? 1 : -1;
      });

      mainData[tableName] = subTableData;
    }
  },
  // 排序数据
  sortData(tableName: any, rows: Array<any>) {
    // 明细表参数
    const subTableInfo = state.vueData.fields.find((item: any) => item.type === 'table' && item.tableName === tableName);
    // 数据排序
    if (subTableInfo.orderFields) {
      const orderFields = subTableInfo.orderFields.split(',');
      for (let i = 0; i < orderFields.length; i++) {
        let field = common.caseStyle(orderFields[i]);
        const orders = field.split(' ');
        let orderBy = 1;
        field = orders[0];
        if (orders.length && orders[1] === 'DESC') {
          orderBy = -1;
        }
        rows.sort((a, b) => {
          return a[field] > b[field] ? orderBy : -orderBy;
        });
      }
    }
  },
  // 打印单据
  printBill() {
    // 只操作当前组件的元素，避免影响其他模板
    if (container.value) {
      const lastCanvas = container.value.querySelector('.canvas-container:last-child');
      if (lastCanvas) {
        lastCanvas.classList.remove('page-next');
      }
    }

    // 如果指定了打印机名称，使用 lodop 打印
    if (props.printName && props.printName !== 'print-page') {
      methods.lodopPrint();
    } else {
      // 否则使用浏览器打印
      window.print();
    }
  },
  // lodop 打印
  lodopPrint() {
    try {
      const LODOP = getLodop();
      if (!LODOP || !LODOP.VERSION) {
        if (proxy.$message) {
          proxy.$message.warning('打印控件未安装，将使用浏览器打印');
        } else {
          console.warn('打印控件未安装，将使用浏览器打印');
        }
        window.print();
        return;
      }

      // 设置打印任务名称
      LODOP.PRINT_INIT('打印任务');

      // 如果指定了打印机名称，设置打印机
      if (props.printName && props.printName !== 'print-page') {
        try {
          // 尝试通过打印机名称设置打印机
          const printerCount = LODOP.GET_PRINTER_COUNT();
          if (printerCount && printerCount > 0) {
            let printerIndex = -1;

            // 遍历所有打印机，找到匹配的打印机
            for (let i = 0; i < printerCount; i++) {
              try {
                const printerName = LODOP.GET_PRINTER_NAME(i);
                if (printerName === props.printName) {
                  printerIndex = i;
                  break;
                }
              } catch (e) {
                // 忽略单个打印机获取失败
                continue;
              }
            }

            if (printerIndex >= 0) {
              LODOP.SET_PRINTER_INDEX(printerIndex);
            } else {
              // 如果找不到指定的打印机，尝试直接使用打印机名称
              try {
                LODOP.SET_PRINTER_INDEXA(props.printName);
              } catch (e) {
                console.warn('设置打印机失败，使用默认打印机:', e);
              }
            }
          }
        } catch (e) {
          console.warn('获取打印机列表失败，使用默认打印机:', e);
        }
      }

      // 获取打印内容 - 使用组件自身的 ref，而不是全局选择器
      const printContainerElement = container.value;
      if (!printContainerElement) {
        const errorMsg = '没有可打印的内容';
        if (proxy.$message) {
          proxy.$message.error(errorMsg);
        } else {
          console.error(errorMsg);
        }
        return;
      }

      const printContent = printContainerElement.innerHTML;
      if (!printContent) {
        const errorMsg = '没有可打印的内容';
        if (proxy.$message) {
          proxy.$message.error(errorMsg);
        } else {
          console.error(errorMsg);
        }
        return;
      }

      // 拼装打印内容，包含必要的样式，防止打印变形
      const printHtml = `
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body {
                margin: 0;
                font-family: 'Microsoft YaHei', Arial, sans-serif;
                -webkit-print-color-adjust: exact;
              }
              ${_style}
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `;

      // 添加打印内容
      LODOP.ADD_PRINT_HTML(0, 0, '100%', '100%', printHtml);

      // 执行打印
      LODOP.PRINT();
    } catch (error: any) {
      console.error('Lodop打印失败:', error);
      const errorMsg = '打印失败：' + (error?.message || '未知错误');
      if (proxy.$message) {
        proxy.$message.error(errorMsg);
      } else {
        console.error(errorMsg);
      }
      // 失败时回退到浏览器打印
      window.print();
    }
  },
  // 获得主表数据，先从主表获得，如果没有从otherData中获取
  getMainData(billDataInfo: any, vueData: any, _prop: any, element?: any) {
    if (!billDataInfo || !vueData || !vueData.dataOptions) {
      return '';
    }
    let masterData = billDataInfo[vueData.dataOptions.tableName];
    if (!masterData) masterData = billDataInfo;

    if (_prop && _prop.indexOf('/login-sso-scan') >= 0) {
      // 二维码字段值特殊处理
      return _prop;
    }

    const props = _prop.split(',');
    let values = '';
    for (let prop of props) {
      prop = common.caseStyle(prop);
      masterData.date = moment(new Date()).format('YYYY-MM-DD'); // 打印日期
      masterData.dateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss'); // 打印日期时间
      const key = props.keyName || proxy.$route?.query?.key;
      let localdata = sessionStorage['localdata_' + key]; // 本地化数据

      let data = masterData[prop];
      if (!data && billDataInfo['otherData']) {
        data = billDataInfo['otherData'][prop];
      }
      if (!data && localdata) {
        localdata = JSON.parse(localdata);
        data = localdata[prop];
      }
      if (element && element.text && ['datetime', 'date'].indexOf(element.text.dataType) >= 0) {
        const formatter = element.text.formatter || 'YYYY-MM-DD HH:mm:ss';
        data = common.formatDate(data, formatter);
      } else if (element && element.text && ['int16', 'int32', 'int32', 'decimal', 'double', 'single', 'bigDecimal'].indexOf(element.text.dataType) >= 0 && element.text.formatter) {
        const formatter = element.text.formatter;
        data = common.formatNumber(data, formatter);
      }
      if (Array.isArray(data)) data = data.join(',');
      if (data === null || data === undefined) data = '';
      values += data;
    }

    // 数据加密
    if (element.encryptionSymbol || element.encryptionBefore || element.encryptionAfter) {
      let before = '';
      if (element.encryptionBefore) {
        before = values.substr(0, element.encryptionBefore);
      }
      let after = '';
      if (element.encryptionAfter) {
        let len = values.length - element.encryptionAfter;
        if (len < 0) len = 0;
        if (len > element.encryptionAfter) len = element.encryptionAfter;
        after = values.substr(values.length - len);
      }
      if (values) {
        values = before + element.encryptionSymbol + after;
      }
    }
    return values;
  },
  // 获得明细表数据
  showDetailData(row: any, field: any, rowIndex: number, colIndex: number, pageIndex: number) {
    const _prop = field.prop;
    const props = _prop.split(',');
    let values = '';
    row.date = moment(new Date()).format('YYYY-MM-DD'); // 打印日期
    row.dateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss'); // 打印日期时间

    for (let prop of props) {
      prop = common.caseStyle(prop);
      let data = row[prop];
      if (field && field.body && ['datetime', 'date'].indexOf(field.body.dataType) >= 0) {
        const formatter = field.body.formatter || 'YYYY-MM-DD HH:mm:ss';
        data = common.formatDate(data, formatter);
      } else if (field && field.body && ['decimal', 'double', 'int16', 'int32', 'int64', 'int'].indexOf(field.body.dataType) >= 0) {
        const formatter = field.body.formatter || '0.##';
        data = common.formatNumber(data, formatter);
      }
      if (Array.isArray(data)) data = data.join(',');
      if (data === null || data === undefined) data = '';
      if (field.body && field.body.maxLength > 0) {
        if (data) {
          const _data = data.toString();
          if (_data.length > field.body.maxLength) {
            data = _data.substr(0, field.body.maxLength) + '...';
          }
        }
      }

      // 执行脚本
      try {
        if (field.body.script) {
          // eslint-disable-next-line
          eval(field.body.script);
        }
      } catch (error: any) {
        proxy.$message.error(`${prop}执行脚本错误：${error.message}`);
      }
      values += data;
    }
    return values;
  },
  // label获得混编数据
  getLabelValue(billDataInfo: any, vueData: any, element: any) {
    let title = element.label.title;
    // 主表数据
    const mainData = billDataInfo;
    Object.keys(mainData).forEach((key) => {
      const data = mainData[key];
      title = title.replace('{' + key + '}', data);
    });
    if (billDataInfo['otherData']) {
      const otherData = billDataInfo['otherData'];
      Object.keys(otherData).forEach((key) => {
        const data = otherData[key];
        title = title.replace('{' + key + '}', data);
      });
    }
    return title;
  },
  // 表格头部div样式
  getHeaderDivStyle(th: any) {
    const data: any = { 'font-size': th.header.fontSize + 'mm', 'line-height': th.header.lineHeight + 'mm', 'text-align': th.header.textAlign };
    if (th.width) {
      data.width = th.width + 'px';
    }
    return data;
  },
  // 表格body td样式
  getBodyTdStyle(element: any, field: any) {
    const data: any = {
      'border-color': element.borderColor,
      'font-size': field.body.fontSize + 'mm',
      'line-height': field.body.lineHeight + 'mm',
      'text-align': field.body.textAlign,
    };
    if (field.width) {
      data.width = field.width + 'px';
    }
    return data;
  },
  // 表格body div样式
  getBodyDivStyle(field: any) {
    const data: any = {
      'font-size': field.body.fontSize + 'mm',
      'line-height': field.body.lineHeight + 'mm',
      'text-align': field.body.textAlign,
    };
    if (field.width) {
      data.width = field.width + 'px';
    }
    return data;
  },
  // 表格foot div样式
  getFootDivStyle(field: any) {
    if (!field.foot) {
      return {};
    }
    const data = {
      'font-size': (field.foot.fontSize || 5) + 'mm',
      'line-height': (field.foot.lineHeight || 5) + 'mm',
      'text-align': field.foot.textAlign || 'foot',
      width: '100%',
    };
    return data;
  },
  // 是否显示
  fieldShow(element: any, pageIndex: any, pageCount: any) {
    const showMode = element.showMode;
    if (showMode === '仅首页') {
      if (pageIndex === 1) {
        return true;
      } else {
        return false;
      }
    } else if (showMode === '仅尾页') {
      if (pageIndex === pageCount) {
        return true;
      } else {
        return false;
      }
    } else if (showMode === '首页尾页') {
      if (pageIndex === 1 || pageIndex === pageCount) {
        return true;
      } else {
        return false;
      }
    }

    return true;
  },
  // 字段参数
  elementOptions(element: any, pageIndex: number, pageCount: number, index: number) {
    let opts = element.options;
    if (!opts._y) {
      opts._y = opts.y;
    }
    opts = common.deepCopy(opts);
    if (pageCount > 1 && pageIndex === pageCount && element.lastY) {
      opts.y = element.lastY;
    } else if (pageIndex !== 1 && element.secondY) {
      opts.y = element.secondY;
    } else {
      opts.y = opts._y;
    }

    // 跟随组件
    if (element.options.followId) {
      let component: any = null;
      state.vueData.fields.forEach((item: any) => {
        if (item.key === element.options.followId) {
          component = item;
        } else if (item.type === 'table') {
          const footCom = item.footFields.find((fItem: any) => fItem.key === element.options.followId);
          if (footCom) {
            component = footCom;
          }
        }
      });
      if (component) {
        setTimeout(() => {
          const id = 'page_' + index + '_' + pageIndex;
          const com = $('#' + id + ' #' + component.key);
          if (com.length) {
            const offset: any = com.offset();
            const left = offset.left + Number(element.options.followX);
            const top = offset.top + Number(element.options.followY);
            // 调整元素位置
            $('#' + id + ' #' + element.key).offset({
              left: left,
              top: top,
            });
          }
        }, 10);
      }
    }

    return opts;
  },
  // 记录打印次数
  async printCount() {
    const menuId = proxy.$route?.params?.menuId;
    const ids = proxy.$route?.params?.ids;
    const tid = proxy.$route?.params?.tid;
    const url = '/api/sys/print/printCount';
    const params = {
      menuId: menuId,
      ids: ids,
      tid: tid,
    };
    const [err, res] = await to(postData(url, params));
    if (err) {
      return;
    }
    common.showMsg(res);
    window.print();
    window.parent.closePrintDialog();
  },
  // 明细显示为字符串模式
  detailShowString(element: any, detailRow: any) {
    let stringExpress = element.stringExpress || '';
    for (const field of element.fields) {
      const v = detailRow[field.prop];
      stringExpress = stringExpress.replace(`{${field.prop}}`, v);
    }

    return stringExpress;
  },
  // 检查是否需要自动打印
  checkAutoPrint() {
    // 优先使用 props 传入的参数，如果没有则使用 URL 参数
    let shouldAutoPrint = false;
    if (typeof props.isAutoPrint !== 'undefined') {
      // 组件使用传参
      shouldAutoPrint = props.isAutoPrint;
    } else if (proxy.$route?.query && typeof proxy.$route.query.autoPrint !== 'undefined') {
      // 如果url传参，使用url参数
      shouldAutoPrint = proxy.$route.query.autoPrint === 'true';
    }

    // 如果没有数据，不执行自动打印
    if (!state.billDataList || state.billDataList.length === 0) {
      return;
    }

    if (state.hasAutoPrinted) {
      return;
    }

    // 如果需要自动打印，延迟执行以确保 DOM 渲染完成
    if (shouldAutoPrint) {
      // 等待 DOM 渲染完成后再打印
      window.setTimeout(() => {
        methods.printBill();
      }, 500);
      state.hasAutoPrinted = true;
    }
  },
};
//#endregion

// 导出 methods 供外部访问
defineExpose({
  ...methods,
});

const _style = `
  .vdr {
    position: absolute;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
  }
  .handle {
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    display: none;
    position: absolute;
    width: 10px;
    height: 10px;
    font-size: 1px;
    background: #eee;
    border: 1px solid #333;
    z-index: 999;
  }
  .handle-tl {
    top: -5px;
    left: -5px;
    cursor: nw-resize;
  }
  .handle-tm {
    top: -5px;
    left: 50%;
    margin-left: -5px;
    cursor: n-resize;
  }
  .handle-tr {
    top: -5px;
    right: -5px;
    cursor: ne-resize;
  }
  .handle-ml {
    top: 50%;
    margin-top: -5px;
    left: -5px;
    cursor: w-resize;
  }
  .handle-mr {
    top: 50%;
    margin-top: -5px;
    right: -5px;
    cursor: e-resize;
  }
  .handle-bl {
    bottom: -5px;
    left: -5px;
    cursor: sw-resize;
  }
  .handle-bm {
    bottom: -5px;
    left: 50%;
    margin-left: -5px;
    cursor: s-resize;
  }
  .handle-br {
    bottom: -5px;
    right: -5px;
    cursor: se-resize;
  }
  @media only screen and (max-width: 768px) {
    /* For mobile phones: */
  [class*="handle-"]:before {
      content: "";
      left: -10px;
      right: -10px;
      bottom: -10px;
      top: -10px;
      position: absolute;
  }
  }

  .print-list-container{
    padding:0px;
    margin:0px;
  }
  .canvas-container {
    background-color: white;
    margin: 0px;
  }
  .canvas-container .canvas-content {
      height: 100%;
      padding-bottom: 0px;
      border: 1px none #000000;
  }
  .canvas-container .canvas-content .drag-list {
        height: 100%;
        position: relative;
  }
  .canvas-container .canvas-content .tool {
        display: none;
        position: absolute;
        right: 0;
        bottom: -30px;
  }
  .canvas-container .canvas-content .text-box {
        overflow: hidden;
        /*white-space: nowrap;*/
        line-height:25px;
  }
  .canvas-container .canvas-content .text-box .label {
          width: 120px;
          display: inline-block;
          text-align: right;
  }
  .canvas-container .canvas-content .text-box .text {
          display: inline-block;
  }
  .canvas-container .ghost {
      background: #fff;
      border: 1px dashed #409eff;
  }
  .canvas-container .ghost::after {
        background: #fff;
  }
  .canvas-container li.ghost {
      height: 30px;
      list-style: none;
      font-size: 0;
  }
  .canvas-container .detail-table {
      border-collapse: collapse;
      border: 1px solid #dcdfe6;
      background-color: white;
      width: 100%;
  }
  .canvas-container .detail-table th,
      .canvas-container .detail-table td {
        font-weight: normal;
        position: relative;
        border-collapse: collapse;
        border: 1px solid #dcdfe6;
        padding: 3px 10px;
  }
  .canvas-container .detail-table th .cell,
        .canvas-container .detail-table td .cell {
          min-height: 20px;
  }
  .canvas-container .detail-table th.drag-active,
        .canvas-container .detail-table td.drag-active {
          background-color: #d5eaff;
  }
  .canvas-container .detail-table th.drag-active .tool,
          .canvas-container .detail-table td.drag-active .tool {
            display: block;
  }
  .canvas-container .detail-table .no-detail-row {
        text-align: center;
        color: #888;
        padding: 20px;
  }
  @media print {
  .canvas-container {
      -webkit-box-shadow: none;
      box-shadow: none;
      margin: 0px;
  }
  .canvas-container .canvas-content {
        border: 0px dotted #000000;
  }
  .no-print {
      display: none;
  }
  .page-next {
      page-break-after: always;
  }
  }
`;
</script>

<style lang="css">
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  background-color: #f8f8f8;
  font-size: 14px;
  overflow: auto;
}
</style>

<style lang="scss">
.canvas-container {
  background-color: white;
  -moz-box-shadow: 0px 0px 10px #3d3d3d;
  -webkit-box-shadow: 0px 0px 10px #3d3d3d;
  box-shadow: 0px 0px 10px #3d3d3d;
  margin: 20px;

  .canvas-content {
    .drag-list {
      height: 100%;
      position: relative;
    }

    height: 100%;
    padding-bottom: 0px;
    border: 1px none #000000;

    //  .resable-item {
    //    &.active {
    //      border: 1px dashed #888;
    //    }
    //  }
    .tool {
      display: none;
      position: absolute;
      right: 0;
      bottom: -30px;
    }

    //  .active {
    //    background-color: rgb(213, 234, 255);
    //    > .tool {
    //      display: block;
    //    }
    //  }
    .text-box {
      overflow: hidden;
      white-space: nowrap;
      display: flex;

      .label {
        width: 120px;
        display: inline-block;
        text-align: right;
        color: #000000;
      }

      .text {
        display: inline-block;
      }
    }
  }

  .ghost {
    background: #fff;
    border: 1px dashed #409eff;

    &::after {
      background: #fff;
    }
  }

  li.ghost {
    height: 30px;
    list-style: none;
    font-size: 0;
  }

  .detail-table {
    border-collapse: collapse;
    border: 1px solid #dcdfe6;
    background-color: white;
    width: 100%;

    th,
    td {
      font-weight: normal;
      position: relative;
      border-collapse: collapse;
      border: 1px solid #dcdfe6;
      padding: 3px 2px;

      .cell {
        min-height: 20px;
        word-break: break-all;
        word-wrap: break-word;
        line-height: 20px;
      }

      &.drag-active {
        background-color: rgb(213, 234, 255);

        .tool {
          display: block;
        }
      }
    }

    tfoot td {
      border-collapse: collapse;
      border: 0px solid #dcdfe6;
      // font-weight: bold;
    }

    .no-detail-row {
      text-align: center;
      color: #888;
      padding: 20px;
    }
  }
}

@media print {
  body {
    height: auto !important;
  }

  .canvas-container {
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    margin: 0px;

    .canvas-content {
      border: 0px dotted #000000;
    }
  }

  .no-print {
    display: none;
  }

  .page-next {
    page-break-after: always;
  }
}
</style>
