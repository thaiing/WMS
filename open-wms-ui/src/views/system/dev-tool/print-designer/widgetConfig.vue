<template>
  <div v-if="show" class="widget-config-container">
    <el-form label-position="top">
      <!--字段字段参数-->
      <template v-if="['field'].indexOf(data.type) >= 0">
        <!--标题样式-->
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="标题名称">
              <el-input v-model="data.label.title" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图层顺序">
              <el-input v-model.number="data.options.z" link></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="标题宽度(mm)">
              <el-input v-model="data.label.styles.width" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标题对齐">
              <el-select v-model="data.label.styles['text-align']">
                <el-option value="left">left</el-option>
                <el-option value="center">center</el-option>
                <el-option value="right">right</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="标题行高(mm)">
              <el-input v-model="data.label.styles['line-height']" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标题字体大小">
              <el-input v-model="data.label.styles['font-size']" link></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="标题后面显示冒号">
              <el-switch v-model="data.label.showColon"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="粗体">
              <el-select v-model="data.styles['font-weight']" placeholder="请选择">
                <el-option :value="'normal'" label="normal"></el-option>
                <el-option :value="'bold'" label="bold" />
                <el-option :value="'bolder'" label="bolder"></el-option>
                <el-option :value="'lighter'" label="lighter"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!--绑定字段样式-->
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="绑定字段">
              <el-input v-model="data.text.prop" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字段行高(mm)">
              <el-input v-model="data.text.styles['line-height']" link></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="字段宽度(mm)">
              <el-input v-model="data.text.styles.width" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字段对齐">
              <el-select v-model="data.text.styles['text-align']">
                <el-option value="left">left</el-option>
                <el-option value="center">center</el-option>
                <el-option value="right">right</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="字段字体大小">
              <el-input v-model="data.text.styles['font-size']" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="换行模式">
              <el-select v-model="data.text.styles['white-space']">
                <el-option value="normal">normal空白会被浏览器忽略</el-option>
                <el-option value="pre">pre空白会被浏览器保留</el-option>
                <el-option value="nowrap">nowrap文本不会换行，文本会在在同一行上继续</el-option>
                <el-option value="pre-wrap">pre-wrap保留空白符序列，但是正常地进行换行</el-option>
                <el-option value="pre-line">pre-line合并空白符序列，但是保留换行符</el-option>
                <el-option value="inherit">inherit从父元素继承</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="数据类型">
              <el-select v-model="data.text.dataType" placeholder="请选择数据类型">
                <el-option v-for="item in state.dataTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="格式化">
              <el-select v-model="data.text.formatter">
                <el-option label="[空]" value=""></el-option>
                <el-option label="YYYY-MM" value="YYYY-MM"></el-option>
                <el-option label="YYYY-MM-DD" value="YYYY-MM-DD"></el-option>
                <el-option label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-DD HH:mm:ss"></el-option>
                <el-option label="￥#.00" value="￥#.00"></el-option>
                <el-option label="#" value="#"></el-option>
                <el-option label="#.#" value="#.#"></el-option>
                <el-option label="#.##" value="#.##"></el-option>
                <el-option label="#.###" value="#.###"></el-option>
                <el-option label="#.####" value="#.####"></el-option>
                <el-option label="#.0" value="#.0"></el-option>
                <el-option label="#.00" value="#.00"></el-option>
                <el-option label="#.000" value="#.000"></el-option>
                <el-option label="#.0000" value="#.0000"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="显示方式">
              <el-select v-model="data.showMode">
                <el-option label="[空]" value=""></el-option>
                <el-option label="仅首页" value="仅首页"></el-option>
                <el-option label="仅尾页" value="仅尾页"></el-option>
                <el-option label="首页尾页" value="首页尾页"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="加密符号">
              <el-input v-model.number="data.encryptionSymbol" link></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="加密前部保留位数">
              <el-input v-model.number="data.encryptionBefore" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="加密尾部保留位数">
              <el-input v-model.number="data.encryptionAfter" link></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <!--普通字段参数-->
      <template v-if="['input'].indexOf(data.type) >= 0">
        <!--标题样式-->
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="标题名称">
              <el-input v-model="data.label.title" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图层顺序">
              <el-input v-model.number="data.options.z" link></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="文本宽度">
              <el-input v-model="data.label.styles.width" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标题对齐">
              <el-select v-model="data.label.styles['text-align']">
                <el-option value="left">left</el-option>
                <el-option value="center">center</el-option>
                <el-option value="right">right</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="文本行高">
              <el-input v-model="data.label.styles['line-height']" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文本排列">
              <el-select v-model="data.label.styles['writing-mode']">
                <el-option value="horizontal-tb">水平方向</el-option>
                <el-option value="vertical-rl">垂直方向，从右向左</el-option>
                <el-option value="vertical-lr">垂直方向，从左向右</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="字体大小">
              <el-input v-model="data.styles['font-size']" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="粗体">
              <el-select v-model="data.styles['font-weight']" placeholder="请选择">
                <el-option :value="'normal'" label="normal"></el-option>
                <el-option :value="'bold'" label="bold" />
                <el-option :value="'bolder'" label="bolder"></el-option>
                <el-option :value="'lighter'" label="lighter"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="字体风格">
              <el-select v-model="data.styles['font-style']" placeholder="请选择">
                <el-option label="正常" value="normal"></el-option>
                <el-option label="斜体" value="italic"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下划线">
              <el-select v-model="data.styles['text-decoration']" placeholder="请选择">
                <el-option :value="'none'" label="无"></el-option>
                <el-option :value="'underline'" label="下划线" />
                <el-option :value="'line-through'" label="删除线"></el-option>
                <el-option :value="'overline'" label="上划线"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="显示方式">
              <el-select v-model="data.showMode">
                <el-option label="[空]" value=""></el-option>
                <el-option label="仅首页" value="仅首页"></el-option>
                <el-option label="仅尾页" value="仅尾页"></el-option>
                <el-option label="首页尾页" value="首页尾页"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="换行模式">
              <el-select v-model="data.label.styles['white-space']">
                <el-option value="normal">normal空白会被浏览器忽略</el-option>
                <el-option value="pre">pre空白会被浏览器保留</el-option>
                <el-option value="nowrap">nowrap文本不会换行，文本会在在同一行上继续</el-option>
                <el-option value="pre-wrap">pre-wrap保留空白符序列，但是正常地进行换行</el-option>
                <el-option value="pre-line">pre-line合并空白符序列，但是保留换行符</el-option>
                <el-option value="inherit">inherit从父元素继承</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <!--明细参数-->
      <template v-if="['table'].indexOf(data.type) >= 0">
        <!--标题样式-->
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="标题名称">
              <el-input v-model="data.label.title" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="明细主键">
              <el-input v-model="data.idField" link></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="14">
            <el-form-item label="关联表名">
              <el-input v-model="data.tableName" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="字符串行模板">
              <el-switch v-model="data.onlyOnline" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="data.onlyOnline" :gutter="10">
          <el-col :span="16">
            <el-form-item label="字符串表达式">
              <el-input v-model="data.stringExpress" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行分隔符">
              <el-input v-model="data.rowSplit" link></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="18">
            <el-form-item label="明细接口地址">
              <el-input v-model="data.detailApiUrl" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="图层顺序">
              <el-input v-model.number="data.options.z" link></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="表格宽度">
              <el-input v-model="data.width" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="表格颜色">
              <el-select v-model="data.borderColor" placeholder="请选择">
                <el-option label="#000000" value="#000000"></el-option>
                <el-option label="#DCDFE6" value="#DCDFE6"></el-option>
                <el-option label="#E4E7ED" value="#E4E7ED"></el-option>
                <el-option label="#EBEEF5" value="#EBEEF5"></el-option>
                <el-option label="#F2F6FC" value="#F2F6FC"></el-option>
                <el-option label="#FFFFFF" value="#FFFFFF"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-form-item label="排序字段(多个字段用英文逗号分隔，加上DESC关键词倒序排序)">
            <el-input v-model="data.orderFields"></el-input>
          </el-form-item>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="显示表头">
              <el-switch v-model="data.showHeader" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="表头第2页起隐藏">
              <el-switch v-model="data.secondHeaderHidden" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="首页行数">
              <el-input-number v-model.number="data.firstPageSize" :min="1" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="尾页行数">
              <el-input-number v-model.number="data.lastPageSize" :min="1" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="默认分页">
              <el-input-number v-model.number="data.pageSize" :min="1" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单页超行数强制分页">
              <el-input-number v-model.number="data.onePageSize" :min="1" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="表格次页Y轴位置">
              <el-input-number v-model.number="data.secondY" :min="1" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="表格尾页Y轴位置">
              <el-input-number v-model.number="data.lastY" :min="1" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <!--明细字段参数-->
      <template v-if="['detail-field'].indexOf(data.type) >= 0">
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="标题名称">
              <el-input v-model="data.label" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联字段名">
              <el-input v-model="data.prop" link></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="列宽">
              <el-input-number v-model.number="data.width" link controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标题行高(mm)">
              <el-input-number v-model.number="data.header.lineHeight" link controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="标题对齐方式">
              <el-select v-model="data.header.textAlign">
                <el-option value="left">left</el-option>
                <el-option value="center">center</el-option>
                <el-option value="right">right</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标题字体大小(mm)">
              <el-input-number v-model.number="data.header.fontSize" link controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="内容对齐方式">
              <el-select v-model="data.body.textAlign">
                <el-option value="left">left</el-option>
                <el-option value="center">center</el-option>
                <el-option value="right">right</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内容字体大小(mm)">
              <el-input-number v-model.number="data.body.fontSize" link controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="内容行高(mm)">
              <el-input-number v-model.number="data.body.lineHeight" link controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="0值不显示">
              <el-switch v-model="data.body.zeroHide" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="底部对齐方式">
              <el-select v-model="data.foot.textAlign">
                <el-option value="left">left</el-option>
                <el-option value="center">center</el-option>
                <el-option value="right">right</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="底部字体大小(mm)">
              <el-input-number v-model.number="data.foot.fontSize" link controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="底部行高(mm)">
              <el-input-number v-model.number="data.foot.lineHeight" link controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="0值不显示">
              <el-switch v-model="data.body.zeroHide" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="数据类型">
              <el-select v-model="data.body.dataType" placeholder="请选择数据类型">
                <el-option v-for="item in state.dataTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="格式化">
              <el-select v-model="data.body.formatter">
                <el-option label="[空]" value=""></el-option>
                <el-option label="YYYY-MM" value="YYYY-MM"></el-option>
                <el-option label="YYYY-MM-DD" value="YYYY-MM-DD"></el-option>
                <el-option label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-DD HH:mm:ss"></el-option>
                <el-option label="￥#.00" value="￥#.00"></el-option>
                <el-option label="#" value="#"></el-option>
                <el-option label="#.#" value="#.#"></el-option>
                <el-option label="#.##" value="#.##"></el-option>
                <el-option label="0.#" value="0.#"></el-option>
                <el-option label="0.##" value="0.##"></el-option>
                <el-option label="0.###" value="0.###"></el-option>
                <el-option label="0.####" value="0.####"></el-option>
                <el-option label="#.0" value="#.0"></el-option>
                <el-option label="#.00" value="#.00"></el-option>
                <el-option label="#.000" value="#.000"></el-option>
                <el-option label="#.0000" value="#.0000"></el-option>
                <el-option label="大单位格式化" value="大单位格式化"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="显示最大长度">
              <el-input-number v-model.number="data.body.maxLength" link controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示求和">
              <el-switch v-model="data.body.showSum" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="关联脚本(detailRow, field, data)">
          <el-input v-model="data.body.script" type="textarea" :rows="2"></el-input>
        </el-form-item>
      </template>
      <!--栅格参数-->
      <template v-if="data.type == 'grid'">
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="栅格间隔">
              <el-input v-model.number="data.options.gutter" type="number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="tab分组名">
              <el-input v-model="data.tabGroupName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="栅格最小行高">
              <el-input v-model="data.colStyles['min-height']"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字体行高">
              <el-input v-model="data.colStyles['line-height']"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="列配置项">
          <draggable :list="data.columns" item-key="index" :options="{ group: { name: 'options' }, ghostClass: 'ghost', handle: '.drag-item' }" tag="ul">
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

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="水平排列方式">
              <el-select v-model="data.options.justify">
                <el-option value="start" label="左对齐"></el-option>
                <el-option value="end" label="右对齐"></el-option>
                <el-option value="center" label="居中"></el-option>
                <el-option value="space-around" label="两侧间隔相等"></el-option>
                <el-option value="space-between" label="两端对齐"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="垂直排列方式">
              <el-select v-model="data.options.align">
                <el-option value="top" label="顶部对齐"></el-option>
                <el-option value="middle" label="居中"></el-option>
                <el-option value="bottom" label="底部对齐"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="显示方式">
              <el-select v-model="data.showMode">
                <el-option label="[空]" value=""></el-option>
                <el-option label="仅首页" value="仅首页"></el-option>
                <el-option label="仅尾页" value="仅尾页"></el-option>
                <el-option label="首页尾页" value="首页尾页"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <!--线条字段参数-->
      <template v-if="['line-horizontal', 'line-vertical'].indexOf(data.type) >= 0">
        <!--标题样式-->
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="标题名称">
              <el-input v-model="data.label.title" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图层顺序">
              <el-input v-model.number="data.options.z" link></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="显示方式">
              <el-select v-model="data.showMode">
                <el-option label="[空]" value=""></el-option>
                <el-option label="仅首页" value="仅首页"></el-option>
                <el-option label="仅尾页" value="仅尾页"></el-option>
                <el-option label="首页尾页" value="首页尾页"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <!--分页码参数-->
      <template v-if="['pagination'].indexOf(data.type) >= 0">
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="名称">
              <el-input v-model="data.label.title" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="样式">
              <el-select v-model="data.layout">
                <el-option value="1/5">1/5</el-option>
                <el-option value="第1/5页">第1/5页</el-option>
                <el-option value="第1页/共5页">第1页/共5页</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="字体大小">
              <el-input v-model="data.styles['font-size']" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="粗体">
              <el-select v-model="data.styles['font-weight']" placeholder="请选择">
                <el-option :value="'normal'" label="normal"></el-option>
                <el-option :value="'bold'" label="bold" />
                <el-option :value="'bolder'" label="bolder"></el-option>
                <el-option :value="'lighter'" label="lighter"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="行高">
              <el-input v-model="data.styles['line-height']" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对齐方式">
              <el-select v-model="data.styles['text-align']" placeholder="请选择">
                <el-option :value="'left'" label="left"></el-option>
                <el-option :value="'center'" label="center" />
                <el-option :value="'right'" label="right"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <!--一维码参数-->
      <template v-if="['barcode'].indexOf(data.type) >= 0">
        <!--标题样式-->
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="标题名称">
              <el-input v-model="data.label.title" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图层顺序">
              <el-input v-model.number="data.options.z" link></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="绑定字段">
              <el-input v-model="data.barcode.value" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Web条码格式">
              <el-select v-model="data.barcode.options.format">
                <el-option value="CODE128">CODE128</el-option>
                <el-option value="CODE39">CODE39</el-option>
                <el-option value="codabar">codabar</el-option>
                <el-option value="EAN13">EAN13</el-option>
                <el-option value="UPC">UPC</el-option>
                <el-option value="EAN8">EAN8</el-option>
                <el-option value="EAN5">EAN5</el-option>
                <el-option value="EAN2">EAN2</el-option>
                <el-option value="ITF14">ITF14</el-option>
                <el-option value="pharmacode">pharmacode</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="Lodop条码格式">
              <el-select v-model="data.barcode.options.lodopBarcode">
                <el-option label="128A" value="128A"></el-option>
                <el-option label="128B" value="128B"></el-option>
                <el-option label="128C" value="128C"></el-option>
                <el-option label="128Auto" value="128Auto"></el-option>
                <el-option label="EAN8" value="EAN8"></el-option>
                <el-option label="EAN13" value="EAN13"></el-option>
                <el-option label="EAN128A" value="EAN128A"></el-option>
                <el-option label="EAN128B" value="EAN128B"></el-option>
                <el-option label="EAN128C" value="EAN128C"></el-option>
                <el-option label="Code39" value="Code39"></el-option>
                <el-option label="39Extended" value="39Extended"></el-option>
                <el-option label="UPC_A" value="UPC_A"></el-option>
                <el-option label="UPC_E0" value="UPC_E0"></el-option>
                <el-option label="Code93" value="Code93"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="旋转角度">
              <el-select v-model="data.styles['-webkit-transform']">
                <el-option label="0" value="rotate(0deg)"></el-option>
                <el-option label="90" value="rotate(90deg)"></el-option>
                <el-option label="180" value="rotate(180deg)"></el-option>
                <el-option label="270" value="rotate(270deg)"></el-option>
                <el-option label="360" value="rotate(360deg)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="Bar宽度">
              <el-input-number v-model.number="data.barcode.options.width" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Bar高度">
              <el-input-number v-model.number="data.barcode.options.height" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="显示文本">
              <el-switch v-model="data.barcode.options.displayValue"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文本字体">
              <el-select v-model="data.barcode.options.font">
                <el-option value="monospace">monospace</el-option>
                <el-option value="SimSun">宋体</el-option>
                <el-option value="SimHei">黑体</el-option>
                <el-option value="Microsoft YaHei">微软雅黑</el-option>
                <el-option value="Microsoft JhengHei">微软正黑体</el-option>
                <el-option value="NSimSun">新宋体</el-option>
                <el-option value="PMingLiU">新细明体</el-option>
                <el-option value="DFKai-SB">标楷体</el-option>
                <el-option value="STXihei">华文细黑</el-option>
                <el-option value="LiSu">隶书</el-option>
                <el-option value="FZShuTi">方正舒体</el-option>
                <el-option value="Arial">Arial</el-option>
                <el-option value="Helvetica">Helvetica</el-option>
                <el-option value="Tahoma">Tahoma</el-option>
                <el-option value="Verdana">Verdana</el-option>
                <el-option value="Lucida Grande">Lucida Grande</el-option>
                <el-option value="Times New Roman">Times New Roman</el-option>
                <el-option value="Georgia">Georgia</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="文本对齐">
              <el-select v-model="data.barcode.options.textAlign">
                <el-option value="left">left</el-option>
                <el-option value="center">center</el-option>
                <el-option value="right">right</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文本位置">
              <el-select v-model="data.barcode.options.textPosition">
                <el-option value="bottom">bottom</el-option>
                <el-option value="top">top</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="条码与文字间距">
              <el-input-number v-model.number="data.barcode.options.textMargin" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字体大小">
              <el-input-number v-model.number="data.barcode.options.fontSize" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="背景颜色">
              <el-color-picker v-model="data.barcode.options.background" show-alpha></el-color-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="条码颜色">
              <el-color-picker v-model="data.barcode.options.lineColor" show-alpha></el-color-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="显示方式">
              <el-select v-model="data.showMode">
                <el-option label="[空]" value=""></el-option>
                <el-option label="仅首页" value="仅首页"></el-option>
                <el-option label="仅尾页" value="仅尾页"></el-option>
                <el-option label="首页尾页" value="首页尾页"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="上边距">
              <el-input-number v-model.number="data.barcode.options.marginTop" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下边距">
              <el-input-number v-model.number="data.barcode.options.marginBottom" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="左边距">
              <el-input-number v-model.number="data.barcode.options.marginLeft" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="右边距">
              <el-input-number v-model.number="data.barcode.options.marginRight" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <!--二维码参数-->
      <template v-if="['qrcode'].indexOf(data.type) >= 0">
        <!--标题样式-->
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="标题名称">
              <el-input v-model="data.label.title" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图层顺序">
              <el-input v-model.number="data.options.z" link></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="绑定字段">
              <el-input v-model="data.qrOptions.value" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Bar宽度">
              <el-input-number v-model.number="data.qrOptions.width" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="背景颜色">
              <el-color-picker v-model="data.qrOptions.color.light"></el-color-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二维码颜色">
              <el-color-picker v-model="data.qrOptions.color.dark"></el-color-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="边距">
              <el-input-number v-model.number="data.qrOptions.margin" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <!--图片参数-->
      <template v-if="['image'].indexOf(data.type) >= 0">
        <!--标题样式-->
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="标题名称">
              <el-input v-model="data.label.title" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图层顺序">
              <el-input v-model.number="data.options.z" link></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="宽度">
              <el-input-number v-model.number="data.image.width" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="高度">
              <el-input-number v-model.number="data.image.height" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="24">
            <el-form-item label="图片路径">
              <el-input v-model="data.image.imageUrl" controls-position="right"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="24">
            <el-form-item label="上传API接口">
              <el-input v-model="data.image.serverAction" controls-position="right"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <!--定位样式-->
      <template v-if="Object.keys(data).indexOf('options') >= 0">
        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="x">
              <el-input-number v-model.number="data.options.x" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="y">
              <el-input-number v-model.number="data.options.y" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="宽度">
              <el-input-number v-model.number="data.options.w" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="高度">
              <el-input-number v-model.number="data.options.h" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="最小宽度">
              <el-input-number v-model.number="data.options.minw" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最小高度">
              <el-input-number v-model.number="data.options.minh" controls-position="right" class="w-130"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="12">
            <el-form-item label="开启吸附">
              <el-switch v-model="data.options.snap" :active-value="true" :inactive-value="false"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对齐距离">
              <el-input v-model="data.options.snapTolerance" link></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="3">
          <el-col :span="9">
            <el-form-item label="跟谁组件ID">
              <el-input v-model="data.options.followId" link></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="相对位置X/Y">
              <el-input v-model="data.options.followX" link style="width: 80px"></el-input>
              <el-input v-model="data.options.followY" link style="width: 80px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <el-form-item v-if="Object.keys(data).indexOf('key') >= 0" label="key">
        <el-input v-model="data.key" link></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="widget-config">
