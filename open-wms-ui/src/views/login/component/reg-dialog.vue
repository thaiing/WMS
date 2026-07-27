<template>
	<div class="reg-container">
		<el-dialog v-model="currentDialogVisible" draggable overflow :show-close="false" width="800" class="reg-dialog" :close-on-click-modal="false">
			<template #header="{ close, titleId, titleClass }">
				<div class="my-header">
					<h1 :id="titleId" :class="titleClass"><span class="colorblue">立即构建</span> 企业数字化供应链平台</h1>
					<el-button type="danger" icon="Close" plain circle size="small" @click="close" />
				</div>
			</template>
			<el-form ref="ruleFormRef" style="max-width: 320px" :model="regForm" :rules="rules" label-width="auto" class="register-form" size="large" status-icon>
				<el-form-item label="联系人：" prop="nickName">
					<el-input v-model="regForm.nickName" placeholder="请输入联系人" />
				</el-form-item>
				<el-form-item label="公司名称：" prop="companyName">
					<el-input v-model="regForm.companyName" placeholder="请输入公司名称" />
				</el-form-item>
				<el-form-item label="手机号码：" prop="phoneNumber">
					<el-input v-model="regForm.phoneNumber" placeholder="请输入手机号码" />
				</el-form-item>
				<el-form-item label="验证码：" prop="code">
					<el-input v-model="regForm.code" placeholder="请输入验证码" style="width: 113px" />
					<el-button type="primary" :disabled="state.smsBtnDisabled" style="width: 110px" @click="clickGetCode(ruleFormRef)"> {{ state.timeMsg }} </el-button>
				</el-form-item>
				<el-form-item label=" ">
					<el-button type="primary" @click="submitForm(ruleFormRef)"> 立即注册 </el-button>
					<el-button plain @click="currentDialogVisible = false">取消</el-button>
				</el-form-item>
			</el-form>
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
	timeMsg: '获取验证码',
	smsBtnDisabled: false,
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

interface RegForm {
	nickName: string;
	companyName: string;
	phoneNumber: string;
	code: string;
}

const ruleFormRef = ref<FormInstance>();
const regForm = reactive<RegForm>({
	nickName: '',
	companyName: '',
	phoneNumber: '',
	code: '',
});

const rules = reactive<FormRules<RegForm>>({
	nickName: [
		{ required: true, message: '请输入联系人', trigger: 'blur' },
		{ min: 3, max: 18, message: '字符长度在3~18', trigger: 'blur' },
	],
	companyName: [
		{
			required: true,
			message: '请输入公司名称',
			trigger: 'change',
		},
	],
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
			register(); // 开始注册
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
	let url = '/resource/sms/code/' + regForm.phoneNumber;
	let params = {};
	const [err, res] = await to(postData(url, params));
	if (err) {
		state.smsBtnDisabled = false;
		return;
	}
	if (res.result) {
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

// 注册用户
const register = async () => {
	state.smsBtnDisabled = true;
	let url = '/auth/register';
	let params = regForm;
	const [err, res] = await to(postData(url, params));
	state.smsBtnDisabled = false;
	if (err) {
		return;
	}
	if (res.result) {
		proxy.common.showMsg(res);
		currentDialogVisible.value = false;
	}
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
	}
}
</style>
