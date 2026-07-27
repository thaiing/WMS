<template>
  <el-dialog draggable v-model="currentVisible" width="600px" title="修改密码" append-to-body>
    <el-form ref="form" :model="state.form" class="demo-form-inline w-400">
      <el-form-item :label-width="state.formLabelWidth" label="请输入密码：">
        <el-input v-model="state.form.password" :type="state.passwordType" auto-complete="off">
          <template #suffix>
            <span class="show-pwd" @click="showPwd">
              <svg-icon :name="state.passwordType == 'password' ? 'icon-yanjing-bi' : 'icon-yanjing'" />
            </span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item :label-width="state.formLabelWidth" label="重复输入密码：">
        <el-input v-model="state.form.password_repeat" :type="state.passwordType" auto-complete="off">
          <template #suffix>
            <span class="show-pwd" @click="showPwd">
              <svg-icon :name="state.passwordType == 'password' ? 'icon-yanjing-bi' : 'icon-yanjing'" />
            </span>
          </template>
        </el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex flex-end">
        <el-button @click="currentVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifypwd">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="modify-pwd">
import { reactive, ComponentInternalInstance, getCurrentInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import { ElTable } from 'element-plus';
import to from 'await-to-js';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:visible']);

//#region 定义属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  id: '',
  passwordType: 'password',
  form: {
    password: '',
    password_repeat: '',
  },
  formLabelWidth: '150px',
  consignorId: '' as any,
});
//#endregion

//#region 计算属性
// 当前宽度
const currentVisible = computed({
  get: function () {
    return props.visible;
  },
  set: function (val) {
    emit('update:visible', val);
  },
});
//#endregion

onMounted(() => {});

const showPwd = () => {
  if (state.passwordType === 'password') {
    state.passwordType = '';
  } else {
    state.passwordType = 'password';
  }
};

const setConsignorId = (consignorId: number) => {
  state.consignorId = consignorId;
};

const modifypwd = async () => {
  if (!state.consignorId) {
    proxy.$message.error('货主ID不能为空！');
    return;
  }
  // 密码
  var password = state.form.password;
  if (password.length < 5) {
    proxy.$message.error('密码必须大于5位！');
    return;
  }

  // 重复密码
  var password_repeat = state.form.password_repeat;
  if (password_repeat.length < 5) {
    proxy.$message.error('密码必须大于5位！');
    return;
  } else if (password_repeat !== password) {
    proxy.$message.error('两次密码不一致！');
    return;
  }

  const url = '/basic/base/consignor/updatePwd';
  const params = {
    consignorId: state.consignorId,
    newPassword: password,
  };
  let [err, res] = await to(postData(url, params));
  if (err) return;

  proxy.common.showMsg(res);
  if (res?.result) {
    currentVisible.value = false;
    state.consignorId = null;
    state.form.password = '';
    state.form.password_repeat = '';
  }
};

// 对外暴露属性和方法
defineExpose({
  setConsignorId,
});
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding: 0px 10px;
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.show-pwd {
  position: absolute;
  right: 10px;
  top: 2px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
</style>
