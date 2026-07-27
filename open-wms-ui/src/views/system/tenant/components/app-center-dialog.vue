<template>
	<el-dialog v-model="currentDialogVisible" :top="common.getDialogTop()" title="应用详情" class="dialog-container" width="1200px" draggable overflow append-to-body>
		<div class="detail-wrap">
			<div class="detail-header">
				<div class="detail-header-top">
					<div class="detail-header-left">
						<div class="detail-logo" style="margin-right: 24px">
							<a href="#" title="金蝶星空云对接 稳定版">
								<img onerror="imgError(this);" src="https://img.onlinedown.net/download/202206/131334-62bbdf7e7af79.jpg" alt="金蝶星空云对接 稳定版" />
							</a>
						</div>
						<div>
							<div class="detail-header-left-top flex-sc">
								<div class="detail-info">
									<div class="soft-name-tag flex-sc mb-17">
										<div class="detail-name ellipsis" title="金蝶星空云对接 稳定版">金蝶星空云对接 稳定版</div>
										<ul class="search-tags flex-sc sesarch-tags-unsuitable" id="J_search-tags">
											<li class="search-tags-item t-safe ml-17"><img src="//pc.qq.com/softmgr_detail/img/t-safe.svg" />安全认证</li>

											<li class="search-tags-item t-plugin ml-17">
												<img src="//pc.qq.com/softmgr_detail/img/t-plugin.svg" />
												无插件
											</li>
										</ul>
									</div>
									<div class="soft-rank flex-sc detail-star">
										<div class="start-contain">
											<div class="rank flex-sc">
												<img src="//pc.qq.com/softmgr_detail/img/star-gray.svg" alt="" class="rank-star" />
												<img src="//pc.qq.com/softmgr_detail/img/star-gray.svg" alt="" class="ml-6 rank-star" />
												<img src="//pc.qq.com/softmgr_detail/img/star-gray.svg" alt="" class="ml-6 rank-star" />
												<img src="//pc.qq.com/softmgr_detail/img/star-gray.svg" alt="" class="ml-6 rank-star" />
												<img src="//pc.qq.com/softmgr_detail/img/star-gray.svg" alt="" class="ml-6 rank-star" />
											</div>
											<div class="rank-active flex-sc star" style="width: 86%">
												<img src="//pc.qq.com/softmgr_detail/img/star.svg" alt="" class="rank-star" />
												<img src="//pc.qq.com/softmgr_detail/img/star.svg" alt="" class="ml-6 rank-star" />
												<img src="//pc.qq.com/softmgr_detail/img/star.svg" alt="" class="ml-6 rank-star" />
												<img src="//pc.qq.com/softmgr_detail/img/star.svg" alt="" class="ml-6 rank-star" />
												<img src="//pc.qq.com/softmgr_detail/img/star.svg" alt="" class="ml-6 rank-star" />
											</div>
										</div>
										<div class="ml-17 rank-num"><span class="detail-score"> 4.3 </span><span class="score-desc">分</span></div>
									</div>
								</div>
							</div>
							<div class="detail-header-left-bottom">
								<div class="soft-sys-info">
									<div class="sys-info-value">付费模块</div>
									<div class="sys-info-desc">软件授权</div>
								</div>
								<div class="split-line"></div>
								<div class="soft-sys-info">
									<div class="sys-info-value ellipsis" title="win10/win11">仓储管理</div>
									<div class="sys-info-desc">软件类型</div>
								</div>
								<div class="split-line"></div>
								<div class="soft-sys-info">
									<div class="sys-info-value ellipsis">124.0.6367.79</div>
									<div class="sys-info-desc">版本</div>
								</div>
								<div class="split-line"></div>
								<div class="soft-sys-info">
									<div class="sys-info-value">2024-04-25</div>
									<div class="sys-info-desc">更新时间</div>
								</div>
							</div>
						</div>
					</div>
					<div class="detail-header-right detail-install" style="width: 325px">
						<a class="detail-install-offical detail-install-fast" target="_blank">
							<img src="//pc.qq.com/softmgr_detail/img/install-offical.svg" alt="" />
							<span class="ml-20">开通应用</span>
						</a>
					</div>
				</div>
			</div>
			<div class="recommend">
				<div class="common_title">
					<img src="//js.18183.com/pc/download/download2022/images/title_icon6.png" alt="" class="left_icon" />
					<span class="tit">旋风加速器无限时长版 介绍</span>
				</div>
				<div class="content">
					<p>旋风加速器是一款提供专业免费的网络加速服务手机APP，配有网易最新的开放网络速度优化内核，可极大地减少网络延迟，减少数据包丢失，让你在各种手机游戏中更加轻松，快来下载旋风加速器最新版吧。</p>
					<p style="text-align: center">
						<img alt="" src="https://img.18183.com/uploads/allimg/230214/415-2302141TU9216.png@!18183" style="width: 283px; height: 500px" />
					</p>
					<p>
						<strong>平台优势：</strong>
					</p>
					<p>1、允许您无延迟地观看视频，玩游戏，带给您更好的冲浪体验;</p>
					<p>2、支援多种流行视频软件和游戏，快速免费，减少丢包，运行平稳。</p>
					<p>3、这也能加快主流音乐平台的速度，你也能听任何需要的歌曲。</p>
					<p>4、强大的游戏新聚集了强大的游戏论坛和礼品包，为您提供全方位的服务。</p>
					<p>
						<strong>主要功能：</strong>
					</p>
					<p>1、一流的IDC集群、专有带宽、直接光纤连接和全系列高端刀片服务器，</p>
					<p>2、平均提高80%的在线游戏速度。 针对不能自动获得验证码的情况，增加上行SMS登录方式。</p>
					<p>3、最后是自由的，同时加速和赢取积分，交换游戏道具。</p>
					<p>
						<strong>常见问题：</strong>
					</p>
					<p>
						<span style="color: #ff0000"><strong>节点加载失败怎么办?</strong></span>
					</p>
					<p>1、用户可以退出旋风加速器，接着打开手机后台运行页面，清理掉旋风加速器的后台，然后再重新打开，一般能解决大部分问题。</p>
					<p>2、若不能解决连接失败问题，可以将旋风加速器卸载后再安装回来。这是最有效的办法。</p>
					<p>3、还有大家切记，旋风加速器是免费的，不用充值!不用充值!不用充值!</p>
					<p>
						<strong>应用特色：</strong>
					</p>
					<p>1、不需要排队或挤线，也不需要取消“伪免费”在线游戏加速器。</p>
					<p>2、为了改进产品的性能，程序员做了许多优化。</p>
					<p>3、对喜欢玩手机游戏、体验流畅性游戏的朋友来说，这是个不错的选择。</p>
					<p>
						<strong>更新日志：</strong>
					</p>
					<p>优化部分功能</p>
					<p></p>
				</div>
			</div>
		</div>
		<template #footer>
			<span class="flex-end">
				<el-button @click="currentDialogVisible = false">取 消</el-button>
				<el-button :loading="state.isLoading" type="primary" icon="ele-Select" @click="save">开通应用</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="app-center-dialog">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
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
	// 当前选中菜单下的导出模板列表
	vueDataList: [],
	// 当前选中模板
	currentTemplate: {},
	isLoading: false,
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

