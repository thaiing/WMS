<!--轮播图 - 参数设置-->
<template>
  <div class="config-container">
    <h4>
      {{ config.title }}
    </h4>
    <el-tabs v-model="state.tabActive" class="tabs-container">
      <el-tab-pane label="内容设置" name="t1" class="tab-pane">
        <el-form ref="formRef" :model="config" label-width="100px">
          <pc-header :config="config" :is-viewer="isViewer"></pc-header>

          <div class="block-group">
            <el-divider content-position="left">表格参数</el-divider>
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="固定高度">
                  <el-input v-model="config.style.tableHeight"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="padding-left-5">
                <el-form-item label="最大高度">
                  <el-input v-model="config.style.maxHeight"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="斑马条纹">
                  <el-checkbox v-model="config.style.stripe"></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="padding-left-5"> </el-col>
            </el-row>
          </div>

          <div class="block-group">
            <el-divider content-position="left">表格字段参数</el-divider>
            <draggable :list="config.columns" item-key="key" tag="div" group="options" ghost-class="ghost-item" chosen-class="chosen-item" drag-class="drag-item" class="grid-list" handle=".cursor-move">
              <template #item="{ element, index }">
                <el-form ref="formRef" :model="element" label-width="80px" class="item-column">
                  <el-row :gutter="5">
                    <el-col :span="12">
                      <el-form-item label="字段中文">
                        <el-input v-model="element.label"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" class="padding-left-5">
                      <el-form-item label="字段名">
                        <el-input v-model="element.prop"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="5">
                    <el-col :span="12" class="padding-left-5">
                      <el-form-item label="列宽">
                        <el-input v-model="element.width"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="列类型">
                        <el-select v-model="element.type" placeholder="请选择" clearable style="width: 100%">
                          <el-option label="序号列" value="index" />
                          <el-option label="普通列" value="" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="5">
                    <el-col :span="12">
                      <el-form-item label="表头对齐">
                        <el-select v-model="element.headerAlign" placeholder="请选择" clearable style="width: 100%">
                          <el-option label="left" value="left" />
                          <el-option label="center" value="center" />
                          <el-option label="right" value="right" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" class="padding-left-5">
                      <el-form-item label="数据对齐">
                        <el-select v-model="element.align" placeholder="请选择" clearable style="width: 100%">
                          <el-option label="left" value="left" />
                          <el-option label="center" value="center" />
                          <el-option label="right" value="right" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="5">
                    <el-col :span="12">
                      <el-form-item label="格式化">
                        <el-select v-model="element.formatter">
                          <el-option label="[清空]" value=""></el-option>
                          <el-option label="YYYY-MM" value="YYYY-MM"></el-option>
                          <el-option label="YYYY-MM-DD" value="YYYY-MM-DD"></el-option>
                          <el-option label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-DD HH:mm:ss"></el-option>
                          <el-option label="￥0.00" value="￥0.00"></el-option>
                          <el-option label="#" value="#"></el-option>
                          <el-option label="#.#" value="#.#"></el-option>
                          <el-option label="0.#" value="0.#"></el-option>
                          <el-option label="0.##" value="0.##"></el-option>
                          <el-option label="0.###" value="0.###"></el-option>
                          <el-option label="0.####" value="0.####"></el-option>
                          <el-option label="0.#####" value="0.#####"></el-option>
                          <el-option label="0.######" value="0.######"></el-option>
                          <el-option label="0.#######" value="0.#######"></el-option>
                          <el-option label="0.########" value="0.########"></el-option>
                          <el-option label="0.0" value="0.0"></el-option>
                          <el-option label="0.00" value="0.00"></el-option>
                          <el-option label="0.000" value="0.000"></el-option>
                          <el-option label="0.0000" value="0.0000"></el-option>
                          <el-option label="0.00000" value="0.00000"></el-option>
                          <el-option label="0.000000" value="0.000000"></el-option>
                          <el-option label="0.0000000" value="0.0000000"></el-option>
                          <el-option label="0.00000000" value="0.00000000"></el-option>
                          <el-option label="%" value="%"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" class="padding-left-5">
                      <el-form-item label="数据类型">
                        <el-select v-model="element.dataType" placeholder="请选择">
                          <el-option v-for="(item, index) in state.dataTypeList" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item :label-width="12">
                    <svg-icon name="icon-jiantou_shangxiaqiehuan" :size="18" class="mr-20 cursor-move cursor-pointer" title="上下移动"></svg-icon>
                    <el-button plain type="danger" size="small" @click="handleOptionsRemove(index)"> <svg-icon name="icon-shanchu5" :size="10" class="mr-10"></svg-icon> 删除 </el-button>
                  </el-form-item>
                </el-form>
              </template>
            </draggable>
            <el-button type="primary" plain class="w-100pc" @click="handleAddColumn">添加字段</el-button>
          </div>

          <div class="block-group">
            <el-divider content-position="left">表格静态数据</el-divider>
            <el-input v-model="config.options.tableData" :rows="4" type="textarea"></el-input>
          </div>

          <div class="block-group">
            <el-divider content-position="left">接口地址</el-divider>
            <el-form-item label="开启接口">
              <el-checkbox v-model="config.api.openApi"></el-checkbox>
            </el-form-item>
            <el-form-item label="接口地址">
              <el-input v-model="config.api.apiUrl" />
            </el-form-item>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="样式设置" name="t2" class="tab-pane">
        <el-form ref="formRef" :model="config.style" label-width="100px" @submit.prevent>
          <pc-style :config="config" :is-viewer="isViewer"></pc-style>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <!--文件选择器-->
    <filer-dialog v-model="state.filerVisible" single-select is-viewer></filer-dialog>
    <!--链接选择器-->
    <linker-dialog v-model="state.linkerVisible" single-select is-viewer></linker-dialog>
  </div>
