<template>
  <div :class="{ frame: true, editorType: true }">
    <div v-if="['inner', 'single'].indexOf(editorType) >= 0" class="inner">
      <div v-if="title" class="title">{{ title }}</div>
      <slot></slot>
      <div :class="{ 'frame-footer': true, 'inner-footer': !!title, 'inner-footer-1': !title }">
        <slot name="footer"></slot>
      </div>
    </div>
    <el-dialog v-else-if="['dialog'].indexOf(editorType) >= 0" v-model="isShowDialog" :title="title" :top="top" :width="width" :before-close="onBeforeClose" :close-on-click-modal="!dataOptions.global_editorProhibitCloseOnClickModal" class="editor-dialog" draggable overflow @opened="opened">
      <slot></slot>
      <template #footer>
        <div class="frame-footer">
          <slot name="footer"></slot>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="yrt-editor-frame">
const emit = defineEmits(['update:visible', 'opened']);

//#region 定义属性
const props = defineProps({
  // 数据参数
  dataOptions: {
    type: Object,
    default: () => {},
  },
  // 编辑类型：inner、dialog
  editorType: {
    type: String,
    default: null,
  },
  // 显示对话框
  visible: {
    type: Boolean,
    default: false,
  },
  // 对话框宽度
  width: {
    type: String,
    default: null,
  },
  // 标题名称
  title: {
    type: String,
    default: null,
  },
  // Dialog CSS 中的 margin-top 值
  top: {
    type: String,
    default: null,
  },
});
//#endregion

//#region 定义变量
const state = reactive({});
//#endregion

// 关闭前事件
const onBeforeClose = inject('onBeforeClose', (done: any) => {
  done();
});

//#region 计算属性
const isShowDialog = computed({
  get: function () {
    return props.visible;
  },
  set: function (newValue: boolean) {
    emit('update:visible', newValue); // 双向绑定prop.visible，通知父级组件变量值同步更新
  },
});

const opened = () => {
  emit('opened');
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.frame {
  background-color: white;
  padding: 10px;
  padding-bottom: 20px;

  .title {
    padding: 10px;
  }

  &.editorType {
    padding: 0px;
  }

  .inner {
    margin-bottom: 70px;
  }
}

.frame-footer {
  &.inner-footer {
    z-index: 100;
    position: fixed;
    bottom: 13px;
    right: 13px;
    background-color: white;
  }

  &.inner-footer-1 {
    z-index: 100;
    margin-bottom: 20px;
    margin-right: 20px;
    background-color: white;
  }
}
</style>
