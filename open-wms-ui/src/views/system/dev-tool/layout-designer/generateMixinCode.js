/* eslint-disable */
// 创建混入文件
export function generateMixinCode(data) {
  var json = JSON.stringify(data, null, 2);

  return json;
}

// 创建主文件
export function generateMainCode() {
  return `<template>
  <div ref="container" class="page-list-container">
    <!--数据Table-->
    <yrt-data-list :ref="dataListRef" :editor-ref="editorRef" :data-options="dataOptions" :fields.sync="dataListOptions.fields" :buttons="dataListOptions.buttons" :button-click="buttonClick" :data-list-selections.sync="dataListSelections" :auth-nodes="authNodes">
    </yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorRef" :data-list-ref="dataListRef" v-bind="editorOptions" :data-options="dataOptions" :action.sync="editorOptions.action" :visible.sync="editorOptions.config.visible" :detail-button-click="detailButtonClick" :auth-nodes="authNodes">
    </yrt-editor>
  </div>
</template>

<script>
import baseLayout from "@/components/common/base-layout.vue";

export default {
  name: "{name}",
  components: {},
  mixins: [baseLayout],
  data() {
    return {};
  },
  methods: {}
};
</script>
`;
}
