<template>
  <div :style="canvasStyle" class="canvas-container" @mousedown="selectWidget.value = null">
    <div class="canvas-content">
      <draggable v-model="data.fields" item-key="index" v-selectable="data.fields" group="people" ghost-class="ghost" filter=".detail-table" class="drag-list" @end="handleMoveEnd" @add="handleWidgetAdd">
        <template #item="{ element, index }">
          <draggableResizable v-model:x="element.options.x" v-model:y="element.options.y" v-model:z="element.options.z" v-model:w="element.options.w" v-model:h="element.options.h" v-model:minw="element.options.minw" v-model:minh="element.options.minh" :class="{ active: isActive(element) }" :style="'z-index:' + element.options.z" :data-key="element.key" class="resable-item" @click.stop="handleSelectWidget(data.fields, element, index)">
            <template v-if="element.type == 'table'">
              <table :style="{ 'border-color': element.borderColor, width: element.width }" class="detail-table" @mousedown.stop>
                <thead v-if="element.showHeader">
                  <draggable v-model="element.fields" item-key="index" group="detail" ghost-class="ghost" :animation="300" chosen-class="chosen-item" :class="{ 'drag-th': true }" tag="tr">
                    <template #item="th">
                      <th :style="{ 'border-color': element.borderColor, width: th.element.width + 'px' }" :class="{ 'drag-active': isActive(th.element) }" @click.stop="handleThSelectWidget(th.element)">
                        <div :style="getHeaderDivStyle(th.element)" class="cell">{{ th.element.label }}</div>
                        <div class="tool">
                          <el-button title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleDetailWidgetDelete(element.fields, th.index)">
                            <i class="yrt-shanchu2"></i>
                          </el-button>
                        </div>
                      </th>
                    </template>
                  </draggable>
                </thead>
                <tbody>
                  <tr v-for="i in [0]" :key="'tr' + i">
                    <td v-for="(th, thIndex) in element.fields" :key="thIndex" :style="{ 'border-color': element.borderColor }">
                      <div class="cell"></div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <draggable v-model="element.footFields" item-key="index" group="people" ghost-class="ghost" class="widget-container" filter="widget-grid-container" @end="handleMoveEnd" @add="handleContainerAdd($event, element.footFields)">
                <!-- 循环footFields元素 -->
                <template #item="subField">
                  <template v-if="subField.element.type === 'grid'">
                    <div v-if="subField.element && subField.element.key" class="widget-grid-container data-grid" style="position: relative">
                      <el-row :justify="subField.element.options.justify" :align="subField.element.options.align" :class="{ active: selectWidget && selectWidget.key === subField.element.key }" :gutter="subField.element.options.gutter ? subField.element.options.gutter : 0" :style="{ 'background-color': subField.element.isMain ? '#b2f9ec' : '' }" class="widget-grid" type="flex" @click.stop="handleSelectWidget(element.footFields, subField.element, subField.index)" @mousedown.stop>
                        <!-- 循环栅格col -->
                        <el-col v-for="(col, colIndex) in subField.element.columns" :key="colIndex" :span="col.span ? col.span : 0">
                          <div style="border: 1px dashed #999">
                            <draggable v-model="col.fields" item-key="index" group="people" ghost-class="ghost" :style="subField.element.colStyles" class="widget-form-list grid-list" filter="widget-grid-container" @end="handleMoveEnd" @add="handleWidgetColAdd($event, subField.element, colIndex)">
                              <!-- 循环栅格col元素 -->
                              <template #item="colField">
                                <template v-if="colField.element.type == 'field'">
                                  <div :class="{ 'drag-active': isActive(colField.element) }" class="table-footer-container" @click.stop="handleSelectWidget(col.fields, colField.element, colField.index)" @mousedown.stop>
                                    <div :style="colField.element.styles" class="text-box">
                                      <div :style="colField.element.label.styles" class="label">
                                        {{ colField.element.label.title }}
                                        <template v-if="colField.element.label.showColon">：</template>
                                      </div>
                                      <div :style="colField.element.text.styles" class="text">{ {{ colField.element.text.prop }} }</div>
                                    </div>
                                    <div class="tool">
                                      <el-button v-if="colField.element.options.w > 20" title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(col.fields, colField.index)">
                                        <i class="yrt-shanchu2"></i>
                                      </el-button>
                                    </div>
                                  </div>
                                </template>
                                <template v-else-if="colField.element.type == 'input'">
                                  <div :class="{ 'drag-active': isActive(colField.element) }" class="table-footer-container" @click.stop="handleSelectWidget(col.fields, colField.element, colField.index)" @mousedown.stop>
                                    <div :style="colField.element.styles" class="text-box">
                                      <div :style="colField.element.label.styles" class="label">{{ colField.element.label.title }}</div>
                                    </div>
                                    <div class="tool">
                                      <el-button v-if="colField.element.options.w > 20" title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(col.fields, colField.index)">
                                        <i class="yrt-shanchu2"></i>
                                      </el-button>
                                    </div>
                                  </div>
                                </template>
                              </template>
                            </draggable>
                          </div>
                        </el-col>
                      </el-row>
                      <div class="tool">
                        <el-button title="删除" style="bottom: -20px" circle plain type="danger" class="widget-action-delete" @click.stop="handleWidgetDelete(element.footFields, subField.index)">
                          <i class="yrt-shanchu2"></i>
                        </el-button>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="subField.element.type == 'field'">
                    <div class="widget-grid-container data-grid" @click.stop="handleSelectWidget(element.fields, subField.element, subField.index)" @mousedown.stop>
                      <div :style="subField.element.styles" :class="{ 'drag-active': isActive(subField.element) }" class="text-box">
                        <div :style="subField.element.label.styles" class="label">
                          {{ subField.element.label.title }}
                          <template v-if="subField.element.label.showColon">：</template>
                        </div>
                        <div :style="subField.element.text.styles" class="text">{ {{ subField.element.text.prop }} }</div>
                      </div>
                      <div class="tool">
                        <el-button v-if="subField.element.options.w > 20" title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(element.footFields, subField.index)">
                          <i class="yrt-shanchu2"></i>
                        </el-button>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="widget-grid-container data-grid" @click.stop="handleSelectWidget(subField.element.fields, subField.element, subField.index)" @mousedown.stop>
                      <div :style="subField.element.styles" :class="{ 'drag-active': isActive(subField.element) }" class="text-box">
                        <div :style="subField.element.label.styles" class="label">{{ subField.element.label.title }}</div>
                      </div>
                      <div class="tool">
                        <el-button v-if="subField.element.options.w > 20" title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(element.footFields, subField.index)">
                          <i class="yrt-shanchu2"></i>
                        </el-button>
                      </div>
                    </div>
                  </template>
                </template>
              </draggable>
              <div class="tool">
                <el-button title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(data.fields, index)">
                  <i class="yrt-shanchu2"></i>
                </el-button>
                <el-button title="添加字段" class="widget-action-addplus" circle plain type="primary" @click.stop="handleDetailWidgetAdd(element, index)">
                  <i class="yrt-addplus"></i>
                </el-button>
              </div>
            </template>
            <template v-else-if="element.type == 'field'">
              <div :style="element.styles" :class="{ 'drag-active': isActive(element) }" class="text-box">
                <div :style="element.label.styles" class="label">
                  {{ element.label.title }}
                  <template v-if="element.label.showColon">：</template>
                </div>
                <div :style="element.text.styles" class="text">{ {{ element.text.prop }} }</div>
              </div>
              <div class="tool">
                <el-button v-if="element.options.w > 20" title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(data.fields, index)">
                  <i class="yrt-shanchu2"></i>
                </el-button>
                <!-- <el-button title="复制" class="widget-action-clone" circle plain type="primary" @click.stop="handleWidgetClone(index)">
                  <i class="yrt-fuzhi4"></i>
                </el-button> -->
              </div>
            </template>
            <template v-else-if="element.type == 'barcode'">
              <div :style="element.styles" :class="{ 'drag-active': isActive(element) }" class="text-box">
                <vue-barcode :value="element.barcode.value" :options="element.barcode.options"></vue-barcode>
              </div>
              <div class="tool">
                <el-button v-if="element.options.w > 20" title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(data.fields, index)">
                  <i class="yrt-shanchu2"></i>
                </el-button>
                <!-- <el-button title="复制" class="widget-action-clone" circle plain type="primary" @click.stop="handleWidgetClone(index)">
                  <i class="yrt-fuzhi4"></i>
                </el-button> -->
              </div>
            </template>
            <template v-else-if="element.type == 'qrcode'">
              <div :style="element.styles" :class="{ 'drag-active': isActive(element) }" class="text-box">
                <vue-qrcode :value="element.qrOptions.value" :options="element.qrOptions"></vue-qrcode>
              </div>
              <div class="tool">
                <el-button v-if="element.options.w > 20" title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(data.fields, index)">
                  <i class="yrt-shanchu2"></i>
                </el-button>
              </div>
            </template>
            <!-- 图片上传 -->
            <template v-else-if="element.type == 'image'">
              <div :style="element.styles" :class="{ 'drag-active': isActive(element) }" class="text-box">
                <el-upload :action="uploadImgUrl" :show-file-list="false" :before-upload="handleBeforeUpload" :on-success="(res:any, file:any) => handleUploadSuccess(res, file, element)" :headers="headers" :style="{ width: element.image.width + 'mm', height: element.image.height + 'mm' }" class="img-uploader">
                  <img v-if="element.image.imageUrl" :src="element.image.imageUrl" :style="{ width: element.image.width + 'mm', height: element.image.height + 'mm' }" class="img" />
                  <i v-else class="el-icon-plus img-uploader-icon"></i>
                </el-upload>
              </div>
              <div class="tool">
                <el-button v-if="element.options.w > 20" title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(data.fields, index)">
                  <i class="yrt-shanchu2"></i>
                </el-button>
                <!-- <el-button title="复制" class="widget-action-clone" circle plain type="primary" @click.stop="handleWidgetClone(index)">
                  <i class="yrt-fuzhi4"></i>
                </el-button> -->
              </div>
            </template>
            <template v-else-if="['line-horizontal', 'line-vertical'].indexOf(element.type) >= 0">
              <div :style="element.styles" :class="{ 'drag-active': isActive(element) }" class="text-box"></div>
              <div class="tool">
                <el-button v-if="element.options.w > 20" title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(data.fields, index)">
                  <i class="yrt-shanchu2"></i>
                </el-button>
                <!-- <el-button title="复制" class="widget-action-clone" circle plain type="primary" @click.stop="handleWidgetClone(index)">
                  <i class="yrt-fuzhi4"></i>
                </el-button> -->
              </div>
            </template>
            <template v-else-if="['pagination'].indexOf(element.type) >= 0">
              <div :style="element.styles" :class="{ 'drag-active': isActive(element) }" class="pagination-box">
                <div class="label">{{ element.layout }}</div>
              </div>
              <div class="tool">
                <el-button v-if="element.options.w > 20" title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(data.fields, index)">
                  <i class="yrt-shanchu2"></i>
                </el-button>
                <!-- <el-button title="复制" class="widget-action-clone" circle plain type="primary" @click.stop="handleWidgetClone(index)">
                  <i class="yrt-fuzhi4"></i>
                </el-button> -->
              </div>
            </template>
            <!-- 容器 -->
            <template v-else-if="element.type == 'container'">
              <div :style="element.styles" :class="{ 'drag-active': isActive(element) }" class="text-box">
                <draggable v-model="element.fields" item-key="index" group="people" ghost-class="ghost" class="widget-container" filter="widget-grid-container" @end="handleMoveEnd" @add="handleContainerAdd($event, element)">
                  <!-- 循环容器元素 -->
                  <template #item="subField">
                    <template v-if="subField.element.type == 'table'">
                      <div>
                        <table :style="{ 'border-color': subField.element.borderColor, width: subField.element.width }" :class="{ active: selectWidget && selectWidget.key === subField.element.key }" class="detail-table widget-grid" @click.stop="handleSelectWidget(element.fields, subField.element, subField.index)" @mousedown.stop>
                          <thead v-if="subField.element.showHeader">
                            <draggable v-model="subField.element.fields" item-key="index" group="container-detail" ghost-class="ghost" :animation="300" chosen-class="chosen-item" :class="{ 'drag-th': true }" tag="tr">
                              <template #item="th">
                                <th :style="{ 'border-color': subField.element.borderColor, width: th.element.width + 'px' }" :class="{ 'drag-active': isActive(th.element) }" @click.stop="handleThSelectWidget(th.element)">
                                  <div :style="getHeaderDivStyle(th.element)" class="cell">{{ th.element.label }}</div>
                                  <div class="tool">
                                    <el-button title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleDetailWidgetDelete(subField.element.fields, index)">
                                      <i class="yrt-shanchu2"></i>
                                    </el-button>
                                  </div>
                                </th>
                              </template>
                            </draggable>
                          </thead>
                          <tbody>
                            <tr v-for="i in [0]" :key="'tr' + i">
                              <td v-for="(th, thIndex) in subField.element.fields" :key="thIndex" :style="{ 'border-color': subField.element.borderColor }">
                                <div class="cell"></div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div class="tool">
                          <el-button title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(subField.element.fields, subField.index)">
                            <i class="yrt-shanchu2"></i>
                          </el-button>
                          <el-button title="添加字段" class="widget-action-addplus" circle plain type="primary" @click.stop="handleDetailWidgetAdd(subField.element, index)">
                            <i class="yrt-addplus"></i>
                          </el-button>
                        </div>
                      </div>
                    </template>
                    <template v-else-if="subField.element.type === 'grid'">
                      <div v-if="subField.element && subField.element.key" :key="subField.element.key" class="widget-grid-container data-grid" style="position: relative">
                        <el-row :justify="subField.element.options.justify" :align="subField.element.options.align" :class="{ active: selectWidget && selectWidget.key === subField.element.key }" :gutter="subField.element.options.gutter ? subField.element.options.gutter : 0" :style="{ 'background-color': subField.element.isMain ? '#b2f9ec' : '' }" class="widget-grid" type="flex" @click.stop="handleSelectWidget(element.fields, subField.element, subField.index)" @mousedown.stop>
                          <!-- 循环栅格col -->
                          <el-col v-for="(col, colIndex) in subField.element.columns" :key="colIndex" :span="col.span ? col.span : 0">
                            <div style="border: 1px dashed #999">
                              <draggable v-model="col.fields" item-key="index" group="people" ghost-class="ghost" class="widget-form-list grid-list" filter="widget-grid-container" @end="handleMoveEnd" @add="handleWidgetColAdd($event, subField.element, colIndex)">
                                <!-- 循环栅格col元素 -->
                                <template #item="colField">
                                  <div v-if="colField.element.type == 'field'" class="widget-grid-container data-grid" @click.stop="handleSelectWidget(col.fields, colField.element, colField.index)" @mousedown.stop>
                                    <div :style="colField.element.styles" :class="{ 'drag-active': isActive(colField.element) }" class="text-box">
                                      <div :style="colField.element.label.styles" class="label">
                                        {{ colField.element.label.title }}
                                        <template v-if="colField.element.label.showColon">：</template>
                                      </div>
                                      <div :style="colField.element.text.styles" class="text">{ {{ colField.element.text.prop }} }</div>
                                    </div>
                                    <div class="tool">
                                      <el-button v-if="colField.element.options.w > 20" title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(colField.element.fields, colField.index)">
                                        <i class="yrt-shanchu2"></i>
                                      </el-button>
                                    </div>
                                  </div>
                                  <div v-else-if="colField.element.type == 'input'" class="widget-grid-container data-grid" @click.stop="handleSelectWidget(col.fields, colField.element, colField.index)" @mousedown.stop>
                                    <div :style="colField.element.styles" :class="{ 'drag-active': isActive(colField.element) }" class="text-box">
                                      <div :style="colField.element.label.styles" class="label">{{ colField.element.label.title }}</div>
                                    </div>
                                    <div class="tool">
                                      <el-button v-if="colField.element.options.w > 20" title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(colField.element.fields, colField.index)">
                                        <i class="yrt-shanchu2"></i>
                                      </el-button>
                                    </div>
                                  </div>
                                </template>
                              </draggable>
                            </div>
                          </el-col>
                        </el-row>
                        <el-button v-if="selectWidget && selectWidget.key === subField.key" title="删除" style="bottom: -20px" circle plain type="danger" class="widget-action-delete" @click.stop="handleWidgetDelete(subField.element.fields, subField.index)">
                          <i class="yrt-shanchu2"></i>
                        </el-button>
                      </div>
                    </template>
                    <template v-else-if="subField.element.type == 'field'">
                      <div class="widget-grid-container data-grid" @click.stop="handleSelectWidget(element.fields, subField.element, subField.index)" @mousedown.stop>
                        <div :style="subField.element.styles" :class="{ 'drag-active': isActive(subField.element) }" class="text-box">
                          <div :style="subField.element.label.styles" class="label">
                            {{ subField.element.label.title }}
                            <template v-if="subField.element.label.showColon">：</template>
                          </div>
                          <div :style="subField.element.text.styles" class="text">{ {{ subField.element.text.prop }} }</div>
                        </div>
                        <div class="tool">
                          <el-button v-if="subField.element.options.w > 20" title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(subField.element.fields, subField.index)">
                            <i class="yrt-shanchu2"></i>
                          </el-button>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="widget-grid-container data-grid" @click.stop="handleSelectWidget(subField.element.fields, subField.element, subField.index)" @mousedown.stop>
                        <div :style="subField.element.styles" :class="{ 'drag-active': isActive(subField.element) }" class="text-box">
                          <div :style="subField.element.label.styles" class="label">{{ subField.element.label.title }}</div>
                        </div>
                        <div class="tool">
                          <el-button v-if="subField.element.options.w > 20" title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(subField.element.fields, subField.index)">
                            <i class="yrt-shanchu2"></i>
                          </el-button>
                        </div>
                      </div>
                    </template>
                  </template>
                </draggable>
              </div>
              <div class="tool">
                <el-button v-if="element.options.w > 20" title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(data.fields, index)">
                  <i class="yrt-shanchu2"></i>
                </el-button>
              </div>
            </template>
            <template v-else>
              <div :style="element.styles" :class="{ 'drag-active': isActive(element) }" class="text-box">
                <div :style="element.label.styles" class="label">{{ element.label.title }}</div>
              </div>
              <div class="tool">
                <el-button v-if="element.options.w > 20" title="删除" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(data.fields, index)">
                  <i class="yrt-shanchu2"></i>
                </el-button>
                <!-- <el-button title="复制" class="widget-action-clone" circle plain type="primary" @click.stop="handleWidgetClone(index)">
                  <i class="yrt-fuzhi4"></i>
                </el-button> -->
              </div>
            </template>
          </draggableResizable>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts" name="widget-config">
