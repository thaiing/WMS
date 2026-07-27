<template>
	<el-dialog v-model="currentDialogVisible" :top="common.getDialogTop()" title="修改手机号" class="dialog-container" width="480px" draggable overflow append-to-body destroy-on-close :close-on-click-modal="false" @open="onOpen">
		<div class="fx-solution-center-wrapper">
			<Verify mode="pop" :captchaType="captchaType" :imgSize="{ width: '400px', height: '200px' }" ref="verify" @success="handleSuccess" @error="handleError"></Verify>

			<div v-if="!state.isChecked" class="user-detail-modal-aliyun" id="user-detail-modal-aliyun" @click="onShow('blockPuzzle')">
				<div id="SM_BTN_WRAPPER_1" class="sm-btn-wrapper">
					<div id="SM_BTN_1" class="sm-btn sm-btn-default" style="width: 401px; height: 42px; line-height: 42px">
						<div class="sm-ico">
							<div class="shield">
								<svg width="12px" height="14px" viewBox="0 0 200 255">
									<g id="Page3" stroke="#eeeeee" strokewidth="1" fill="none" fillrule="evenodd">
										<g id="Group3" fill="#ffffff" fillrule="nonzero">
											<path d="M192.215987,31.5402031 C190.026012,31.619176 187.868479,31.6497744 185.757709,31.6497744 L185.748648,31.6497744 C130.221833,31.6497744 105.760339,6.2755772 105.556627,6.05672609 L100.008184,0 L94.4518488,6.05672609 C94.2095573,6.32191195 68.3980713,33.5987437 7.78430533,31.5402029 L2.8561292e-07,31.2753086 L0,146.302981 C0,176.418758 10.0841737,220.345176 97.2848165,253.952079 L100.000584,255 L102.715183,253.952079 C189.915826,220.345176 200,176.418467 200,146.302981 L200,31.2753086 L192.215987,31.5402031 Z" id="Shape3"></path>
										</g>
									</g>
								</svg>
							</div>
							<div class="sm-ico-wave"></div>
							<div class="out-silder-circle"></div>
						</div>
						<span id="SM_TXT_1" class="sm-txt">请点击按钮开始智能验证</span>
						<div id="rectMask" style="width: 403px; height: 44px; line-height: 44px">
							<div class="rect-top" id="rectTop" style="width: 401px; height: 21px; line-height: 42px"></div>
							<div class="rect-bottom" id="rectBottom" style="width: 401px; height: 21px; line-height: 42px; top: 22px"></div>
						</div>
					</div>
					<div id="sm-btn-bg" style="width: 401px; height: 42px; line-height: 42px"></div>
				</div>
			</div>
			<el-form v-else ref="ruleFormRef" :model="regForm" :rules="rules" label-width="auto" class="register-form" size="large" status-icon>
				<el-form-item label="当前手机号：">
					{{ props.phoneNumber }}
				</el-form-item>
				<el-form-item label="验证码：" prop="code">
					<el-input v-model="regForm.code" placeholder="请输入验证码" style="width: 113px" />
					<el-button type="primary" :disabled="state.smsBtnDisabled" style="width: 110px" @click="clickGetCode(ruleFormRef)"> {{ state.timeMsg }} </el-button>
				</el-form-item>
				<el-form-item label="新手机号码：" prop="phoneNumber">
					<el-input v-model="regForm.phoneNumber" placeholder="请输入新手机号码" style="width: 228px" />
				</el-form-item>
			</el-form>
		</div>
		<template #footer>
			<span class="flex-end">
				<el-button @click="currentDialogVisible = false">取 消</el-button>
				<el-button @click="submitForm(ruleFormRef)" type="primary">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="phone-modify-dialog">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import { DataType, OrderByType, OrderItem, QueryBo, QueryType } from '/@/types/common';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';
import Verify from '/@/components/verifition/Verify.vue';
import type { ComponentSize, FormInstance, FormRules } from 'element-plus';
import { useUserStore } from '/@/stores/modules/user';
const userStore = useUserStore();
import { Session, Local } from '/@/utils/storage';

let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy: BaseProperties = ins.proxy as BaseProperties;
// 事件定义
const emit = defineEmits(['update:visible', 'on-closed']);

//#region 定义属性
const props = defineProps({
	// 是否显示
	visible: {
		type: Boolean,
		default: false,
	},
	// 原手机号
	phoneNumber: {
		type: String,
	},
});
//#endregion

