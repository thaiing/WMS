<!--轮播图 - 参数设置-->
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
          </div>

          <div class="block-group">
            <el-divider content-position="left">网格参数</el-divider>
            <el-form-item label="图高度">
              <el-input v-model="config.style.gridHeight" placeholder="auto/100%/20px"></el-input>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="上侧距离">
                  <el-input v-model.number="config.grid.top"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="下侧距离">
                  <el-input v-model.number="config.grid.bottom"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="左侧距离">
                  <el-input v-model.number="config.grid.left"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="右侧距离">
                  <el-input v-model.number="config.grid.right"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div class="block-group">
            <el-divider content-position="left">坐标轴参数</el-divider>
            <el-form-item label="x轴数据">
              <el-input v-model="config.xAxis.data" placeholder="多个值用逗号分隔"></el-input>
            </el-form-item>
            <el-form-item label="y轴类型">
              <el-select v-model="config.yAxis.type" clearable filterable allow-create default-first-option :reserve-keyword="false" style="width: 100%">
                <el-option label="数据轴" value="value" />
                <el-option label="类目轴" value="category" />
                <el-option label="时间轴" value="time" />
                <el-option label="对数轴" value="log" />
              </el-select>
            </el-form-item>
            <el-form-item label="y轴名称">
              <el-input v-model="config.yAxis.name"></el-input>
            </el-form-item>
          </div>

          <div class="block-group">
            <el-divider content-position="left">折线参数</el-divider>
            <draggable :list="config.series" item-key="title" class="series-box" :animation="300" tag="div" :component-data="{ name: 'fade' }" handle=".cursor-move" group="config" ghost-class="ghost-item" chosen-class="chosen-item" drag-class="drag-item">
              <template #item="{ element, index }">
                <el-form ref="formRef" :model="element" label-width="100px" class="item-row">
                  <el-form-item label="柱状图名称">
                    <el-input v-model="element.name" style="width: 90%; margin-right: 10px"></el-input>
                    <i class="iconfont icon-juzhong cursor-move" title="调整顺序"></i>
                  </el-form-item>
                  <el-form-item label="柱状图数据">
                    <el-input v-model="element.data"></el-input>
                  </el-form-item>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="柱条宽度" :label-width="110">
                        <el-input v-model="element.barWidth" placeholder="不设时自适应/数字/百分比"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="柱条圆角半径" :label-width="110">
                        <el-input v-model="element.borderRadius" placeholder="单位px，数字或者数组"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="柱状渐变色1" :label-width="110">
                        <el-color-picker v-model="element.itemStyleColor1" :predefine="predefineColors" show-alpha />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="柱状渐变色2" :label-width="110">
                        <el-color-picker v-model="element.itemStyleColor2" :predefine="predefineColors" show-alpha />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item :label-width="12">
                    <el-button @click="delItem(element, index)">删除柱状图</el-button>
                  </el-form-item>
                </el-form>
              </template>
            </draggable>
            <el-button type="primary" plain class="w-100pc margin-top-10" @click="addItem">添加柱状图</el-button>
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
import { ArrowRight } from '@element-plus/icons-vue';
import { predefineColors } from '/@/utils/commonFunction';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import pcHeader from '../components/pc-header.vue';
import pcStyle from '../components/pc-style.vue';
// 引入图标组件
const IconSelector = defineAsyncComponent(() => import('/@/components/iconSelector/index.vue'));

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

//#region 方法
const addItem = () => {
  if (!Array.isArray(props.config.series)) {
    props.config.iteseriesms = [];
  }
  props.config.series.push({
    data: '10,41.1,30.4,65.1,53.3,53.3,53.3,41.1,30.4,65.1,53.3,10',
    name: '新队列' + (props.config.series.length + 1),
    itemStyleColor1: 'rgba(255, 69, 0, 0.68)',
    itemStyleColor2: 'rgba(108, 80, 243, 0)',
    borderRadius: '30,30,0,0',
    barWidth: '25',
  });
};

// 删除项
const delItem = (element: any, index: number) => {
  if (props.config.series.length === 1) {
    proxy.$message.error('至少保留一项！');
    return;
  }

  proxy
    .$confirm('确定要删除选定项吗, 是否继续?', '确定删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      props.config.series.splice(index, 1);
    })
    .catch(() => {
      proxy.$message.info('已取消');
    });
};
//#endregion
</script>

<style lang="scss" scoped>
@import '../scss/config.scss';
</style>