import { BaseProperties } from '/@/types/base-type';
import { ComponentInternalInstance } from 'vue';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:select', 'update:detail-fields', 'update:config-type', 'update:select']);

import { selectable as vSelectable } from './directive/selectable.js';
import draggable from 'vuedraggable';
import draggableResizable from '/@/components/base/draggable-resizable/index.js';
import VueBarcode from '/@/utils/vue-barcode.js';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import { globalHeaders } from '/@/utils/request.js';
import { UploadFile } from 'element-plus';

//#region 定义属性
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
  select: {
    type: Object,
    default: null,
  },
  configType: {
    type: String,
    default: null,
  },
  detailFields: {
    type: Array,
    default: null,
  },
});
//#endregion

//#region 定义变量
const state = reactive({});
//#endregion

const baseUrl = import.meta.env.VITE_APP_BASE_API;
const uploadImgUrl = ref(baseUrl + '/system/core/oss/upload'); // 上传的图片服务器地址
const headers = ref(globalHeaders());

//#region 计算属性
// 当前选中明细列表
const selectWidget = computed({
  get: function () {
    return props.select;
  },
  set: function (val) {
    emit('update:select', val);
  },
});
// 当前配置类型
const currentConfigType = computed({
  get: function () {
    return props.configType;
  },
  set: function (val) {
    emit('update:config-type', val);
  },
});
// 当前选中明细列表
const currentDetailFields = computed({
  get: function () {
    return props.detailFields;
  },
  set: function (val) {
    emit('update:detail-fields', val);
  },
});
// 获得当前是否激活
const isActive = computed(() => {
  return function (th: any) {
    var active = selectWidget.value && selectWidget.value.key === th.key;
    return active;
  };
});
// 画布样式设置
const canvasStyle = computed(() => {
  var opts = props.data.dataOptions;
  return {
    width: opts.width + 'mm',
    height: opts.height + 'mm',
    'padding-top': opts.paddingTop + 'mm',
    'padding-bottom': opts.paddingBottom + 'mm',
    'padding-left': opts.paddingLeft + 'mm',
    'padding-right': opts.paddingRight + 'mm',
  };
});