const cancel = () => {
	proxy.$message.success('还原成功');
	currentDialogVisible.value = false;
	emit('field-change');
};

const save = () => {
	proxy.$message.success('保存成功');
	currentDialogVisible.value = false;
	emit('field-change');
};
</script>

<style lang="scss">
.dialog-container {
	position: relative;
	.el-dialog__body {
		padding: 0 10px !important;
		padding-bottom: 10px !important;
	}
}

.flex-sc {
	-ms-flex-align: center;
	align-items: center;
	display: -ms-flexbox;
	display: flex;
}

.flex-sc {
	-ms-flex-pack: start;
	justify-content: flex-start;
}
.detail-header {
	padding: 20px 20px 0;
}
.detail-header-top {
	-ms-flex-pack: justify;
	background: #e4f3c7;
	background-image: linear-gradient(115deg, rgba(212, 214, 78, 0.8) 0px, rgba(0, 127, 255, 0.3) 50%, rgba(0, 127, 255, 0) 100%);
	border-radius: 8px;
	box-shadow: 0 6px 18px 2px rgba(0, 0, 0, 0.06);
	box-sizing: border-box;
	display: -ms-flexbox;
	display: flex;
	-ms-flex-wrap: wrap;
	flex-wrap: wrap;
	justify-content: space-between;
	margin-bottom: 20px;
	min-height: 268px;
	padding: 45px 60px 40px 55px;
	position: relative;
}

