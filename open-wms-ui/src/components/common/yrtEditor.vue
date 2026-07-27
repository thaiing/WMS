<template>
  <div ref="editor-container" class="yrt-editor-box" @click="eHook.editorContainerClick">
    <yrt-editor-frame v-model:visible="isShowDialog" :data-options="dataOptions" :editor-type="editorType" :title="currentTitle" :label-position="config.labelPosition" :top="currentTop" :width="currentDialogWidth" :on-before-close="eHook.onBeforeClose" @opened="eHook.opened">
      <div class="editor-container">
        <template v-if="masterFields">
          <!-- 顶部自定义字段插槽 -->
          <slot name="header-slot" :formData="state.editorVo.master"></slot>
          <el-form ref="editor-form" :inline="config.formInline" :model="state.editorVo.master" :rules="rules" :label-width="config.labelWidth || '100px'" :style="{ width: config.formWidth || 'auto' }" :disabled="setCurrentDisabled('form')" class="editor-master">
            <!--开启tab分组导航-->
            <el-tabs v-if="dataOptions.openTabGroup" v-model="state.activeTabName" @tab-change="tabChange">
              <el-tab-pane v-for="(tabGroupName, index) in tabGroupList" :key="index" :label="tabGroupName" :name="tabGroupName">
                <template v-for="(firstField, groupIndex) in eHook.getGroupFields(tabGroupName)">
                  <!--grid行-->
                  <el-row v-if="firstField.type == 'grid'" :gutter="firstField.gutter">
                    <el-col v-for="(col, colIndex) in firstField.columns" :key="colIndex" :span="col.span">
                      <yrt-editor-input v-for="(subField, fieldIndex) in col.fields" :ref="'input-' + subField.options.prop" :key="subField.key + '_' + fieldIndex" :field="subField" :form-data="state.editorVo.master" :disabled="setCurrentDisabled('input', subField)" :dropdown-data="state.dropdownData" :rules="rules" :hide-feilds="hideFeilds" :data-remote-method="dataRemoteMethod" @on-change="eHook.onChange" @on-focus="eHook.onFocus" @on-blur="eHook.onBlur" @on-key-up="eHook.onKeyup" @on-key-down="eHook.onKeyDown" @on-row-change="eHook.onRowChange" @on-row-click="eHook.onRowClick" @on-tree-node-click="eHook.onTreeNodeClick" @on-upload-after="eHook.onUploadAfter">
                        <!-- label插槽 -->
                        <template v-if="useLabelSlot === true || (Array.isArray(useLabelSlot) && useLabelSlot.indexOf(subField.options.prop) >= 0)" v-slot:[getLabel(subField)]>
                          <slot :name="'label-' + subField.options.prop" :form-data="state.editorVo.master"></slot>
                        </template>
                        <!-- 空白自定义字段插槽 -->
                        <template v-for="slotItem in eHook.getSlotNames(subField)" v-slot:[slotItem.blank]>
                          <slot :name="slotItem.label" :form-data="state.editorVo.master"></slot>
                          <slot :name="slotItem.blank" :form-data="state.editorVo.master"></slot>
                        </template>
                        <!-- 文件字段插槽 -->
                        <template v-for="slotItem in eHook.getFileSlotNames(subField)" v-slot:[slotItem.file]="{ fileList }">
                          <slot :name="slotItem.file" :form-data="state.editorVo.master" :fileList="fileList"></slot>
                        </template>
                        <!-- 后缀插槽 -->
                        <template v-slot:[getSubffix(subField)]>
                          <slot :name="'suffix-' + firstField.options.prop" :form-data="state.editorVo.master"></slot>
                        </template>
                      </yrt-editor-input>
                    </el-col>
                  </el-row>

                  <!--分割器-->
                  <div v-else-if="firstField.type == 'splitter-group'" :key="'splitter' + groupIndex" class="splitter-title">
                    <div class="title">
                      {{ firstField.label }}
                    </div>
                  </div>

                  <!--编辑框在一行内 / 编辑框独立一行-->
                  <yrt-editor-input v-else :ref="'input-' + firstField.options.prop" :key="groupIndex" :field="firstField" :form-data="state.editorVo.master" :disabled="setCurrentDisabled('input', firstField)" :dropdown-data="state.dropdownData" :rules="rules" :hide-feilds="hideFeilds" :data-remote-method="dataRemoteMethod" @on-change="eHook.onChange" @on-focus="eHook.onFocus" @on-blur="eHook.onBlur" @on-key-up="eHook.onKeyup" @on-key-down="eHook.onKeyDown" @on-row-change="eHook.onRowChange" @on-row-click="eHook.onRowClick" @on-tree-node-click="eHook.onTreeNodeClick" @on-upload-after="eHook.onUploadAfter">
                    <!-- label插槽 -->
                    <template v-if="useLabelSlot === true || (Array.isArray(useLabelSlot) && useLabelSlot.indexOf(firstField.options.prop) >= 0)" v-slot:[getLabel(firstField)]>
                      <slot :name="'label-' + firstField.options.prop" :form-data="state.editorVo.master"></slot>
                    </template>
                    <!-- 空白自定义字段插槽 -->
                    <template v-for="slotItem in eHook.getSlotNames(firstField)" v-slot:[slotItem.blank]>
                      <slot :name="slotItem.label" :form-data="state.editorVo.master"></slot>
                      <slot :name="slotItem.blank" :form-data="state.editorVo.master"></slot>
                    </template>
                    <!-- 文件字段插槽 -->
                    <template v-for="slotItem in eHook.getFileSlotNames(firstField)" v-slot:[slotItem.file]="{ fileList }">
                      <slot :name="slotItem.file" :form-data="state.editorVo.master" :details="detailFields" :picList="fileList"></slot>
                    </template>
                    <!-- 后缀插槽 -->
                    <template v-slot:[getSubffix(firstField)]>
                      <slot :name="'suffix-' + firstField.options.prop" :form-data="state.editorVo.master"></slot>
                    </template>
                  </yrt-editor-input>
                </template>
              </el-tab-pane>
            </el-tabs>
            <template v-else>
              <template v-for="(firstField, groupIndex) in masterFields">
                <!--grid行-->
                <el-row v-if="firstField.type == 'grid'" :gutter="firstField.gutter">
                  <!-- {{ useLabelSlot }} -->
                  <el-col v-for="(col, colIndex) in firstField.columns" :key="colIndex" :span="col.span">
                    <yrt-editor-input v-for="(subField, index) in col.fields" :key="subField.key + '_' + index" :ref="'input-' + subField.options.prop" :field="subField" :form-data="state.editorVo.master" :disabled="setCurrentDisabled('input', subField)" :dropdown-data="state.dropdownData" :rules="rules" :hide-feilds="hideFeilds" :data-remote-method="dataRemoteMethod" @on-change="eHook.onChange" @on-focus="eHook.onFocus" @on-blur="eHook.onBlur" @on-key-up="eHook.onKeyup" @on-key-down="eHook.onKeyDown" @on-row-change="eHook.onRowChange" @on-row-click="eHook.onRowClick" @on-tree-node-click="eHook.onTreeNodeClick" @on-upload-after="eHook.onUploadAfter">
                      <!-- label插槽 -->
                      <template v-if="useLabelSlot === true || (Array.isArray(useLabelSlot) && useLabelSlot.indexOf(subField.options.prop) >= 0)" v-slot:[getLabel(subField)]>
                        <slot :name="'label-' + subField.options.prop" :form-data="state.editorVo.master"></slot>
                      </template>
                      <!-- 空白自定义字段插槽 -->
                      <template v-for="slotItem in eHook.getSlotNames(subField)" v-slot:[slotItem.blank]>
                        <slot :name="slotItem.label" :form-data="state.editorVo.master"></slot>
                        <slot :name="slotItem.blank" :form-data="state.editorVo.master"></slot>
                      </template>
                      <!-- 文件字段插槽 -->
                      <template v-for="slotItem in eHook.getFileSlotNames(subField)" v-slot:[slotItem.file]="{ fileList }">
                        <slot :name="slotItem.file" :form-data="state.editorVo.master" :fileList="fileList"></slot>
                      </template>
                      <!-- 后缀插槽 -->
                      <template v-slot:[getSubffix(subField)]>
                        <slot :name="'suffix-' + firstField.options.prop" :form-data="state.editorVo.master"></slot>
                      </template>
                    </yrt-editor-input>
                  </el-col>
                </el-row>

                <!--分割器-->
                <div v-else-if="firstField.type == 'splitter-group'" :key="'splitter' + groupIndex" class="splitter-title">
                  <div class="title">
                    {{ firstField.label }}
                  </div>
                </div>

                <!--编辑框在一行内 / 编辑框独立一行-->
                <yrt-editor-input v-else :ref="'input-' + firstField.options.prop" :key="groupIndex" :field="firstField" :form-data="state.editorVo.master" :disabled="setCurrentDisabled('input', firstField)" :dropdown-data="state.dropdownData" :rules="rules" :hide-feilds="hideFeilds" :data-remote-method="dataRemoteMethod" @on-change="eHook.onChange" @on-focus="eHook.onFocus" @on-blur="eHook.onBlur" @on-key-up="eHook.onKeyup" @on-key-down="eHook.onKeyDown" @on-row-change="eHook.onRowChange" @on-row-click="eHook.onRowClick" @on-tree-node-click="eHook.onTreeNodeClick" @on-upload-after="eHook.onUploadAfter">
                  <!-- label插槽 -->
                  <template v-if="useLabelSlot === true || (Array.isArray(useLabelSlot) && useLabelSlot.indexOf(firstField.options.prop) >= 0)" v-slot:[getLabel(firstField)]>
                    <slot :name="'label-' + firstField.options.prop" :form-data="state.editorVo.master"></slot>
                  </template>
                  <!-- 空白自定义字段插槽 -->
                  <template v-for="slotItem in eHook.getSlotNames(firstField)" v-slot:[slotItem.blank]>
                    <slot :name="slotItem.label" :form-data="state.editorVo.master"></slot>
                    <slot :name="slotItem.blank" :form-data="state.editorVo.master"></slot>
                  </template>
                  <!-- 文件字段插槽 -->
                  <template v-for="slotItem in eHook.getFileSlotNames(firstField)" v-slot:[slotItem.file]="{ fileList }">
                    <slot :name="slotItem.file" :form-data="state.editorVo.master" :fileList="fileList"></slot>
                  </template>
                  <!-- 后缀插槽 -->
                  <template v-slot:[getSubffix(firstField)]>
                    <slot :name="'suffix-' + firstField.options.prop" :form-data="state.editorVo.master"></slot>
                  </template>
                </yrt-editor-input>
              </template>
            </template>
          </el-form>
        </template>

        <!--明细数据-->
        <div v-for="(detail, index) in detailFields" :key="index" v-show="!detail.hiddenDetail && ((dataOptions.openTabGroup && state.activeTabName === detail.tabGroupName) || !dataOptions.openTabGroup || !detail.tabGroupName)" class="editor-detail" :class="{ 'editor-detail-border': !detail.options.isHidden, ' margin-top-0': dataOptions.openTabGroup }">
          <div v-if="detail.options.title && !detail.options.isHidden" class="splitter-title">
            <div class="title">
              {{ detail.options.title }}
            </div>
          </div>
          <template v-if="!detail.options.isHidden">
            <div v-if="detail.buttons.length" class="detail-tool">
              <slot name="detail-tool-slot">
                <template v-for="button in detail.buttons">
                  <!--分组按钮-->
                  <el-button-group v-if="button.type == 'button-group'" class="tool-group">
                    <template v-for="(btn, btnIndex) in button.buttons">
                      <el-button v-if="authNodes[btn.options.authNode]" :type="btn.options.type" :disabled="detailBtnDisabled(btn.options)" size="small" @click="() => dHook.onDetailButtonAction(btn.options.authNode, detail, btn)">
                        <template #icon>
                          <svg-icon :name="btn.options.icon" class="text-size-n" :size="14" />
                        </template>
                        {{ btn.label }}
                      </el-button>
                    </template>
                  </el-button-group>
                  <!--不分组按钮-->
                  <template v-else>
                    <el-tooltip v-if="authNodes[button.options.authNode]" :content="button.label" :show-after="1000" placement="top">
                      <el-button v-if="authNodes[button.options.authNode]" :type="button.options.type" :disabled="detailBtnDisabled(button.options)" size="small" @click="() => dHook.onDetailButtonAction(button.options.authNode, detail, button)">
                        <template #icon>
                          <svg-icon :name="button.options.icon" class="text-size-n" :size="14" />
                        </template>
                        {{ button.label }}
                      </el-button>
                    </el-tooltip>
                  </template>
                </template>
              </slot>
              <slot name="detail-tool-right-slot" :form-data="state.editorVo.master"></slot>
            </div>
            <el-table :ref="'detail-table-' + detail.subTableName" v-bind="detail.options" :data="eHook.getDetailDataList(detail)" :max-height="400" :row-style="(scope:any) => dHook.detailRowStyle(scope.row, scope.rowIndex, detail)" :show-summary="detail.options.showSumField" :summary-method="(scope:any) => dHook.getDetailSummaries(scope.columns, scope.data, detail)" :row-key="detail.options.idField" style="width: 100%" highlight-current-row @row-click="(row: any, column: any, event: Event) => dHook.onDetailRowClick(row, column, event,detail.fields)" @selection-change="(val:any) => dHook.handleSelectionChange(val, detail)" @cell-click="(row:any, column:any, cell:any, event:any) => dHook.onDetailCellClick(detail, row, column, cell, event)" @current-change="(currentRow:any, oldCurrentRow:any) => dHook.onDetailCurrentChange(detail, currentRow, oldCurrentRow)" @click.stop @header-click="(column:any, event:any) => dHook.detailHeaderClick(column, event, detail)" @sort-change="dHook.sortChange" @expand-change="(row:any) => onExpandChange(row, detail, index)">
              <el-table-column :width="'35px'" type="selection" fixed="left" class="col-selection"></el-table-column>
              <el-table-column :width="'35px'" :index="(index:any) => (detail.options.pageIndex - 1) * detail.options.pageSize + index + 1" type="index" label="#" fixed="left" class="col-index"></el-table-column>

              <el-table-column v-if="detail.options.showExpandRow" width="35px" type="expand" :fixed="detail.options.expandColFixed ? 'left' : false">
                <template #default="{ row }">
                  <!-- detail.subTableView={{ detail.subTableView }} -->
                  <slot :name="'expand-column-slot-' + detail.subTableView" :row="row"> </slot>
                </template>
              </el-table-column>

              <template v-for="(col, fieldIndex) in detail.fields">
                <!--操作列插槽-->
                <el-table-column v-if="col.prop == '_action' && !col.hidden" :key="fieldIndex" :sortable="!!col.sortable" :label="col.label" :width="col.width || 'auto'" :header-align="col.headerAlign || 'left'" :align="col.align || 'left'" fixed="right">
                  <template #default="{ row }">
                    <slot :row="row" :col="col" name="action-column-slot">
                      <el-button v-for="(btn, btnIndex) in col.action" :key="btnIndex" type="primary" link size="small">{{ btn.label }}</el-button>
                    </slot>
                  </template>
                </el-table-column>

                <!--通用列插槽-->
                <yrt-detail-column :col="col" :data-options="dataOptions" :dropdown-data="state.dropdownData" :disabled="setCurrentDisabled('detail', col)" :show-fields="showFields" :current-row="detail.currentRow" :load-data-before="loadDataBefore" @on-detail-change="(ref: any, val: any, row: any, field: any) => dHook.onDetailChange(ref, val, row, field, eHook.getDetailDataList(detail))" @on-row-click="(ref: any, val: any, itemData:any, field: any, row: any) => dHook.onDetailChange(ref, val, row, field, eHook.getDetailDataList(detail))" :detailRemoteMethod="detailRemoteMethod">
                  <template v-if="useDetailSlot === true || (Array.isArray(useDetailSlot) && useDetailSlot.indexOf(col.prop) >= 0)" #column-slot="{ row, column, index }">
                    <slot :detail="detail" :row="row" :col="col" :column="column" :index="index" name="detail-column-slot"></slot>
                  </template>
                </yrt-detail-column>
              </template>
            </el-table>
            <div v-if="!detail.options.isHidden" class="pagination-container">
              <el-pagination v-model:current-page="detail.options.pageIndex" v-model:page-size="detail.options.pageSize" :page-sizes="[5, 10, 15, 20, 50, 100, 200, 300, 500, 1000]" :disabled="state.detailPageDisabled" layout="total, sizes, prev, pager, next, jumper" :total="detail.options.total || 0" @size-change="(val:any) => dHook.handleSizeChange(val, detail)" @current-change="(val:any) => dHook.handleCurrentChange(val, detail)"></el-pagination>
            </div>
          </template>

          <!--明细自定义插槽-->
          <slot :name="'detail-' + index" :detail="detail" :detail-data-list="getDetailDataList(detail)"></slot>
        </div>
      </div>

      <template #footer>
        <slot name="footer">
          <div class="dialog-footer">
            <div class="left">
              <!--自定义按钮-->
              <template v-for="(item, index) in buttonList">
                <el-button v-if="authNodes[item.authName]" :key="index" :disabled="btnReadOnly[item.authName]" :type="item.type" @click="eHook.onButtonAction(item.authName)">
                  <i :class="item.icon"></i>
                  {{ item.label }}
                </el-button>
              </template>

              <slot :form-data="state.editorVo.master" :details="detailFields" :eHook="eHook" name="footer-button-region"></slot>
            </div>
            <div class="right">
              <span style="color: white; cursor: pointer; margin-right: 10px" @click="state.showMainFieldsDialog = true">字段</span>
              <span style="color: white; cursor: pointer" @click="proxy.$message.success('主键ID：' + dataOptions.idValue)">ID值</span>
              <el-button-group>
                <el-button v-if="['inner', 'single'].indexOf(editorType) < 0" @click="eHook.cancel">
                  <template #icon>
                    <svg-icon name="ele-CloseBold" class="text-size-n" :size="14" />
                  </template>
                  取 消
                </el-button>
                <el-button @click="eHook.reload">
                  <template #icon>
                    <svg-icon name="ele-Refresh" class="text-size-n" :size="14" />
                  </template>
                  刷新
                </el-button>
                <el-button :loading="state.saveLoading" :disabled="setCurrentDisabled('save') || btnReadOnly['save'] || !authNodes.save" type="primary" @click="eHook.submit(false)">
                  <template #icon>
                    <svg-icon name="s-save" class="text-size-n" :size="14" />
                  </template>
                  {{ config.saveButtonText }}(F2)
                </el-button>
                <el-button v-if="['inner', 'single'].indexOf(editorType) < 0" :loading="state.saveLoading" :disabled="setCurrentDisabled('save') || btnReadOnly['save'] || !authNodes.save" type="primary" @click="eHook.submit(true)">
                  <template #icon>
                    <svg-icon name="s-save" class="text-size-n" :size="14" />
                  </template>
                  保存并关闭
                </el-button>
              </el-button-group>
            </div>
          </div>
        </slot>
      </template>
    </yrt-editor-frame>

    <!-- 批量导入对话框 -->
    <import-dialog ref="import-dialog" v-model:visible="state.importOptions.visible" :import-options="state.importOptions" :dataOptions="props.dataOptions" @on-close="onCloseImport"></import-dialog>

    <!-- 批量导出对话框 -->
    <export-dialog ref="export-dialog" v-model:visible="state.batchExport.visible" :export-options="state.batchExport.options" :export-data="eHook.exportData"></export-dialog>

    <!--显示主表字段属性-->
    <table-info-dialog v-model:visible="state.showMainFieldsDialog" :data-options="dataOptions" :fields="mainFields"></table-info-dialog>

    <!--显示明细字段属性-->
    <table-info-dialog v-model:visible="state.tableAttr.showAttrDialog" :data-options="state.tableAttr.dataOptions" :fields="state.tableAttr.fields"></table-info-dialog>
  </div>
