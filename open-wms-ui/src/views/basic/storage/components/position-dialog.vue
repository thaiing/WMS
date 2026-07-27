<template>
  <el-dialog ref="uploadRef" draggable v-model="currentDialogVisible" :title="$tt(positionTitle)" class="position-dialog-container" width="780px" append-to-body>
    <el-alert :closable="false" :title="$tt('提示：请认真填写下面库区各项参数，然后点击确定按钮生成库存货位布局。')" type="success" class="alert-msg"> </el-alert>
    <el-form ref="form" :model="state.formData" :rules="state.rules" label-width="140px" class="form-wrap" size="">
      <el-form-item required :label="$tt('仓库名称')" class="margin-bottom-10">
        <span>{{ state.formData.storageName }}</span>
      </el-form-item>
      <el-form-item required :label="$tt('库区名称')" prop="areaCode">
        <input-select v-model="state.formData.areaCode" :options="state.areaCodeList" :click-hidden="true" :label="$tt('库区名称')" input-width="200px" trigger="click"> </input-select>
      </el-form-item>
      <el-form-item required :label="$tt('温层类型')" prop="thermocLine">
        <el-select v-model="state.formData.thermocLine" placeholder="请选择温层类型" class="w-200">
          <el-option :label="$tt('常温层')" value="常温层"></el-option>
          <el-option :label="$tt('冷藏')" value="冷藏"></el-option>
          <el-option :label="$tt('冷冻')" value="冷冻"></el-option>
          <el-option :label="$tt('恒温')" value="恒温"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item required :label="$tt('编码规则')" prop="positionRegular"> <el-input v-model="state.formData.positionRegular" :placeholder="$tt('请输入货位编码规则')" class="w-200"> </el-input> {{ $tt('标准编码规则：{库区}-{通道}{货架}{层}{列}') }} </el-form-item>
      <el-form-item required :label="$tt('货位类型')" prop="positionType">
        <el-select v-model.number="state.formData.positionType" placeholder="请选择货位类型" class="w-200">
          <el-option v-for="(item, index) in state.positionTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item required :label="$tt('货位最大重量')" prop="maxWeight">
        <el-input-number v-model.number="state.formData.maxWeight" controls-position="right" class="w-200"></el-input-number>
      </el-form-item>
      <el-form-item required :label="$tt('货位最大拍数')" prop="maxBeatNumber">
        <el-input-number v-model.number="state.formData.maxBeatNumber" controls-position="right" class="w-200"></el-input-number>
      </el-form-item>
      <el-form-item required :label="$tt('货位最大数量')" prop="maxCapacity">
        <el-input-number v-model.number="state.formData.maxCapacity" controls-position="right" class="w-200"></el-input-number>
      </el-form-item>
      <el-form-item required :label="$tt('存货率计算')" prop="inventoryRate">
        <el-radio-group v-model="state.formData.inventoryRate">
          <el-radio label="按数量">{{ $tt('按数量') }}</el-radio>
          <el-radio label="按重量">{{ $tt('按重量') }}</el-radio>
          <el-radio label="按拍数">{{ $tt('按拍数') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item required :label="$tt('摆放模式')" prop="shelveMode">
        <el-radio-group v-model="state.formData.shelveMode" @change="onChangeShelveMode">
          <el-radio label="立体货架">{{ $tt('立体货架') }}</el-radio>
          <el-radio label="地堆">{{ $tt('地堆') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="state.formData.shelveMode === '立体货架'">
        <el-form-item required :label="$tt('拣货模式')" prop="pickMode">
          <el-radio-group v-model="state.formData.pickMode" @change="onChangePickMode">
            <el-radio label="U型">{{ $tt('U型') }}</el-radio>
            <el-radio label="Z型">{{ $tt('Z型') }}</el-radio>
            <el-radio label="AB面奇偶型">{{ $tt('AB面奇偶型') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item required :label="$tt('库区通道数')" prop="channelNum">
          <el-input-number v-model.number="state.formData.channelNum" controls-position="right" class="w-100"></el-input-number>
          <span class="tip">{{ $tt('当前库区总共有多少个通道') }}</span>
        </el-form-item>
        <el-form-item required :label="$tt('货架层数')" prop="rowNum">
          <el-input-number v-model.number="state.formData.rowNum" controls-position="right" class="w-100"></el-input-number>
          <span class="tip">每个货架有多少层</span>
        </el-form-item>
        <el-form-item required :label="$tt('货架列数')" prop="columnNum">
          <el-input-number v-model.number="state.formData.columnNum" controls-position="right" class="w-100"></el-input-number>
          <span class="tip">{{ $tt('每个货架每层分多少列（格）') }}</span>
        </el-form-item>
        <template v-if="state.formData.pickMode == 'U型'">
          <el-form-item required :label="$tt('A面货架编号范围')" prop="shelveNumA1">
            <el-input-number v-model.number="state.formData.shelveNumA1" :disabled="true" controls-position="right" class="w-100"></el-input-number> ~
            <el-input-number v-model.number="state.formData.shelveNumA2" controls-position="right" class="w-100"></el-input-number>
            <span class="tip">{{ $tt('库区一般每个通道中存在A面、B面') }}</span>
          </el-form-item>
          <el-form-item required :label="$tt('B面货架编号范围')" prop="shelveNumB1">
            <el-input-number v-model.number="state.formData.shelveNumB1" controls-position="right" class="w-100"></el-input-number> ~
            <el-input-number v-model.number="state.formData.shelveNumB2" controls-position="right" class="w-100"></el-input-number>
            <span class="tip">{{ $tt('库区开头可能只有A面，结尾只有B面') }}</span>
          </el-form-item>
        </template>
        <template v-else-if="state.formData.pickMode == 'Z型'">
          <el-form-item required :label="$tt('货架编号范围')" prop="shelveNumA1">
            <el-input-number v-model.number="state.formData.shelveNumZ1" :disabled="true" controls-position="right" class="w-100"></el-input-number> ~
            <el-input-number v-model.number="state.formData.shelveNumZ2" controls-position="right" class="w-100"></el-input-number>
          </el-form-item>
        </template>
      </template>
      <template v-if="state.formData.shelveMode === '地堆'">
        <el-form-item required :label="$tt('库区通道数')" prop="channelNumDidui">
          <el-input-number v-model.number="state.formData.channelNumDidui" controls-position="right" class="w-100"></el-input-number>
          <span class="tip">{{ $tt('当前地堆库区总共有多少个通道') }}</span>
        </el-form-item>
        <el-form-item required :label="$tt('地堆行数')" prop="rowNumDidui">
          <el-input-number v-model.number="state.formData.rowNumDidui" controls-position="right" class="w-100"></el-input-number>
          <span class="tip">{{ $tt('每个货架有多少层') }}</span>
        </el-form-item>
        <el-form-item required :label="$tt('地堆列数')" prop="columnNumDidui">
          <el-input-number v-model.number="state.formData.columnNumDidui" controls-position="right" class="w-100"></el-input-number>
          <span class="tip">{{ $tt('每个地堆区分多少列（格）') }}</span>
        </el-form-item>
      </template>
    </el-form>

    <template #footer class="dialog-footer">
      <el-button @click="currentDialogVisible = false">
        <template #icon>
          <svg-icon name="yrt-guanbi1" class="text-size-n" :size="14" />
        </template>
        {{ $tt('取消') }}
      </el-button>
      <el-button @click="resetForm">
        <template #icon>
          <svg-icon name="yrt-reset" class="text-size-n" :size="14" />
        </template>
        {{ $tt('重置') }}
      </el-button>
      <el-button :loading="state.isLoading" type="primary" @click="submitForm">
        <template #icon>
          <svg-icon name="yrt-save" class="text-size-n" :size="14" />
        </template>
        {{ $tt('确定') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// import InputSelect from '@/components/base/InputSelect';
import { BaseProperties } from '/@/types/base-type';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import { ComponentInternalInstance } from 'vue';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:visible', 'on-closed']);

//#region 定义属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: null,
  },
  options: {
    type: Object,
    default: () => {
      return {};
    },
  },
  // 表单数据
  areaData: {
    type: Object,
    default: () => {
      return {
        // 摆放模式
        shelveMode: '立体货架',
        // 拣货模式
        pickMode: 'U型',
      };
    },
  },
  importData: {
    type: Function,
    default: () => {
      return () => {};
    },
  },
  // 标题
  positionTitle: {
    type: String,
    default: null,
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  isLoading: false,
  // 库区候选项
  areaCodeList: 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(',').map((item) => {
    return {
      label: item,
      value: item,
    };
  }),
  // 货位类型
  positionTypeList: [
    {
      label: '常规货位',
      value: 1,
    },
    {
      label: '残品货位',
      value: 2,
    },
    {
      label: '借入货位',
      value: 3,
    },
    {
      label: '收货位',
      value: 4,
    },
    {
      label: '下架理货位',
      value: 5,
    },
    {
      label: '暂存货位',
      value: 6,
    },
    {
      label: '虚拟货位',
      value: 7,
    },
    {
      label: '次品货位',
      value: 8,
    },
    {
      label: '拣货车',
      value: 9,
    },
    {
      label: '灯光分拣位',
      value: 11,
    },
    {
      label: '高架货位',
      value: 12,
    },
    {
      label: '存储货位',
      value: 13,
    },
    {
      label: '临期货位',
      value: 14,
    },
  ],
  // 验证规则
  rules: {
    areaCode: [{ required: true, message: '请选择库区名称', trigger: 'blur' }],
    positionType: [{ required: true, message: '请选择货位类型', trigger: 'blur' }],
    thermocLine: [{ required: true, message: '请选择温层类型', trigger: 'blur' }],
    positionRegular: [{ required: true, message: '编码规则不能为空', trigger: 'blur' }],
    shelveMode: [{ required: true, message: '请选择摆放模式', trigger: 'blur' }],
    pickMode: [{ required: true, message: '请选择拣货模式', trigger: 'blur' }],
    maxWeight: [{ required: true, message: '请输入货位最大重量', trigger: 'blur' }],
    maxBeatNumber: [{ required: true, message: '请输入货位最大拍数', trigger: 'blur' }],
    maxCapacity: [
      { required: true, message: '请输入最大库位量', trigger: 'blur' },
      { type: 'number', min: 1, message: '最小值为1', trigger: 'blur' },
    ],
    channelNum: [
      { required: true, message: '请输入库区通道数', trigger: 'blur' },
      { type: 'number', min: 1, message: '最小值为1', trigger: 'blur' },
    ],
    rowNum: [
      { required: true, message: '请输入货架层数', trigger: 'blur' },
      { type: 'number', min: 1, message: '最小值为1', trigger: 'blur' },
    ],
    columnNum: [
      { required: true, message: '请输入货架列数', trigger: 'blur' },
      { type: 'number', min: 1, message: '最小值为1', trigger: 'blur' },
    ],
    shelveNumA1: [
      { required: true, message: '请输入A面货架编号范围', trigger: 'blur' },
      { type: 'number', min: 1, message: '最小值为1', trigger: 'blur' },
    ],
    shelveNumB1: [
      { required: true, message: '请输入B面货架编号范围', trigger: 'blur' },
      { type: 'number', min: 1, message: '最小值为1', trigger: 'blur' },
    ],
    channelNumDidui: [
      { required: true, message: '请输入库区通道数', trigger: 'blur' },
      { type: 'number', min: 1, message: '最小值为1', trigger: 'blur' },
    ],
    rowNumDidui: [
      { required: true, message: '请输入地堆行数', trigger: 'blur' },
      { type: 'number', min: 1, message: '最小值为1', trigger: 'blur' },
    ],
    columnNumDidui: [
      { required: true, message: '请输入地堆列数', trigger: 'blur' },
      { type: 'number', min: 1, message: '最小值为1', trigger: 'blur' },
    ],
    shelveNumZ1: [
      { required: true, message: '货架编号范围', trigger: 'blur' },
      { type: 'number', min: 1, message: '最小值为1', trigger: 'blur' },
    ],
  } as any,
  // 当前表单数据
  formData: {
    maxCapacity: 0,
    rowNumDidui: 0,
    columnNumDidui: 0,
    inventoryRate: '按数量',
    action: '',
    channelNum: 0,
    rowNum: 0,
    shelveMode: '',
    channelNumDidui: 0,
    columnNum: 0,
    pickMode: '',
    shelveNumA2: 0,
    shelveNumB2: 0,
    shelveNumA1: 0,
    shelveNumZ1: 0,
    shelveNumZ2: 0,
    shelveNumB1: 0,
    maxWeight: 0,
    maxBeatNumber: 0,
    positionRegular: '',
    thermocLine: '',
    areaCode: '',
    storageName: '',
    positionType: undefined,
  },
});
//#endregion

// 是否显示dialog
const currentDialogVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val); // 双向绑定prop.action，通知父级组件变量值同步更新
  },
});

watch(
  () => props.areaData,
  (newVal) => {
    state.formData = JSON.parse(JSON.stringify(props.areaData));
    state.formData.inventoryRate = state.formData.inventoryRate || '按数量';
  },
  { deep: true }
);
onMounted(async () => {
  // getareaCodeList();
});
// 获得库区下拉框
// const getareaCodeList=()=> {
// 	const url = '/api/sys/param/getValueList';
// 	const params = {
// 		type_Id: 735,
// 	};
// 	this.common.ajax(url, params, (res) => {
// 		this.common.showMsg(res);
// 		if (res.result) {
// 			this.areaCodeList = res.data.map((item) => {
// 				return {
// 					value: item.value02,
// 					label: item.value02,
// 				};
// 			});
// 		}
// 	});
// };
// 保存数据
const submitForm = () => {
  if (state.formData.action === 'modify' && state.formData.channelNum > props.areaData.channelNum) {
    proxy.$message.error('新输入通道数不能小于原通道数！');
    return;
  }
  if (state.formData.action === 'modify' && state.formData.rowNum > props.areaData.rowNum) {
    proxy.$message.error('新输入货架层数不能小于原货架层数！');
    return;
  }
  if (state.formData.action === 'modify' && state.formData.channelNum > props.areaData.channelNum) {
    proxy.$message.error('新输入货架列数不能小于原货架列数！');
    return;
  }
  if (state.formData.shelveMode === '地堆') {
    state.formData.channelNum = state.formData.channelNumDidui;
    state.formData.rowNum = state.formData.rowNumDidui;
    state.formData.columnNum = state.formData.columnNumDidui;
  } else {
    if (state.formData.pickMode === 'U型') {
      if (state.formData.action === 'modify' && state.formData.shelveNumA2 > props.areaData.shelveNumA2) {
        proxy.$message.error('新输入A面货架数不能小于原A面货架数！');
        return;
      }
      if (state.formData.action === 'modify' && state.formData.shelveNumB2 > props.areaData.shelveNumB2) {
        proxy.$message.error('新输入B面货架数不能小于原B面货架数！');
        return;
      }
      if (state.formData.action === 'modify' && state.formData.shelveNumA2 > props.areaData.shelveNumA2) {
        proxy.$message.error('新输入货架数不能小于原货架数！');
        return;
      }
    } else if (state.formData.pickMode === 'Z型') {
      state.formData.shelveNumA1 = state.formData.shelveNumZ1;
      state.formData.shelveNumA2 = state.formData.shelveNumZ2;

      if (state.formData.action === 'modify' && state.formData.shelveNumA2 > props.areaData.shelveNumA2) {
        proxy.$message.error('新输入货架数不能小于原货架数！');
        return;
      }
      if (state.formData.shelveNumA1 > state.formData.shelveNumA2) {
        proxy.$message.error('请输入货架编号范围，开始值不能大于结束值！');
        return;
      }
      state.formData.shelveNumB1 = 0;
      state.formData.shelveNumB2 = 0;
    } else if (state.formData.pickMode === 'AB面奇偶型') {
      if (state.formData.action === 'modify' && state.formData.shelveNumA2 > props.areaData.shelveNumA2) {
        proxy.$message.error('新输入货架数不能小于原货架数！');
        return;
      }
      if (state.formData.shelveNumA1 > state.formData.shelveNumA2) {
        proxy.$message.error('请输入货架编号范围，开始值不能大于结束值！');
        return;
      }
      state.formData.shelveNumB1 = 0;
      state.formData.shelveNumB2 = 0;
    }
  }

  proxy.$refs['form'].validate((valid: any, result: any) => {
    if (valid) {
      proxy.$emit('on-confirm', state.formData);
      currentDialogVisible.value = false;
    } else {
      Object.keys(result).forEach((key) => {
        proxy.$message.error(result[key][0].message);
      });
      return false;
    }
  });
};
// 重置
const resetForm = () => {
  proxy.$refs['form'].resetFields();
};
// 摆放模式
const onChangeShelveMode = (val: any) => {
  if (val === '立体货架') {
    state.formData.shelveNumA1 = 1;
    state.formData.shelveNumA2 = 2;
  }
};
// 设置AB
const onChangePickMode = (val: any) => {
  if (val === 'AB面奇偶型' || val === 'U型') {
    state.formData.shelveNumA1 = 1;
    state.formData.shelveNumA2 = 2;
  }
};
</script>

<style lang="scss" scoped>
.position-dialog-container {
  ::v-deep .el-dialog__body {
    padding-top: 0px;
  }
  ::v-deep .scrollbar-wrap {
    max-height: 400px;
    overflow-x: hidden;
    padding: 0px;
  }
  .form-wrap {
    margin-top: 20px;
  }
}
</style>
