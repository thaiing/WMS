<template>
  <div v-if="show">
    <el-form label-position="top" class="widget-config">
      <template v-if="['button', 'button-dropdown'].indexOf(data.type) >= 0">
        <el-form-item label="按钮名称">
          <el-input v-model="data.label" type="primary" link></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <icon-selector v-model="data.options.icon" />
        </el-form-item>
        <el-form-item label="权限点名称">
          <el-input v-model="data.options.authNode" type="primary" link></el-input>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="按钮类型">
              <el-select v-model="data.options.type">
                <el-option value="default">default</el-option>
                <el-option value="primary">primary</el-option>
                <el-option value="success">success</el-option>
                <el-option value="warning">warning</el-option>
                <el-option value="danger">danger</el-option>
                <el-option value="info">info</el-option>
                <el-option value="text">text</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="朴素">
              <el-switch v-model="data.options.plain"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="data.options.authNode && data.options.authNode.toLowerCase().indexOf('print') >= 0" :gutter="10">
          <el-col :span="24">
            <el-form-item label="baskReport打印连接(填写JSON格式)">
              <el-input v-model="data.options.baskReportUrl" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="data.options.authNode && data.options.authNode.toLowerCase().indexOf('import') >= 0" :gutter="10">
          <el-col :span="12">
            <el-form-item label="关联导入模板ID">
              <el-input v-model.number="data.options.importId" controls-position="right"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="data.options.authNode && data.options.authNode.toLowerCase().indexOf('export') >= 0" :gutter="10">
          <el-col :span="12">
            <el-form-item label="关联导出模板ID">
              <el-input v-model.number="data.options.exportId" controls-position="right"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="data.type === 'button-dropdown'" :gutter="10">
          <el-col :span="24">
            <el-form-item label="下拉框项">
              <draggable :list="data.options.options" item-key="label" :group="{ name: 'options' }" ghost-class="ghost" handle=".drag-item" tag="ul">
                <template #item="{ element, index }">
                  <li>
                    <el-input v-model="element.label" style="width: 110px" size="small" placeholder="按钮名称"></el-input>
                    <el-input v-model="element.authNode" style="width: 90px" size="small" placeholder="动作名称"></el-input>
                    <i class="drag-item yrt-yidong1" style="font-size: 16px; margin: 0 5px; cursor: move"></i>
                    <el-button circle plain type="danger" size="small" icon="el-icon-minus" style="padding: 4px; margin-left: 5px" @click="handleOptionsRemove(index)"></el-button>
                  </li>
                </template>
              </draggable>
              <div style="margin-left: 22px">
                <el-button type="primary" link @click="data.options.options.push({ label: null, authNode: null })">添加选项</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="key">
          <el-input v-model="data.key" type="primary" link></el-input>
        </el-form-item>
      </template>
      <template v-if="['button-group'].indexOf(data.type) >= 0">
        <el-form-item label="按钮分组名称">
          <el-input v-model="data.label" type="primary" link></el-input>
        </el-form-item>
        <el-form-item label="包含按钮数"> {{ data.buttons.length }} 个 </el-form-item>
      </template>

      <template v-if="data.type == 'grid'">
        <el-row v-if="dataOptions.isPDA" :gutter="3">
          <el-col :span="12">
            <el-form-item label="详情主表数据">
              <el-switch v-model="data.isMain"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="栅格间隔">
          <el-input v-model.number="data.options.gutter" type="number"></el-input>
        </el-form-item>
        <el-form-item label="tab分组名">
          <el-input v-model="data.tabGroupName"></el-input>
        </el-form-item>
        <el-form-item label="列配置项">
          <draggable :list="data.columns" item-key="index" :group="{ name: 'options' }" ghost-class="ghost" handle=".drag-item" tag="ul">
            <template #item="{ element, index }">
              <li>
                <i class="drag-item yrt-yidong1" style="font-size: 16px; margin: 0 5px; cursor: move"></i>
                <el-input v-model.number="element.span" placeholder="栅格值" size="small" style="width: 100px" type="number"></el-input>
                <el-button circle plain type="danger" size="small" icon="minus" style="padding: 4px; margin-left: 5px" @click="handleOptionsRemove(index)"></el-button>
              </li>
            </template>
          </draggable>
          <div style="margin-left: 22px">
            <el-button type="primary" link @click="handleAddColumn">添加列</el-button>
          </div>
        </el-form-item>
        <el-form-item label="水平排列方式">
          <el-select v-model="data.options.justify">
            <el-option value="start" label="左对齐"></el-option>
            <el-option value="end" label="右对齐"></el-option>
            <el-option value="center" label="居中"></el-option>
            <el-option value="space-around" label="两侧间隔相等"></el-option>
            <el-option value="space-between" label="两端对齐"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="垂直排列方式">
          <el-select v-model="data.options.align">
            <el-option value="top" label="顶部对齐"></el-option>
            <el-option value="middle" label="居中"></el-option>
            <el-option value="bottom" label="底部对齐"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template v-if="data.type == 'detail-grid'">
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="标题名称">
              <el-input v-model="data.options.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件夹名">
              <el-input v-model="data.folder"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="关联子表名" required>
              <el-input v-model="data.subTableName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子表主键字段名" required>
              <el-input v-model="data.options.idField"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="24">
            <el-form-item label="子表路由前缀" required>
              <el-input v-model="data.options.prefixRouter"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="6">
            <el-form-item label="分页大小">
              <el-input v-model.number="data.options.pageSize"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="子表排序方式">
              <el-input v-model="orderBy"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="固定条件">
          <el-input v-model="currentFixedWhere" :rows="3" type="textarea"></el-input>
        </el-form-item>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="是否带有纵向边框">
              <el-switch v-model="data.options.border"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示求和行">
              <el-switch v-model="data.options.showSumField" active-text="是" inactive-text="否"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="表格尺寸">
              <el-select v-model="data.options.size">
                <el-option value="large">large</el-option>
                <el-option value="default">default</el-option>
                <el-option value="small">small</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="虚拟明细">
              <el-switch v-model="data.options.isVirtual" active-text="是" inactive-text="否"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="隐藏明细">
              <el-switch v-model="data.options.isHidden" active-text="是" inactive-text="否"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示展开行">
              <el-switch v-model="data.options.showExpandRow" active-text="是" inactive-text="否"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="表格最大高度">
          <el-input v-model.number="data.options['max-height']">
            <template slot="append">px</template>
          </el-input>
        </el-form-item>
        <el-form-item label="默认打开页面索引(默认为1)">
          <el-input v-model.number="data.options.pageIndex"></el-input>
        </el-form-item>
        <el-form-item label="tab分组名">
          <el-input v-model="data.tabGroupName"></el-input>
        </el-form-item>
      </template>
      <template v-if="data.type == 'inline-group'">
        <el-form-item label="标题">
          <el-input v-model="data.label"></el-input>
        </el-form-item>
        <el-form-item label="tab分组名">
          <el-input v-model="data.tabGroupName"></el-input>
        </el-form-item>
      </template>
      <template v-if="data.type == 'splitter-group'">
        <el-form-item label="标题">
          <el-input v-model="data.label"></el-input>
        </el-form-item>
        <el-form-item label="tab分组名">
          <el-input v-model="data.tabGroupName"></el-input>
        </el-form-item>
      </template>
      <template v-if="isFieldType(data.type)">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item v-if="isFieldType(data.type)" label="标题">
              <el-input v-model="data.label"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="绑定字段">
              <el-input v-model="data.options.prop"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="isFieldType(data.type)" :gutter="3">
          <el-col :span="12">
            <el-form-item label="输入框类型">
              <el-select v-model="data.type" placeholder="请选择" @change="($event) => dataTypeChange($event, data)">
                <el-option v-for="(item, index) in _basicComponents" :key="index" :label="item.label" :value="item.type"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据类型">
              <el-select v-model="data.options.dataType" placeholder="请选择">
                <el-option v-for="(item, index) in state.dataTypeList" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="isFieldType(data.type)" :gutter="3">
          <el-col :span="12">
            <el-form-item label="是否只读">
              <el-switch v-model="data.options.readonly" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="isFieldType(data.type) && data.options" label="显示标题">
              <el-switch v-model="data.options.noLabel" :active-value="false" :inactive-value="true"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <template v-if="data.type === 'table-select'">
          <el-row>
            <el-col :span="24">
              <el-form-item label="接口地址">
                <el-input v-model="data.options.url"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="查询字段">
                <el-input v-model="data.options.searchFields" :rows="2" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="表格字段定义">
                <el-row v-for="(item, index) in data.options.columns" :key="index">
                  <el-col :span="11">
                    <el-input v-model="item.prop" placeholder="字段英文名" class="col-param"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="item.label" placeholder="字段中文名" class="col-param"></el-input>
                  </el-col>
                  <el-col :span="5">
                    <el-input v-model.number="item.width" placeholder="宽度" class="col-param"></el-input>
                  </el-col>
                </el-row>
                <el-button type="primary" link @click="(e) => data.options.columns.push({})">添加字段</el-button>
                <el-button type="primary" link @click="(e) => data.options.columns.pop()">删除字段</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="3">
            <el-col :span="12">
              <el-form-item label="下拉框宽度">
                <el-input v-model="data.options.popoverWidth"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下拉框主键字段">
                <el-input v-model="data.options.keyProp"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-if="data.type === 'input-select'">
          <el-row>
            <el-col :span="24">
              <el-form-item label="接口地址">
                <el-input v-model="data.options.url"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="查询字段">
                <el-input v-model="data.options.searchFields" :rows="2" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="value字段">
                <el-input v-model="data.options.valueField"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="label字段">
                <el-input v-model="data.options.labelField"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <el-row v-if="Object.keys(data.options).indexOf('width') >= 0" :gutter="3">
          <el-col :span="12">
            <el-form-item label="输入框宽度">
              <el-input v-model="data.options.width"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="占位内容">
              <el-input v-model="data.options.placeholder"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="!dataOptions.isPDA && Object.keys(data.options).indexOf('styles') >= 0" :gutter="3">
          <el-col :span="12">
            <el-form-item label="字体大小">
              <el-input-number v-model.number="data.options.styles.fontSize" :min="0" :step="1" controls-position="right" class="w-110"></el-input-number>
              px
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行高">
              <el-input-number v-model.number="data.options.styles.lineHeight" :min="0" :step="1" controls-position="right" class="w-110"></el-input-number>
              px
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="!dataOptions.isPDA" :gutter="3">
          <el-col :span="12">
            <el-form-item label="标题宽度">
              <el-input-number v-model.number="data.options['label-width']" :min="0" :step="1" controls-position="right" class="w-120"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="无外边距">
              <el-switch v-model="data.options.noMargin"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-if="Object.keys(data.options).indexOf('size') >= 0" label="大小">
          宽度：
          <el-input v-model.number="data.options.size.width" style="width: 70px" type="number"></el-input>
          高度：
          <el-input v-model.number="data.options.size.height" style="width: 70px" type="number"></el-input>
        </el-form-item>

        <el-form-item v-if="Object.keys(data.options).indexOf('inline') >= 0" label="布局方式">
          <el-radio-group v-model="data.options.inline">
            <el-radio-button :label="false">块级</el-radio-button>
            <el-radio-button :label="true">行内</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="Object.keys(data.options).indexOf('showInput') >= 0" label="显示输入框">
          <el-switch v-model="data.options.showInput"></el-switch>
        </el-form-item>

        <el-row v-if="data.type == 'upload-image'" :gutter="3">
          <el-col :span="24">
            <el-form-item label="服务器地址">
              <el-input v-model="data.options.serverAction"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="data.type == 'upload-image'">
          <el-row :gutter="3">
            <el-col :span="12">
              <el-form-item label="是否多图">
                <el-switch v-model="data.options.multiple"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上次最大数">
                <el-input-number v-model="data.options.max" :min="0" :max="10" :step="1" controls-position="right" class="w-120"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="3">
            <el-col :span="12">
              <el-form-item label="文件列表类型">
                <el-select v-model="data.options.listType" placeholder="请选择">
                  <el-option label="picture-card" value="picture-card"></el-option>
                  <el-option label="picture" value="picture"></el-option>
                  <el-option label="text" value="text"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="隐藏标准列表">
                <el-switch v-model="data.options.hiddenFileList"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="3">
            <el-col :span="24">
              <el-form-item label="文件类型">
                <el-select v-model="data.options.acceptList" multiple clearable filterable allow-create default-first-option placeholder="请选择" class="w-100pc">
                  <template v-for="(item, index) in acceptList">
                    <el-option :label="'.' + item" :value="'.' + item"></el-option>
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <el-row v-if="data.type == 'select' || data.type == 'tree'" :gutter="3">
          <el-col :span="24">
            <el-form-item label="下拉框主键字段">
              <el-input v-model="data.options.keyProp"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="data.type == 'select' || data.type == 'tree'" :gutter="3">
          <el-col :span="12">
            <el-form-item label="是否多选">
              <el-switch v-model="data.options.multiple" @change="handleSelectMuliple"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数组提交">
              <el-switch v-model="data.options.arraySubmit"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-if="Object.keys(data.options).indexOf('allowHalf') >= 0" label="允许半选">
          <el-switch v-model="data.options.allowHalf"></el-switch>
        </el-form-item>
        <el-form-item v-if="Object.keys(data.options).indexOf('showAlpha') >= 0" label="支持透明度选择">
          <el-switch v-model="data.options.showAlpha"></el-switch>
        </el-form-item>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item v-if="Object.keys(data.options).indexOf('showLabel') >= 0" label="是否显示标签">
              <el-switch v-model="data.options.showLabel"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="data.type == 'tree'" label="仅选择叶节点">
              <el-switch v-model="data.options.onlySelectLeaf"></el-switch>
            </el-form-item>
            <el-form-item v-if="data.type == 'select'" label="可搜索">
              <el-switch v-model="data.options.filterable"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item v-if="data.type == 'select'" label="创建新条目">
              <el-switch v-model="data.options.allowCreate"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-if="Object.keys(data.options).indexOf('options') >= 0" label="数据翻译">
          <el-radio-group v-model="data.options.remote" size="small" style="margin-bottom: 10px">
            <el-radio-button :label="'bindDropdown'">下拉框ID</el-radio-button>
            <el-radio-button :label="false">静态数据</el-radio-button>
            <el-radio-button :label="true">远端数据</el-radio-button>
          </el-radio-group>
          <template v-if="data.options.remote === true">
            <div>
              <!-- <el-input v-model="data.options.remoteFunc" size="small" style="">
                <template slot="prepend">远端方法</template>
              </el-input> -->
              <el-input v-model="data.options.props.value" size="small" style="">
                <template #prepend>值</template>
              </el-input>
              <el-input v-model="data.options.props.label" size="small" style="">
                <template #prepend>标签</template>
              </el-input>
            </div>
          </template>
          <template v-else-if="data.options.remote === 'bindDropdown'">
            <el-input v-model.number="data.options.dropdownId" type="number" size="small">
              <template #prepend>关联下拉框ID</template>
            </el-input>
          </template>
          <template v-else>
            <template v-if="['radio', 'static'].some((s) => s === data.type) || (data.type == 'select' && !data.options.multiple)">
              <el-radio-group v-model="data.options.defaultValue">
                <draggable :list="data.options.options" item-key="value" :group="{ name: 'options' }" ghostClass="ghost" handle=".drag-item" tag="ul">
                  <template #item="{ element, index }">
                    <li>
                      <el-radio :label="element.value" style="margin-right: 5px">
                        <el-input v-model="element.value" style="width: 90px" size="small"></el-input>
                        <el-input v-model="element.label" style="width: 90px" size="small"></el-input>
                        <!-- <input v-model="item.value"/> -->
                      </el-radio>
                      <i class="drag-item yrt-yidong1" style="font-size: 16px; margin: 0 5px; cursor: move"></i>
                      <el-button circle plain type="danger" size="small" icon="el-icon-minus" style="padding: 4px; margin-left: 5px" @click="handleOptionsRemove(index)"></el-button>
                    </li>
                  </template>
                </draggable>
              </el-radio-group>
            </template>

            <template v-if="data.type == 'checkbox' || (data.type == 'select' && data.options.multiple)">
              <el-checkbox-group v-model="data.options.defaultValue">
                <draggable :list="data.options.options" item-key="value" :group="{ name: 'options' }" ghostClass="ghost" handle=".drag-item" tag="ul">
                  <template #item="{ element, index }">
                    <li>
                      <el-checkbox :label="element.value" style="margin-right: 5px">
                        <el-input v-model="element.value" :style="{ width: data.options.showLabel ? '90px' : '190px' }" size="small"></el-input>
                        <el-input v-if="data.options.showLabel" v-model="element.label" style="width: 100px" size="small"></el-input>
                      </el-checkbox>
                      <i class="drag-item yrt-yidong1" style="font-size: 16px; margin: 0 5px; cursor: move"></i>
                      <el-button circle plain type="danger" size="small" icon="el-icon-minus" style="padding: 4px; margin-left: 5px" @click="handleOptionsRemove(index)"></el-button>
                    </li>
                  </template>
                </draggable>
              </el-checkbox-group>
            </template>
            <div style="margin-left: 22px">
              <el-button type="primary" link @click="handleAddOption">添加选项</el-button>
            </div>
          </template>
        </el-form-item>

        <el-form-item v-if="Object.keys(data.options).indexOf('defaultValue') >= 0 && ['textarea', 'input', 'rate', 'color', 'switch', 'radio', 'tree', 'date', 'datetime', 'select'].indexOf(data.type) >= 0" label="默认值">
          <el-input v-if="data.type == 'textarea'" v-model="data.options.defaultValue" :rows="5" type="textarea"></el-input>
          <template v-if="['input', 'radio', 'switch', 'tree', 'date', 'datetime', 'select'].indexOf(data.type) >= 0">
            <el-input v-if="['byte', 'integer', 'long', 'double', 'bigDecimal'].indexOf(data.options.dataType) >= 0" v-model.number="data.options.defaultValue"></el-input>
            <el-input v-else v-model="data.options.defaultValue"></el-input>
          </template>
          <el-rate v-if="data.type == 'rate'" v-model="data.options.defaultValue" :max="data.options.max" :allow-half="data.options.allowHalf" style="display: inline-block; vertical-align: middle"></el-rate>
          <el-button v-if="data.type == 'rate'" type="primary" link style="display: inline-block; vertical-align: middle; margin-left: 10px" @click="data.options.defaultValue = 0">清空</el-button>
          <el-color-picker v-if="data.type == 'color'" v-model="data.options.defaultValue" :show-alpha="data.options.showAlpha"></el-color-picker>
        </el-form-item>
        <template v-if="['date', 'datetime'].indexOf(data.options.dataType) >= 0">
          <el-row :gutter="3">
            <el-col :span="8">
              <el-form-item label="显示类型">
                <el-select v-model="data.options.type">
                  <el-option value="year"></el-option>
                  <el-option value="month"></el-option>
                  <el-option value="date"></el-option>
                  <el-option value="dates"></el-option>
                  <!-- <el-option value="week"></el-option> -->
                  <el-option value="datetime"></el-option>
                  <el-option value="datetimerange"></el-option>
                  <el-option value="daterange"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="格式">
                <el-select v-model="data.options.formatter">
                  <el-option label="[清空]" value=""></el-option>
                  <el-option label="YYYY-MM" value="YYYY-MM"></el-option>
                  <el-option label="YYYY-MM-DD" value="YYYY-MM-DD"></el-option>
                  <el-option label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-DD HH:mm:ss"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="data.type === 'time'" :gutter="10">
            <el-col :span="12">
              <el-form-item label="范围选择">
                <el-switch v-model="data.options.isRange"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="固定时间选择模式">
                <el-switch v-model="data.options.fixedTimeSelect"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item v-if="data.type == 'date'" label="是否获取时间戳">
            <el-switch v-model="data.options.timestamp"></el-switch>
          </el-form-item>
          <el-form-item v-if="data.options.isRange || data.options.type == 'datetimerange' || data.options.type == 'daterange'" label="结束时间占位内容">
            <el-input v-model="data.options.endPlaceholder"></el-input>
          </el-form-item>
          <el-row v-if="data.type === 'time'" :gutter="10">
            <el-col :span="8">
              <el-form-item label="开始时间">
                <el-input v-model="data.options.start"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结束时间">
                <el-input v-model="data.options.end"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="步长">
                <el-input v-model="data.options.step"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="data.type == 'time' && Object.keys(data.options).indexOf('isRange') >= 0" label="默认值">
            <el-time-picker v-if="!data.options.isRange" key="1" v-model="data.options.defaultValue" :arrow-control="data.options.arrowControl" :value-format="data.options.format" style="width: 100%"></el-time-picker>
            <el-time-picker v-if="data.options.isRange" key="2" v-model="data.options.defaultValue" :arrow-control="data.options.arrowControl" :value-format="data.options.format" is-range style="width: 100%"></el-time-picker>
          </el-form-item>
        </template>

        <template v-if="data.type == 'imgupload'">
          <el-form-item label="最大上传数">
            <el-input v-model.number="data.options.length" type="number"></el-input>
          </el-form-item>
          <el-form-item :required="true" label="Domain">
            <el-input v-model="data.options.domain"></el-input>
          </el-form-item>
          <el-form-item :required="true" label="获取七牛Token方法">
            <el-input v-model="data.options.tokenFunc"></el-input>
          </el-form-item>
        </template>

        <template v-if="data.type == 'blank'">
          <el-form-item label="绑定数据类型">
            <el-select v-model="data.options.defaultType">
              <el-option value="String" label="字符"></el-option>
              <el-option value="Object" label="对象"></el-option>
              <el-option value="Array" label="数组"></el-option>
            </el-select>
          </el-form-item>
        </template>

        <el-form-item v-if="data.type == 'tree'" label="ajax请求参数">
          <el-input v-model="currentAjaxParams" :rows="3" type="textarea"></el-input>
        </el-form-item>

        <el-row v-if="['byte', 'integer', 'long', 'double', 'bigDecimal'].indexOf(data.options.dataType) >= 0" :gutter="3">
          <el-col :span="24">
            <el-form-item label="格式化">
              <el-select v-model="data.options.formatter">
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
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="输入值格式">
              <el-input v-model="data.options.valueFormatter"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="格式化取值">
              <el-input v-model="data.options.valueParser"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="数据绑定Key">
              <el-input v-model="data.key"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="扩展字段">
              <el-switch v-model="data.options.isExpandField"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-if="!dataOptions.isPDA" label="操作属性">
          <el-checkbox v-if="Object.keys(data.options).indexOf('readonly') >= 0" v-model="data.options.readonly">完全只读</el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('disabled') >= 0" v-model="data.options.disabled">禁用 </el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('editable') >= 0" v-model="data.options.editable">文本框可输入</el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('clearable') >= 0" v-model="data.options.clearable">显示清除按钮</el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('arrowControl') >= 0" v-model="data.options.arrowControl">使用箭头进行时间选择</el-checkbox>
        </el-form-item>
        <el-form-item label="校验">
          <div class="mr-10">
            <el-checkbox v-model="data.options.required">必填</el-checkbox>
            <el-checkbox v-model="data.options.hidden">隐藏</el-checkbox>
          </div>
          <el-select v-model="data.options.ruleType" size="small">
            <el-option value="string" label="字符串"></el-option>
            <el-option value="number" label="数字"></el-option>
            <el-option value="boolean" label="布尔值"></el-option>
            <el-option value="byte" label="byte"></el-option>
            <el-option value="integer" label="整数"></el-option>
            <el-option value="float" label="浮点数"></el-option>
            <el-option value="url" label="URL地址"></el-option>
            <el-option value="email" label="邮箱地址"></el-option>
            <el-option value="hex" label="十六进制"></el-option>
          </el-select>

          <div v-if="Object.keys(data.options).indexOf('pattern') >= 0">
            <el-input v-model.lazy="data.options.pattern" size="small" style="width: 240px" placeholder="填写正则表达式"></el-input>
          </div>
        </el-form-item>
        <template v-if="data.type == 'switch'">
          <el-row :gutter="3">
            <el-col :span="12">
              <el-form-item label="打开时的文字描述">
                <el-input v-model="data.options['active-text']"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="关闭时的文字描述">
                <el-input v-model="data.options['inactive-text']"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!--设置值-->
          <template v-if="['byte', 'integer', 'long', 'double', 'bigDecimal'].indexOf(data.options.dataType) >= 0">
            <el-row :gutter="3">
              <el-col :span="12">
                <el-form-item label="打开时的值number">
                  <el-input v-model.number="data.options['active-value']"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="关闭时的值number">
                  <el-input v-model.number="data.options['inactive-value']"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-else>
            <el-row :gutter="3">
              <el-col :span="12">
                <el-form-item label="打开时的值">
                  <el-input v-model="data.options['active-value']"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="关闭时的值">
                  <el-input v-model="data.options['inactive-value']"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </template>
        <el-form-item label="字段说明">
          <el-input v-model="data.options.remark" type="textarea"></el-input>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="widget-config">
