<template>
  <div>
    <el-dialog draggable v-model="currentVisible" title="生成波次" width="30%" class="dialog-container">
      <el-form ref="form" :model="state.form" label-width="150px">
        <el-form-item label="波次订单数">
          <el-input v-model.number="state.form.orderCount" class="w-250"></el-input>
        </el-form-item>
        <el-form-item label="拣货优先级">
          <el-select v-model="state.form.priority" placeholder="请选择优先级" class="w-250">
            <el-option v-for="item in state.priorityList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="派单">
          <el-select v-model="state.form.userId" :placeholder="$tt('请选择拣货人')" filterable remote :remote-method="remoteMethod" clearable class="w-250">
            <el-option v-for="item in state.form.userList" :key="item.userId" :label="item.nickName" :value="item.userId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="state.form.remark" class="w-250"></el-input>
        </el-form-item>
      </el-form>
      <template class="right" #footer>
        <span>
          <el-button @click="currentVisible = false">取 消</el-button>
          <el-button type="primary" @click="createOrderWave">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="create-order-dialog">
import { ComponentInternalInstance } from 'vue';

import { BaseProperties } from '/@/types/base-type';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import scanHook from '/@/components/hooks/scanHook';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

//#region 配置参数
const config = ref({
  // 是否启用装箱操作
  batch_count: 0,
});

const base = scanHook({
  config,
  // 配置参数自定义处理
  doData: (item: any, hookOptions: any) => {
    let configKey = item.configKey; // 字段名称
    let configValue = item.configValue;

    if (proxy.common.isNumber(item.configValue)) {
      configValue = parseInt(item.configValue);
    }

    // 扫描明细必填项
    hookOptions.config.value[configKey] = !!configValue;
    state.form.orderCount = configValue;
  },
});
//#endregion

const emit = defineEmits(['update:visible', 'on-closed']);

//#region 定义属性
const props = defineProps({
  visible: Boolean,
  ids: Number,
  // 选中的订单ID
  dataListSelections: {
    type: Array,
    default: () => {
      return [];
    },
    required: true,
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  // 配置参数
  config: config.value,
  number: 0,
  form: {
    orderCount: 1,
    priority: 0,
    userId: null,
    userTrueName: '',
    userList: [] as any[],
    remark: '',
  },
  priorityList: [] as any[],
});

//#endregion

//#region onMounted
onMounted(async () => {
  remoteMethod('');

  var priorityList = [
    {
      label: '普通',
      value: 0,
    },
    {
      label: '优先',
      value: 1,
    },
  ];
  state.priorityList = priorityList;
  state.form.priority = 0;
});
//#endregion

// 是否显示dialog
const currentVisible = computed({
  get() {
    return props.visible;
  },
  set(newValue) {
    emit('update:visible', newValue); // 双向绑定prop.action，通知父级组件变量值同步更新
  },
});

// 获取用户
const remoteMethod = async (query: any) => {
  const url = '/system/permission/user/getUserList';
  const params = {
    name: query,
    storageUser: 1,
  };

  let [err, res] = await to(postData(url, params));

  if (err) {
    return;
  }
  state.form.userList = res?.data;
  proxy.common.showMsg(res);
};

// 生成波次
const createOrderWave = async () => {
  var userId = state.form.userId;
  var priority = state.form.priority;

  if (userId) {
    var nickName = state.form.userList.find((item: any) => item.userId === userId).nickName;
  }
  const url = '/outbound/operation/orderWave/createOrderWave';
  const params = {
    ids: props.dataListSelections.map((m: any) => m.orderId),
    orderCount: state.form.orderCount,
    priority: priority,
    userId: userId,
    nickName: nickName,
    remark: state.form.remark,
  };

  let [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  proxy.common.showMsg(res);
  currentVisible.value = false;
  emit('on-closed'); // 关闭窗口事件
};

defineExpose({});
</script>