</template>

<script setup lang="ts" name="yrt-editor">
import { ComponentInternalInstance } from 'vue';
import yrtEditorInput from '/@/components/common/yrtEditorInput.vue';
import yrtDetailColumn from '/@/components/common/yrtDetailColumn.vue';
import ImportDialog from '/@/components/common/components/import-dialog.vue';
import ExportDialog from '/@/components/common/components/export-dialog.vue';
import yrtEditorFrame from '/@/components/common/components/yrt-editor-frame.vue';
import TableInfoDialog from '/@/components/common/components/table-info-dialog.vue';
import { BaseProperties, DetailField, DataOptions } from '/@/types/base-type';
import editorHook from '../hooks/editorHook';
import editorDetailHook from '../hooks/editorDetailHook';
import { EditorVo, EditorState, DetailInfo, FiledInfo } from '/@/api/types';
import { BaseObject } from '/@/types/common';
import { PropType } from 'vue';

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:action', 'on-save-after', 'on-change', 'on-row-change', 'on-edit-load-before', 'on-edit-load-after', 'on-detail-change', 'on-detail-delete-after', 'on-key-down', 'on-key-up', 'on-row-click', 'on-blur', 'on-focus', 'on-copy-after', 'on-add-load-after', 'on-expand-change', 'on-detail-row-click', 'on-tab-change']);

