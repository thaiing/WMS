<template>
  <div class="reg-container">
    <el-dialog v-model="currentDialogVisible" draggable overflow :show-close="false" width="960" class="reg-dialog" :close-on-click-modal="false" @opened="dialogOpened()">
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <h1 :id="titleId" :class="titleClass"><span class="colorblue">商家注册认证</span></h1>
          <el-button type="danger" icon="Close" plain circle size="small" @click="close" />
        </div>
      </template>
      <el-form ref="ruleFormRef" style="max-width: 430px" :model="state.merForm" :rules="state.rules" label-width="auto" class="register-form" status-icon>
        <el-form-item label="商家名称：" prop="nickName">
          <el-input v-model="state.merForm.nickName" placeholder="企业全程必须与营业执照一致" />
        </el-form-item>
        <el-form-item label="统一社会信用代码：" prop="licenseNumber">
          <el-input v-model="state.merForm.licenseNumber" />
        </el-form-item>
        <el-form-item label="联系人：" prop="linker">
          <el-input v-model="state.merForm.linker" />
        </el-form-item>
        <el-form-item label="联系电话：" prop="phoneNumber">
          <el-input v-model="state.merForm.phoneNumber" />
        </el-form-item>
        <el-form-item label="email：" prop="email">
          <el-input v-model="state.merForm.email" />
        </el-form-item>
        <el-form-item label="传真：" prop="fax">
          <el-input v-model="state.merForm.fax" />
        </el-form-item>
        <el-form-item label="省：" prop="provinceName">
          <el-select v-model="state.merForm.provinceId" filterable @change="(val) => provinceChange(val)">
            <el-option v-for="(items, indexs) in state.provinceNameSelect" :key="indexs" :label="items.provinceName" :value="items.provinceId"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市：" prop="cityName">
          <el-select v-model="state.merForm.cityId" filterable @change="(val) => cityChange(val)">
            <el-option v-for="(items, indexs) in state.cityNameSelect" :key="indexs" :label="items.cityName" :value="items.cityId"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="办公地址：" prop="address">
          <el-input v-model="state.merForm.address" />
        </el-form-item>
        <el-form-item label="营业执照上传：" prop="fileList">
          <upload-file v-model="state.fileList" :options="state.options"></upload-file>
        </el-form-item>

        <el-form-item label=" " prop="agree">
          <el-checkbox v-model="state.merForm.agree"> 我已阅读并同意 <a href="#" @click.prevent="showAgreement">《用户协议》</a> </el-checkbox>
        </el-form-item>

        <el-form-item label=" ">
          <el-button type="primary" @click="submitForm(ruleFormRef)">提交申请 </el-button>
          <el-button plain @click="currentDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="测试平台用户协议" v-model="state.agreementDialogVisible" width="60%">
      <div class="agreement-content">
        <p>用户在使用平台服务前，应仔细阅读本协议的全部内容，用户使用平台服务即表示用户已充分理解平台的使用方式及产生真实支付订单的含义。并同意接受本协议的约束。用户确认本协议后，本协议即在用户和网站之间产生法律效力。</p>
        <p>• 用户在注册平台账号时，应提供真实、准确、完整的个人信息以及注册所需要的公司信息。</p>
        <p>• 用户注册成功后即成为平台的注册用户，可以使用平台提供的服务。平台旨在提供一个模拟环境，用于测试订单支付交易流程。通过本平台，可以模拟形成真实支付订单。本平台发出的测试订单将被真实推送至您所指定的付款银行，形成真实的支付订单。用户可以忽略该真实订单，也可进行实际支付。因而用户须在实际支付前，在付款银行的操作界面仔细核对支付订单信息，以确保所有细节准确无误后进行支付。任何支付测试的结果均以付款银行的记录和反馈为最终依据。本平台不承担因注册用户对平台使用误解或订单信息填写错误而造成的用户财务损失。</p>
        <p>• 用户应妥善保管自己的账号密码及注册时所用的手机号码，并对账号下的所有行为负责。如用户发现账号被盗用或存在安全漏洞的情况，应立即通知平台并合作处理。</p>
        <p>• 用户有权根据平台提供的服务，浏览信息、发布内容、参与讨论等。用户应确保其发布的内容不侵犯任何第三方的合法权益，包括但不限于知识产权、名誉权、隐私权等。</p>
        <p>• 用户在本网站的所有行为都须符合中国的法律法规，不得利用本网站提供的服务制作、复制、发布、传播违法信息。</p>
        <p>• 用户注册时有义务提供完整、真实、的个人信息，信息如有变更，应及时更新。</p>
        <p>• 用户必须自行配备使用网站的所需设备，包括个人电脑、手机等，并自行负担个人上网所支付的与此服务有关的电话费用、网络费用。</p>
        <p>• 网站有权在必要时修改服务条款，网站服务条款一旦发生变动，将会在重要页面上提示修改内容。</p>
        <!-- 更多协议内容... -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="state.agreementDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="acceptAgreement">同 意</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="inbound-scan-order">
