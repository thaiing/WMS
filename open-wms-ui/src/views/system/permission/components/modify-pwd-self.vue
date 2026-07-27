<template>
	<el-dialog draggable v-model="currentVisible" width="600px" title="修改密码" append-to-body>
		<el-form ref="form" :model="state.form" class="demo-form-inline w-400">
			<el-form-item :label-width="state.formLabelWidth" label="请输入旧密码：">
				<el-input v-model="state.form.oldPassword" :type="state.passwordType" auto-complete="off">
					<template #suffix>
						<span class="show-pwd" @click="showPwd">
							<svg-icon :name="state.passwordType == 'password' ? 'icon-yanjing-bi' : 'icon-yanjing'" />
						</span>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item :label-width="state.formLabelWidth" label="请输入密码：">
				<el-input v-model="state.form.password" :type="state.passwordType" auto-complete="off" @input="scorePassword(state.form.password)">
					<template #suffix>
						<span class="show-pwd" @click="showPwd">
							<svg-icon :name="state.passwordType == 'password' ? 'icon-yanjing-bi' : 'icon-yanjing'" />
						</span>
					</template>
				</el-input>
				<el-progress style="width: 300px; margin-right: 10px; margin-top: 10px" :text-inside="true" :stroke-width="20" :percentage="state.passwordStrength" :color="passwordStrengthColor">
					<span>{{ passwordStrengthText }}</span>
				</el-progress>
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
import to from 'await-to-js';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const emit = defineEmits(['update:visible', 'on-closed']);

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
		oldPassword: '',
		password: '',
		password_repeat: '',
	},
	formLabelWidth: '150px',
	userId: '' as any,
	passwordStrength: 0,
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

// 密码强度描述
const passwordStrengthText: any = computed(() => {
	let text = '';
	if (state.passwordStrength > 80) {
		text = '很强';
	} else if (state.passwordStrength > 60) {
		text = '强';
	} else if (state.passwordStrength > 40) {
		text = '中';
	} else if (state.passwordStrength > 20) {
		text = '弱';
	} else {
		text = '很弱';
	}
	return text + state.passwordStrength + '%';
});

// 密码强度描述
const passwordStrengthColor: any = computed(() => {
	if (state.passwordStrength > 80) {
		return '#339900';
	} else if (state.passwordStrength > 60) {
		return '#66cc00';
	} else if (state.passwordStrength > 40) {
		return '#99cc00';
	} else if (state.passwordStrength > 20) {
		return '#e6a23c';
	} else {
		return '#f56c6c';
	}
});
//#endregion

onMounted(() => {
	const userInfo = proxy.common.getUserInfo();
	state.userId = userInfo.userId;
});

const showPwd = () => {
	if (state.passwordType === 'password') {
		state.passwordType = '';
	} else {
		state.passwordType = 'password';
	}
};

const modifypwd = async () => {
	if (!state.form.oldPassword) {
		proxy.$message.error('旧密码不能为空！');
		return;
	}

	// 密码
	var password = state.form.password;
	if (password.length < 6) {
		proxy.$message.error('密码必须大于6位！');
		return;
	}

	// 重复密码
	var password_repeat = state.form.password_repeat;
	if (password_repeat.length < 6) {
		proxy.$message.error('密码必须大于6位！');
		return;
	} else if (password_repeat !== password) {
		proxy.$message.error('两次密码不一致！');
		return;
	}

	const url = '/system/permission/profile/updatePwd';
	const params = {
		oldPassword: state.form.oldPassword,
		newPassword: password,
		passwordStrength: state.passwordStrength || 0,
	};
	let [err, res] = await to(postData(url, params));
	if (err) return;

	proxy.common.showMsg(res);
	if (res?.result) {
		currentVisible.value = false;
		state.userId = null;
		state.form.oldPassword = '';
		state.form.password = '';
		state.form.password_repeat = '';
		let passwordStrength = state.passwordStrength;
		state.passwordStrength = 0;
		emit('on-closed', passwordStrength);
	}
};