import { BaseProperties, DataOptions } from '/@/types/base-type';
import { ComponentInternalInstance } from 'vue';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits([]);

const _dataTypeList = [
  { id: 'none', name: 'none' },
  { id: 'string', name: 'string' },
  { id: 'byte', name: 'byte' },
  { id: 'integer', name: 'integer' },
  { id: 'long', name: 'long' },
  { id: 'double', name: 'double' },
  { id: 'bigDecimal', name: 'bigDecimal' },
  { id: 'boolean', name: 'boolean' },
  { id: 'datetime', name: 'datetime' },
  { id: 'date', name: 'date' },
  { id: 'month', name: 'month' },
];
import Draggable from 'vuedraggable';

//#region 定义属性
const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  // 数据类型列表
  dataTypeList: _dataTypeList,
});
//#endregion

//#region 计算属性
// 显示
const show = computed(() => {
  if (props.data && Object.keys(props.data).length > 0) {
    return true;
  }
  return false;
});
//#endregion

const handleAddColumn = () => {
  props.data.columns.push({
    span: '',
    fields: [],
  });
};

const handleOptionsRemove = (index: any) => {
  if (props.data.type === 'grid') {
    props.data.columns.splice(index, 1);
  } else {
    props.data.options.options.splice(index, 1);
  }
};
</script>

<style lang="scss" scoped>
.widget-config-container {
  padding-bottom: 20px;
  .el-form-item {
    margin-bottom: 5px;
  }
  :deep(.el-form--label-top .el-form-item__label) {
    padding: 0 0 2px;
    line-height: 1.5;
  }
  :deep(.el-input__inner) {
    padding: 0 5px;
  }
  :deep(.el-input-number .el-input__inner) {
    padding-left: 5px;
    padding-right: 40px;
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