const handleMoveEnd = () => {};
const handleMoveStart = () => {};
// 元素选中
const handleSelectWidget = (fields: any, field: any, index: any) => {
  selectWidget.value = field;
  currentConfigType.value = 'WidgetConfig';
};
// 明细单元格选中
const handleThSelectWidget = (th: any, index?: any) => {
  selectWidget.value = th;
  if (typeof selectWidget.value.foot === 'undefined') {
    selectWidget.value.foot = {
      fontSize: 5,
      lineHeight: 5,
      textAlign: 'center',
    };
  }
  currentConfigType.value = 'WidgetConfig';
};
// 画布 - 添加元素
const handleWidgetAdd = (evt: any) => {
  const newIndex = evt.newIndex;

  // 为拖拽到容器的元素添加唯一 key
  const key = Date.now() + '_' + Math.ceil(Math.random() * 99999);
  var newField = JSON.parse(JSON.stringify(props.data.fields[newIndex]));
  props.data.fields[newIndex] = { ...newField, key };
  delete props.data.fields[newIndex].icon;

  if (props.data.fields[newIndex].type === 'table') {
    var _fields = props.data.fields[newIndex].fields;
    _fields.forEach((_field: any, _index: any) => {
      const _key = Date.now() + '_' + Math.ceil(Math.random() * 99999) + _index;
      _field['key'] = _key;
    });
  }

  currentConfigType.value = 'WidgetConfig';
  selectWidget.value = props.data.fields[newIndex];
};
// 画布 - 删除
const handleWidgetDelete = (fields: any, index: any) => {
  if (fields.length - 1 === index) {
    if (index === 0) {
      selectWidget.value = {};
    } else {
      selectWidget.value = fields[index - 1];
    }
  } else {
    selectWidget.value = fields[index + 1];
  }

  proxy.$nextTick(() => {
    fields.splice(index, 1);
  });
};
// 画布 - 复制
const handleWidgetClone = (index: number) => {
  const cloneData = {
    ...JSON.parse(JSON.stringify(props.data.fields[index])),
    key: Date.now + '_' + Math.ceil(Math.random() * 99999),
  };
  cloneData.options.x += 5;
  cloneData.options.y += 5;

  props.data.fields.splice(index, 0, cloneData);

  proxy.$nextTick(() => {
    selectWidget.value = props.data.fields[index + 1];
  });
};
// 删除明细字段
const handleDetailWidgetDelete = (fields: any[], index: number) => {
  if (fields.length - 1 === index) {
    if (index === 0) {
      selectWidget.value = {};
    } else {
      selectWidget.value = fields[index - 1];
    }
  } else {
    selectWidget.value = fields[index + 1];
  }

  proxy.$nextTick(() => {
    fields.splice(index, 1);
  });
};
// 新增明细字段
const handleDetailWidgetAdd = (element: any, index: any) => {
  element.fields[element.fields.length] = {
    type: 'detail-field',
    prop: '',
    width: 150,
    header: {
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
    },
    body: {
      fontSize: 14,
      textAlign: 'left',
      lineHeight: 20,
    },
    label: '字段' + element.fields.length,
    key: Date.now() + '_' + Math.ceil(Math.random() * 99999),
  };
};
// 容器 - 添加元素
const handleContainerAdd = (evt: any, fields: any) => {
  const newIndex = evt.newIndex;
  const field = fields[newIndex];

  // 限制可拖入的元素
  if (['input', 'field', 'grid'].indexOf(field.type) < 0) {
    fields.splice(newIndex, 1);
    proxy.$message.error('该元素不允许使用');
    return false;
  }

  // 为拖拽到容器的元素添加唯一 key
  const key = Date.now() + '_' + Math.ceil(Math.random() * 99999);
  const newField = JSON.parse(JSON.stringify(field));
  fields[newIndex] = { ...newField, key };
  delete field.icon;

  currentConfigType.value = 'WidgetConfig';
  selectWidget.value = fields[newIndex];
};
// 栅格 - 添加元素
const handleWidgetColAdd = ($event: any, row: any, colIndex: any) => {
  const newIndex = $event.newIndex;
  const field = row.columns[colIndex].fields[newIndex];

  // 限制可拖入的元素
  if (['input', 'field'].indexOf(field.type) < 0) {
    row.columns[colIndex].fields.splice(newIndex, 1);
    proxy.$message.error('该元素不允许使用');

    return false;
  }

  const key = Date.now() + '_' + Math.ceil(Math.random() * 99999);
  var newField = JSON.parse(JSON.stringify(field));

  row.columns[colIndex].fields[newIndex] = {
    ...newField,
    options: {
      ...newField.options,
      remoteFunc: 'func_' + key,
    },
    key,
    // 绑定键值
    model: row.columns[colIndex].fields[newIndex].type + '_' + key,
    rules: [],
  };

  delete row.columns[colIndex].fields[newIndex].icon;

  currentConfigType.value = 'WidgetConfig';
  selectWidget.value = row.columns[colIndex].fields[newIndex];
};
// 上传图片前
const handleBeforeUpload = (file: any) => {
  const isImg = ['image/jpeg', 'image/png'].indexOf(file.type) >= 0;
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImg) {
    proxy.$message.error('上传头像图片只能是 JPG/PNG 格式!');
  }
  if (!isLt2M) {
    proxy.$message.error('上传头像图片大小不能超过 2MB!');
  }
  return isImg && isLt2M;
};