//#region 定义属性
const props = defineProps({
  // 编辑类型：inner、dialog
  editorType: {
    type: String,
    default: null,
  },
  // 对话框宽度
  dialogWidth: {
    type: [Number, String],
    default: null,
  },
  // 编辑类型：add、edit
  action: {
    type: String,
    default: 'add',
    validator: function (value: string) {
      // 接收值为：add、edit
      return ['add', 'edit'].indexOf(value) !== -1;
    },
  },
  // 校验规则
  rules: {
    type: Object,
    default: () => {
      return null;
    },
  },
  // 全局参数
  dataOptions: {
    type: Object as PropType<DataOptions>,
    default: () => {},
  },
  // 编辑页面参数
  editorOptions: {
    type: Object as any,
    default: () => {
      return {};
    },
  },
  // 配置参数
  config: {
    type: Object,
    default: () => {
      return {
        top: '10vh',
        title: '对话框标题',
        // 是否显示添加实验室小组对话框
        visible: false,
        // 是否禁用
        disabled: false,
        // 编辑时KeyId
        id: 0,
        // 保存按钮文本
        saveButtonText: '保存',
        // 行内表单模式
        formInline: true,
      };
    },
  },
  // 明细按钮单击事件
  detailButtonClick: {
    type: Function,
    required: false,
    default: null,
  },
  // 编辑按钮点击事件
  editButtonClick: {
    type: Function,
    required: false,
    default: null,
  },
  // 关联列表ref名
  dataListRefName: {
    type: String,
    default: 'data-list',
  },
  // 权限集合
  authNodes: {
    type: Object,
    required: true,
    default: () => {
      return {
        save: true,
      };
    },
  },
  // 按钮列表
  buttonList: {
    type: Array as PropType<any[]>,
    required: false,
    default: () => {
      return [
        {
          label: '审核',
          authName: 'auditing',
          icon: 'icon-gouxuan1',
          type: 'success',
        },
        {
          label: '复制',
          authName: 'copy',
          icon: 'icon-fuzhi',
          type: 'success',
        },
        {
          label: '终止',
          authName: 'stop',
          icon: 'icon-zhongzhiicon',
          type: 'success',
        },
        {
          label: '开启',
          authName: 'open',
          icon: 'icon-kaiqi',
          type: 'success',
        },
      ];
    },
  },
  // 表单默认值，新建时用
  defaultValue: {
    type: Object,
    required: false,
    default: () => {
      return {};
    },
  },
  // 按钮是否可用
  btnReadOnly: {
    type: Object,
    required: false,
    default: () => {
      return {
        save: false,
        auditing: false,
        add: false,
        delete: false,
        stop: false,
        open: false,
      };
    },
  },
  // 明细字段使用插槽，值为true=所有列都使用插槽；值为数组，数组中存在的字段使用插槽
  useDetailSlot: {
    type: [Boolean, Array],
    default: false,
  },
  // 主表使用标签插槽，值为true=所有字段都使用插槽；值为数组，数组中存在的字段使用插槽
  useLabelSlot: {
    type: [Boolean, Array],
    default: false,
  },
  // 修改数据事件
  onSaveBefore: {
    type: Function,
    default: () => {},
  },
  // 终止前事件
  onStopBefore: {
    type: Function,
    default: () => {
      return true;
    },
  },
  // 删除前事件
  onDetailDeleteBefore: {
    type: Function,
    default: () => {
      return true;
    },
  },
  // 数据处理方法
  doDataParser: {
    type: Function,
    required: false,
    default: null,
  },
  // 审核成功后，不可编辑处理方法
  auditDisabled: {
    type: Function,
    required: false,
    default: null,
  },
  // 控制显示字段,true=显示所有字段，Array=只显示数组内的字段
  showFields: {
    type: [Boolean, Array],
    default: true,
  },
  // 自定义查询条件
  filteredValue: {
    type: Array,
    default: null,
  },
  // 额外下拉框ID
  dropdownIds: {
    type: Array,
    default: () => {
      return [];
    },
  },
  // 隐藏字段
  hideFeilds: {
    type: Array,
    default: () => {
      return [];
    },
  },
  // 明细按钮是否禁用
  detailButtonCustom: {
    type: Boolean,
    default: false,
  },
  // 输入选择框加载前方法
  loadDataBefore: {
    type: Function,
    default: () => {
      return () => {};
    },
  },
  // 下拉框远程搜索事件
  detailRemoteMethod: {
    type: Function,
    default: () => {
      return (query: string, row: any, col: any) => {};
    },
  },
  // 表单是否可用
  setFormDisabled: {
    type: Function,
    default: null,
  },
  // 下拉框远程搜索事件
  dataRemoteMethod: {
    type: Function,
    default: () => {
      return (query: string, col: any) => {};
    },
  },
});
//#endregion

