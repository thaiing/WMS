<template>
  <div class="info-contianer">
    <div class="user-container-body">
      <h1 class="user-title">个人信息</h1>
      <el-card style="max-width: 100%; margin-bottom: 20px">
        <template #header>
          <div class="card-header">
            <span>账号资料</span>
          </div>
        </template>

        <el-form label-width="auto" style="max-width: 1000px">
          <el-form-item class="form-item" label="当前账号">
            <span class="content">{{ userInfo.phoneNumber }}</span>
          </el-form-item>
          <el-form-item class="form-item" label="姓名">
            <template v-if="state.currentName !== 'nickName'">
              <span class="content mr-20">{{ userInfo.nickName }}</span>
              <svg-icon name="icon-bianji" title="编辑" class="edit-icon" @click="editField('nickName', userInfo.nickName)"></svg-icon>
            </template>

            <template v-if="state.currentName === 'nickName'">
              <el-input v-model="state.currentValue" style="width: 140px" placeholder="请输入" />
              <el-button type="primary" @click="saveEdit">保存</el-button>
              <el-button type="default" @click="cancelEdit">取消</el-button>
            </template>
          </el-form-item>
          <el-form-item class="form-item" label="微信号">
            <template v-if="state.currentName !== 'weChat'">
              <span class="content mr-20">{{ userInfo.weChat }}</span>
              <svg-icon name="icon-bianji" title="编辑" class="edit-icon" @click="editField('weChat', userInfo.weChat)"></svg-icon>
            </template>

            <template v-if="state.currentName === 'weChat'">
              <el-input v-model="state.currentValue" style="width: 140px" placeholder="请输入" />
              <el-button type="primary" @click="saveEdit">保存</el-button>
              <el-button type="default" @click="cancelEdit">取消</el-button>
            </template>
          </el-form-item>
          <el-form-item class="form-item" label="备注">
            <template v-if="state.currentName !== 'remark'">
              <span class="content mr-20">{{ userInfo.remark }}</span>
              <svg-icon name="icon-bianji" title="编辑" class="edit-icon" @click="editField('remark', userInfo.remark)"></svg-icon>
            </template>

            <template v-if="state.currentName === 'remark'">
              <el-input v-model="state.currentValue" style="width: 140px" placeholder="请输入" />
              <el-button type="primary" @click="saveEdit">保存</el-button>
              <el-button type="default" @click="cancelEdit">取消</el-button>
            </template>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card style="max-width: 100%; margin-bottom: 20px">
        <template #header>
          <div class="card-header">
            <span class="mr-20">账号安全</span>
            <el-rate v-model="securityRate" allow-half disabled />
          </div>
        </template>
        <el-form label-width="auto" style="max-width: 1000px">
          <el-form-item class="form-item" label="密码强度">
            <el-progress style="width: 300px; margin-right: 10px" :text-inside="true" :stroke-width="20" :percentage="userInfo.passwordStrength" status="success">
              <span>{{ passwordStrengthText }}</span>
            </el-progress>
            <svg-icon name="icon-bianji" title="修改密码" class="edit-icon" @click="state.modifyPwdVisible = true"></svg-icon>
          </el-form-item>
          <el-form-item class="form-item" label="绑定手机号">
            <span class="content mr-20">{{ userInfo.phoneNumber }}</span>
            <el-tag v-if="userInfo.phoneVerified" type="success" effect="dark" class="mr-20">
              <svg-icon name="ele-Check" class="mr-5"></svg-icon>
              已验证
            </el-tag>
            <el-tag v-else type="warning" effect="dark" class="mr-20">
              <svg-icon name="ele-Warning" class="mr-5"></svg-icon>
              未验证
            </el-tag>
            <svg-icon name="icon-bianji" title="重新绑定手机号" class="edit-icon mr-20" @click="state.modifyPhoneVisible = true"></svg-icon>
            <svg-icon v-if="!userInfo.phoneVerified" name="icon-shouji4" :size="18" title="验证手机号" class="edit-icon" @click="state.phoneCheckDialogVisible = true"></svg-icon>
          </el-form-item>
          <el-form-item class="form-item" label="email">
            <span class="content mr-20">{{ userInfo.email }}</span>
            <el-tag v-if="userInfo.emailVerified" type="success" effect="dark" class="mr-20">
              <svg-icon name="ele-Check" class="mr-5"></svg-icon>
              已验证
            </el-tag>
            <el-tag v-else type="warning" effect="dark" class="mr-20">
              <svg-icon name="ele-Warning" class="mr-5"></svg-icon>
              未验证
            </el-tag>
            <svg-icon name="icon-bianji mr-20" title="重新绑定邮箱" class="edit-icon" @click="state.modifyEmailVisible = true"></svg-icon>
            <el-popconfirm v-if="!userInfo.emailVerified" title="点击确认发送邮箱验证连接。" :width="300" @confirm="sendActiveEmail">
              <template #reference>
                <svg-icon name="fa-envelope-open-o" title="验证邮箱" class="edit-icon"></svg-icon>
              </template>
            </el-popconfirm>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="danger" @click="cancelUser">注销用户账号</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!--修改密码弹窗-->
    <modify-pwd ref="modifypwdDialogRef" v-model:visible="state.modifyPwdVisible" :is-orgin-pwd="false" @on-closed="onClosed"></modify-pwd>

    <!--修改修改手机弹窗-->
    <phone-modify-dialog v-model:visible="state.modifyPhoneVisible" :phoneNumber="userInfo.phoneNumber" @on-closed="onClosed"></phone-modify-dialog>

    <!--修改修改手机弹窗-->
    <email-modify-dialog v-model:visible="state.modifyEmailVisible" :email="userInfo.email" @on-closed="onClosed"></email-modify-dialog>

    <!--手机号验证-->
    <el-dialog v-model="state.phoneCheckDialogVisible" title="手机号验证" class="dialog-container" width="550px" draggable overflow append-to-body>
      <el-form ref="ruleFormRef" :model="regForm" :rules="rules" size="large" class="mt-30">
        <el-form-item label="验证码：" prop="code">
          <el-input v-model="regForm.code" placeholder="请输入验证码" style="width: 113px" />
          <el-button type="primary" :disabled="state.smsBtnDisabled" @click="clickGetCode(ruleFormRef)"> {{ state.timeMsg }} </el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">确定验证</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="flex-end">
          <el-button @click="state.phoneCheckDialogVisible = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="system-tenant-user-info">