</template>

<script setup lang="ts" name="pc-stat-config">
import { reactive, toRefs, onMounted, onUnmounted, nextTick, getCurrentInstance } from 'vue';
import draggable from 'vuedraggable';
import filerDialog from '/@/components/base/filer-dialog.vue';
import linkerDialog from '/@/components/linker/linker-dialog.vue';
import { predefineColors } from '/@/utils/commonFunction';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import pcHeader from '../components/pc-header.vue';
import pcStyle from '../components/pc-style.vue';

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

//#region 定义属性
const props = defineProps({
  // 配置参数
  config: {
    type: Object,
    default: () => {
      return {};
    },
  },
  // 预览模式
  isViewer: {
    type: Boolean,
    default: false,
  },
});
//#endregion

const state = reactive({
  tabActive: 't1', // 左侧tab导航
  formData: {}, // 参数设置
  configComponent: null, // 参数配置
  filerVisible: false, // 显示文件选择器
  linkerVisible: false, // 链接选择器
  predefineColors,
  currentItem: null as any,
  // 数据类型
  dataTypeList: ['string', 'byte', 'integer', 'long', 'double', 'bigDecimal', 'boolean', 'date', 'datetime', 'time'],
});

//#region 方法
const handleAddColumn = () => {
  props.config.columns.push({
    prop: 'col' + props.config.columns.length,
    type: '',
    label: '列名',
    width: null,
    headerAlign: 'center',
    align: 'center',
  });
};

const handleOptionsRemove = (index: any) => {
  props.config.columns.splice(index, 1);
};
//#endregion

// 页面加载事件
onMounted(async () => {
  // 响应选中文件事件
  proxy.mittBus.on('onSelectFile', (item: any) => {
    if (item) {
      props.config.content.image = item.url;
      state.filerVisible = false;
    }
  });
  // 响应选择链接事件
  proxy.mittBus.on('onSelectLink', (item: any) => {
    if (item) {
      state.currentItem.url = item.url;
      state.linkerVisible = false;
    }
  });
});

// 页面卸载事件
onUnmounted(() => {
  // 卸载选中文件事件
  proxy.mittBus.off('onSelectFile');
  // 卸载选择链接事件
  proxy.mittBus.off('onSelectLink');
});
</script>

<style lang="scss" scoped>
@import '../scss/config.scss';
.item-column {
  background-color: #fff;
  padding: 15px 5px 5px;
  margin-bottom: 10px;
  border: 1px solid #d1d1d1;
}
</style>