//#region 定义变量
const state: EditorState = reactive({
  saveLoading: false, // 保存loading
  initLoading: false, // 加载数据初始化loading
  editorVo: {
    master: {},
    detailList: [],
  } as EditorVo,
  dropdownData: {} as any, // 下拉框数据集合
  // 模块tree prop参数配置
  treeProps: {
    label: 'label',
    children: 'children',
    value: 'value',
    isLeaf: function (data: any) {
      return data.hasChild !== 1;
    },
  },
  // TREE选择器右侧图标
  treeSuffixIcon: 'icon-xiangxiajiantou1',
  // 显示批量导入对话框参数
  importOptions: {
    visible: false,
    label: '批量导入',
    url: '/api/common/upload',
    importId: 0,
    vueDataId: 0,
    mainId: 0, // 主表主键值
    detailInfo: {} as DetailInfo,
  },
  // 显示批量导出对话框参数
  batchExport: {
    visible: false,
    label: '批量导出',
    options: {
      exportId: 0,
      vueDataId: 0,
    },
  },
  // 明细分页器禁用
  detailPageDisabled: true,
  // 显示字段属性对话框
  tableAttr: {
    showAttrDialog: false,
    dataOptions: {},
    fields: [],
  },
  // 当前选中tab
  activeTabName: '',
  isSavedCloseDialog: false,
  // 显示字段属性对话框
  showMainFieldsDialog: false,
});
//#endregion