import { BaseProperties, DetailField } from '/@/types/base-type';
import { reactive, ComponentInternalInstance } from 'vue';
import { DataType, QueryType } from '/@/types/common';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import ModifyPwd from '/@/views/system/permission/components/modify-pwd-self.vue';
import PhoneModifyDialog from './components/phone-modify-dialog.vue';
import EmailModifyDialog from './components/email-modify-dialog.vue';
import type { ComponentSize, FormInstance, FormRules } from 'element-plus';

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const state = reactive({
  password: '',
  currentName: '',
  currentValue: '',
  modifyPwdVisible: false,
  modifyPhoneVisible: false,
  modifyEmailVisible: false,
  timeMsg: '获取验证码',
  smsBtnDisabled: false,
  phoneCheckDialogVisible: false,
});

//#region 计算属性
// 当前用户
const userInfo = computed(() => proxy.common.getUserInfo());

// 密码强度描述
const passwordStrengthText: any = computed(() => {
  let text = '';
  if (userInfo.value.passwordStrength > 80) {
    text = '很强';
  } else if (userInfo.value.passwordStrength > 60) {
    text = '强';
  } else if (userInfo.value.passwordStrength > 40) {
    text = '中';
  } else if (userInfo.value.passwordStrength > 20) {
    text = '弱';
  } else {
    text = '很弱';
  }
  return text + userInfo.value.passwordStrength + '%';
});

// 整体安全等级
const securityRate: any = computed(() => {
  let rate = 0;
  if (userInfo.value.passwordStrength > 80) {
    rate = 3;
  } else if (userInfo.value.passwordStrength > 60) {
    rate = 2;
  } else if (userInfo.value.passwordStrength > 40) {
    rate = 1;
  } else if (userInfo.value.passwordStrength > 20) {
    rate = 0.5;
  } else {
    rate = 0;
  }
  if (userInfo.value.phoneVerified) {
    rate += 1;
  }
  if (userInfo.value.emailVerified) {
    rate += 1;
  }
  return rate;
});

//#endregion

