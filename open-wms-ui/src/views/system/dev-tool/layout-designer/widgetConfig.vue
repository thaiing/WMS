<template>
  <div v-if="show">
    <el-form label-position="top" class="widget-config">
      <template v-if="['button', 'button-dropdown'].indexOf(data.type) >= 0">
        <el-form-item label="按钮名称">
          <el-input v-model="data.label" link></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="data.options.icon" link style="width: 68.5%"></el-input>

          <el-popover ref="icon-popover" placement="bottom" title="选择图标" width="1230" trigger="click" popper-class="select-icon">
            <el-button slot="reference" style="width: 30%" @click="selectIcon">选择</el-button>
            <el-scrollbar :noresize="false" :native="false" wrap-class="scrollbar-wrap">
              <keep-alive>
                <select-icon @onSelectIcon="(icon:any) =>onSelectIcon(icon)"></select-icon>
              </keep-alive>
            </el-scrollbar>
            <el-footer style="padding-top: 10px; border-top: 1px solid #f3f3f3; text-align: right">
              <!-- <el-button type="primary" @click="$refs['icon-popover'].doClose()">关闭</el-button> -->
            </el-footer>
          </el-popover>
        </el-form-item>
        <el-form-item label="权限点名称">
          <el-input v-model="data.options.authNode" link></el-input>
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
              <el-switch v-model="data.options.plain"> </el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="data.options.authNode && data.options.authNode.indexOf('import') >= 0" :gutter="10">
          <el-col :span="16">
            <el-form-item label="导入API地址">
              <el-input v-model="data.options.url" link></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="data.type === 'button-dropdown'" :gutter="10">
          <el-col :span="24">
            <el-form-item label="下拉框项">
              <draggable :list="data.options.options" :options="{ group: { name: 'options' }, ghostClass: 'ghost', handle: '.drag-item' }" tag="ul">
                <li v-for="(item, index) in data.options.options" :key="index">
                  <el-input v-model="item.label" style="width: 110px" size="default" placeholder="按钮名称"></el-input>
                  <el-input v-model="item.authNode" style="width: 90px" size="default" placeholder="动作名称"></el-input>
                  <i class="drag-item el-icon-yrt-yidong1" style="font-size: 16px; margin: 0 5px; cursor: move"></i>
                  <el-button circle plain type="danger" size="default" icon="el-icon-minus" style="padding: 4px; margin-left: 5px" @click="handleOptionsRemove(index)"></el-button>
                </li>
              </draggable>
              <div style="margin-left: 22px">
                <el-button link @click="data.options.options.push({ label: null, authNode: null })">添加选项</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="key">
          <el-input v-model="data.key" link></el-input>
        </el-form-item>
      </template>
      <template v-if="['button-group'].indexOf(data.type) >= 0">
        <el-form-item label="按钮分组名称">
          <el-input v-model="data.label" link></el-input>
        </el-form-item>
        <el-form-item label="包含按钮数"> {{ data.buttons.length }} 个 </el-form-item>
      </template>

      <template v-if="data.type == 'grid'">
        <el-form-item label="栅格间隔">
          <el-input v-model.number="data.options.gutter" type="number"></el-input>
        </el-form-item>
        <el-form-item label="列配置项">
          <draggable :list="data.columns" :options="{ group: { name: 'options' }, ghostClass: 'ghost', handle: '.drag-item' }" tag="ul">
            <li v-for="(item, index) in data.columns" :key="index">
              <i class="drag-item el-icon-yrt-yidong1" style="font-size: 16px; margin: 0 5px; cursor: move"></i>
              <el-input v-model.number="item.span" placeholder="栅格值" size="default" style="width: 100px" type="number"></el-input>
              <el-button circle plain type="danger" size="default" icon="el-icon-minus" style="padding: 4px; margin-left: 5px" @click="handleOptionsRemove(index)"></el-button>
            </li>
          </draggable>
          <div style="margin-left: 22px">
            <el-button link @click="handleAddColumn">添加列</el-button>
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
            <el-form-item label="关联子表名" required>
              <el-input v-model="data.subTableView"></el-input>
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
            <el-form-item label="标题名称">
              <el-input v-model="data.options.title"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="是否带有纵向边框">
              <el-switch v-model="data.options.border"> </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示求和行">
              <el-switch v-model="data.options.showSumField" active-text="是" inactive-text="否"> </el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="表格尺寸">
          <el-select v-model="data.options.size">
            <el-option value="medium">medium</el-option>
            <el-option value="small">small</el-option>
            <el-option value="mini">mini</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表格最大高度">
          <el-input v-model.number="data.options['max-height']">
            <template slot="append">px</template>
          </el-input>
        </el-form-item>
        <el-form-item label="分页大小">
          <el-input v-model.number="data.options.pageSize"> </el-input>
        </el-form-item>
        <el-form-item label="默认打开页面索引(默认为1)">
          <el-input v-model.number="data.options.pageIndex"> </el-input>
        </el-form-item>
      </template>
      <template v-if="data.type == 'inline-group'">
        <el-form-item label="标题">
          <el-input v-model="data.label"></el-input>
        </el-form-item>
      </template>
      <template v-if="data.type == 'splitter-group'">
        <el-form-item label="标题">
          <el-input v-model="data.label"></el-input>
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
            <el-form-item v-if="isFieldType(data.type)" label="显示标题">
              <el-switch v-model="data.options.noLabel" :active-value="false" :inactive-value="true"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item v-if="isFieldType(data.type)" label="输入框类型">
              <el-select v-model="data.type" placeholder="请选择" @change="dataTypeChange($event, data)">
                <el-option v-for="(item, index) in _basicComponents" :key="index" :label="item.label" :value="item.type"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据类型">
              <el-select v-model="data.options.dataType" placeholder="请选择">
                <el-option v-for="(item, index) in state.dataTypeList" :key="index" :label="item" :value="item"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item v-if="isFieldType(data.type)" label="是否只读">
              <el-switch v-model="data.options.readonly" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="isFieldType(data.type)" label="绑定字段">
              <el-input v-model="data.options.prop"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item v-if="data.type === 'table-select'" label="表格字段定义">
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
              <el-button
                link
                @click="
                  (e) => {
                    data.options.columns.push({});
                  }
                "
                >添加字段</el-button
              >
              <el-button
                link
                @click="
                  (e) => {
                    data.options.columns.pop();
                  }
                "
                >删除字段</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item v-if="Object.keys(data.options).indexOf('width') >= 0" label="输入框宽度">
              <el-input v-model="data.options.width"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="占位内容">
              <el-input v-model="data.options.placeholder"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="Object.keys(data.options).indexOf('styles') >= 0" :gutter="3">
          <el-col :span="12">
            <el-form-item label="字体大小"> <el-input-number v-model.number="data.options.styles.fontSize" :min="0" :step="1" controls-position="right" class="w-110"></el-input-number> px </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行高"> <el-input-number v-model.number="data.options.styles.lineHeight" :min="0" :step="1" controls-position="right" class="w-110"></el-input-number> px </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
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
          <el-input v-model.number="data.options.size.width" style="width: 90px" type="number"></el-input>
          高度：
          <el-input v-model.number="data.options.size.height" style="width: 90px" type="number"></el-input>
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

        <el-row v-if="data.type == 'upload-image'" :gutter="3">
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

        <el-row v-if="data.type == 'select'" :gutter="3">
          <el-col :span="12">
            <el-form-item label="是否多选">
              <el-switch v-model="data.options.multiple" @change="handleSelectMuliple"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下拉框主键字段">
              <el-input v-model="data.options.keyProp"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-if="Object.keys(data.options).indexOf('allowHalf') >= 0" label="允许半选">
          <el-switch v-model="data.options.allowHalf"> </el-switch>
        </el-form-item>
        <el-form-item v-if="Object.keys(data.options).indexOf('showAlpha') >= 0" label="支持透明度选择">
          <el-switch v-model="data.options.showAlpha"> </el-switch>
        </el-form-item>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item v-if="Object.keys(data.options).indexOf('showLabel') >= 0" label="是否显示标签">
              <el-switch v-model="data.options.showLabel"> </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="data.type == 'tree'" label="仅选择叶节点">
              <el-switch v-model="data.options.onlySelectLeaf"> </el-switch>
            </el-form-item>
            <el-form-item v-if="data.type == 'select'" label="可搜索">
              <el-switch v-model="data.options.filterable"> </el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-if="Object.keys(data.options).indexOf('options') >= 0" label="选项">
          <el-radio-group v-model="data.options.remote" size="default" style="margin-bottom: 10px">
            <el-radio-button :label="'bindDropdown'">下拉框ID</el-radio-button>
            <el-radio-button :label="false">静态数据</el-radio-button>
            <el-radio-button :label="true">远端数据</el-radio-button>
          </el-radio-group>
          <template v-if="data.options.remote === true">
            <div>
              <el-input v-model="data.options.remoteFunc" size="default" style="">
                <template slot="prepend">远端方法</template>
              </el-input>
              <el-input v-model="data.options.props.value" size="default" style="">
                <template slot="prepend">值</template>
              </el-input>
              <el-input v-model="data.options.props.label" size="default" style="">
                <template slot="prepend">标签</template>
              </el-input>
            </div>
          </template>
          <template v-else-if="data.options.remote === 'bindDropdown'">
            <el-input v-model.number="data.options.dropdownId" type="number" size="default">
              <template slot="prepend">关联下拉框ID</template>
            </el-input>
          </template>
          <template v-else>
            <template v-if="data.type == 'radio' || (data.type == 'select' && !data.options.multiple)">
              <el-radio-group v-model="data.options.defaultValue">
                <draggable :list="data.options.options" :options="{ group: { name: 'options' }, ghostClass: 'ghost', handle: '.drag-item' }" tag="ul">
                  <li v-for="(item, index) in data.options.options" :key="index">
                    <el-radio :label="item.value" style="margin-right: 5px">
                      <el-input v-model="item.value" style="width: 90px" size="default"></el-input>
                      <el-input v-model="item.label" style="width: 90px" size="default"></el-input>
                      <!-- <input v-model="item.value"/> -->
                    </el-radio>
                    <i class="drag-item el-icon-yrt-yidong1" style="font-size: 16px; margin: 0 5px; cursor: move"></i>
                    <el-button circle plain type="danger" size="default" icon="el-icon-minus" style="padding: 4px; margin-left: 5px" @click="handleOptionsRemove(index)"></el-button>
                  </li>
                </draggable>
              </el-radio-group>
            </template>

            <template v-if="data.type == 'checkbox' || (data.type == 'select' && data.options.multiple)">
              <el-checkbox-group v-model="data.options.defaultValue">
                <draggable :list="data.options.options" :options="{ group: { name: 'options' }, ghostClass: 'ghost', handle: '.drag-item' }" tag="ul">
                  <li v-for="(item, index) in data.options.options" :key="index">
                    <el-checkbox :label="item.value" style="margin-right: 5px">
                      <el-input v-model="item.value" :style="{ width: data.options.showLabel ? '90px' : '190px' }" size="default"></el-input>
                      <el-input v-if="data.options.showLabel" v-model="item.label" style="width: 100px" size="default"></el-input>
                    </el-checkbox>
                    <i class="drag-item el-icon-yrt-yidong1" style="font-size: 16px; margin: 0 5px; cursor: move"></i>
                    <el-button circle plain type="danger" size="default" icon="el-icon-minus" style="padding: 4px; margin-left: 5px" @click="handleOptionsRemove(index)"></el-button>
                  </li>
                </draggable>
              </el-checkbox-group>
            </template>
            <div style="margin-left: 22px">
              <el-button link @click="handleAddOption">添加选项</el-button>
            </div>
          </template>
        </el-form-item>

        <el-form-item v-if="Object.keys(data.options).indexOf('defaultValue') >= 0 && ['textarea', 'input', 'rate', 'color', 'switch', 'radio', 'tree', 'date', 'select'].indexOf(data.type) >= 0" label="默认值">
          <el-input v-if="data.type == 'textarea'" v-model="data.options.defaultValue" :rows="5" type="textarea"></el-input>
          <template v-if="['input', 'radio', 'switch', 'tree', 'date', 'select'].indexOf(data.type) >= 0">
            <el-input v-if="['byte', 'int32', 'int64', 'float'].indexOf(data.options.dataType) >= 0" v-model.number="data.options.defaultValue"></el-input>
            <el-input v-else v-model="data.options.defaultValue"></el-input>
          </template>
          <el-rate v-if="data.type == 'rate'" v-model="data.options.defaultValue" :max="data.options.max" :allow-half="data.options.allowHalf" style="display: inline-block; vertical-align: middle"></el-rate>
          <el-button v-if="data.type == 'rate'" link style="display: inline-block; vertical-align: middle; margin-left: 10px" @click="data.options.defaultValue = 0">清空</el-button>
          <el-color-picker v-if="data.type == 'color'" v-model="data.options.defaultValue" :show-alpha="data.options.showAlpha"></el-color-picker>
        </el-form-item>

        <template v-if="data.type == 'time' || data.type == 'date'">
          <el-form-item v-if="data.type == 'date'" label="显示类型">
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
          <el-form-item v-if="data.type == 'time'" label="是否为范围选择">
            <el-switch v-model="data.options.isRange"> </el-switch>
          </el-form-item>
          <el-form-item v-if="data.type == 'date'" label="是否获取时间戳">
            <el-switch v-model="data.options.timestamp"> </el-switch>
          </el-form-item>
          <el-form-item v-if="(!data.options.isRange && data.type == 'time') || (data.type != 'time' && data.options.type != 'datetimerange' && data.options.type != 'daterange')" label="占位内容">
            <el-input v-model="data.options.placeholder"></el-input>
          </el-form-item>
          <el-form-item v-if="data.options.isRange || data.options.type == 'datetimerange' || data.options.type == 'daterange'" label="开始时间占位内容">
            <el-input v-model="data.options.startPlaceholder"></el-input>
          </el-form-item>
          <el-form-item v-if="data.options.isRange || data.options.type == 'datetimerange' || data.options.type == 'daterange'" label="结束时间占位内容">
            <el-input v-model="data.options.endPlaceholder"></el-input>
          </el-form-item>
          <el-form-item label="格式">
            <el-select v-model="data.options.format">
              <el-option label="yyyy-MM-dd" value="yyyy-MM-dd"></el-option>
              <el-option label="yyyy-MM-dd HH:mm:ss" value="yyyy-MM-dd HH:mm:ss"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="data.type == 'time' && Object.keys(data.options).indexOf('isRange') >= 0" label="默认值">
            <el-time-picker v-if="!data.options.isRange" key="1" v-model="data.options.defaultValue" :arrow-control="data.options.arrowControl" :value-format="data.options.format" style="width: 100%"> </el-time-picker>
            <el-time-picker v-if="data.options.isRange" key="2" v-model="data.options.defaultValue" :arrow-control="data.options.arrowControl" :value-format="data.options.format" is-range style="width: 100%"> </el-time-picker>
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

        <el-form-item label="数据绑定Key">
          <el-input v-model="data.key"></el-input>
        </el-form-item>
        <el-form-item label="操作属性">
          <el-checkbox v-if="Object.keys(data.options).indexOf('readonly') >= 0" v-model="data.options.readonly">完全只读</el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('disabled') >= 0" v-model="data.options.disabled">禁用 </el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('editable') >= 0" v-model="data.options.editable">文本框可输入</el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('clearable') >= 0" v-model="data.options.clearable">显示清除按钮</el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('arrowControl') >= 0" v-model="data.options.arrowControl">使用箭头进行时间选择</el-checkbox>
        </el-form-item>
        <el-form-item label="校验">
          <div>
            <el-checkbox v-model="data.options.required">必填</el-checkbox>
            <el-checkbox v-model="data.options.hidden">隐藏</el-checkbox>
          </div>
          <el-select v-model="data.options.ruleType" size="default">
            <el-option value="string" label="字符串"></el-option>
            <el-option value="number" label="数字"></el-option>
            <el-option value="boolean" label="布尔值"></el-option>
            <el-option value="integer" label="整数"></el-option>
            <el-option value="float" label="浮点数"></el-option>
            <el-option value="url" label="URL地址"></el-option>
            <el-option value="email" label="邮箱地址"></el-option>
            <el-option value="hex" label="十六进制"></el-option>
          </el-select>

          <div v-if="Object.keys(data.options).indexOf('pattern') >= 0">
            <el-input v-model.lazy="data.options.pattern" size="default" style="width: 240px" placeholder="填写正则表达式"></el-input>
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
          <template v-if="['byte', 'int16', 'int32', 'float'].indexOf(data.options.dataType) >= 0">
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
      </template>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="widget-config">
