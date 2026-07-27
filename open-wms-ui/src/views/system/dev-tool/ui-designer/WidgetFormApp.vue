<template>
  <div class="widget-form-container">
    <el-form :label-position="data.editorOptions.config.labelPosition" :label-width="data.editorOptions.config.labelWidth" :inline="data.editorOptions.config.formInline" :style="{ width: data.editorOptions.config.formWidth || 'auto' }">
      <!-- <el-button type="primary" link size="small" class="btn-add-all" @click="addCol">1列模式</el-button>
      <el-button type="primary" link size="small" class="btn-add-all" @click="addCols(2)">2列模式</el-button>
      <el-button type="primary" link size="small" class="btn-add-all" @click="addCols(3)">3列模式</el-button>
      <el-button type="primary" link size="small" class="btn-add-all" @click="btnClearAll">清空</el-button> -->

      <draggable v-model="data.dataListOptions.fields" item-key="key" :group="{ name: 'people' }" ghost-class="ghost" class="widget-form-list form-region" @end="handleMoveEnd" @add="handleWidgetAdd">
        <template v-for="(element, index) in data.dataListOptions.fields">
          <template v-if="element.type === 'grid'">
            <div v-if="element && element.key" :key="element.key" class="widget-grid-container data-grid" style="position: relative">
              <el-row :justify="element.options.justify" :align="element.options.align" :class="{ active: selectWidget && selectWidget.key === element.key }" :gutter="element.options.gutter ? element.options.gutter : 0" class="widget-grid" type="flex" @click="handleSelectWidget(index)">
                <el-col v-for="(col, colIndex) in element.columns" :key="colIndex" :span="col.span ? col.span : 0">
                  <div style="border: 1px dashed #999">
                    <draggable v-model="col.fields" item-key="key" :group="{ name: 'people' }" ghost-class="ghost" class="widget-form-list grid-list" filter="widget-grid-container" @end="handleMoveEnd" @add="handleWidgetColAdd($event, element, colIndex)">
                      <template v-for="(el, i) in col.fields">
                        <widget-form-item v-if="el.key" :key="el.key" :element="el" :select.sync="selectWidget" :config-type.sync="currentConfigType" :index="i" :fields="col.fields" :data="data"></widget-form-item>
                      </template>
                    </draggable>
                  </div>
                </el-col>
              </el-row>
              <el-button v-if="selectWidget && selectWidget.key === element.key" title="删除" style="bottom: -20px" circle plain type="danger" class="widget-action-delete" @click.stop="handleWidgetDelete(index)">
                <i class="yrt-shanchu2"></i>
              </el-button>
            </div>
          </template>
          <template v-else-if="element.type === 'inline-group'">
            <div v-if="element && element.key" :key="element.key" class="widget-grid-container inline-group" style="position: relative">
              <div :class="{ active: selectWidget && selectWidget.key === element.key }" class="widget-grid" @click="handleSelectWidget(index)">
                <div style="border: 1px dashed #999">
                  <el-form-item :label="element.label">
                    <draggable v-model="element.fields" item-key="key" :group="{ name: 'people' }" ghost-class="ghost" class="widget-form-list inline-list" filter="widget-grid-container" @end="handleMoveEnd" @add="handleWidgetInlineAdd($event, element)">
                      <template v-for="(el, i) in element.fields">
                        <widget-form-item-inline v-if="el.key" :key="el.key" :element="el" :select.sync="selectWidget" :config-type.sync="currentConfigType" :index="i" :fields="element.fields" :data="data"></widget-form-item-inline>
                      </template>
                    </draggable>
                  </el-form-item>
                </div>
              </div>
              <el-button v-if="selectWidget && selectWidget.key === element.key" title="删除" style="bottom: -20px" type="danger" class="widget-action-delete" circle plain @click.stop="handleWidgetDelete(index)">
                <i class="yrt-shanchu2"></i>
              </el-button>
            </div>
          </template>
          <template v-else-if="element.type === 'splitter-group'">
            <div v-if="element && element.key" :key="element.key" class="widget-grid-container splitter-group" style="position: relative">
              <div :class="{ active: selectWidget && selectWidget.key === element.key }" class="widget-grid" @click="handleSelectWidget(index)">
                <div style="border: 1px dashed #999">
                  <div class="splitter-title">
                    {{ element.label }}
                  </div>
                </div>
              </div>
              <el-button v-if="selectWidget && selectWidget.key === element.key" title="删除" style="bottom: -20px" class="widget-action-delete" circle plain type="danger" @click.stop="handleWidgetDelete(index)">
                <i class="yrt-shanchu2"></i>
              </el-button>
            </div>
          </template>
          <template v-else-if="element.type === 'detail-grid'">
            <div v-if="element && element.key" :key="element.key" class="widget-grid-container detail-grid" style="position: relative">
              <div :class="{ active: selectWidget && selectWidget.key === element.key }" class="widget-grid" @click="handleSelectWidget(index)">
                <div if="element.options.title" class="splitter-title">
                  <div class="title">
                    {{ element.options.title }}
                  </div>
                </div>
                <div class="manager-form-container" style="border: 1px dashed #999">
                  <div class="button-container-title">明细按钮设计区</div>
                  <!--按钮设置-->
                  <manager-form-button-group :buttons.sync="element.buttons" :config-type.sync="currentConfigType" :select.sync="selectWidget"></manager-form-button-group>

                  <div class="button-container-title margin-top-5">明细字段设计区</div>
                  <draggable v-model="element.fields" item-key="key" :group="{ name: 'people' }" ghost-class="ghost" :animation="300" , handle=".handle" chosen-class="chosen-item" tag="ul" class="draggable-main widget-form-list detail-list" @add="handleWidgetDetailAdd($event, element)">
                    <template v-for="(subEl, index2) in element.fields">
                      <manager-form-item v-if="subEl && subEl.key" :key="subEl.key" :element="subEl" :select.sync="selectWidget" :config-type.sync="currentConfigType" :index="index2" :fields="element.fields"></manager-form-item>
                    </template>
                  </draggable>
                </div>
              </div>
              <el-button v-if="selectWidget && selectWidget.key === element.key" circle plain type="primary" title="查看字段" style="bottom: -20px" class="widget-action-clone" @click.stop="showDetailField">
                <i class="icon-74wodedingdan"></i>
              </el-button>
              <el-button v-if="selectWidget && selectWidget.key === element.key" circle plain type="danger" title="删除" style="bottom: -20px" class="widget-action-delete" @click.stop="handleWidgetDelete(index)">
                <i class="yrt-shanchu2"></i>
              </el-button>
            </div>
          </template>
          <template v-else>
            <widget-form-item v-if="element && element.key" :key="element.key" :element="element" :select.sync="selectWidget" :config-type.sync="currentConfigType" :index="index" :fields="data.dataListOptions.fields" :data="data"></widget-form-item>
          </template>
        </template>
      </draggable>
    </el-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import WidgetFormItem from './WidgetFormItem.vue';