const scorePassword = (password: string) => {
	let score = 0;
	const minLength = 6;
	// 检查不能是连续的数字或字母
	if (!validateChar(password)) {
		proxy.$message.error('不能包含连续的数字或字母，键盘连续字符也不可以！');
		state.passwordStrength = score;
		return;
	}

	// 密码长度
	if (!password || password.length < minLength) {
		state.passwordStrength = 0;
		return;
	}
	// 根据密码长度增加分值，最高加20分，密码至少8位长度
	let lenScore = password.length * 2.5;
	if (lenScore >= 20) {
		lenScore = 20;
	}
	score += lenScore;

	// 包含大写字母
	if (password.match(/[A-Z]/)) {
		score += 20;
	}

	// 包含小写字母
	if (password.match(/[a-z]/)) {
		score += 20;
	}

	// 包含数字
	if (password.match(/\d+/)) {
		score += 20;
	}

	// 密码包含至少两个特殊字符
	if (password.match(/(.*[\W_].*[\W_].*)/)) {
		score += 20;
	} else if (password.match(/[\W_]/)) {
		// 包含特殊字符
		score += 10;
	}

	state.passwordStrength = score;

	// 返回最终评分
	return score;
};

//不能连续字符（如123、abc）连续3位或3位以上
/**
 * 键盘字符表(小写)
 * 非shift键盘字符表
 */
const charTable1 = [
	['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', ''],
	['', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
	['', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", '', ''],
	['', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '', '', ''],
];
/**
 * shift键盘的字符表
 */
const charTable2 = [
	['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', ''],
	['', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '{', '}', '|'],
	['', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ':', '"', '', ''],
	['', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '<', '>', '?', '', '', ''],
];

// 所有键盘组合值
let charAll = [] as any[];

function getCharAll() {
	charAll = [];
	// 横向所有的值(正序和反序)-
	charTable1.concat(charTable2).forEach((item, index) => {
		charAll.push(item.join(''), Object.assign([], item).reverse().join(''));
	});

	// 反斜杠纵向所有的值(正序和反序)\
	for (let i = 0; i < charTable1[0].length; i++) {
		let sb1 = [] as any[];
		let sb2 = [] as any[];
		charTable1.forEach((item) => {
			sb1.push(item[i]);
		});
		charTable2.forEach((item) => {
			sb2.push(item[i]);
		});
		// 去除长度小于3的值
		sb1.join('').length < 3 || charAll.push(sb1.join(''), Object.assign([], sb1).reverse().join(''));
		sb1.join('').length < 3 || charAll.push(sb2.join(''), Object.assign([], sb2).reverse().join(''));
	}

	// 正斜杠纵向所有的值(正序和反序)/
	for (let i = 0; i < charTable1[0].length; i++) {
		let sb1 = [] as any[];
		let sb2 = [] as any[];
		charTable1.forEach((item, index) => {
			i - index < 0 || sb1.push(item[i - index]);
		});
		charTable2.forEach((item, index) => {
			i - index < 0 || sb2.push(item[i - index]);
		});
		// 去除长度小于3的值
		sb1.join('').length < 3 || charAll.push(sb1.join(''), Object.assign([], sb1).reverse().join(''));
		sb1.join('').length < 3 || charAll.push(sb2.join(''), Object.assign([], sb2).reverse().join(''));
	}
	charAll.push('abcdefghijklmnopqrstuvwxyz');
	return charAll;
}

// 校验键盘连续性和连续重复
function validateChar(val: string) {
	getCharAll();
	let password = val.toLowerCase();
	// 密码3位比对
	for (let i = 0; i < password.length - 2; i++) {
		let n1 = password[i];
		let n2 = password[i + 1];
		let n3 = password[i + 2];
		// 判断重复字符
		if (n1 === n2 && n1 === n3) {
			return false;
			// 判断键盘连续字符
		} else if (
			charAll.some((item) => {
				return item.includes(n1 + n2 + n3);
			})
		) {
			return false;
		}
	}
	return true;
}
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
