<template>
  <div id="position-container" class="position-container">
    <el-form ref="form" :inline="true" :model="state.formData" class="demo-form-inline">
      <el-form-item :label="$tt('仓库')">
        <el-select v-model="state.formData.storageId" style="width: 120px" :placeholder="$tt('请选择仓库')" @change="onStorageChange(state.formData.storageId)">
          <el-option v-for="(item, index) in state.storageList" :key="index" :label="item.storageName" :value="item.storageId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$tt('库区')">
        <el-select v-model="state.formData.areaCode" style="width: 120px" :placeholder="$tt('请选择库区')" @change="onStorageAreaChange(state.formData.areaCode)">
          <el-option v-for="(item, index) in state.storageAreaList" :key="index" :label="item.areaCode" :value="item.areaCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="Select" @click="addStorageArea">{{ $tt('新建库区') }}</el-button>
        <el-button :loading="state.isLoading" type="primary" icon="CircleCheckFilled" @click="saveArea">{{ $tt('保存') }}</el-button>
        <el-button icon="RefreshRight" @click="refreshArea">{{ $tt('刷新') }}</el-button>
        <el-button type="success" icon="Select" @click="uploadSvg">{{ $tt('上传SVG图') }}</el-button>
      </el-form-item>
      <br />

      <el-form-item :label="$tt('库区')">
        <span id="i_storageArea" class="area-content">{{ state.areaData.areaCode }}</span>
      </el-form-item>
      <el-form-item :label="$tt('货架模式')">
        <span id="i_shelveMode" class="area-content">{{ $tt(state.areaData.shelveMode) }}</span>
      </el-form-item>
      <el-form-item :label="$tt('货位类型')">
        <span id="i_PositionType" class="area-content">{{ dropdownStore.translateText(state.areaData.positionType, 501) }}</span>
      </el-form-item>
      <el-form-item :label="$tt('通道数')">
        <span id="i_channelNum" class="area-content">{{ state.areaData.channelNum }}</span>
      </el-form-item>

      <template v-if="state.areaData.shelveMode !== '地堆'">
        <template v-if="state.areaData.pickMode === 'U型'">
          <el-form-item :label="$tt('拣货模式')">
            <span id="i_pickMode" class="area-content">{{ $tt(state.areaData.pickMode) }}</span>
          </el-form-item>
          <el-form-item :label="$tt('货架A面')">
            <span id="i_shelveNumA_1" class="area-content">{{ state.areaData.shelveNumA1 }}</span> ~
            <span id="i_shelveNumA_2" class="area-content">{{ state.areaData.shelveNumA2 }}</span>
          </el-form-item>
          <el-form-item :label="$tt('货架B面')">
            <span id="i_shelveNumB_1" class="area-content">{{ state.areaData.shelveNumB1 }}</span> ~
            <span id="i_shelveNumB_2" class="area-content">{{ state.areaData.shelveNumB2 }}</span>
          </el-form-item>
        </template>
        <template v-if="state.areaData.pickMode !== 'U型'">
          <el-form-item :label="$tt('拣货模式')">
            <span id="i_pickMode_U" class="area-content">{{ state.areaData.pickMode }}</span>
          </el-form-item>
          <el-form-item :label="$tt('货架A面')">
            <span id="i_shelveNumZ_1" class="area-content">{{ state.areaData.shelveNumA1 }}</span> ~
            <span id="i_shelveNumZ_2" class="area-content">{{ state.areaData.shelveNumA2 }}</span>
          </el-form-item>
        </template>
      </template>

      <el-form-item :label="$tt('列数')">
        <span id="i_colNum" class="area-content">{{ state.areaData.columnNum }}</span>
      </el-form-item>
      <el-form-item :label="$tt(state.areaData.rowTitle)">
        <span id="i_rowNum" class="area-content">{{ state.areaData.rowNum }}</span>
      </el-form-item>
      <el-form-item>
        <el-button link @click="modifyAreaData">修改设置</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="state.tabIndex">
      <el-tab-pane :label="$tt('示意图')" name="示意图"> </el-tab-pane>
      <el-tab-pane :label="$tt('2D图')" name="2D图"> </el-tab-pane>
    </el-tabs>
    <!-- BEGIN PAGE -->
    <div v-show="state.tabIndex === '示意图'" class="layoutarea">
      <div class="position-layout">
        <!--整体外框-->
        <div ref="refDraw" v-drawposition="{ areaData: state.areaData, storageData: state.storageData, shelveDataList: state.shelveDataList, channelDataList: state.channelDataList, isViewer: false, isRefresh: state.isRefresh, updateRefresh: updateRefresh, displayTool: displayTool }" class="table-wrap clearfix"></div>
      </div>
      <!--整体外框-->
    </div>
    <!-- END PAGE -->
    <!-- 显示 svg图片 -->
    <svg-box v-if="state.tabIndex === '2D图'" :svg-url="state.svgUrl" :from-data="state.formData"></svg-box>
    <!-- 新建对话框 -->
    <position-dialog ref="positionDialog" v-model:visible="state.editorData.visible" :area-data="state.areaData" :position-title="state.positionTitle" @on-confirm="onConfirm"></position-dialog>

    <!-- popover工具栏 -->
    <el-popover ref="popoverRef" placement="bottom" :title="$tt('货位设置工具')" width="360" trigger="focus" virtual-triggering :virtual-ref="buttonRef">
      <el-row class="margin-bottom-20">
        <el-button type="primary" @click="state.toolConfig.lockPositionVisible = true">
          <template #icon>
            <svg-icon name="yrt-30" class="text-size-n" :size="14" />
          </template>
          {{ $tt('锁定货位') }}
        </el-button>
        <el-button type="primary" @click="state.toolConfig.unLockPositionVisible = true">
          <template #icon>
            <svg-icon name="yrt-suokaiqi" class="text-size-n" :size="14" />
          </template>
          {{ $tt('解锁货位') }}
        </el-button>
        <el-button type="primary" @click="printPosition">
          <template #icon>
            <svg-icon name="yrt-dayin" class="text-size-n" :size="14" />
          </template>
          打印货位
        </el-button>
      </el-row>
      <el-row class="margin-bottom-20">
        <el-button type="primary" @click="state.toolConfig.isMixProductPositionVisible = true">
          <template #icon>
            <svg-icon name="yrt-fenpeimubiao" class="text-size-n" :size="14" />
          </template>
          {{ $tt('是否混放') }}
        </el-button>
        <el-button type="primary" @click="state.toolConfig.enablePositionVisible = true">
          <template #icon>
            <svg-icon name="yrt-yiwancheng1" class="text-size-n" :size="14" />
          </template>
          {{ $tt('是否可用') }}
        </el-button>
        <el-button type="primary" @click="showShelveSetting()">
          <template #icon>
            <svg-icon name="yrt-shezhi" class="text-size-n" :size="14" />
          </template>
          {{ $tt('货架设置') }}
        </el-button>
      </el-row>
      <el-row>
        <el-button type="primary" @click="state.toolConfig.isminCapacity = true">
          <template #icon>
            <svg-icon name="yrt-fenpeimubiao" class="text-size-n" :size="14" />
          </template>
          {{ $tt('最低库存') }}
        </el-button>
        <el-button v-if="state.positionConfig.action === '通道'" type="primary" @click="showChannelShelveNum()">
          <template #icon>
            <svg-icon name="yrt-fenpeimubiao" class="text-size-n" :size="14" />
          </template>
          {{ $tt('设置货架数') }}
        </el-button>
      </el-row>
    </el-popover>
    <el-button ref="buttonRef" v-click-outside="onClickOutside" class="btn-tool">{{ $tt('操作') }}</el-button>

    <!-- 锁定货位对话框 -->
    <el-dialog draggable v-model="state.toolConfig.lockPositionVisible" width="560px" :title="$tt('锁定货位对话框')" append-to-body>
      <el-alert :closable="false" :title="$tt('提示：点击确定按钮后将锁定以下范围的货位，锁定将无法做任何操作。')" type="warning"> </el-alert>
      <el-form label-width="100px" class="position-config">
        <el-form-item v-if="state.positionConfig.channelCode" :label="$tt('通道')">
          {{ state.positionConfig.channelCode }}
        </el-form-item>
        <el-form-item v-if="state.positionConfig.shelveCode" :label="$tt('货架')">
          {{ state.positionConfig.shelveCode }}
        </el-form-item>
        <el-form-item v-if="state.positionConfig.colNo" :label="$tt('列')">
          {{ state.positionConfig.colNo }}
        </el-form-item>
        <el-form-item v-if="state.positionConfig.rowNo" :label="$tt('层')">
          {{ state.positionConfig.rowNo }}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="state.toolConfig.lockPositionVisible = false">{{ $tt('取消') }}</el-button>
        <el-button type="primary" @click="lockPosition">{{ $tt('确定') }}</el-button>
      </span>
    </el-dialog>

    <!-- 解锁货位对话框 -->
    <el-dialog draggable v-model="state.toolConfig.unLockPositionVisible" width="560px" :title="$tt('解锁货位对话框')" append-to-body>
      <el-alert :closable="false" :title="$tt('提示：点击确定按钮后将解锁以下范围的货位，解锁后将可以进行库存操作。')" type="warning"> </el-alert>
      <el-form label-width="100px" class="position-config">
        <el-form-item v-if="state.positionConfig.channelCode" :label="$tt('通道')">
          {{ state.positionConfig.channelCode }}
        </el-form-item>
        <el-form-item v-if="state.positionConfig.shelveCode" :label="$tt('货架')">
          {{ state.positionConfig.shelveCode }}
        </el-form-item>
        <el-form-item v-if="state.positionConfig.colNo" :label="$tt('列')">
          {{ state.positionConfig.colNo }}
        </el-form-item>
        <el-form-item v-if="state.positionConfig.rowNo" :label="$tt('层')">
          {{ state.positionConfig.rowNo }}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="state.toolConfig.unLockPositionVisible = false">{{ $tt('取消') }}</el-button>
        <el-button type="primary" @click="unLockPosition">{{ $tt('确定') }}</el-button>
      </span>
    </el-dialog>

    <!-- 是否混放对话框 -->
    <el-dialog draggable v-model="state.toolConfig.isMixProductPositionVisible" width="560px" :title="$tt('是否混放对话框')" append-to-body>
      <el-alert :closable="false" :title="$tt('提示：选择“混物料”值，然后将批量修改目标的是否混物料状态。')" type="warning"> </el-alert>
      <el-form :model="state.positionConfig" label-width="100px" class="position-config">
        <el-form-item v-if="state.positionConfig.channelCode" :label="$tt('通道')">
          {{ state.positionConfig.channelCode }}
        </el-form-item>
        <el-form-item v-if="state.positionConfig.shelveCode" :label="$tt('货架')">
          {{ state.positionConfig.shelveCode }}
        </el-form-item>
        <el-form-item v-if="state.positionConfig.colNo" :label="$tt('列')">
          {{ state.positionConfig.colNo }}
        </el-form-item>
        <el-form-item v-if="state.positionConfig.rowNo" :label="$tt('层')">
          {{ state.positionConfig.rowNo }}
        </el-form-item>
        <el-form-item :label="$tt('是否混放')">
          <el-radio-group v-model="state.positionConfig.isMixProductPosition">
            <el-radio :label="true">{{ $tt('是') }}</el-radio>
            <el-radio :label="false">{{ $tt('否') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="state.toolConfig.isMixProductPositionVisible = false">{{ $tt('取消') }}</el-button>
        <el-button type="primary" @click="isMixProductPosition">{{ $tt('确定') }}</el-button>
      </span>
    </el-dialog>

    <!-- 是否可用对话框 -->
    <el-dialog draggable v-model="state.toolConfig.enablePositionVisible" width="560px" :title="$tt('是否可用对话框')" append-to-body>
      <el-alert :closable="false" :title="$tt('提示：选择“是否可用”值，然后将批量修改目标“是否可用”状态。')" type="warning"> </el-alert>
      <el-form :model="state.positionConfig" label-width="100px" class="position-config">
        <el-form-item v-if="state.positionConfig.channelCode" :label="$tt('通道')">
          {{ state.positionConfig.channelCode }}
        </el-form-item>
        <el-form-item v-if="state.positionConfig.shelveCode" :label="$tt('货架')">
          {{ state.positionConfig.shelveCode }}
        </el-form-item>
        <el-form-item v-if="state.positionConfig.colNo" :label="$tt('列')">
          {{ state.positionConfig.colNo }}
        </el-form-item>
        <el-form-item v-if="state.positionConfig.rowNo" :label="$tt('层')">
          {{ state.positionConfig.rowNo }}
        </el-form-item>
        <el-form-item :label="$tt('是否可用')">
          <el-radio-group v-model="state.positionConfig.enablePosition">
            <el-radio :label="true">{{ $tt('是') }}</el-radio>
            <el-radio :label="false">{{ $tt('否') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="state.toolConfig.enablePositionVisible = false">{{ $tt('取消') }}</el-button>
        <el-button type="primary" @click="enablePosition">{{ $tt('确定') }}</el-button>
      </span>
    </el-dialog>

    <!-- 货架设置对话框 -->
    <el-dialog draggable v-model="state.toolConfig.setShelveInfoVisible" width="680px" :title="$tt('货架设置对话框')" append-to-body>
      <el-alert :closable="false" :title="$tt('提示：请认真填写下面库区各项参数，然后点击确定按钮生成库存货位布局。')" type="warning"> </el-alert>
      <el-form :model="state.positionConfig" label-width="100px" class="position-config">
        <el-form-item v-if="state.positionConfig.channelCode" :label="$tt('通道')">
          {{ state.positionConfig.channelCode }}
        </el-form-item>
        <el-form-item v-if="state.positionConfig.shelveCode" :label="$tt('货架')">
          {{ state.positionConfig.shelveCode }}
        </el-form-item>
        <el-form-item v-if="state.positionConfig.colNo" :label="$tt('列')">
          {{ state.positionConfig.colNo }}
        </el-form-item>
        <el-form-item v-if="state.positionConfig.rowNo" :label="$tt('层')">
          {{ state.positionConfig.rowNo }}
        </el-form-item>
        <el-form-item v-if="!state.positionConfig.colNo && !state.positionConfig.rowNo" :label="$tt('货架层数')" class="margin-bottom-10"> <el-input ref="configRowNum" v-model="state.positionConfig.rowNum" :placeholder="$tt('请输入层数')" class="w-100"></el-input> {{ $tt('每个货架有多少层') }} </el-form-item>
        <el-form-item v-if="!state.positionConfig.colNo && !state.positionConfig.rowNo" :label="$tt('货架列数')" class="margin-bottom-10"> <el-input ref="configColumnNum" v-model="state.positionConfig.columnNum" :placeholder="$tt('请输入列数')" class="w-100"></el-input> {{ $tt('每个货架每层分多少列（格）') }} </el-form-item>
        <el-form-item :label="$tt('货位编码规则')"> <el-input ref="configPositionRegular" v-model="state.positionConfig.positionRegular" :placeholder="$tt('货位编码规则')" class="w-250"></el-input> {{ $tt('标准编码规则：{库区}-{通道}{货架}{层}{列}') }} </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="state.toolConfig.setShelveInfoVisible = false">{{ $tt('取消') }}</el-button>
        <el-button type="primary" @click="setShelveInfo">{{ $tt('确定') }}</el-button>
      </span>
    </el-dialog>

    <!-- 通道货架数设置对话框 -->
    <el-dialog draggable v-model="state.toolConfig.isShelveNum" width="680px" :title="$tt('通道货架数设置对话框')" append-to-body>
      <el-alert :closable="false" :title="$tt('提示：请认真填写下面库区各项参数，然后点击确定按钮生成库存货位布局。')" type="warning"> </el-alert>
      <el-form :model="state.channelNumConfig" label-width="120px" class="position-config">
        <el-form-item v-if="state.channelNumConfig.channelCode" :label="$tt('通道')">
          {{ state.channelNumConfig.channelCode }}
        </el-form-item>
        <template v-if="state.channelNumConfig.pickMode == 'U型'">
          <el-form-item required :label="$tt('A面货架编号范围')" prop="shelveNumA1">
            <el-input-number v-model.number="state.channelNumConfig.shelveNumA1" :disabled="true" controls-position="right" class="w-100"></el-input-number> ~
            <el-input-number v-model.number="state.channelNumConfig.shelveNumA2" controls-position="right" class="w-100"></el-input-number>
            <span class="tip">库区一般每个通道中存在A面、B面</span>
          </el-form-item>
          <el-form-item required :label="$tt('B面货架编号范围')" prop="shelveNumB1">
            <el-input-number v-model.number="state.channelNumConfig.shelveNumB1" controls-position="right" class="w-100"></el-input-number> ~
            <el-input-number v-model.number="state.channelNumConfig.shelveNumB2" controls-position="right" class="w-100"></el-input-number>
            <span class="tip">{{ $tt('库区开头可能只有A面，结尾只有B面') }}</span>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item required :label="$tt('货架编号范围')" prop="shelveNumA1">
            <el-input-number v-model.number="state.channelNumConfig.shelveNumA1" :disabled="true" controls-position="right" class="w-100"></el-input-number> ~
            <el-input-number v-model.number="state.channelNumConfig.shelveNumA2" controls-position="right" class="w-100"></el-input-number>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="state.toolConfig.isShelveNum = false">{{ $tt('取消') }}</el-button>
        <el-button type="primary" @click="setChannelShelveNum">{{ $tt('确定') }}</el-button>
      </span>
    </el-dialog>

    <!-- 最低库存对话框 -->
    <el-dialog draggable v-model="state.toolConfig.isminCapacity" width="560px" :title="$tt('最低库存对话框')" append-to-body>
      <el-alert :closable="false" :title="$tt('提示：填写“最低库存”值，然后将批量修改目标“最低库存”。')" type="warning"> </el-alert>
      <el-form :model="state.positionConfig" label-width="100px" class="position-config">
        <el-form-item v-if="state.positionConfig.channelCode" :label="$tt('通道')">
          {{ state.positionConfig.channelCode }}
        </el-form-item>
        <el-form-item v-if="state.positionConfig.shelveCode" :label="$tt('货架')">
          {{ state.positionConfig.shelveCode }}
        </el-form-item>
        <el-form-item v-if="state.positionConfig.colNo" :label="$tt('列')">
          {{ state.positionConfig.colNo }}
        </el-form-item>
        <el-form-item v-if="state.positionConfig.rowNo" :label="$tt('层')">
          {{ state.positionConfig.rowNo }}
        </el-form-item>
        <el-form-item :label="$tt('最低库存')">
          <el-input v-model="state.positionConfig.minCapacity" style="width: 120px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="state.toolConfig.isminCapacity = false">{{ $tt('取消') }}</el-button>
        <el-button type="primary" @click="submitminCapacity">{{ $tt('确定') }}</el-button>
      </span>
    </el-dialog>

    <!-- 批量导入对话框 -->
    <upload-dialog v-model="state.uploadOptions.uploadVisible" :options="state.uploadOptions.options" @on-closed="onClosed"></upload-dialog>
  </div>
</template>

<script setup lang="ts" name="basic-storage-position-config">
const PositionDialog = defineAsyncComponent(() => import('./components/position-dialog.vue'));
const svgBox = defineAsyncComponent(() => import('./components/svg-box.vue'));
import { vDrawposition } from './directives/drawposition';
import { BaseProperties } from '/@/types/base-type';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import { ComponentInternalInstance, ref, unref } from 'vue';
import uploadDialog from '/@/components/base/upload-dialog.vue';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
// 引用下拉框状态管理组件
import useDropdownStore from '/@/stores/modules/dropdown';
const dropdownStore = useDropdownStore();

import { ClickOutside as vClickOutside } from 'element-plus';
const buttonRef: any = ref();
const popoverRef = ref();
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.();
};

//#region 定义变量
const state = reactive({
  isLoading: false,
  // 表单数据
  formData: {
    storageId: null,
    storageName: '',
    areaCode: '',
  } as any,
  // 仓库下拉框值
  storageList: [] as any,
  // 库区下拉框值
  storageAreaList: [] as any,
  // 对话框参数
  editorData: {
    visible: false,
    options: {},
  },

  // 显示批量导入对话框参数
  uploadOptions: {
    uploadVisible: false,
    options: {
      listType: 'text',
      multiple: false,
    },
  },
  // 库区数据
  areaData: {
    storageId: 0,
    storageName: '',
    positionType: 0,
    areaCode: 'A',
    pickMode: 'U型',
    shelveMode: '立体货架',
    maxCapacity: 100,
    channelNum: 0,
    rowNum: 0,
    columnNum: 0,
    shelveNumA1: 1,
    shelveNumA2: 0,
    shelveNumB1: 0,
    shelveNumB2: 0,
    positionRegular: null,
    channelRegular: null,
    shelvesRegular: null,
    rowRegular: null,
    columnRegular: null,
    action: 'add',
    rowTitle: '层数',
    thermocLine: '',
    maxWeight: 0,
    maxBeatNumber: 0,
    inventoryRate: '',
    channelNumDidui: 0,
    rowNumDidui: 0,
    columnNumDidui: 0,
    shelveNumZ1: 0,
    shelveNumZ2: 0,
    shelveDataList: [],
    channelDataList: [],
    expandFields: {} as any,
    svgUrl: '',
  } as any,
  // 仓库数据
  storageData: {
    positionRegular: null,
    channelRegular: null,
    shelvesRegular: null,
    rowRegular: null,
    columnRegular: null,
    action: 'add',
    storageName: '',
  } as any,
  // 货架信息
  shelveDataList: [] as any,
  // 通道货架数
  channelDataList: [] as any,
  // 刷新货位数据
  isRefresh: false,
  // 工具栏参数
  toolConfig: {
    // 显示锁定货位对话框
    lockPositionVisible: false,
    // 显示解锁货位对话框
    unLockPositionVisible: false,
    // 显示是否混放对话框
    isMixProductPositionVisible: false,
    // 显示是否可用对话框
    enablePositionVisible: false,
    // 显示货架设置对话框
    setShelveInfoVisible: false,
    // 显示最低库存对话框
    isminCapacity: false,
    // 显示设置货架数对话框
    isShelveNum: false,
  },
  // 当前工具点击参数
  positionConfig: {
    action: null, // 操作类型：通道、列、层
    channelCode: null, // 通道编号
    shelveCode: null, // 货架编号
    colNo: null, // 列编号
    rowNo: null, // 层编号
    isMixProductPosition: true, // 是否混放
    enablePosition: true, // 是否可用
    selectPositions: [] as any[], // 货位列表
    rowNum: 0, // 货位自定义层数
    columnNum: 0, // 货位自定义列数
    positionRegular: '', // 货位自定义规则
    minCapacity: 0, // 最低库存,
    selectChannelShelveList: [] as Array<any>, //
  },
  // 通道货架数设置
  channelNumConfig: {
    channelCode: null,
    shelveNumA1: 0,
    shelveNumA2: 0,
    shelveNumB1: 0,
    shelveNumB2: 0,
    pickMode: '',
  },
  // 编辑器标题名称
  positionTitle: '新建库区',
  // SVG上传对话框参数
  importConfig: {
    // 显示导入对话框
    isShowDialog: false,
    title: 'SVG上传',
    // 上传接口地址
    url: '/api/storage/position/svgImport',
    // 上传地址
    // fileUrl:"\upload\",
    // 按钮名称
    buttonText: '开始上传',
    // 提示描述
    errorTip: '请上传svg文件，如果有错请按照下面提示做修改',
    // 上传提示
    uploadTip: '只能上传svg文件，且不超过2Mb',
    // 上传文件格式
    accept: '.svg',
    isShowTemplateButton: false, // 设为false不显示
    // 不异步加载消息
    noMsg: true,
    // 上传到阿里云
    isAliOss: true,
    params: {},
  },
  // 当前选中tab
  tabIndex: '示意图',
  // svg内容
  svgUrl: '',
});
//#endregion

onMounted(() => {
  // this.common.loadDropDown([501], { projectName: 'Rattan.ERP.Storage' });
  getStorageList();
});
// 获得仓储列表
const getStorageList = async () => {
  const url = '/basic/storage/storage/getList';
  const params = {
    searchFields: 'storageId,storageCode,storageName,areaRegular,shelvesRegular,rowRegular,positionRegular,channelRegular,columnRegular',
  };
  const [err, res] = await to(postData(url, params));
  if (res?.result) {
    state.storageList = res.data;
  }
};

// 仓库选择改变后，获得库区列表
const onStorageChange = async (storageId: any) => {
  state.storageAreaList = [];
  if (state.formData.storageId !== storageId) {
    state.formData.areaCode = '';
  }
  state.storageData = state.storageList.find((item: any) => item.storageId === storageId);
  state.formData.storageName = state.storageData.storageName;

  let url = '/basic/storage/storageArea/getAreaList';
  let params = {
    storageId: storageId,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res.result) {
    state.storageAreaList = res.data;
  }
};

// 库区选择改变后
const onStorageAreaChange = async (areaCode: any) => {
  state.areaData = state.storageAreaList.find((item: any) => {
    item.maxWeight = Number(item.maxWeight);
    item.maxBeatNumber = Number(item.maxBeatNumber);
    item.maxCapacity = Number(item.maxCapacity);
    return item.areaCode === areaCode;
  });

  await loadArea(areaCode);
  getSvgContent();
};

// 加载货架数据
const loadShelveList = async (areaCode: any) => {
  state.shelveDataList = []; // 初始化货架数据
  state.channelDataList = []; // 初始化通道货架数据

  let url = '/basic/storage/storageArea/loadShelveList';
  let params = {
    storageId: state.formData.storageId,
    areaCode: areaCode,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res.result) {
    state.shelveDataList = JSON.parse(res.data.jsonData); // 货架信息集合
    state.channelDataList = JSON.parse(res.data.channelDataList || '[]');
    state.isRefresh = true;
  }
};

// 加载库区数据
const loadArea = async (areaCode: any) => {
  let url = '/basic/storage/storageArea/getStorageAreaInfo';
  let params = {
    storageId: state.formData.storageId,
    areaCode: areaCode,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }

  if (res.result) {
    state.areaData = res.data;
    state.areaData.maxWeight = Number(state.areaData.maxWeight);
    state.areaData.maxBeatNumber = Number(state.areaData.maxBeatNumber);
    state.areaData.maxCapacity = Number(state.areaData.maxCapacity);

    if (state.areaData.positionType) {
      state.areaData.positionType = state.areaData.positionType;
    }
    state.areaData.rowTitle = '层数';
    if (state.areaData.shelveMode === '地堆') {
      state.areaData.channelNumDidui = state.areaData.channelNum;
      state.areaData.rowNumDidui = state.areaData.rowNum;
      state.areaData.columnNumDidui = state.areaData.columnNum;
      state.areaData.rowTitle = '行数';
    } else if (state.areaData.shelveMode === '立体货架') {
      if (state.areaData.pickMode === 'Z型') {
        state.areaData.shelveNumZ1 = state.areaData.shelveNumA1;
        state.areaData.shelveNumZ2 = state.areaData.shelveNumA2;
      }
    }
    state.storageData.action = 'modify';

    // state.isRefresh = true;
    loadShelveList(areaCode); // 加载货架
  }
};

// 刷新
const refreshArea = () => {
  let areaCode = state.formData.areaCode;
  if (!areaCode) return;
  loadArea(areaCode);
};

// 新建库区对话框
const addStorageArea = () => {
  if (!state.formData.storageId) {
    proxy.$message.error('请选择仓库！');
    return;
  }
  state.shelveDataList = [];
  state.channelDataList = [];
  const positionTmpl = state.storageData.positionRegular;
  if (!positionTmpl) {
    proxy.$message.error('货位编码规则为空，请设置好货位编码规则！');
    return;
  }
  state.areaData = {
    storageId: state.formData.storageId,
    storageName: state.formData.storageName,
    positionType: 1,
    areaCode: '',
    pickMode: 'U型',
    shelveMode: '立体货架',
    maxCapacity: 100,
    channelNum: 0,
    rowNum: 4,
    columnNum: 4,
    shelveNumA1: 1,
    shelveNumA2: 3,
    shelveNumB1: 4,
    shelveNumB2: 6,
    positionRegular: positionTmpl,
    channelRegular: state.storageData.channelRegular,
    shelvesRegular: state.storageData.shelvesRegular,
    rowRegular: state.storageData.rowRegular,
    columnRegular: state.storageData.columnRegular,
    action: 'add',
    rowTitle: '层数',
    channelNumDidui: 1,
    rowNumDidui: 1,
    columnNumDidui: 1,
    shelveNumZ1: 1,
    shelveNumZ2: 1,
    thermocLine: '常温层',
    maxWeight: 0,
    maxBeatNumber: 0,
    inventoryRate: '',
    shelveDataList: [],
    channelDataList: [],
    expandFields: {
      svgUrl: '',
    },
    svgUrl: '',
  };
  state.storageData.action = 'add';
  state.editorData.visible = true;
  state.positionTitle = '新建库区';
};

// 新建库区
const onConfirm = (formData: any) => {
  state.areaData = JSON.parse(JSON.stringify(formData));
  state.isRefresh = true;
};

// 保存库区
const saveArea = async () => {
  if (!state.areaData || !state.areaData.columnNum) {
    proxy.$message.error('请先创建库区数据，然后在执行保存！');
    return;
  }
  state.isLoading = true;
  const url = '/basic/storage/position/saveArea';
  state.areaData.shelveDataList = state.shelveDataList; // 自定义货架
  state.areaData.channelDataList = state.channelDataList; // 自定义货架
  const params = {
    areaData: state.areaData,
    shelveDataList: state.areaData.shelveDataList,
    channelDataList: state.areaData.channelDataList,
  };
  debugger;
  const [err, res] = await to(postData(url, params));
  state.isLoading = false;

  if (err) {
    return;
  }
  if (res.result) {
    proxy.$message.success(res.msg);
    onStorageChange(state.formData.storageId);
  }
};
// 修改库区数据
const modifyAreaData = () => {
  const positionTmpl = state.storageData.positionRegular;
  if (!positionTmpl) {
    proxy.$message.error('货位编码规则为空，请设置好货位编码规则！');
    return;
  }

  if (state.storageData.action !== 'modify') {
    proxy.$message.error('当前库区数据未保存！');
    return;
  }
  state.positionTitle = '修改库区设置';
  state.editorData.visible = true;
};
// 修改刷新状态
const updateRefresh = (isRefresh: any) => {
  state.isRefresh = isRefresh;
};
// 显示工具栏
const displayTool = (the: any, positionList: any, shelveList: Array<any>, action: any) => {
  state.positionConfig.action = action;
  const el = buttonRef.value.ref;
  const rect = getOffsetRect(the);
  let left = document.getElementById('position-container')?.getBoundingClientRect().left || 210;
  el.style.left = rect.left - left + 'px';
  el.style.top = rect.top - 65 + 'px';

  // 获得货位参数
  state.positionConfig.channelCode = the.getAttribute('channelcode');
  state.positionConfig.shelveCode = the.getAttribute('shelveCode');
  state.positionConfig.colNo = the.getAttribute('colNo');
  state.positionConfig.rowNo = the.getAttribute('rowNo');
  state.positionConfig.selectPositions = positionList;
  state.positionConfig.selectChannelShelveList = shelveList;

  let findShelveInfo = null;
  findShelveInfo = state.shelveDataList.find((item: any) => {
    let result = item.storageId === state.areaData.storageId && item.areaCode === state.formData.areaCode && item.channelCode === state.positionConfig.channelCode;

    // 点击地堆通道的时候，不需要货架
    if (state.positionConfig.shelveCode) {
      result = result && item.shelveCode === state.positionConfig.shelveCode;
    }
    return result;
  });
  state.positionConfig.columnNum = state.areaData.columnNum;
  state.positionConfig.rowNum = state.areaData.rowNum;

  if (findShelveInfo) {
    findShelveInfo = JSON.parse(JSON.stringify(findShelveInfo));
    state.positionConfig.columnNum = findShelveInfo.columnNum;
    state.positionConfig.rowNum = findShelveInfo.rowNum;
    state.positionConfig.positionRegular = findShelveInfo.positionRegular;
  }
  window.setTimeout(() => {
    el.focus();
  }, 200);
};
// 获取偏移量
const getOffsetRect = (ele: any) => {
  const box = ele.getBoundingClientRect();
  const body = document.body;
  const docElem = document.documentElement;
  // 获取页面的scrollTop,scrollLeft(兼容性写法)
  const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
  const clientTop = docElem.clientTop || body.clientTop;
  const clientLeft = docElem.clientLeft || body.clientLeft;
  const top = box.top + scrollTop - clientTop;
  const left = box.left + scrollLeft - clientLeft;
  return {
    // Math.round 兼容火狐浏览器bug
    top: Math.round(top),
    left: Math.round(left),
  };
};
// 锁定货位
const lockPosition = async () => {
  let storageId = state.formData.storageId;
  let storageArea = state.formData.areaCode; // 库区
  let channelCode = state.positionConfig.channelCode ? state.positionConfig.channelCode : null;
  let shelveCode = state.positionConfig.shelveCode ? state.positionConfig.shelveCode : null;
  let colNo = state.positionConfig.colNo ? state.positionConfig.colNo : null;
  let rowNo = state.positionConfig.rowNo ? state.positionConfig.rowNo : null;
  // let positionInfo = {
  // 	storageId: storageId,
  // 	storageArea: storageArea,
  // 	channelCode: channelCode,
  // 	shelveCode: shelveCode,
  // 	colNo: colNo,
  // 	rowNo: rowNo,
  // };
  let url = '/basic/storage/position/lockPosition';
  let params = {
    storageId: storageId,
    storageArea: storageArea,
    channelCode: channelCode,
    shelveCode: shelveCode,
    colNo: colNo,
    rowNo: rowNo,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res.result) {
    refreshArea();
  }
  state.toolConfig.lockPositionVisible = false;
};
// 解锁货位
const unLockPosition = async () => {
  let storageId = state.formData.storageId;
  let storageArea = state.formData.areaCode; // 库区
  let channelCode = state.positionConfig.channelCode ? state.positionConfig.channelCode : null;
  let shelveCode = state.positionConfig.shelveCode ? state.positionConfig.shelveCode : null;
  let colNo = state.positionConfig.colNo ? state.positionConfig.colNo : null;
  let rowNo = state.positionConfig.rowNo ? state.positionConfig.rowNo : null;
  // let positionInfo = {
  // 	storageId: storageId,
  // 	storageArea: storageArea,
  // 	channelCode: channelCode,
  // 	shelveCode: shelveCode,
  // 	colNo: colNo,
  // 	rowNo: rowNo,
  // };
  let url = '/basic/storage/position/unlockPosition';
  let params = {
    storageId: storageId,
    storageArea: storageArea,
    channelCode: channelCode,
    shelveCode: shelveCode,
    colNo: colNo,
    rowNo: rowNo,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res.result) {
    refreshArea();
  }
  state.toolConfig.unLockPositionVisible = false;
};
// 打印货位
const printPosition = async () => {
  if (!state.positionConfig.selectPositions.length) {
    proxy.$message.error('执行选择一项');
    return;
  }
  let storageId = state.formData.storageId;
  let url = '/basic/storage/position/getList';
  let params = {
    storageId: storageId,
    name: state.positionConfig.selectPositions.map((m) => m.positionName).join(','),
    searchFields: 'positionId,positionName',
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res.result) {
    let positionIds = res.data.map((m: any) => m.positionId).join(',');
    url = `/system/print/base-template-id/1819/1692/${positionIds}?key=${proxy.common.getGUID()}&autoPrint=false`;
    window.open(url);
    return false;
  }
};
// 是否混放
const isMixProductPosition = async () => {
  let storageId = state.formData.storageId;
  let storageArea = state.formData.areaCode; // 库区
  let channelCode = state.positionConfig.channelCode ? state.positionConfig.channelCode : null;
  let shelveCode = state.positionConfig.shelveCode ? state.positionConfig.shelveCode : null;
  let colNo = state.positionConfig.colNo ? state.positionConfig.colNo : null;
  let rowNo = state.positionConfig.rowNo ? state.positionConfig.rowNo : null;
  let isMixProduct = state.positionConfig.isMixProductPosition ? 1 : 0;
  // let positionInfo = {
  // 	storageId: storageId,
  // 	storageArea: storageArea,
  // 	channelCode: channelCode,
  // 	shelveCode: shelveCode,
  // 	colNo: colNo,
  // 	rowNo: rowNo,
  // 	isMixProduct: isMixProduct,
  // };
  let url = '/basic/storage/position/isMixProductPosition';
  let params = {
    storageId: storageId,
    storageArea: storageArea,
    channelCode: channelCode,
    shelveCode: shelveCode,
    colNo: colNo,
    rowNo: rowNo,
    isMixProduct: isMixProduct,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res.result) {
    refreshArea();
  }
  state.toolConfig.isMixProductPositionVisible = false;
};
// 是否可用
const enablePosition = async () => {
  let storageId = state.formData.storageId;
  let storageArea = state.formData.areaCode; // 库区
  let channelCode = state.positionConfig.channelCode ? state.positionConfig.channelCode : null;
  let shelveCode = state.positionConfig.shelveCode ? state.positionConfig.shelveCode : null;
  let colNo = state.positionConfig.colNo ? state.positionConfig.colNo : null;
  let rowNo = state.positionConfig.rowNo ? state.positionConfig.rowNo : null;
  let enable = state.positionConfig.enablePosition ? 1 : 0;
  let url = '/basic/storage/position/enablePosition';
  let params = {
    storageId: storageId,
    storageArea: storageArea,
    channelCode: channelCode,
    shelveCode: shelveCode,
    colNo: colNo,
    rowNo: rowNo,
    enable: enable,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res.result) {
    refreshArea();
  }
  state.toolConfig.enablePositionVisible = false;
};
// 显示货架自定义信息
const showShelveSetting = () => {
  state.toolConfig.setShelveInfoVisible = true;
  popoverRef.value.hide();
};
// 货架设置
const setShelveInfo = () => {
  let rowNum = state.positionConfig.rowNum;
  if (!rowNum || rowNum <= 0) {
    proxy.$message.error('请输入货架层数！');
    proxy.$refs.configRowNum.focus().select();
    return;
  }
  let columnNum = state.positionConfig.columnNum;
  if (!columnNum || columnNum <= 0) {
    proxy.$message.error('请输入货架列数!');
    proxy.$refs.configColumnNum.focus().select();
    return;
  }
  let positionRegular = state.positionConfig.positionRegular;
  if (!positionRegular || parseInt(positionRegular) <= 0) {
    proxy.$message.error('请输入货位编码规则!');
    proxy.$refs.configPositionRegular.focus().select();
    return;
  }

  // 通过通道设置
  if (!state.positionConfig.shelveCode) {
    state.positionConfig.selectChannelShelveList.forEach((item: any) => {
      let oldShelveInfo: any = null;
      state.shelveDataList.forEach((val: any) => {
        if (item.channelCode === val.channelCode && item.shelveCode === val.shelveCode) {
          oldShelveInfo = val;
        }
      });
      if (oldShelveInfo) {
        oldShelveInfo.rowNum = state.positionConfig.rowNum;
        oldShelveInfo.columnNum = state.positionConfig.columnNum;
        oldShelveInfo.positionRegular = state.positionConfig.positionRegular;
      } else {
        oldShelveInfo = {};
        oldShelveInfo.storageId = state.areaData.storageId;
        oldShelveInfo.areaCode = state.formData.areaCode;
        oldShelveInfo.channelCode = state.positionConfig.channelCode;
        oldShelveInfo.shelveCode = item.shelveCode;
        oldShelveInfo.rowNum = state.positionConfig.rowNum;
        oldShelveInfo.columnNum = state.positionConfig.columnNum;
        oldShelveInfo.positionRegular = state.positionConfig.positionRegular;
        state.shelveDataList.push(oldShelveInfo);
      }
    });
    state.isRefresh = true;
    state.toolConfig.setShelveInfoVisible = false;
    return;
  }

  let findShelveInfo = null;
  findShelveInfo = state.shelveDataList.find((item: any) => {
    return item.storageId === state.areaData.storageId && item.areaCode === state.formData.areaCode && item.channelCode === state.positionConfig.channelCode && item.shelveCode === state.positionConfig.shelveCode;
  });
  if (!findShelveInfo) {
    findShelveInfo = {
      storageId: 0,
      storageName: '',
      areaCode: '',
      channelCode: null,
      shelveCode: null,
      rowNum: 0,
      columnNum: 0,
    };
    findShelveInfo.storageId = state.areaData.storageId;
    findShelveInfo.areaCode = state.formData.areaCode;
    findShelveInfo.channelCode = state.positionConfig.channelCode;
    findShelveInfo.shelveCode = state.positionConfig.shelveCode;
    findShelveInfo.rowNum = state.positionConfig.rowNum;
    findShelveInfo.columnNum = state.positionConfig.columnNum;
    // findShelveInfo.positionRegular = state.positionConfig.positionRegular;
    state.shelveDataList.push(findShelveInfo);
  } else {
    findShelveInfo.rowNum = state.positionConfig.rowNum;
    findShelveInfo.columnNum = state.positionConfig.columnNum;
    // findShelveInfo.positionRegular = state.positionConfig.positionRegular;
  }
  /** **************************************
   * 设置编码规则级别
   *************************************** */
  if (state.positionConfig.action === '通道') {
    // 通道级别编码规则
    findShelveInfo.positionRegular = state.positionConfig.positionRegular;
  } else if (state.positionConfig.action === '层') {
    // 层级别编码规则
    if (!findShelveInfo.columnConfigs) {
      findShelveInfo.columnConfigs = [];
    }
    const existConfig = findShelveInfo.columnConfigs.find((cItem: any) => {
      return cItem.colNo === state.positionConfig.colNo;
    });
    if (existConfig) {
      existConfig.positionRegular = state.positionConfig.positionRegular;
    } else {
      findShelveInfo.columnConfigs.push({
        colNo: state.positionConfig.colNo,
        positionRegular: state.positionConfig.positionRegular,
      });
    }
  } else if (state.positionConfig.action === '列') {
    // 列级别编码规则
    if (!findShelveInfo.rowConfigs) {
      findShelveInfo.rowConfigs = [];
    }
    const existConfig = findShelveInfo.rowConfigs.find((cItem: any) => {
      return cItem.rowNo === state.positionConfig.rowNo;
    });
    if (existConfig) {
      existConfig.positionRegular = state.positionConfig.positionRegular;
    } else {
      findShelveInfo.rowConfigs.push({
        rowNo: state.positionConfig.rowNo,
        positionRegular: state.positionConfig.positionRegular,
      });
    }
  }

  state.isRefresh = true;
  state.toolConfig.setShelveInfoVisible = false;
};
// 通道货架数设置
const setChannelShelveNum = () => {
  let rowNum = state.positionConfig.rowNum;
  if (!rowNum || rowNum <= 0) {
    proxy.$message.error('请输入货架层数！');
    proxy.$refs.configRowNum.focus().select();
    return;
  }
  let columnNum = state.positionConfig.columnNum;
  if (!columnNum || columnNum <= 0) {
    proxy.$message.error('请输入货架列数!');
    proxy.$refs.configColumnNum.focus().select();
    return;
  }
  let positionRegular = state.positionConfig.positionRegular;
  if (!positionRegular || parseInt(positionRegular) <= 0) {
    proxy.$message.error('请输入货位编码规则!');
    proxy.$refs.configPositionRegular.focus().select();
    return;
  }

  let findChannelInfo = state.channelDataList.find((item: any) => {
    return item.storageId === state.areaData.storageId && item.areaCode === state.formData.areaCode && item.channelCode === state.positionConfig.channelCode;
  });
  if (!findChannelInfo) {
    findChannelInfo = {};
    findChannelInfo.storageId = state.areaData.storageId;
    findChannelInfo.areaCode = state.formData.areaCode;
    findChannelInfo.channelCode = state.channelNumConfig.channelCode;

    findChannelInfo.pickMode = state.channelNumConfig.pickMode;
    findChannelInfo.shelveNumA1 = state.channelNumConfig.shelveNumA1;
    findChannelInfo.shelveNumA2 = state.channelNumConfig.shelveNumA2;
    findChannelInfo.shelveNumB1 = state.channelNumConfig.shelveNumB1;
    findChannelInfo.shelveNumB2 = state.channelNumConfig.shelveNumB2;

    state.channelDataList.push(findChannelInfo);
  } else {
    findChannelInfo.channelCode = state.channelNumConfig.channelCode;

    findChannelInfo.pickMode = state.channelNumConfig.pickMode;
    findChannelInfo.shelveNumA1 = state.channelNumConfig.shelveNumA1;
    findChannelInfo.shelveNumA2 = state.channelNumConfig.shelveNumA2;
    findChannelInfo.shelveNumB1 = state.channelNumConfig.shelveNumB1;
    findChannelInfo.shelveNumB2 = state.channelNumConfig.shelveNumB2;
  }

  state.isRefresh = true;
  state.toolConfig.isShelveNum = false;
};
// 最低库存
const submitminCapacity = async () => {
  let storageId = state.formData.storageId;
  let storageArea = state.formData.areaCode; // 库区
  let channelCode = state.positionConfig.channelCode ? state.positionConfig.channelCode : null;
  let shelveCode = state.positionConfig.shelveCode ? state.positionConfig.shelveCode : null;
  let colNo = state.positionConfig.colNo ? state.positionConfig.colNo : null;
  let rowNo = state.positionConfig.rowNo ? state.positionConfig.rowNo : null;
  let minCapacity = state.positionConfig.minCapacity;
  // let positionInfo = {
  // 	storageId: storageId,
  // 	storageArea: storageArea,
  // 	channelCode: channelCode,
  // 	shelveCode: shelveCode,
  // 	colNo: colNo,
  // 	rowNo: rowNo,
  // 	minCapacity: minCapacity,
  // };
  let url = '/basic/storage/position/submitminCapacity';
  let params = {
    storageId: storageId,
    storageArea: storageArea,
    channelCode: channelCode,
    shelveCode: shelveCode,
    colNo: colNo,
    rowNo: rowNo,
    minCapacity: minCapacity,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    proxy.$message.error(err.message);
    return;
  }
  if (res.result) {
    state.positionConfig.minCapacity = 0;
    refreshArea();
  }
  state.toolConfig.isminCapacity = false;
};
// 上传SVG图
const uploadSvg = () => {
  if (!state.formData.storageId) {
    proxy.$message.error('请选择仓库！');
    return false;
  }
  if (!state.formData.areaCode) {
    proxy.$message.error('请选择库区！');
    return false;
  }
  state.uploadOptions.uploadVisible = true;
};
// 上传事件前事件
const beforeImportSubmit = () => {
  // 自定义参数
  state.importConfig.params = {
    storageId: state.formData.storageId,
    areaCode: state.formData.areaCode,
  };
};
// 获取svg内容
const getSvgContent = () => {
  state.svgUrl = state.areaData.svgUrl;
};
// 显示通道货架数对话框
const showChannelShelveNum = () => {
  state.toolConfig.isShelveNum = true;
  state.channelNumConfig.channelCode = state.positionConfig.channelCode;
  let findChannelInfo = state.channelDataList.find((item: any) => {
    return item.storageId === state.areaData.storageId && item.areaCode === state.formData.areaCode && item.channelCode === state.channelNumConfig.channelCode;
  });

  state.channelNumConfig.pickMode = state.areaData.pickMode;
  state.channelNumConfig.shelveNumA1 = state.areaData.shelveNumA1;
  state.channelNumConfig.shelveNumA2 = state.areaData.shelveNumA2;
  state.channelNumConfig.shelveNumB1 = state.areaData.shelveNumB1;
  state.channelNumConfig.shelveNumB2 = state.areaData.shelveNumB2;

  if (findChannelInfo) {
    state.channelNumConfig.shelveNumA1 = findChannelInfo.shelveNumA1;
    state.channelNumConfig.shelveNumA2 = findChannelInfo.shelveNumA2;
    state.channelNumConfig.shelveNumB1 = findChannelInfo.shelveNumB1;
    state.channelNumConfig.shelveNumB2 = findChannelInfo.shelveNumB2;
  }
};
//上传svg 图片
const onClosed = async (fileList: any) => {
  if (!fileList || !fileList.length) {
    return;
  }

  let url = '/basic/storage/storageArea/saveSvg';
  let params = {
    storageId: state.formData.storageId,
    areaCode: state.formData.areaCode,
    url: fileList[0].url,
  };
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    proxy.$message.success(res.msg);
    state.svgUrl = fileList[0].url;
  }
};
</script>

<style lang="scss" scoped>
.position-container {
  padding: 10px;
  background-color: white;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
  overflow: auto;
  ::v-deep .el-form-item__label {
    padding: 0;
    &::after {
      content: '：';
    }
  }

  .layoutarea {
    // overflow-x: auto;
    // overflow-y: visible;
    .position-layout {
      width: 50000px;
    }
  }

  /* table-wrap */
  ::v-deep .table-wrap {
    position: relative;
    display: inline-block;
    * {
      margin: 0;
      padding: 0;
      list-style: none;
      font-family: '微软雅黑', Arial;
    }
    .table-row {
      position: relative;
      background-color: #fff;
      min-height: 100px;
      padding: 10px 0 10px 0;
      border-bottom: 1px solid #ccc;
      .column-num {
        width: 35px;
        height: 50px;
        position: absolute;
        margin-top: -25px;
        left: 10px;
        top: 50%;
        font-size: 14px;
        color: #666;
        z-index: 100;
        cursor: pointer;
      }
    }

    .table-row.didui {
      margin: 20px 0;
    }

    .table-row .column-num p {
      font-size: 24px;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 400;
      color: #333;
    }

    .table-row .t-box {
      position: relative;
    }

    .table-row .t-box .guanlian-line {
      display: block;
      width: 20px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-right: none;
      height: 10px;
      position: absolute;
      top: 50%;
      left: 60px;
    }

    .table-row .column-line {
      min-height: 100px;
      padding-left: 100px;
    }

    .table-row .column-line.didui {
      padding-left: 50px;
    }

    .table-row .column-line .nood-a,
    .table-row .column-line .nood-b {
      position: relative;
    }

    .table-row .column-line .nood-a .nood-text,
    .table-row .column-line .nood-b .nood-text {
      display: block;
      width: 18px;
      height: 40px;
      line-height: 1.5;
      position: absolute;
      top: 50%;
      margin-top: 15px;
      left: -20px;
      font-size: 12px;
      color: #666;
      border: 1px solid #ccc;
      text-align: center;
    }

    .table-row .column-line .nood-b .nood-text {
      margin-top: -50px !important;
    }

    .table-row .column-line .table-reset {
      display: inline-block;
      margin-left: 50px;
      position: relative;
      vertical-align: top;
    }

    .table-row .column-line .table-reset .table-num {
      font-size: 14px;
      color: #666;
      font-weight: 400;
      margin: 0 0 25px 0;
    }

    .table-row .column-line .table-reset .table-num.didui {
      margin: 0 0 0px 0;
    }

    .table-row .column-line .table-reset .table-num strong {
      font-size: 24px;
      font-weight: 400;
      padding-left: 5px;
      color: #333;
      cursor: pointer;
    }

    .table-row .column-line .table-reset .table-num.didui strong {
      display: none;
    }

    .table-row .column-line .table-reset .table-list-ul {
      position: relative;
      display: table;
    }

    /* .table-row .column-line .table-reset .table-list-ul:last-child{ border-bottom:1px solid #ccc;} */

    .table-row .column-line .table-reset .table-list-ul li {
      position: relative;
      min-width: 100px;
      padding-right: 5px;
      height: 30px;
      line-height: 30px;
      border: 1px solid #ccc;
      border-right: none;
      border-bottom: none;
      display: table-cell;
      font-size: 12px;
      padding-left: 5px;
      color: #666;
    }

    .table-row .column-line .table-reset .table-list-ul li.border-bottom {
      border-bottom: 1px solid #ccc;
    }

    .table-row .column-line .table-reset .table-list-ul li:last-child {
      border-right: 1px solid #ccc;
    }

    .table-row .column-line .table-reset .table-list-ul li .t-n {
      position: absolute;
      top: -30px;
      left: 10px;
      font-size: 12px;
      cursor: pointer;
    }

    .table-row .column-line .table-reset .table-list-ul li .b-n {
      position: absolute;
      bottom: -30px;
      left: 10px;
      font-size: 12px;
      cursor: pointer;
    }

    .table-row .column-line .table-reset .table-list-ul li .l-n {
      position: absolute;
      left: -25px;
      top: 1px;
      font-size: 12px;
      cursor: pointer;
    }

    /* B面style */

    .table-row .column-line .nood-b {
      margin-top: 20px;
    }

    .table-row .column-line .nood-b .table-num {
      font-size: 14px;
      color: #666;
      font-weight: 400;
      margin: 20px 0 0 0;
    }

    .nood-b .table-reset .table-list-ul:last-child {
      border-bottom: 10px solid #ccc !important;
      background-color: red !important;
    }

    /* 图标类型 */

    .postype-1 {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: url(/static/images/type.png) no-repeat 0 0;
      vertical-align: middle;
      position: absolute;
      bottom: 3px;
      right: 3px;
    }

    .postype-2 {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: url(/static/images/type.png) no-repeat -8px 0;
      vertical-align: middle;
      position: absolute;
      bottom: 3px;
      right: 3px;
    }

    .postype-3 {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: url(/static/images/type.png) no-repeat -16px 0;
      vertical-align: middle;
      position: absolute;
      bottom: 3px;
      right: 3px;
    }

    .postype-4 {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: url(/static/images/type.png) no-repeat -24px 0;
      vertical-align: middle;
      position: absolute;
      bottom: 3px;
      right: 3px;
    }

    .postype-5 {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: url(/static/images/type.png) no-repeat -32px 0;
      vertical-align: middle;
      position: absolute;
      bottom: 3px;
      right: 3px;
    }

    .postype-6 {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: url(/static/images/type.png) no-repeat -40px 0;
      vertical-align: middle;
      position: absolute;
      bottom: 3px;
      right: 3px;
    }

    .postype-7 {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: url(/static/images/type.png) no-repeat -48px 0;
      vertical-align: middle;
      position: absolute;
      bottom: 3px;
      right: 3px;
    }

    .locked {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: url(/static/images/type.png) no-repeat -56px 0;
      vertical-align: middle;
      position: absolute;
      top: 3px;
      right: 3px;
    }

    .isMixProduct {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: url(/static/images/type.png) no-repeat -64px 0;
      vertical-align: middle;
      position: absolute;
      top: 3px;
      right: 3px;
    }
  }
  /* 工具栏按钮 */
  .btn-tool {
    position: absolute;
    top: -100px;
    left: -100px;
    width: 0;
    height: 0;
    padding: 0;
    border: 0;
    font-size: 0;
    line-height: 0;
  }
  ::v-deep .el-dialog__body {
    padding: 10px 20px 30px;
  }
  .position-config {
    ::v-deep .el-form-item {
      margin-bottom: 0px;
    }
  }
  // SVG图
  .svg-box {
    overflow: auto;
    ::v-deep svg {
      width: 100%;
    }
  }
}
</style>