//#region 计算属性
// 当前宽度
const currentDialogWidth = computed(() => {
  if (props.dialogWidth) {
    const width = Number.isInteger(props.dialogWidth) ? props.dialogWidth + 'px' : props.dialogWidth;
    return width;
  } else {
    const width = Number.isInteger(props.config.width) ? props.config.width + 'px' : props.config.width;
    return width;
  }
});

// 主表字段
const masterFields = computed(() => {
  if (props.editorOptions.fields) {
    return props.editorOptions.fields.filter((item: any) => item.type !== 'detail-grid');
  } else {
    return [] as Array<any>;
  }
});

// 明细字段
const detailFields = computed(() => {
  if (props.editorOptions.fields) {
    let details: Array<any> = props.editorOptions.fields.filter((item: any) => item.type === 'detail-grid');

    return details;
  } else {
    return [];
  }
});

// 主表字段属性，字段弹出框使用
const mainFields = computed(() => {
  if (props.editorOptions.fields) {
    let newFields: Array<any> = [];
    const _f = props.editorOptions.fields.filter((item: any) => ['grid', 'detail-grid', 'splitter-group', 'inline-group'].indexOf(item.type) < 0);
    newFields = newFields.concat(
      _f.map((m: any) => {
        return {
          prop: m.options.prop,
          label: m.label,
          dataType: m.options.dataType,
          width: m.options.width,
          type: m.options.type,
          isExpandField: m.options.isExpandField,
        };
      })
    );
    props.editorOptions.fields
      .filter((item: any) => ['grid', 'inline-group'].indexOf(item.type) >= 0)
      .forEach((item: any) => {
        if (item.type === 'grid') {
          for (const col of item.columns) {
            newFields = newFields.concat(
              col.fields.map((m: any) => {
                return {
                  prop: m.options.prop,
                  label: m.label,
                  dataType: m.options.dataType,
                  width: m.options.width,
                  type: m.type,
                  isExpandField: m.options.isExpandField,
                };
              })
            );
          }
        } else if (item.type === 'inline-group') {
          newFields = newFields.concat(
            item.fields.map((m: any) => {
              return {
                prop: m.options.prop,
                label: m.label,
                dataType: m.options.dataType,
                width: m.options.width,
                type: m.type,
                isExpandField: m.options.isExpandField,
              };
            })
          );
        }
      });
    return newFields;
  } else {
    return [];
  }
});