import WidgetFormItemInline from './WidgetFormItemInline.vue';
import ManagerFormItem from './ManagerFormItem.vue';
import ManagerFormButtonGroup from './ManagerFormButtonGroup.vue';

export default {
  components: {
    Draggable,
    WidgetFormItem,
    WidgetFormItemInline,
    ManagerFormItem,
    ManagerFormButtonGroup,
  },
  props: {
    // 整个JSON对象，包含：dataOptions、editorOptions、dataListOptions
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    select: {
      type: Object,
      default: () => {
        return {};
      },
    },
    configType: {
      type: String,
      default: null,
    },
    detailFields: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 主表字段
    fieldComponents: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      selectWidget: this.select,
    };
  },
  computed: {
    currentConfigType: {
      get: function () {
        return this.configType;
      },
      set: function (val) {
        this.$emit('update:configType', val);
      },
    },
    // 当前选中明细列表
    currentDetailFields: {
      get: function () {
        return this.detailFields;
      },
      set: function (val) {
        this.$emit('update:detailFields', val);
      },
    },
  },
  watch: {
    select(val) {
      this.selectWidget = val;
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val);
      },
      deep: true,
    },
  },
  methods: {
    handleMoveEnd({ newIndex, oldIndex }) {
      // console.log('index', newIndex, oldIndex)
    },
    handleMoveStart({ oldIndex }) {
      // console.log("start", oldIndex, this.basicComponents);
    },
    handleSelectWidget(index) {
      // console.log(index, '#####')
      this.selectWidget = this.data.dataListOptions.fields[index];
      this.currentConfigType = 'WidgetConfig';
    },
    handleWidgetAdd(evt) {
      const newIndex = evt.newIndex;
      // console.log(to)

      // 为拖拽到容器的元素添加唯一 key
      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999);
      this.$set(this.data.dataListOptions.fields, newIndex, {
        ...this.data.dataListOptions.fields[newIndex],
        options: {
          ...this.data.dataListOptions.fields[newIndex].options,
        },
        key,
        rules: [],
      });
      delete this.data.dataListOptions.fields[newIndex].icon;

      if (this.data.dataListOptions.fields[newIndex].type === 'radio' || this.data.dataListOptions.fields[newIndex].type === 'checkbox') {
        this.$set(this.data.dataListOptions.fields, newIndex, {
          ...this.data.dataListOptions.fields[newIndex],
          options: {
            ...this.data.dataListOptions.fields[newIndex].options,
            options: this.data.dataListOptions.fields[newIndex].options.options.map((item) => ({
              ...item,
            })),
          },
        });
      } else if (this.data.dataListOptions.fields[newIndex].type === 'detail-grid') {
        this.data.dataListOptions.fields[newIndex].subTableName = null; // 关联子表
        this.$set(this.data.dataListOptions.fields[newIndex], 'buttons', [
          {
            type: 'button-group',
            label: '按钮组',
            buttons: [
              {
                type: 'button',
                label: '新建',
                options: {
                  icon: 'el-icon-plus',
                  type: 'primary',
                  authNode: 'detailAdd',
                },
                key: 'detail_add',
              },
              {
                type: 'button',
                label: '删除',
                options: {
                  icon: 'yrt-shanchu2',
                  type: 'primary',
                  authNode: 'detailDelete',
                },
                key: 'detail_delete',
              },
            ],
            options: {
              icon: 'icon-anniuzu',
            },
          },
        ]);

        // delete this.data.dataListOptions.fields[newIndex].options;
        delete this.data.dataListOptions.fields[newIndex].rules;
      } else if (this.data.dataListOptions.fields[newIndex].type === 'grid') {
        this.$set(this.data.dataListOptions.fields, newIndex, {
          ...this.data.dataListOptions.fields[newIndex],
          columns: this.data.dataListOptions.fields[newIndex].columns.map((item) => ({ ...item })),
        });
        delete this.data.dataListOptions.fields[newIndex].rules;
      }

      this.currentConfigType = 'WidgetConfig';
      this.selectWidget = this.data.dataListOptions.fields[newIndex];
    },
    handleWidgetColAdd($event, row, colIndex) {
      // console.log('coladd', $event, row, colIndex)
      const newIndex = $event.newIndex;
      const oldIndex = $event.oldIndex;
      const item = $event.item;

      // 防止布局元素的嵌套拖拽
      if (item.className.indexOf('data-grid') >= 0) {
        // 如果是列表中拖拽的元素需要还原到原来位置
        item.tagName === 'DIV' && this.data.dataListOptions.fields.splice(oldIndex, 0, row.columns[colIndex].fields[newIndex]);

        row.columns[colIndex].fields.splice(newIndex, 1);

        return false;
      }

      // console.log('from', item)

      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999);

      this.$set(row.columns[colIndex].fields, newIndex, {
        ...row.columns[colIndex].fields[newIndex],
        options: {
          ...row.columns[colIndex].fields[newIndex].options,
        },
        key,
        // 绑定键值
        model: row.columns[colIndex].fields[newIndex].type + '_' + key,
        rules: [],
      });

      if (row.columns[colIndex].fields[newIndex].type === 'radio' || row.columns[colIndex].fields[newIndex].type === 'checkbox') {
        this.$set(row.columns[colIndex].fields, newIndex, {
          ...row.columns[colIndex].fields[newIndex],
          options: {
            ...row.columns[colIndex].fields[newIndex].options,
            options: row.columns[colIndex].fields[newIndex].options.options.map((item) => ({
              ...item,
            })),
          },
        });
      }
      delete row.columns[colIndex].fields[newIndex].icon;

      this.currentConfigType = 'WidgetConfig';
      this.selectWidget = row.columns[colIndex].fields[newIndex];
    },
    handleWidgetDelete(index) {
      if (this.data.dataListOptions.fields.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {};
        } else {
          this.selectWidget = this.data.dataListOptions.fields[index - 1];
        }
      } else {
        this.selectWidget = this.data.dataListOptions.fields[index + 1];
      }

      this.$nextTick(() => {
        this.data.dataListOptions.fields.splice(index, 1);
      });
    },
    // 行内布局
    handleWidgetInlineAdd($event, row) {
      // console.log('coladd', $event, row, colIndex)
      const newIndex = $event.newIndex;
      const oldIndex = $event.oldIndex;
      const item = $event.item;

      // 防止布局元素的嵌套拖拽
      if (item.className.indexOf('inline-group') >= 0) {
        // 如果是列表中拖拽的元素需要还原到原来位置
        item.tagName === 'DIV' && this.data.dataListOptions.fields.splice(oldIndex, 0, row.fields[newIndex]);

        row.fields.splice(newIndex, 1);

        return false;
      }

      // console.log('from', item)

      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999);

      this.$set(row.fields, newIndex, {
        ...row.fields[newIndex],
        options: {
          ...row.fields[newIndex].options,
        },
        key,
        rules: [],
      });

      if (row.fields[newIndex].type === 'radio' || row.fields[newIndex].type === 'checkbox') {
        this.$set(row.fields, newIndex, {
          ...row.fields[newIndex],
          options: {
            ...row.fields[newIndex].options,
            options: row.fields[newIndex].options.options.map((item) => ({
              ...item,
            })),
          },
        });
      }
      delete row.fields[newIndex].icon;

      this.currentConfigType = 'WidgetConfig';
      this.selectWidget = row.fields[newIndex];
    },
    // 明细布局
    handleWidgetDetailAdd($event, row) {
      // console.log('coladd', $event, row, colIndex)
      const newIndex = $event.newIndex;
      const oldIndex = $event.oldIndex;
      const item = $event.item;

      // 防止布局元素的嵌套拖拽
      if (item.className.indexOf('detail-grid') >= 0) {
        // 如果是列表中拖拽的元素需要还原到原来位置
        item.tagName === 'DIV' && this.data.dataListOptions.fields.splice(oldIndex, 0, row.fields[newIndex]);

        row.fields.splice(newIndex, 1);

        return false;
      }

      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999);

      var field = row.fields[newIndex];
      this.$set(row.fields, newIndex, {
        prop: field.options.prop,
        label: field.label,
        dataType: field.options.dataType,
        sortable: false,
        hidden: false,
        isQuickSearch: false,
        key,
        headerAlign: 'center',
        align: 'left',
      });

      if (row.fields[newIndex].type === 'radio' || row.fields[newIndex].type === 'checkbox') {
        this.$set(row.fields, newIndex, {
          ...row.fields[newIndex],
          options: {
            ...row.fields[newIndex].options,
            options: row.fields[newIndex].options.options.map((item) => ({
              ...item,
            })),
          },
        });
      }
      delete row.fields[newIndex].icon;

      this.currentConfigType = 'ManagerConfig';
      this.selectWidget = row.fields[newIndex];
    },
    // 显示明细字段列表
    showDetailField() {
      if (!this.selectWidget.subTableName) {
        this.$message.warning('请设置关联子表名称');
        return;
      }
      this.loadModuleFields();
    },
    // 加载模块字段
    loadModuleFields() {
      var the = this;
      var where = { tableView: this.selectWidget.subTableName };

      var url = '/api/common/loadDataList';
      var params = {
        openNodeApi: true,
        folder: 'sys/core',
        projectName: 'Rattan.Sys',
        tableView: 'Sys_MvcTableColumn',
        idField: 'columnID',
        idValue: 0,
        menuId: 6,
        pageIndex: 1,
        pageSize: 1000,
        total: 0,
        where: where,
        orderBy: { orderNo: 'DESC', columnID: 'ASC' },
      };

      the.common.ajax(
        url,
        params,
        (res) => {
          if (res.result) {
            var fields = res.data.rows.map((item, index, arr) => {
              var field = {
                type: 'input',
                label: item.columnComment,
                icon: 'yrt-danhangshurukuang',
                options: {
                  prop: the.common.caseStyle(item.columnName),
                  width: '100%',
                  noLabel: false,
                  defaultValue: '',
                  required: false,
                  dataType: item.dataType.toLowerCase(),
                  pattern: '',
                  placeholder: '',
                },
              };
              return field;
            });
            the.currentDetailFields = fields;
            // 找到明细主键
            var keyField = res.data.rows.find((item) => {
              return item.fieldAttribute === 'Key';
            });
            if (keyField) {
              this.$set(this.selectWidget.options, 'idField', the.common.caseStyle(keyField.columnName));
            }
          } else {
            the.$message({
              showClose: true,
              duration: 6000,
              message: res.Msg,
              type: 'error',
            });
          }
        },
        true
      );
    },
    // 下来选择器参数
    selectOptions(newField, dropdownId, keyProp) {
      const randNum = Math.ceil(Math.random() * 99999);
      const key = Date.parse(new Date()) + '_' + randNum;
      const params = {
        type: 'select',
        label: newField.label,
        options: {
          width: '280px',
          defaultValue: '',
          multiple: false,
          disabled: false,
          clearable: false,
          placeholder: '',
          required: false,
          showLabel: true,
          noLabel: false,
          options: [
            {
              value: '下拉框1',
            },
            {
              value: '下拉框2',
            },
            {
              value: '下拉框3',
            },
          ],
          remote: 'bindDropdown',
          remoteOptions: [],
          dropdownId: dropdownId,
          props: {
            value: 'value',
            label: 'label',
          },
          prop: newField.options.prop,
          dataType: newField.options.dataType,
        },
        key: key,
      };
      if (keyProp) {
        params.options.keyProp = keyProp;
      }
      return params;
    },
    // 向fields集合中添加字段
    addField(fields, field, width) {
      const newIndex = fields.length;
      // 为拖拽到容器的元素添加唯一 key
      const randNum = Math.ceil(Math.random() * 99999);
      const key = Date.parse(new Date()) + '_' + randNum;
      this.$set(fields, newIndex, {
        ...field,
        options: {
          ...field.options,
        },
        key,
        rules: [],
      });

      var newField = fields[newIndex];
      switch (newField.options.dataType) {
        case 'datetime':
          newField.type = 'date';
          break;
      }
      switch (newField.options.prop) {
        case 'enable':
          fields[newIndex] = {
            type: 'switch',
            label: newField.label,
            options: {
              defaultValue: false,
              required: false,
              disabled: false,
              noLabel: false,
              prop: newField.options.label,
              dataType: newField.options.dataType,
              'active-value': 1,
              'inactive-value': 0,
            },
            key: key,
          };
          break;
        case 'userTrueName':
          fields[newIndex] = this.selectOptions(newField, 22, 'user_Id');
          break;
        case 'consignorName':
          fields[newIndex] = this.selectOptions(newField, 797, 'consignor_Id');
          break;
        case 'storageName':
          fields[newIndex] = this.selectOptions(newField, 31, 'storage_Id');
          break;
        case 'expressCorpName':
          fields[newIndex] = this.selectOptions(newField, 568, 'expressCorp_Id');
          break;
        case 'expressCorpType':
          fields[newIndex] = this.selectOptions(newField, 502, null);
          break;
        case 'creator':
        case 'createDate':
        case 'modifier':
        case 'modifyDate':
          newField.options.readonly = true;
          break;
        case 'remark':
          fields[newIndex].type = 'textarea';
          fields[newIndex].options.width = '420px';
          break;
      }
      if (fields[newIndex].type !== 'switch') {
        fields[newIndex].options.width = width || '100%';
      }
      delete fields[newIndex].icon;
    },
    // 添加单列模式
    addCol() {
      this.data.dataListOptions.fields = [];
      const fields = this.data.dataListOptions.fields;
      this.fieldComponents
        .filter((field) => {
          return !field.options.prop.endsWith('Id') && !field.options.prop.endsWith('ID') && !field.options.prop.endsWith('Plat');
        })
        .forEach((field, index) => {
          this.addField(fields, field, '280px');
        });

      // 选中第一个
      this.currentConfigType = 'WidgetConfig';
      this.selectWidget = this.data.dataListOptions.fields[0];
      this.data.dataListOptions.config.width = '800px';
    },
    // 添加多列模式
    addCols(colCount) {
      this.data.dataListOptions.fields = [];
      const newIndex = this.data.dataListOptions.fields.length;
      // 为拖拽到容器的元素添加唯一 key
      const randNum = Math.ceil(Math.random() * 99999);
      const key = Date.parse(new Date()) + '_' + randNum;
      this.$set(this.data.dataListOptions.fields, newIndex, {
        type: 'grid',
        label: '栅格布局',
        columns: [],
        options: {
          gutter: 0,
          justify: 'start',
          align: 'top',
        },
        key: key,
      });
      let colIndex = 0;
      const span = 24 / colCount;
      while (colIndex < colCount) {
        this.data.dataListOptions.fields[0].columns.push({
          span: span,
          fields: [],
        });
        colIndex++;
      }
      this.fieldComponents
        .filter((field) => {
          return !field.options.prop.endsWith('Id') && !field.options.prop.endsWith('ID') && !field.options.prop.endsWith('Plat');
        })
        .forEach((field, index) => {
          colIndex = index % colCount;
          const col = this.data.dataListOptions.fields[0].columns[colIndex];
          this.addField(col.fields, field);
        });

      // 选中第一个
      this.currentConfigType = 'WidgetConfig';
      const col0 = this.data.dataListOptions.fields[0].columns[0];
      this.selectWidget = col0.fields[0];

      // 三列时，弹出窗口设为1100px宽度
      if (colCount === 3) {
        this.data.dataListOptions.config.width = '1100px';
      } else {
        this.data.dataListOptions.config.width = '800px';
      }
    },
    // 清空全部列表字段
    btnClearAll() {
      this.$confirm('确定要全部列表字段, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.data.dataListOptions.fields = [];
          this.selectWidget = null;
          this.$message.error('清空完毕');
        })
        .catch(() => {
          this.$message.info('已取消');
        });
    },
  },
};
</script>