.detail-header-left {
	-ms-flex-pack: start;
	-ms-flex-align: start;
	align-items: flex-start;
	display: -ms-flexbox;
	display: flex;
	justify-content: flex-start;
}

.detail-logo img {
	border: 1px solid #82af2b;
	border-radius: 14px;
	height: 102px;
	width: 102px;
}

.detail-header-left-bottom {
	-ms-flex-align: center;
	align-items: center;
	display: -ms-flexbox;
	display: flex;
	height: 50px;
	padding-top: 20px;
}

.detail-header-left-top .detail-info {
	display: -ms-flexbox;
	display: flex;
	-ms-flex-direction: column;
	flex-direction: column;
	margin-bottom: 21px;
}

.detail-header-left-top .detail-name {
	color: #000;
	font-family: Microsoft YaHei;
	font-size: 32px;
	font-style: normal;
	font-weight: 700;
	line-height: normal;
	max-width: 500px;
}

.detail-header-left-top .soft-rank {
	-ms-flex-align: center;
	-ms-flex-pack: start;
	align-items: center;
	display: -ms-flexbox;
	display: flex;
	height: 26px;
	justify-content: flex-start;
	line-height: 26px;
}

.start-contain {
	position: relative;
	width: 128px;
}

.rank-active {
	left: 0;
	overflow: hidden;
	position: absolute;
	top: 0;
	width: 84%;
}

.detail-header-left-top .rank-star {
	-ms-flex-pack: center;
	-ms-flex-align: center;
	align-items: center;
	display: -ms-flexbox;
	display: flex;
	-ms-flex-direction: column;
	flex-direction: column;
	justify-content: center;
}

.detail-header-left-top .soft-rank .rank-num {
	color: #00be63;
	font-family: Microsoft YaHei;
	font-size: 20px;
	font-weight: 400;
	letter-spacing: 0;
	line-height: 26px;
	text-align: left;
}

.detail-header-left-top .soft-rank .rank-num .score-desc {
	color: #00be63;
	font-family: Microsoft YaHei;
	font-size: 14px;
	font-weight: 400;
	letter-spacing: 0;
	line-height: 18px;
	text-align: left;
}

.detail-header-left-top .soft-name-tag {
	-ms-flex-align: center;
	align-items: center;
	display: -ms-flexbox;
	display: flex;
	height: 42px;
}

.detail-header-left-top .search-tags-item {
	-ms-flex-pack: center;
	-ms-flex-align: center;
	align-items: center;
	background: #093578;
	border-radius: 7px;
	display: -ms-flexbox;
	display: flex;
	justify-content: center;
	padding: 8px 12px 8px 8px;
	color: white;
}

.detail-header-left-top .t-plugin {
	color: #00be63;
}

.detail-header-left-top .t-ad {
	color: #f9a441;
}

.detail-header-left-top .search-tags-item img {
	height: 22px;
	margin-right: 8px;
	object-fit: cover;
	width: 22px;
}

.detail-header-left-bottom .soft-sys-info {
	-ms-flex-pack: justify;
	display: -ms-flexbox;
	display: flex;
	-ms-flex-direction: column;
	flex-direction: column;
	height: 50px;
	justify-content: space-between;
	line-height: 22px;
}

.detail-header-left-bottom .soft-sys-info .sys-info-value {
	color: #4d4d4d;
	font-family: DIN Alternate;
	font-size: 22px;
	font-style: normal;
	font-weight: 700;
	line-height: normal;
	max-width: 170px;
}

.detail-header-left-bottom .soft-sys-info .sys-info-desc {
	color: #4d4d4d;
	font-family: Microsoft YaHei;
	font-size: 12px;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
}

.detail-header-left-bottom .split-line {
	background: #bfbfbf;
	height: 38px;
	margin: 0 20px;
	width: 1px;
}