import Draggable from 'vuedraggable';
// 引入图标组件
const IconSelector = defineAsyncComponent(() => import('/@/components/iconSelector/index.vue'));

import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
let iconPopover: any = ref(); // ref引用

//#region 定义父组件传过来的值
const props = defineProps({
  dataOptions: {
    type: Object,
    default: () => {
      return {};
    },
  },
  data: {
    type: Object,
    default: () => {
      return {};
    },
  },
  basicComponents: {
    type: Array,
    default: () => [],
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  // 验证规则
  validator: {
    type: null as any,
    required: null as any,
    pattern: null as any,
    range: null,
    length: null,
  } as Record<string, any>,
  // 非字段类型
  noFieldType: ['grid', 'detail-grid', 'inline-group', 'splitter-group', 'button', 'button-group'],
  // 数据类型
  dataTypeList: ['string', 'byte', 'integer', 'long', 'double', 'bigDecimal', 'boolean', 'date', 'datetime', 'time'],
  predefineColors: ['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585', 'rgba(255, 69, 0, 0.68)', 'rgb(255, 120, 0)', 'hsv(51, 100, 98)', 'hsva(120, 40, 94, 0.5)', 'hsl(181, 100%, 37%)', 'hsla(209, 100%, 56%, 0.73)', '#c7158577'],
  // 文件类型
  acceptFileList: ['jpeg', 'jpg', 'png', 'bmp', 'jfif', 'gif', 'xls', 'xlsx', 'doc', 'docx', 'pdf', 'zip', 'rar', 'mp3', 'mp4'],
  // 图片类型
  acceptImageList: ['jpeg', 'jpg', 'png', 'bmp', 'jfif', 'gif'],
});
//#endregion

//#region 计算属性
const show = computed(() => {
  if (props.data && Object.keys(props.data).length > 0) {
    return true;
  }
  return false;
});

// tree Ajax加载属性
const currentAjaxParams = computed({
  get: function () {
    var params = props.data.ajaxParams;
    if (params) {
      return JSON.stringify(params, null, 2);
    } else {
      return '';
    }
  },
  set: function (val) {
    try {
      props.data.ajaxParams = JSON.parse(val);
      proxy.$message.success('json格式正确');
    } catch (error: any) {
      proxy.$message.error('数据结构不正确，不是有效的json格式，' + error.message);
    }
  },
});

const _basicComponents = computed(() => {
  return props.basicComponents as Array<any>;
});

// 排序方式
const orderBy = computed({
  get: function () {
    return JSON.stringify(props.data.options.orderBy);
  },
  set: function (val) {
    try {
      const orderBy = JSON.parse(val);
      props.data.options.orderBy = orderBy;
      proxy.$message.success('列表排序方式格式正确');
    } catch (error) {
      proxy.$message.error('列表排序方式不是有效的JSON格式');
    }
  },
});

// fixedWhere JSON加载属性
const currentFixedWhere = computed({
  get: function () {
    var params = props.data.options.fixedWhere;
    if (params) {
      return JSON.stringify(params, null, 2);
    } else {
      return '';
    }
  },
  set: function (val) {
    try {
      props.data.options.fixedWhere = JSON.parse(val);
      proxy.$message.success('json格式正确');
    } catch (error: any) {
      proxy.$message.error('数据结构不正确，不是有效的json格式，' + error.message);
    }
  },
});

// 文件类型
const acceptList = computed(() => {
  if (props.data.options.listType === 'text') {
    return state.acceptFileList;
  } else {
    return state.acceptImageList;
  }
});
//#endregion

const generateRule = () => {
  props.data.rules = [];
  Object.keys(state.validator).forEach((key) => {
    if (state.validator[key]) {
      props.data.rules.push(state.validator[key]);
    }
  });
  if (!props.data.rules.length) {
    delete props.data.rules;
  }
};

//#region wacth
watch(
  () => props.data,
  (val, oldVal) => {
    if (JSON.stringify(val) === JSON.stringify(oldVal)) {
      return;
    }

    if (val && props.data.options) {
      // props.data.options.defaultValue = null;
      if (props.data.options.required) {
        state.validator.required = {
          required: true,
          message: `${props.data.label}必须填写`,
        };
      } else {
        state.validator.required = null;
      }

      let ruleType = props.data.options.ruleType;
      if (ruleType && ruleType !== 'string') {
        state.validator.type = {
          type: ruleType,
          message: props.data.label + '格式不正确',
        };
      } else {
        state.validator.type = null;
      }

      let pattern = props.data.options.pattern;
      var evil = function (fn: any) {
        // 一个变量指向Function，防止有些前端编译工具报错
        var Fn = Function;
        return new Fn('return ' + fn)();
      };
      if (pattern) {
        state.validator.pattern = {
          pattern: evil(val),
          message: props.data.label + '格式不匹配',
        };
      } else {
        state.validator.pattern = null;
      }

      generateRule();
    }
  },
  { deep: true, immediate: true }
);
//#endregion

// 判断是字段类型
const isFieldType = (type: any) => {
  return state.noFieldType.indexOf(type) < 0;
};

const handleOptionsRemove = (index: number) => {
  if (props.data.type === 'grid') {
    props.data.columns.splice(index, 1);
  } else {
    props.data.options.options.splice(index, 1);
  }
};

const handleAddOption = () => {
  if (props.data.options.showLabel) {
    props.data.options.options.push({
      value: '新选项',
      label: '新选项',
    });
  } else {
    props.data.options.options.push({
      value: '新选项',
    });
  }
};

const handleAddColumn = () => {
  props.data.columns.push({
    span: '',
    fields: [],
  });
};

const handleSelectMuliple = (value: any) => {
  if (value) {
    if (props.data.options.defaultValue) {
      props.data.options.defaultValue = [props.data.options.defaultValue];
    } else {
      props.data.options.defaultValue = [];
    }
  } else {
    if (props.data.options.defaultValue.length > 0) {
      props.data.options.defaultValue = props.data.options.defaultValue[0];
    } else {
      props.data.options.defaultValue = '';
    }
  }
};

// 编辑框类型改变
const dataTypeChange = (selectVal: any, data: any) => {
  const item = _basicComponents.value.find((item: any) => {
    return item.type === selectVal;
  });
  let customJson = {};
  // 表格下拉框时设置默认参数
  if (item.type === 'table-select') {
    // 仓库默认值
    if (data.options.prop === 'storageName') {
      customJson = {
        columns: [
          {
            prop: 'storageCode',
            label: '仓库编号',
            width: 100,
          },
          {
            prop: 'storageName',
            label: '仓库名称',
            width: 150,
          },
        ],
        url: '/basic/storage/storage/getList',
        searchFields: 'storageId,storageCode,storageName',
      };
    } else if (data.options.prop === 'consignorName') {
      // 货主默认值
      customJson = {
        columns: [
          {
            prop: 'consignorCode',
            label: '货主编号',
            width: 100,
          },
          {
            prop: 'consignorName',
            label: '货主名称',
            width: 150,
          },
        ],
        url: '/basic/base/consignor/getList',
        searchFields: 'consignorId,consignorCode,consignorName',
      };
    } else if (data.options.prop === 'productName') {
      // 商品默认值
      customJson = {
        columns: [
          {
            prop: 'productCode',
            label: '商品编号',
            width: 100,
          },
          {
            prop: 'productName',
            label: '商品名称',
            width: 150,
          },
        ],
        url: '/basic/product/product/getList',
        searchFields: 'productId,productCode,productModel,productName,productSpec',
      };
    } else if (data.options.prop === 'providerShortName') {
      // 供应商默认值
      customJson = {
        columns: [
          {
            prop: 'providerCode',
            label: '供应商编号',
            width: 100,
          },
          {
            prop: 'providerShortName',
            label: '供应商名称',
            width: 150,
          },
        ],
        url: '/basic/product/provider/getList',
        searchFields: 'providerId,providerCode,providerShortName,providerName',
      };
    } else if (data.options.prop === 'clientShortName') {
      // 客户默认值
      customJson = {
        columns: [
          {
            prop: 'clientCode',
            label: '客户编号',
            width: 100,
          },
          {
            prop: 'clientShortName',
            label: '客户名称',
            width: 150,
          },
        ],
        url: '/basic/client/client/getList',
        searchFields: 'clientId,clientCode,clientShortName,clientFullName',
      };
    }
  }
  const options = Object.assign(
    {},
    item.options,
    {
      prop: data.options.prop,
    },
    customJson
  );
  data.options = JSON.parse(JSON.stringify(options));
  data.options.popoverWidth = '300px';
  if (['date', 'datetime', 'time'].indexOf(item.type) >= 0) {
    data.options.dataType = item.type;
  } else {
    data.options.dataType = 'string';
  }
};
</script>

<style lang="scss" scoped>
.widget-config {
  .col-param {
    :deep(.el-input__inner) {
      padding: 0 5px;
    }
  }

  :deep(.el-input__inner) {
    padding: 0 5px;
  }

  :deep(.el-input-number .el-input__inner) {
    padding-left: 5px;
    padding-right: 40px;
  }

  :deep(.el-row) {
    margin-bottom: 3px;
  }

  :deep(.el-form-item) {
    margin-bottom: 5px !important;
  }

  :deep(.el-form-item__label) {
    margin-bottom: 0px !important;
    line-height: 22px !important;
    height: 22px !important;
    justify-content: flex-start;
  }
}
</style>