import Draggable from 'vuedraggable';
import SelectIcon from './select-icon.vue';
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

//#region 定义父组件传过来的值
const props = defineProps({
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
// #endregion

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
});
// #endregion
//#region 计算属性
const show = computed(() => {
  if (props.data && Object.keys(props.data).length > 0) {
    return true;
  }
  return false;
});
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
//#endregion

//#region wacth
watch(
  () => props.data,
  (val, oldVal) => {
    if (JSON.stringify(val) === JSON.stringify(oldVal)) {
      return;
    }
    if (typeof val !== 'undefined') {
      if (val) {
        props.data.value.options.defaultValue = null;
      } else if ('defaultValue' in props.data.value.options) {
        props.data.value.options.defaultValue = '';
      }
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
const handleOptionsRemove = (index: any) => {
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
  const item: any = props.basicComponents.find((item: any) => {
    return item.type === selectVal;
  });
  data.options = Object.assign({}, item.options, {
    prop: data.options.prop,
  });
};
// 选择图标
const selectIcon = () => {};
const onSelectIcon = (icon: any) => {
  props.data.options.icon = icon;
  proxy.$message.success('选择成功！');
  // proxy.findRef("icon-popover").doClose();
};
const _basicComponents = computed(() => {
  return props.basicComponents as Array<any>;
});
</script>

<style lang="scss" scoped>
.widget-config {
  .col-param {
    ::v-deep .el-input__inner {
      padding: 0 5px;
    }
  }
  ::v-deep .el-input__inner {
    padding: 0 5px;
  }
}
</style>