import { ComponentInternalInstance } from 'vue';
import type { ComponentSize, FormInstance, FormRules } from 'element-plus';
import { BaseProperties } from '/@/types/base-type';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy: BaseProperties = ins.proxy as BaseProperties;
import { DataType, OrderByType, OrderItem, QueryBo, QueryType } from '/@/types/common';
import UploadFile from '/@/components/base/UploadFile.vue';

// 事件定义
const emit = defineEmits(['update:visible', 'field-change']);

//#region 定义属性
const props = defineProps({
  // 是否显示
  visible: {
    type: Boolean,
    default: false,
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  provinceNameSelect: [] as any[],
  cityNameSelect: [] as any,
  agreementDialogVisible: false,
  fileList: [] as any[], // 上传后接受的值
  merForm: {
    nickName: '',
    licenseNumber: '',
    linker: '',
    phoneNumber: '',
    email: '',
    fax: '',
    provinceId: undefined,
    provinceName: '',
    cityId: undefined,
    cityName: '',
    address: '',
    fileName: '',
    agree: false, // 是否勾选用户协议
  },
  options: {
    multiple: true, // 是否多选
    disabled: false, // 上传组件是否可用
    listType: 'text', // text/picture/picture-card，参考elementplus
    buttonType: 'text', // 按钮类型，参考elementplus
  },

  rules: {
    nickName: [
      { required: true, message: '商家名称', trigger: 'blur' },
      { min: 3, max: 18, message: '字符长度在3~18', trigger: 'blur' },
    ],
    licenseNumber: [
      {
        required: true,
        message: '请输入统一社会信用代码',
        trigger: 'change',
      },
    ],
    linker: [
      {
        required: true,
        message: '请输入联系人',
        trigger: 'change',
      },
    ],
    phoneNumber: [
      {
        required: true,
        message: '请输入联系电话',
        trigger: 'change',
      },
    ],
    email: [
      {
        required: true,
        message: '请输入Email',

        trigger: 'change',
      },
      {
        pattern: /^((\w+)|(\w+[!#$%&'*+\-,./=?^_`{|}~\w]*[!#$%&'*+\-,/=?^_`{|}~\w]))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,10}|[0-9]{1,3})(\]?)$/,
        message: '请输入正确的Email格式',
        trigger: 'blur',
      },
    ],
    address: [
      {
        required: true,
        message: '请输入办公地址',
        trigger: 'change',
      },
    ],
    agree: [{ required: true, message: '请先同意用户协议', trigger: 'change' }],
  },
});
//#endregion

//#region 计算属性
// 显示窗口
const currentDialogVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});
//#endregion

//#region onMounted
onMounted(async () => {
  getProvinceList();
  getCityList();
});
//#endregion

const ruleFormRef = ref<FormInstance>();

// 窗口打开完毕后
const dialogOpened = () => {
  refresh();
};
// 获取省
const getProvinceList = async () => {
  const url = '/basic/base/city/getProvinceList';
  const params = {};
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result && res.data) {
    state.provinceNameSelect = res.data.map((item: any) => {
      item.provinceId = item.cityId;
      item.provinceName = item.cityName;
      return item;
    });
    state.provinceNameSelect;
  }
};

// 获取市
const getCityList = async () => {
  const url = '/basic/base/city/getCityList';
  const params = {};
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    state.cityNameSelect = res.data;
  }
};