// 标题名称
const currentTitle = computed(() => {
  if (!props.config.hiddenTitle) {
    if (props.config.title) {
      return props.config.title + ' - ' + (props.action === 'add' ? '新建' : '编辑');
    } else {
      return '编辑数据';
    }
  } else {
    return '';
  }
});

// 是否显示dialog
const isShowDialog = computed({
  get() {
    return props.config.visible;
  },
  set(newValue) {
    props.config.visible = newValue;
  },
});

// 当前编辑动作：add/edit
const currentAction = computed({
  get() {
    return props.action;
  },
  set(newValue) {
    emit('update:action', newValue); // 双向绑定prop.action，通知父级组件变量值同步更新
  },
});

// 当前diaolog top
const currentTop = computed({
  get() {
    return props.config.top;
  },
  set(newValue) {
    props.config.top = newValue;
  },
});

// 是否禁用
const currentDisabled = computed({
  get: function () {
    if (props.setFormDisabled) {
      return props.setFormDisabled('save', null, state.editorVo.master);
    } else {
      return props.config.disabled || false;
    }
  },
  set: function (newValue) {
    props.config.disabled = newValue;
  },
});

// 是否禁用
const setCurrentDisabled = computed(() => {
  return (type: string, fieldInfo?: FiledInfo) => {
    if (props.setFormDisabled) {
      return props.setFormDisabled(type, fieldInfo, state.editorVo.master);
    } else {
      return props.config.disabled || false;
    }
  };
});