//#region 定义变量
const state = reactive({
	isChecked: false, // 验证码校验成功
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

onMounted(() => {});

/**
 * 验证码校验
 */
const verify = ref();
const captchaType = ref('');
const onShow = (type: string) => {
	captchaType.value = type;
	verify?.value.show();
};
const handleSuccess = (res: any) => {
	state.isChecked = true;
	regForm.captchaVerification = res.captchaVerification;
};
const handleError = (res: any) => {
	console.log('error=', res);
	console.log('error');
};
const onOpen = () => {
	state.isChecked = false;
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
			modifyPhoneNumber(); // 修改手机号
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
	let url = '/resource/sms/code/' + props.phoneNumber;
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

// 修改手机号
const modifyPhoneNumber = async () => {
	state.smsBtnDisabled = true;
	let url = '/system/permission/user/modifyPhoneNumber';
	let params = regForm;
	const [err, res] = await to(postData(url, params));
	state.smsBtnDisabled = false;
	timeLong = 0;
	if (err) {
		state.isChecked = false;
		regForm.code = '';
		return;
	}
	if (res.result) {
		proxy.common.showMsg(res);
		currentDialogVisible.value = false;

		setTimeout(async () => {
			// 清除缓存/token等
			await userStore.logout();
			Session.clear();
			// 使用 reload 时，不需要调用 resetRoute() 重置路由
			window.location.reload();
		}, 1000);
	}
};
</script>

<style lang="scss">
.dialog-container {
	position: relative;
	.el-dialog__body {
		padding: 0px !important;
		padding-bottom: 10px !important;
	}
	.el-dialog__footer {
		padding: 0px !important;
		box-sizing: border-box;
	}
}
.sm-btn {
	line-height: 42px;
	border: 1px solid #ddd;
	cursor: pointer;
	overflow: hidden;
}
.user-detail-modal-aliyun {
	margin: 10px 0 20px 10px;
	background: #fff;
	text-align: center;
}

.user-detail-modal-aliyun .sm-btn {
	border: 1px solid #dae1ea;
	border-radius: 4px;
}

.user-detail-modal-aliyun .sm-txt {
	vertical-align: top;
}

.user-detail-modal-aliyun .rect-bottom,
.user-detail-modal-aliyun .rect-top,
.user-detail-modal-aliyun .sm-pop-close {
	display: none;
}
#rectMask {
	overflow: hidden;
	position: absolute;
}
.sm-btn-default .sm-ico {
	position: relative;
	background: none;
	display: inline-block;
	margin-top: -3px;
	margin-left: 12px;
	margin-right: 10px;
	width: 36px;
	height: 36px;
	border-radius: 50%;
	line-height: 36px;
	text-align: center;
	vertical-align: middle;
}
#rectMask {
	top: 0;
	left: 0;
}
.sm-btn-wrapper {
	position: relative;
}

.sm-btn-default .right-tick {
	display: none;
}
.sm-btn-default .shield {
	animation: shieldanimation 1.5s infinite;
}

.sm-btn-default .sm-ico:hover {
	box-shadow: 0 0 10px #00de76;
	background: rgba(0, 222, 118, 0.3);
}
.sm-btn-default:hover {
	box-shadow: 0 0 8px #65f4b5;
}
.sm-btn-default .sm-ico {
	position: relative;
	background: none;
	display: inline-block;
	margin-top: -3px;
	margin-left: 12px;
	width: 36px;
	height: 36px;
	border-radius: 50%;
	line-height: 36px;
	text-align: center;
	vertical-align: middle;
}
.sm-btn-default .sm-ico-wave {
	animation: defaultWave 1.5s ease infinite;
}
.sm-btn-default .sm-ico-wave {
	width: 26px;
	height: 26px;
	border-radius: 50%;
	position: relative;
	z-index: 800;
	left: 5px;
	top: 5px;
}
.sm-btn-default .sm-ico-wave {
	background-image: linear-gradient(0deg, #3a9afa, #00de76);
}
.sm-btn-default .shield,
.sm-btn-fail .shield,
.sm-btn-loading .shield,
.sm-btn-success .shield {
	width: 12px;
	height: 14px;
	line-height: 38px;
	left: 12px;
	position: absolute;
	z-index: 1000;
	top: -1px;
}
.sm-btn-default .shield {
	animation: shieldanimation 1.5s infinite;
}

@keyframes shieldanimation {
	0% {
		transform: scale(1);
	}
	20% {
		transform: scale(1.15);
	}
	40% {
		transform: scale(1);
	}
	to {
		transform: scale(1);
	}
}
@keyframes defaultWave {
	0% {
		transform: scale(1);
	}
	20% {
		transform: scale(1.23);
	}
	40% {
		transform: scale(1);
	}
	to {
		transform: scale(1);
	}
}
@keyframes defaultOutsideWave {
	0% {
		transform: scale(1);
	}
	20% {
		transform: scale(0.8125);
	}
	40% {
		transform: scale(1);
	}
	to {
		transform: scale(1);
	}
}
</style>
