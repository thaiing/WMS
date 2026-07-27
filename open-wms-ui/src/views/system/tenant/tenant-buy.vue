<template>
	<div class="info-contianer">
		<div class="user-container-body">
			<h1 class="user-title">服务购买</h1>
			<el-card style="max-width: 100%; margin-bottom: 20px">
				<template #header>
					<div class="card-header">
						<span>我的产品</span>
						<span class="my-ticket">我的发票</span>
					</div>
				</template>

				<el-form label-width="auto" style="max-width: 1000px">
					<el-form-item label="产品名称">
						<span class="content">易软通仓配一体化系统</span>
					</el-form-item>
					<el-form-item label="用户数">
						<span class="content mr-20">10</span>
					</el-form-item>
					<el-form-item label="产品开通时间">
						<span class="content mr-20">2024-05-10</span>
					</el-form-item>
					<el-form-item label="产品到期时间">
						<span class="content mr-20">2024-06-10</span>
					</el-form-item>
					<el-form-item label="">
						<el-button type="primary">立即续费</el-button>
					</el-form-item>
				</el-form>

				<el-divider />
				<el-form label-width="auto" style="max-width: 1000px">
					<el-form-item label="产品名称">
						<span class="content">易软通标准WMS系统</span>
					</el-form-item>
					<el-form-item label="用户数">
						<span class="content mr-20">10</span>
					</el-form-item>
					<el-form-item label="产品开通时间">
						<span class="content mr-20">2024-05-10</span>
					</el-form-item>
					<el-form-item label="产品到期时间">
						<span class="content mr-20">2024-06-10</span>
					</el-form-item>
					<el-form-item label="">
						<el-button type="primary">立即续费</el-button>
					</el-form-item>
				</el-form>

				<el-divider />
				<el-form label-width="auto" style="max-width: 1000px">
					<el-form-item label="产品名称">
						<span class="content">易软通标准TMS系统</span>
					</el-form-item>
					<el-form-item label="用户数">
						<span class="content mr-20">10</span>
					</el-form-item>
					<el-form-item label="产品开通时间">
						<span class="content mr-20">2024-05-10</span>
					</el-form-item>
					<el-form-item label="产品到期时间">
						<span class="content mr-20">2024-06-10</span>
					</el-form-item>
					<el-form-item label="">
						<el-button type="primary">立即续费</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const state = reactive({
	securityRate: 5,
	password: '111111',
	passwordStrength: 90,
});

const scorePassword = (password: string) => {
	let score = 0;
	const minLength = 8;

	// 密码长度
	if (password.length < minLength) {
		return score;
	}

	// 包含大写字母
	if (password.match(/[A-Z]/)) {
		score += 10;
	}

	// 包含小写字母
	if (password.match(/[a-z]/)) {
		score += 10;
	}

	// 包含数字
	if (password.match(/\d+/)) {
		score += 10;
	}

	// 包含特殊字符
	if (password.match(/[\W_]/)) {
		score += 10;
	}

	// 返回最终评分
	return score;
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
			justify-content: space-between;
			.my-ticket {
				cursor: pointer;
				&:hover {
					color: #16b5e0;
				}
			}
		}
		.user-title {
			line-height: 3;
			padding-left: 5px;
		}
		.edit-icon {
			cursor: pointer;
		}
	}
}
</style>