// 根据省ID获得市
const loadChildrenNodeOrigin = async (id: any, dropdownId: any, prop: any) => {
  if (!id) {
    return;
  }
  let whereList: Array<QueryBo> = []; // 查询条件
  whereList.push({
    column: 'parentId',
    values: id,
    queryType: QueryType.EQ,
    dataType: DataType.INT,
  });
  let orderByList: Array<OrderItem> = []; // 排序提交
  orderByList.push({
    column: 'parentId',
    orderByType: OrderByType.DESC,
  });
  let url = '/system/core/common/loadTreeNode';
  let params = {
    tableName: 'baseCity',
    keyName: 'cityId',
    nodeName: 'cityName',
    fixHasChild: false,
    showOutsideNode: false,
    parentName: 'parentId',
    whereList: whereList, // 查询条件
    orderByList: orderByList, // 排序字段
    extendColumns: '',
  };
  let res = await postData(url, params);
  if (res.result) {
    var data = res.data.map((item: { value: any; label: any }) => {
      if (prop === 'provinceName') {
        const newItem = {
          cityId: item.value,
          cityName: item.label,
          value: item.value,
          label: item.label,
        };
        return newItem;
      } else if (prop === 'cityName') {
        const newItem = {
          regionId: item.value,
          regionName: item.label,
          value: item.value,
          label: item.label,
        };
        return newItem;
      }
    });
    if (prop === 'provinceName') {
      state.cityNameSelect = data;
    }
  } else {
    proxy.$message.error(res.msg);
  }
};
// 省下拉框事件
const provinceChange = (val: any) => {
  loadChildrenNodeOrigin(val, 614, 'provinceName');

  // 找到对应省份的名称
  const selectedProvince = state.provinceNameSelect.find((item: any) => item.provinceId === val);
  if (selectedProvince) {
    // 更新省份名称
    state.merForm.provinceName = selectedProvince.provinceName;
  }
};
// 市下拉框事件
const cityChange = (val: any) => {
  loadChildrenNodeOrigin(val, 615, 'cityName');

  // 找到对应市份的名称
  const selectedProvince = state.cityNameSelect.find((item: any) => item.cityId === val);
  if (selectedProvince) {
    // 更新市份名称
    state.merForm.cityName = selectedProvince.cityName;
  }
};
// 提交申请
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      register(); // 开始注册
    } else {
      proxy.$message.error(`请输入正确填写表单信息`);
    }
  });
};

// 注册用户
const register = async () => {
  if (!state.merForm.agree) {
    proxy.$message.error('请先同意用户协议');
    return;
  }
  if (!state.fileList) {
    proxy.$message.error('请上传营业执照');
    return;
  }
  let files = state.fileList.map((m) => m.url).join(',');
  state.merForm.fileName = files;
  if (!state.merForm.fileName) {
    proxy.$message.error('请上传营业执照');
    return;
  }

  let url = '/system/permission/user/register';
  let params = state.merForm;
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  if (res.result) {
    proxy.common.showMsg(res);
    currentDialogVisible.value = false;
    refresh();
  }
};
const showAgreement = () => {
  state.agreementDialogVisible = true;
};
const acceptAgreement = () => {
  state.agreementDialogVisible = false;
  state.merForm.agree = true;
};
const refresh = () => {
  state.merForm.nickName = '';
  state.merForm.licenseNumber = '';
  state.merForm.linker = '';
  state.merForm.phoneNumber = '';
  state.merForm.email = '';
  state.merForm.fax = '';
  state.merForm.provinceId = undefined;
  state.merForm.provinceName = '';
  state.merForm.cityId = undefined;
  state.merForm.cityName = '';
  state.merForm.address = '';
  state.merForm.fileName = '';
  state.fileList = [];
};
</script>

<style lang="scss">
.reg-container {
  .reg-dialog {
    position: relative;
    z-index: 1;
    /* 为伪元素设置背景图片和透明度 */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      background-image: url(https://auod-beijing.oss-cn-beijing.aliyuncs.com/wms/dijing/register-bg02.png);
      background-size: 59%;
      background-position: 378px -10px;
      background-repeat: no-repeat;
      opacity: 0.5;
    }
    .my-header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 16px;
      font-size: 28px;
      letter-spacing: 2px;
      z-index: 2;
      position: relative;
    }

    .colorblue {
      color: #005cef !important;
    }
    .dialog-footer {
      justify-content: flex-end;
    }
    .register-form {
      box-sizing: border-box;
    }
    .agreement-content {
      max-height: 400px;
      overflow-y: auto;
      padding: 20px;
      border: 1px solid #ebeef5;
      background-color: #fff;
      color: #606266;
      font-size: 14px;
      line-height: 1.75;
      letter-spacing: 1px; /* 增加字间距 */
    }

    /* 如果需要进一步调整 p 标签的样式 */
    .agreement-content p {
      margin-bottom: 16px;
      letter-spacing: 1px; /* 确保每个段落的字间距一致 */
    }
  }
}
</style>