// 上传成功回调
const handleUploadSuccess = (res: any, file: UploadFile, element: any) => {
  if (res.code === 200) {
    element.image.imageUrl = res.data.url;
  }
};

// 表格头部div样式
const getHeaderDivStyle = (th: any) => {
  const data: any = { 'font-size': th.header.fontSize + 'mm', 'line-height': th.header.lineHeight + 'mm', 'text-align': th.header.textAlign };
  if (th.width) {
    data.width = th.width + 'px';
  }
  return data;
};
</script>

<style lang="scss" scoped>
.canvas-container {
  -moz-box-shadow: 0px 0px 10px #3d3d3d;
  -webkit-box-shadow: 0px 0px 10px #3d3d3d;
  box-shadow: 0px 0px 10px #3d3d3d;
  margin: 20px 6px;

  /* 设计区域不允许选中 */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard syntax */

  .canvas-content {
    height: 100%;
    padding-bottom: 0px;
    border: 1px dotted #000000;
    .drag-list {
      height: 100%;
      position: relative;
    }

    .resable-item {
      &.active {
        border: 1px dashed #888;
      }
      &.selected {
        border: 1px dashed #888;
      }
    }
    .tool {
      display: none;
      position: absolute;
      right: 0;
      bottom: -30px;
      z-index: 10000;
    }
    .drag-active,
    .active {
      background-color: rgb(213, 234, 255);
      > .tool,
      + .tool {
        display: block;
      }
    }
    .text-box {
      overflow: hidden;
      white-space: nowrap;
      height: calc(100% - 2px);
      .label {
        width: 120px;
        color: #000000;
        display: inline-block;
        text-align: right;
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
    th,
    td {
      font-weight: normal;
      position: relative;
      border-collapse: collapse;
      border: 1px solid #dcdfe6;
      padding: 3px 2px;
      .cell {
        min-height: 20px;
      }
      &.drag-active {
        background-color: rgb(213, 234, 255);
        .tool {
          display: block;
        }
      }
    }
  }

  // 选择框
  :deep(.selectable) {
    position: absolute;
    width: 0px;
    height: 0px;
    background-color: #409eff20;
    border: 1px solid #409eff70;
  }

  // 图片上传
  :deep(.img-uploader) {
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      &:hover {
        border-color: #409eff;
      }
    }
    .img-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
    .img {
      width: 100px;
      height: 60px;
      display: block;
    }
  }

  /* 容器样式 */
  .widget-container {
    width: 100%;
    height: 100%;
  }
  .data-grid {
    position: relative;
  }
}

.widget-action-clone {
  position: absolute;
  right: 70px;
  bottom: -35px;
  z-index: 1009;
}

$primary-color: #409eff;
$primary-background-color: #ecf5ff;

.widget-form-list {
  height: 100%;
  padding-bottom: 0px;

  &.form-region {
    min-height: 700px;
    margin-bottom: 50px;
  }

  &.grid-list {
    min-height: 5px;
  }

  &.inline-list {
    min-height: 50px;
  }

  &.detail-list {
    min-height: 300px;
  }

  .widget-view {
    padding: 5px 10px;
    margin: 0;
    position: relative;
    border-left: 5px solid transparent;

    &.is_req {
      .el-form-item__label::before {
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
      }
    }

    &:after {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      display: block;
      z-index: 1001;
    }

    &:hover {
      background: $primary-background-color;
      border-left: 5px solid $primary-background-color;
    }

    &.active {
      border-left: 5px solid $primary-color;
      background: #b3d8ff;
    }
  }

  .inline-view {
    padding: 5px 5px 5px 5px;
    margin: 0;
    position: relative;
    border-left: 5px solid transparent;
    display: inline-block;

    &:after {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      display: block;
      z-index: 1001;
      content: '';
    }

    &:hover {
      background: $primary-background-color;
      border-left: 5px solid $primary-background-color;
    }

    &.active {
      border-left: 5px solid $primary-color;
      background: #b3d8ff;
    }
  }
}

.widget-grid-container {
  &.ghost {
    &::after {
      background: #fff;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      display: block;
      z-index: 10;
      content: '';
    }
  }
  .table-footer-container {
    border: 1px dashed transparent;
    border-left: 5px solid transparent;
    position: relative;
    &.drag-active {
      border: 1px dashed $primary-color;
      border-left: 5px solid $primary-color;
    }
  }
}

.ghost {
  background: #fff;
  border: 1px dashed $primary-color;

  &::after {
    background: #fff;
  }
}

li.ghost {
  height: 30px;
  list-style: none;
  font-size: 0;
}

.widget-grid {
  background: #f4f6fc;
  position: relative;
  border-left: 5px solid transparent;
  padding: 5px;
  margin: 0 !important;

  &.active {
    border-left: 5px solid $primary-color;
    background-color: #d5ffda !important;
  }
}
</style>
