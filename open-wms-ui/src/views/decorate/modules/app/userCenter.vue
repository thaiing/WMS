<template>
  <div class="module-container" :style="{'background-color':config.style.moduleBgColor,'background-image': 'linear-gradient('+config.style?.moduleBgColor1+', '+config.style?.moduleBgColor2+')','border-radius':config.style?.moduleBorderRadius?config.style.moduleBorderRadius+'px':0,'margin-top':config.style.moduleMarginTop+'px','margin-bottom':config.style.moduleMarginBottom+'px','margin-left':config.style.moduleMarginLeft+'px','margin-right':config.style.moduleMarginRight+'px','padding-top':config.style.modulePaddingTop+'px','padding-bottom':config.style.modulePaddingBottom+'px','padding-left':config.style.modulePaddingLeft+'px','padding-right':config.style.modulePaddingRight+'px', border: config.style.moduleBorderStyle+' '+(config.style.moduleBorderWidth+'px')+' '+config.style.moduleBorderColor}">
    {{config.style.bgImage}}
    <div class="header" :style="{'background-color':config.style.headerBgColor,'background-image':'url('+config.style.headerBgImage+')'}">
      <div class="logo">
        <el-image class="img" src="https://auod-beijing.oss-cn-beijing.aliyuncs.com/bbc/user-center/user01.png?x-oss-process=style/300" fit="contain">
        </el-image>
      </div>
      <div class="user-box">
        <div class="name-box">
          <span class="name">用户名称用户名</span>
          <span class="svip">
            <el-image class="img" src="https://auod-beijing.oss-cn-beijing.aliyuncs.com/bbc/user-center/user02.png?x-oss-process=style/300" fit="contain">
            </el-image>
          </span>
        </div>
        <div>绑定手机号 <i class="el-icon-yrt-youjiantou1"></i></div>
      </div>
      <div class="icon-box">
        <div class="qrcode">
          <i class="el-icon-yrt-saomiao21"></i>
        </div>
        <div class="msg">
          <el-badge :value="12">
            <i class="el-icon-yrt-xiaoxi3"></i>
          </el-badge>
        </div>
      </div>
    </div>
    <div class="member">
      <div class="date">会员到期 2014-05-21</div>
      <div class="renew">立即续费 <i class="el-icon-yrt-youjiantou5"></i></div>
    </div>
    <div class="items">
      <div v-for="(item, index) in config.items" :key="index" class="item">
        <div class="num" :style="{'font-size':config.style.numFontSize+'px',color:config.style.numFontColor}">{{item.number}}</div>
        <div class="txt" :style="{'font-size':config.style.fontSize+'px',color:config.style.fontColor}">{{item.title}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, getCurrentInstance, computed } from "vue";
import { Search } from "@element-plus/icons-vue";

export default {
	name: "app-design-left-panel",
	components: {
		Search,
	},
	props: {
		// 配置参数
		config: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	setup() {
		const { proxy } = getCurrentInstance() as any;
		const state = reactive({
			searchKey: null,
		});

		//#region
		let method = {};
		//#endregion

		return {
			...toRefs(state),
			...method,
		};
	},
};
</script>

<style lang="scss" scoped>
.module-container {
	padding: 0;
	height: 193px;
}
.header {
	display: flex;
	justify-content: space-between;
	color: white;
	padding: 20px 10px 60px 10px;
	align-items: center;
	background-repeat: none;
	background-size: cover;
	.logo {
		width: 40px;
		.img {
			width: 38px;
			height: 38px;
			border-radius: 20px;
		}
	}
	.user-box {
		margin-right: auto;
		margin-left: 10px;
		.name-box {
			display: flex;
			justify-content: space-between;
			.svip {
				.img {
					width: 40px;
					height: 16px;
					border-radius: 20px;
				}
			}
		}
	}
	.icon-box {
		display: flex;
		justify-content: space-between;
		i {
			font-size: 24px;
		}
		.qrcode {
			margin-right: 10px;
		}
		.msg {
			margin-right: 15px;
		}
	}
}
.member {
	background-image: url(https://auod-beijing.oss-cn-beijing.aliyuncs.com/bbc/user-center/user04.png);
	background-size: cover;
	background-repeat: no-repeat;
	display: flex;
	justify-content: space-between;
	color: white;
	padding: 12px 10px 30px 10px;
	margin: 10px;
	position: relative;
	top: -50px;
	.date {
		margin-left: 40px;
	}
}
.items {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	padding: 10px 0;
	border-radius: 5px;
	margin: 10px;
	background-color: white;
	position: relative;
	top: -75px;

	.item {
		width: calc(20% - 5px);
		text-align: center;
		+ .item {
			margin-left: 5px;
		}
		.num {
			font-size: 16px;
			font-weight: bolder;
		}
		.txt {
			font-size: 12px;
			line-height: 2;
		}
	}
}
</style>