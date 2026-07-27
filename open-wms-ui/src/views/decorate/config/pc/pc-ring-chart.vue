<!--环形图 - 参数设置-->
<template>
  <div class="config-container">
    <h4>
      {{ config.title }}
    </h4>
    <el-tabs v-model="state.tabActive" class="tabs-container">
      <el-tab-pane label="饼图设置" name="t1" class="tab-pane">
        <el-form ref="formRef" :model="config" label-width="100px">
          <pc-header :config="config" :is-viewer="isViewer"></pc-header>

          <div class="block-group">
            <el-divider content-position="left">标题参数</el-divider>
            <el-form-item label="标题名称">
              <el-input v-model="config.header.text"></el-input>
            </el-form-item>
            <el-form-item label="标题位置">
              <el-select v-model="config.header.left" clearable filterable allow-create default-first-option :reserve-keyword="false" placeholder="请选择left/right/center或者输入像素单位" style="width: 100%">
                <el-option label="left" value="left" />
                <el-option label="center" value="center" />
                <el-option label="right" value="right" />
              </el-select>
            </el-form-item>
            <el-form-item label="字体大小">
              <el-input v-model="config.header.fontSize"></el-input>
            </el-form-item>
            <el-form-item label="字体颜色">
              <el-color-picker v-model="config.header.fontColor" :predefine="predefineColors" show-alpha />
            </el-form-item>
          </div>

          <div class="block-group">
            <el-divider content-position="left">图例参数</el-divider>
            <el-form-item label="图例类型">
              <el-select v-model="config.legend.type" clearable filterable allow-create default-first-option :reserve-keyword="false" style="width: 100%">
                <el-option label="普通图例" value="plain" />
                <el-option label="滚动翻页" value="scroll" />
              </el-select>
            </el-form-item>
            <el-form-item label="布局朝向">
              <el-select v-model="config.legend.orient" clearable filterable allow-create default-first-option :reserve-keyword="false" style="width: 100%">
                <el-option label="水平" value="horizontal" />
                <el-option label="垂直" value="vertical" />
              </el-select>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="左边位置">
                  <el-select v-model="config.legend.left" clearable filterable allow-create default-first-option :reserve-keyword="false" placeholder="请选择或者输入百分比/像素" style="width: 100%">
                    <el-option label="left" value="left" />
                    <el-option label="center" value="center" />
                    <el-option label="right" value="right" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="右边位置">
                  <el-input v-model="config.legend.right" placeholder="auto/20%/20px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="顶部位置">
                  <el-select v-model="config.legend.top" clearable filterable allow-create default-first-option :reserve-keyword="false" placeholder="请选择或者输入百分比/像素" style="width: 100%">
                    <el-option label="top" value="top" />
                    <el-option label="middle" value="middle" />
                    <el-option label="bottom" value="bottom" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="底部位置">
                  <el-input v-model="config.legend.bottom" placeholder="auto/20%/20px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="图例宽度">
                  <el-input v-model.number="config.legend.itemWidth"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="图例高度">
                  <el-input v-model.number="config.legend.itemHeight"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="图例标题">
              <el-input v-model="config.legend.data" placeholder="多个值用逗号分隔"></el-input>
            </el-form-item>
          </div>

          <div class="block-group">
            <el-divider content-position="left">图形参数</el-divider>
            <el-form-item label="图高度">
              <el-input v-model="config.style.gridHeight" placeholder="auto/100%/20px"></el-input>
            </el-form-item>
            <el-form-item label="饼图内半径">
              <el-input v-model="config.series.radius0" placeholder="填写百分比或者像素单位"></el-input>
            </el-form-item>
            <el-form-item label="饼图外半径">
              <el-input v-model="config.series.radius1" placeholder="填写百分比或者像素单位"></el-input>
            </el-form-item>
            <el-form-item label="中心坐标">
              <el-input v-model="config.series.center" placeholder="数组横坐标,纵坐标"></el-input>
            </el-form-item>
            <el-form-item label="间隔角度">
              <el-input v-model="config.series.padAngle" placeholder="饼图扇区之间的间隔角度(0~360)"></el-input>
            </el-form-item>
            <el-form-item label="内外圆角半径">
              <el-input v-model="config.series.borderRadius" placeholder="饼图扇形区块的内外圆角半径，支持设置固定数值或者相对于扇形区块的半径的百分比值"></el-input>
            </el-form-item>
            <el-form-item label="显示标签">
              <el-checkbox v-model="config.series.showLabel"></el-checkbox>
            </el-form-item>
            <el-form-item label="图形数据">
              <el-input v-model="config.series.data" placeholder="多个值用逗号分隔"></el-input>
            </el-form-item>
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
});
//#endregion

// 页面加载事件
onMounted(async () => {});
</script>

<style lang="scss" scoped>
@import '../scss/config.scss';
</style>
