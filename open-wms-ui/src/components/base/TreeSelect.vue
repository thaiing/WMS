<template>
  <el-popover ref="tree-select" v-model:visible="showPopover" :title="'请选择' + label" :disabled="disabled || options.disabled" trigger="click" placement="bottom" :width="300" popper-class="tree-select" @show="() => (state.treeSuffixIcon = 'yrt-xiangxiajiantou1 dropdown')" @hide="() => (state.treeSuffixIcon = 'yrt-xiangxiajiantou1')">
    <template #reference>
      <el-input ref="input" v-model="currentValue" readonly :style="{ width: options.width }" :placeholder="options.placeholder" :disabled="disabled || options.disabled" class="input no-bg" clearable @focus="(event:any) => onFocus($refs['input'], currentValue, event)" @change="(val:any) => onInputChange($refs['input'], val)">
        <template #suffix>
          <i :class="[state.treeSuffixIcon]"></i>
        </template>
      </el-input>
    </template>
    <el-scrollbar :noresize="false" :native="false" wrap-class="popover-tree scrollbar-wrap">
      <el-tree :ref="'tree-' + options.prop + '-tree'" :node-key="nodeKey" :props="state.treeProps" :load="(node:any, resolve:any) => _treeLoad(node, resolve)" highlight-current lazy @node-click="(data:any, node:any, el:any) => onTreeNodeClick(data, node, el)">
        <template #default="{ node }">
          <span class="custom-tree-node">
            <template v-if="!node.isLeaf">
              <span v-if="node.expanded"> <i class="yrt-wenjianjiazhankai"></i> {{ node.label }} </span>
              <span v-else> <i class="yrt-wenjianjia"></i> {{ node.label }} </span>
            </template>
            <template v-else>
              <span> <i class="yrt-wenjian1"></i> {{ node.label }} </span>
            </template>
          </span>
        </template>
      </el-tree>
    </el-scrollbar>
    <el-button type="primary" link size="small" @click="treeRefresh"> <i class="iconfont yrt-shuaxin1"></i> 刷新 </el-button>
    <el-button type="primary" link size="small" @click="showPopover = false"> <i class="iconfont yrt-untitled96"></i> 关闭 </el-button>
  </el-popover>
</template>

<script setup lang="ts" name="tree-select">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:modelValue', 'on-change', 'on-focus', 'on-tree-node-click']);

//#region 定义属性
const props = defineProps({
  // 下拉框绑定值
  modelValue: {
    type: String,
    default: null,
  },
  // 标题名称
  label: {
    type: String,
    required: true,
    default: '树选择器',
  },
  // 详细参数
  options: {
    type: Object,
    required: true,
    default: () => {},
  },
  // 数据加载函数
  treeLoad: {
    type: Function,
    default: function () {},
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 当前选中主键值
  nodeKeyValue: {
    type: [String, Number],
    default: 0,
  },
  // tree NodeKey
  nodeKey: {
    type: [String],
    default: 'value',
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  // 模块tree prop参数配置
  treeProps: {
    label: 'label',
    children: 'children',
    value: 'value',
    isLeaf: function (data: any) {
      return data.hasChild !== 1;
    },
  },
  // TREE选择器右侧下拉框
  treeSuffixIcon: 'yrt-xiangxiajiantou1',
  // 当前选中值
  currentNodeKey: 5,
  // 下拉框是否显示
  isShowPopover: false,
});
//#endregion

//#region 计算属性
// 当前值
const currentValue = computed({
  get: function () {
    proxy.$nextTick(() => {
      proxy.$refs['tree-' + props.options.prop + '-tree'].setCurrentKey(props.nodeKeyValue);
    });
    return props.modelValue;
  },
  set: function (val) {
    emit('update:modelValue', val);
  },
});

// 显示弹窗
const showPopover = computed({
  get: function () {
    return state.isShowPopover;
  },
  set: function (val) {
    console.log(val);
    state.isShowPopover = val;
  },
});
//#endregion

onMounted(() => {
  // 响应编辑器点击事件
  proxy.mittBus.on('onEditorClick', (params: any) => {
    // showPopover.value = false;
  });
});

onUnmounted(() => {
  // 卸载编辑器点击事件
  proxy.mittBus.off('onEditorClick');
});

// item单击事件
const onTreeNodeClick = (data: any, node: any, el: any) => {
  let labels = [];
  let values = [];
  let _node = node;
  while (_node) {
    if (!_node.data || !_node.data.label) {
      break;
    }
    labels.push(_node.data.label);
    values.push(_node.data.value);
    _node = _node.parent;
  }
  labels = labels.reverse();
  values = values.reverse();
  showPopover.value = false;
  emit('on-tree-node-click', data, node, el, labels, values);
};

// input change事件
const onInputChange = (ref: any, val: any) => {
  emit('on-change', ref, val);
};

// 获得焦点
const onFocus = (ref: any, val: any, event: any) => {
  var disabled = ref.$attrs.disabled;
  if (disabled) return;
  emit('on-focus', ref, val, event);
};

// 触发数据加载函数
const _treeLoad = (node: any, resolve: any) => {
  proxy.$nextTick(() => {
    props.treeLoad(node, resolve);
    proxy.$nextTick(() => {
      proxy.$refs['tree-' + props.options.prop + '-tree'].setCurrentKey(props.nodeKeyValue);
    });
  });
};

// 刷新tree
const treeRefresh = () => {
  const tree = proxy.$refs['tree-' + props.options.prop + '-tree'];
  var root = tree.store.root;
  while (root.childNodes.length) {
    tree.remove(root.childNodes[0]);
  }
  _treeLoad(root, (data: any) => {
    root.doCreateChildren(data);
  });
};
</script>

<style lang="scss" scoped>
.input {
  :deep(.yrt-xiangxiajiantou1) {
    transition: all 0.6s;
    -moz-transition: all 0.6s; /* Firefox 4 */
    -webkit-transition: all 0.6s; /* Safari and Chrome */
    -o-transition: all 0.6s; /* Opera */
    height: 29px;
    &.dropdown {
      transform: rotateZ(-180deg) translateY(0px);
      -ms-transform: rotateZ(-180deg) translateY(0px); /* Internet Explorer */
      -moz-transform: rotateZ(-180deg) translateY(0px); /* Firefox */
      -webkit-transform: rotateZ(-180deg) translateY(0px); /* Safari 和 Chrome */
      -o-transform: rotateZ(-180deg) translateY(0px); /* Opera */
    }
  }
}
</style>

<style lang="scss">
.tree-select {
  padding: 12px 0 0 0 !important;
  .el-popover__title {
    padding-left: 10px;
  }
  .el-button {
    padding-left: 10px;
    padding-right: 10px;
  }
}
.el-scrollbar {
  .popover-tree.scrollbar-wrap {
    max-height: 300px;
    overflow-x: hidden;
    padding: 0px;
    .el-tree {
      margin-bottom: 10px;
      :deep(.el-tree-node.is-current) {
        > .el-tree-node__content {
          background-color: #409eff;
          color: white;
        }
      }
    }
  }
}
</style>