.detail-header-right {
	-ms-flex-pack: center;
	-ms-flex-align: end;
	align-items: flex-end;
	background-image: url(//pc.qq.com/softmgr_detail/img/install-offical-bg.png);
	background-position: 0 -1px;
	background-size: 0 0;
	box-sizing: border-box;
	display: -ms-flexbox;
	display: flex;
	-ms-flex-direction: column;
	flex-direction: column;
	height: 268px;
	justify-content: center;
	padding: 45px 20px 40px 48px;
	position: absolute;
	right: 0;
	top: 0;
	width: 325px;
}

.detail-header-right .detail-install-offical {
	-ms-flex-pack: center;
	-ms-flex-align: start;
	align-items: flex-start;
	background: #2049ee;
	border-radius: 100px;
	color: #fff;
	cursor: pointer;
	display: -ms-flexbox;
	display: flex;
	font-family: Microsoft YaHei;
	font-size: 20px;
	font-style: normal;
	font-weight: 700;
	justify-content: center;
	line-height: 26px;
	line-height: normal;
	margin-bottom: 28px;
	padding: 20px 10px;
	width: 215px;
}

.detail-header-top .offical-down-box {
	-ms-flex-pack: justify;
	background: #edf5ff;
	border-radius: 10px;
	box-sizing: border-box;
	justify-content: space-between;
	margin-top: 40px;
	padding: 13px 20px 13px 15px;
	width: 1085px;
}

.detail-header-top .offical-down-box,
.offical-down-box .offical-down-info {
	-ms-flex-align: center;
	align-items: center;
	display: -ms-flexbox;
	display: flex;
}

.recommend {
	margin-bottom: 10px;
	padding: 0 40px 40px;
	.common_title {
		position: relative;
		width: 100%;
		height: 46px;
		border-bottom: 2px #f6f6f6 solid;
		padding-top: 10px;
		box-sizing: border-box;
	}

	.common_title .left_icon {
		position: absolute;
		width: 24px;
		height: 24px;
		left: 0;
	}
	.common_title .tit {
		margin-left: 35px;
		font-size: 18px;
		font-family: Microsoft YaHei;
		font-weight: bold;
		color: #303030;
	}
}

.recommend .content {
	padding-top: 20px;
}

.recommend .content h5 {
	color: #333333;
	font-size: 15px;
	font-weight: bold;
	line-height: 26px;
}

.recommend .content p {
	color: #333333;
	font-size: 15px;
	font-weight: 400;
	line-height: 26px;
}

.recommend .content h2 {
	display: inline-block;
	position: relative;
	height: 46px;
	margin: 20px 0;
	padding: 0 20px;
	background: #0aaf60;
	font-size: 18px;
	font-family: Microsoft YaHei;
	font-weight: bold;
	color: #ffffff;
	line-height: 46px;
}

.recommend .content h2::after {
	content: '';
	position: absolute;
	top: 0;
	right: -20px;
	width: 0;
	height: 0;
	border-style: solid;
	border-width: 23px 10px;
	border-color: transparent transparent #0aaf60 #0aaf60;
}

.recommend .content .swiper_box {
	margin-top: 40px;
	width: 100%;
	height: 408px;
	position: relative;
}

.recommend .content .swiper_box .swiper-wrapper {
	width: 100%;
	height: 408px;
}

.recommend .content .swiper_box .swiper-wrapper .swiper-slide {
	width: 230px;
	height: 408px;
	border-radius: 10px;
}

.recommend .content .swiper_box .swiper-wrapper .swiper-slide img {
	width: 100%;
	height: 100%;
	border-radius: 10px;
}

.recommend .content .swiper_box .swiper-wrapper .swiper-slide.hen {
	width: 450px;
	height: 280px;
}

.recommend .content .swiper_box .swiper-button-next {
	width: 32px;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	position: absolute;
	top: 20px;
	right: 0;
}

.recommend .content .swiper_box .swiper-button-next::after {
	font-size: unset;
	color: #ffffff;
}

.recommend .content .swiper_box .swiper-button-prev {
	width: 32px;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	position: absolute;
	left: 0;
	top: 20px;
}

.recommend .content .swiper_box .swiper-button-prev::after {
	font-size: unset;
	color: #ffffff;
}

.recommend .content .swiper_box.hen {
	height: 280px;
}

.recommend .content .swiper_box.hen .swiper-wrapper .swiper-slide {
	width: 450px;
	height: 280px;
}
</style>