// 开始编辑
const editField = (fieldName: string, fieldValue: string) => {
  state.currentName = fieldName;
  state.currentValue = fieldValue;
};

// 取消编辑
const cancelEdit = () => {
  state.currentName = '';
  state.currentValue = '';
};

// 保存编辑
const saveEdit = async () => {
  let url = '/system/permission/user/update-multi-condition';
  let params: any = {
    // 更新字段
    columns: {},
    // 更新条件
    queryBoList: [
      {
        column: 'userId',
        values: userInfo.value.userId,
        queryType: QueryType.EQ,
        dataType: DataType.LONG,
      },
    ],
  };
  params.columns[state.currentName] = state.currentValue;
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  let _user: any = userInfo;
  _user.value[state.currentName] = state.currentValue;
  proxy.common.showMsg(res);
  state.currentName = '';
  state.currentValue = '';
};

const onClosed = (passwordStrength: number) => {
  userInfo.value.passwordStrength = passwordStrength;
};

// 发送激活邮件验证连接
const sendActiveEmail = async () => {
  let url = '/system/permission/user/sendActiveEmail';
  let params = {};
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
};

/****************************************************************
 * 表单验证提交
 ****************************************************************/
interface RegForm {
  phoneNumber: string;
  code: string;
  captchaVerification: string;
}

const ruleFormRef = ref<FormInstance>();
const regForm = reactive<RegForm>({
  phoneNumber: '',
  code: '',
  captchaVerification: '',
});

const rules = reactive<FormRules<RegForm>>({
  phoneNumber: [
    {
      required: true,
      message: '请输入手机号码',

      trigger: 'change',
    },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: '请输入正确的手机号格式',
      trigger: 'blur',
    },
  ],
  code: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'change',
    },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      sendPhoneActivate(); // 激活手机号
    } else {
      proxy.$message.error(`请输入正确填写表单信息`);
    }
  });
};

// 单击获取验证码
const clickGetCode = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validateField('phoneNumber', (valid, fields) => {
    if (valid) {
      getCode();
    } else {
      proxy.$message.error(`请输入正确输入手机号信息`);
    }
  });
};

// 获取验证码
const getCode = async () => {
  state.smsBtnDisabled = true;
  let url = '/resource/sms/code/' + userInfo.value.phoneNumber;
  let params = {};
  const [err, res] = await to(postData(url, params, false));
  if (err) {
    state.smsBtnDisabled = false;
    return;
  }
  if (res.result) {
    timeLong = 60;
    timeoutMsg();
  }
};

let timeLong = 60; // 60 seconds
const timeoutMsg = () => {
  if (timeLong <= 0) {
    state.smsBtnDisabled = false;
    state.timeMsg = `获取验证码`;

    return;
  }
  setTimeout(() => {
    state.timeMsg = `剩余时间${timeLong}秒`;
    timeLong--;
    timeoutMsg();
  }, 1000);
};

// 激活手机号
const sendPhoneActivate = async () => {
  state.smsBtnDisabled = true;
  let url = '/system/permission/user/sendPhoneActivate';
  regForm.phoneNumber = userInfo.value.phoneNumber;
  let params = regForm;
  const [err, res] = await to(postData(url, params));
  state.smsBtnDisabled = false;
  timeLong = 0;
  if (err) {
    regForm.code = '';
    return;
  }
  if (res.result) {
    proxy.common.showMsg(res);
    state.phoneCheckDialogVisible = false;
    userInfo.value.phoneVerified = true;
  }
};

// 注销用户
const cancelUser = () => {
  proxy.$message.warning('注销用户需谨慎，请联系运维管理员！');
};
</script>

<style lang="scss" scoped>
.info-contianer {
  margin: 0;
  ::v-deep .el-form-item--default {
    margin-bottom: 10px;
  }

  .user-container-body {
    width: 1160px;
    margin: 0 auto;
    .card-header {
      display: flex;
      align-items: center;
    }
    .user-title {
      line-height: 3;
      padding-left: 5px;
    }
    .content {
      padding: 0;
    }
    .form-item:hover {
      .edit-icon {
        display: inline-block !important;
      }
    }
    .edit-icon {
      display: none;
      cursor: pointer;
      color: #1d7bf7;
    }
  }
}
</style>