// 明细按钮是否禁用
const currentDetailDisabled = computed(() => {
  return (detail: any) => {
    if (props.detailButtonCustom) {
      return false;
    } else {
      return props.config.disabled || false;
    }
  };
});
// 明细按钮是否禁用
const detailBtnDisabled = computed(() => {
  return (options: any) => {
    if (props.btnReadOnly[options.authNode] == undefined) {
      return props.config.disabled || false;
    }
    let disabled = !!props.btnReadOnly[options.authNode];
    return disabled;
  };
});

// tab分组
const tabGroupList = computed(() => {
  if (props.editorOptions.fields) {
    let groupList: Array<any> = masterFields.value.reduce((all: any, next: any) => (all.some((item: any) => item.tabGroupName === next.tabGroupName) ? all : [...all, next]), []);
    // 初始化明细数据结构
    groupList = groupList.map((item: any) => {
      return item.tabGroupName || '[未分组]';
    });

    // 明细表分组
    const detailList = detailFields.value
      .reduce((all: any[], next: any) => (all.some((item: any) => item.tabGroupName === next.tabGroupName) ? all : [...all, next]), [])
      .filter((item: any) => item.tabGroupName)
      .map((item: any) => {
        return item.tabGroupName;
      });
    groupList = groupList.concat(detailList);

    return groupList;
  } else {
    return [];
  }
});
//#endregion

//#region watch
watch(
  () => state.editorVo.master,
  (newVal) => {
    // 审核成功，将不可编辑
    if (typeof props.auditDisabled === 'function') {
      props.auditDisabled(state.editorVo.master, props.config);
    } else {
      if (state.editorVo.master.auditing === 2) {
        props.config['disabled'] = true;
      } else {
        props.config['disabled'] = false;
      }
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => tabGroupList.value,
  (groupList: Array<any>) => {
    // 设置第一项默认选中项
    if (groupList.length) {
      state.activeTabName = groupList[0];
    }
  },
  { deep: true, immediate: true }
);
//#endregion

//#region 定义事件
const events = {
  /**
   * 保存后事件
   */
  onSaveAfter() {
    emit('on-save-after', state.editorVo.master);
  },
  /**
   * 改变后事件
   */
  onChange(ref: any, val: any, field: any, master: any, selectItemOptions: any[]) {
    emit('on-change', ref, val, field, master, selectItemOptions);
  },
  /**
   * 改变后事件
   */
  onRowChange(ref: any, val: any, field: any, master: any) {
    emit('on-row-change', ref, val, field, master);
  },

  /**
   * 点击事件
   */
  onRowClick(ref: any, val: any, field: any, master: any) {
    emit('on-row-click', ref, val, field, master);
  },
  /**
   * 编辑前加载事件
   */
  onEditLoadBefore(rowData: BaseObject) {
    emit('on-edit-load-before', rowData);
  },
  /**
   * 编辑前加载事件
   */
  onAddLoadAfter(rowData: BaseObject) {
    emit('on-add-load-after', rowData);
  },
  /**
   * 编辑前加载事件
   */
  onEditLoadAfter(rowData: BaseObject) {
    emit('on-edit-load-after', rowData);
  },
  /**
   * 明细删除后事件
   */
  onDetailDeleteAfter(deletedRows: Array<any>, detailInfo: DetailInfo) {
    emit('on-detail-delete-after', deletedRows, detailInfo);
  },
  /**
   * 明细数据改变事件
   */
  onDetailChange(ref: any, val: any, row: any, field: DetailField, rows: Array<any>) {
    emit('on-detail-change', ref, val, row, field, rows);
  },
  /**
   * 按键抬起
   */
  onKeyDown(ref: any, val: any, event: any, field: any, tableData: any) {
    emit('on-key-down', ref, val, event, field, tableData);
  },
  /**
   * 按键抬起
   */
  onKeyUp(ref: any, val: any, event: any, field: any, tableData: any) {
    emit('on-key-up', ref, val, event, field, tableData);
  },
  /**
   * 明细行点击
   */
  onDetailRowClick(row: any, column: any, event: Event, fields: any) {
    emit('on-detail-row-click', row, column, event, fields, state.editorVo.master);
  },
  /**
   * Focus事件
   */
  onFocus(ref: any, val: any, event: any, field: any) {
    emit('on-focus', ref, val, event, field);
  },
  /**
   * 失去焦点事件
   */
  onBlur(ref: any, val: any, event: any, field: any) {
    emit('on-blur', ref, val, event, field);
  },
  /**
   * 保存后事件
   * @idValue 主键ID值
   */
  onCopyAfter(idValue: number) {
    emit('on-copy-after', idValue);
  },
};
//#endregion

// 主操作hook
const eHook = editorHook({ props, state, detailFields, isShowDialog, currentAction, currentDisabled, currentTop, masterFields, events });
// 明细表操作hook
const dHook = editorDetailHook({ props, state, detailFields, isShowDialog, currentAction, currentDisabled, currentTop, masterFields, events });

const { loadEditData, copy, reset, editorVo, addData } = eHook;
const { addDetailDataRow, clearDetailDataRow, flagDeleteDetailList } = dHook;

onMounted(async () => {
  // document.addEventListener('click', eHook.editorContainerClick);
});

onActivated(() => {
  isShowDialog.value = false;
});

// 明细展开事件
const onExpandChange = (row: any, detail: any, index: any) => {
  emit('on-expand-change', row, detail, index);
};
// 关闭导入对话框
const onCloseImport = async () => {
  await eHook.loadEditData();
};
// 获得明细数据集
const getDetailDataList = (detailInfo: any) => {
  if (typeof detailInfo === 'string') {
    detailInfo = {
      subTableName: detailInfo,
    };
  }
  if (detailInfo.subTableName) {
    detailInfo.subTableName = proxy.common.toCamelCase(detailInfo.subTableName);
    const dataList = state.editorVo.detailList.find((item) => proxy.common.toCamelCase(detailInfo.subTableName) === detailInfo.subTableName);
    if (dataList && dataList.rows.length) {
      return dataList.rows;
    } else {
      return [];
    }
  } else {
    return [];
  }
};

const getLabel = (subField: any) => {
  return 'label-' + subField.options.prop;
};
const getSubffix = (subField: any) => {
  return 'suffix-' + subField.options.prop;
};

const tabChange = (name: any) => {
  emit('on-tab-change', { name });
};

// 对外暴露属性和方法
defineExpose({
  editorVo,
  loadEditData,
  copy,
  reset,
  addData,
  addDetailDataRow,
  clearDetailDataRow,
  flagDeleteDetailList,
  getFieldInfo: eHook.getFieldInfo,
  cancel: eHook.cancel,
});
</script>

<style lang="scss" scoped>
.editor-container {
  padding-bottom: 10px;

  .splitter-title {
    background-color: #f2f6fc;
    padding: 0px 10px;
    margin-bottom: 5px;
    border-bottom: #dcdfe6 2px double;
    position: relative;

    .title {
      padding: 5px 3px;
      border-bottom: #036fba 3px solid;
      font-size: 16px;
      display: inline-block;
      position: relative;
      bottom: -2px;
    }
  }

  .editor-detail {
    .detail-tool {
      margin-bottom: 0px;
      padding: 10px 0;

      .el-button--mini {
        padding: 7px 7px;
      }

      .tool-group + .tool-group {
        margin-left: 10px;
      }

      .el-button--medium {
        padding: 10px 10px;
      }
    }

    + .editor-detail {
      margin-top: 20px;
    }
  }

  :deep(.el-input__inner) {
    padding: 0 5px;
  }

  :deep(.el-input-number) {
    &.is-controls-right .el-input__inner {
      padding-left: 5px;
      padding-right: 40px;
    }
  }

  :deep(td) {
    padding: 3px 0;
  }

  :deep(.col-container) {
    .el-input--suffix .el-input__inner {
      padding: 0 0 0 4px;
    }

    :deep(.el-input--prefix .el-input__inner) {
      padding: 0 5px 0 25px;
    }

    .cell {
      padding-left: 5px;
      padding-right: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .el-input-number.is-controls-right .el-input__inner {
      padding-left: 0px;
      padding-right: 0px;
    }
  }

  :deep(.el-input__prefix) {
    left: 5px;
  }

  :deep(.el-input__suffix) {
    right: 0;
  }

  .el-checkbox + .el-checkbox,
  .el-radio + .el-radio {
    margin-left: 0px !important;
  }
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  :deep(.el-button) {
    padding: 10px 10px !important;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
.editor-container {
  .el-dialog__body {
    padding: 10px 20px 10px 10px;
  }

  .pagination-container {
    margin-top: 10px;
  }
}

.editor-detail-border {
  border-top: 1px solid #ebeef5;
  position: relative;
}
</style>
