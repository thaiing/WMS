<template>
	<div :ref="'settings'" class="settings-sub-container">
		<el-form ref="form" v-model="state.formData" label-width="350px">
			<h2 class="sub-title">{{ $tt('扫描条码') }}</h2>
			<el-form-item :label="$tt('常规上架')" label-width="120px">
				<el-checkbox-group v-model="state.formData.pda_barcodeList_shelveScan">
					<el-checkbox :label="0">{{ $tt('条码') }}</el-checkbox>
					<el-checkbox :label="1">{{ $tt('关联码1') }}</el-checkbox>
					<el-checkbox :label="2">{{ $tt('关联码2') }}</el-checkbox>
					<el-checkbox :label="3">{{ $tt('关联码3') }}</el-checkbox>
					<el-checkbox :label="4">{{ $tt('关联码4') }}</el-checkbox>
					<el-checkbox :label="5">{{ $tt('关联码5') }}</el-checkbox>
					<el-checkbox :label="6">{{ $tt('唯一码') }}</el-checkbox>
					<el-checkbox :label="7">{{ $tt('中条码') }}</el-checkbox>
					<el-checkbox :label="8">{{ $tt('大条码') }}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item :label="$tt('拣货下架')" label-width="120px">
				<el-checkbox-group v-model="state.formData.pda_barcodeList_pickingScan">
					<el-checkbox :label="0">{{ $tt('条码') }}</el-checkbox>
					<el-checkbox :label="1">{{ $tt('关联码1') }}</el-checkbox>
					<el-checkbox :label="2">{{ $tt('关联码2') }}</el-checkbox>
					<el-checkbox :label="3">{{ $tt('关联码3') }}</el-checkbox>
					<el-checkbox :label="4">{{ $tt('关联码4') }}</el-checkbox>
					<el-checkbox :label="5">{{ $tt('关联码5') }}</el-checkbox>
					<el-checkbox :label="6">{{ $tt('唯一码') }}</el-checkbox>
					<el-checkbox :label="7">{{ $tt('中条码') }}</el-checkbox>
					<el-checkbox :label="8">{{ $tt('大条码') }}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>

			<h2 class="sub-title">{{ $tt('无单扫描出库单设置') }}</h2>
			<el-form-item :label="$tt('无单扫描出库单设置')">
				<el-switch v-model="state.formData.out_receivePosition" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('无单扫描出库需要扫描批号')">
				<el-switch v-model="state.formData.out_noBillScanBatchNumber" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('自动加载货位和商品编号')">
				<el-switch v-model="state.formData.out_noBillScanLoadPosition" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('出库货位下拉框改为输入框')">
				<el-switch v-model="state.formData.out_noBillScan_positionName_text" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('商品条码下拉框改为输入框')">
				<el-switch v-model="state.formData.out_noBillScan_productModel_text" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>

			<h2 class="sub-title">{{ $tt('出库单拣货设置') }}</h2>
			<el-form-item :label="$tt('显示拣货车码扫描')">
				<el-switch v-model="state.formData.pick_cartCode" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('显示托盘号扫描')">
				<el-switch v-model="state.formData.pick_plateCode" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('出库拣货下架不提示确认')">
				<el-switch v-model="state.formData.pick_noPickingConfrim" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('出库拣货单货位通道间U型')">
				<el-switch v-model="state.formData.pick_channelPositionUSorting" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('拣货完毕后自动出库')">
				<el-switch v-model="state.formData.pick_overAfterAutoOut" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('拣货领取任务上限')">
				<el-input v-model="state.formData.pick_receiveTaskLimitationNumber" class="w-100"></el-input>
			</el-form-item>

			<h2 class="sub-title">{{ $tt('出库单打包校验配置') }}</h2>
			<el-form-item :label="$tt('按拣货数量打包')">
				<el-switch v-model="state.formData.outer_pickQuantity" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('出库时同时校验订单号和快递单号')">
				<el-switch v-model="state.formData.outer_outScanExpressAndOrder" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('出库单打包校验时启用装箱操作')">
				<el-switch v-model="state.formData.outer_caseNumber" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('出库单打包校验时启用包材条码')">
				<el-switch v-model="state.formData.outer_wrapperBarcode" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('出库单打包支持部分复核校验')">
				<el-switch v-model="state.formData.outer_batchPartialCheck" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('出库单快递公司必填')">
				<el-switch v-model="state.formData.outer_expressCorpMust" :active-value="1" :inactive-value="0"></el-switch>
				<span class="remark">{{ $tt('当选择不是必填时，审核出库单时自动选择第一个快递公司，快递单号默认为出库单号') }}</span>
			</el-form-item>
			<el-form-item :label="$tt('出库单打包校验时启用快递单号')">
				<el-switch v-model="state.formData.outer_expressCode" :active-value="1" :inactive-value="0"></el-switch>
				<span class="remark">{{ $tt('勾选后在打包校验中快递单号将可以重复使用') }}</span>
			</el-form-item>
			<el-form-item :label="$tt('打包校验时快递单号必填')">
				<el-switch v-model="state.formData.outer_expressCodeMust" :active-value="1" :inactive-value="0"></el-switch>
				<span class="remark">{{ $tt('此项只有在部分校验后，第二次封箱才起作用') }}</span>
			</el-form-item>

			<el-form-item :label="$tt('显示“打印面单”')">
				<el-switch v-model="state.formData.outer_printBill" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('显示“打印订单详情单”')">
				<el-switch v-model="state.formData.outer_printOrderDetail" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('显示“打印装箱清单”')">
				<el-switch v-model="state.formData.outer_printCaseNumber" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('打印装箱单时不打印“一品一箱”')">
				<el-switch v-model="state.formData.outer_singleCaseNumberNoPrint" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('自动打印单据')">
				<el-switch v-model="state.formData.outer_autoPrint" :active-value="1" :inactive-value="0"></el-switch>
				<span class="remark">{{ $tt('勾选后在打包校验中的单据将自动打印') }}</span>
			</el-form-item>
			<el-form-item :label="$tt('扫描完成后自动提交')">
				<el-switch v-model="state.formData.outer_autoConfirm" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<!-- <el-form-item label="称重阈值报警提示”">
        <el-switch :active-value="1" :inactive-value="0" v-model="state.formData.outer_weightWhreshold"></el-switch>
      </el-form-item> -->
			<el-form-item :label="$tt('称重阈值报警提示')">
				<el-input v-model="state.formData.outer_weightWhreshold" class="w-300"></el-input>
			</el-form-item>
			<el-form-item :label="$tt('复核提交时打开件数、体积录入框')">
				<el-switch v-model="state.formData.outer_openPackage" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('开启拣货框码扫描')">
				<el-switch v-model="state.formData.outer_kuangCode" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('出库打包未下架的数量不校验')">
				<el-switch v-model="state.formData.outer_packageNoPickQty" :active-value="1" :inactive-value="0"></el-switch>
				<span class="remark">{{ $tt('只校验下架的数量，开启后必须做下架操作') }}</span>
			</el-form-item>
			<el-form-item :label="$tt('扫描明细必填项')">
				<el-checkbox-group v-model="state.formData.outer_scanDetails">
					<el-checkbox :label="0">{{ $tt('明细件数') }}</el-checkbox>
					<el-checkbox :label="1">{{ $tt('小计重量') }}</el-checkbox>
					<el-checkbox :label="2">{{ $tt('小计体积') }}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>

			<h2 class="sub-title">{{ $tt('波次打包校验配置') }}</h2>
			<el-form-item :label="$tt('波次打包校验时启用装箱操作')">
				<el-switch v-model="state.formData.batch_caseNumber" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('波次打包校验时启用包材条码')">
				<el-switch v-model="state.formData.batch_wrapperBarcode" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('波次打包校验时启用快递单号')">
				<el-switch v-model="state.formData.batch_expressCode" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('波次打包校验时快递单号是否必填')">
				<el-switch v-model="state.formData.batch_expressCodeMust" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('波次打包支持部分复核校验')">
				<el-switch v-model="state.formData.batch_batchPartialCheck" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('显示“打印面单”')">
				<el-switch v-model="state.formData.batch_printBill" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('显示“打印订单详情单”')">
				<el-switch v-model="state.formData.batch_printOrderDetail" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('显示“打印装箱清单”')">
				<el-switch v-model="state.formData.batch_printCaseNumber" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('打印装箱单时不打印“一品一箱”')">
				<el-switch v-model="state.formData.batch_singleCaseNumberNoPrint" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('自动打印单据')">
				<el-switch v-model="state.formData.batch_autoPrint" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('扫描完成时是否提示“需要确认打包出库吗？”')">
				<el-switch v-model="state.formData.batch_confirmTip" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>

			<h2 class="sub-title">{{ $tt('发货校验设置') }}</h2>
			<el-form-item :label="$tt('无需称重')">
				<el-switch v-model="state.formData.out_sendNoWeight" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('闪电发货显示打印弹出框')">
				<el-switch v-model="state.formData.out_sendShowPrint" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('闪电发货校验波次类型')">
				<el-switch v-model="state.formData.out_checkType" :active-value="1" :inactive-value="0"></el-switch>
				<span class="remark">{{ $tt('开启后只允许波次状态为等待配货和等待打包的操作闪电发货') }}</span>
			</el-form-item>

			<h2 class="sub-title">{{ $tt('一键出库') }}</h2>
			<el-form-item :label="$tt('实际出库数量不允许大于出库数量')">
				<el-switch v-model="state.formData.outer_onekey_factQtyNoMoreQtyOrder" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item :label="$tt('审核后入库')">
				<el-switch v-model="state.formData.outer_isAuditAfter" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>

			<el-form-item class="form-footer fixed-footer">
				<el-button type="primary" @click="onSave">{{ $tt('保存') }}</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup lang="ts" name="settings-out">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import settingsHook from '../hook/settingsHook';

//#region 定义变量
const state = reactive({
	// 编辑数据对象
	formData: {
		out_receivePosition: 0,
		out_noBillScanBatchNumber: 0,
		out_noBillScanLoadPosition: 0,
		out_noBillScan_positionName_text: 1,
		out_noBillScan_productModel_text: 1,

		pick_cartCode: 0,
		pick_plateCode: 0,
		pick_noPickingConfrim: 0,
		pick_channelPositionUSorting: 0, // 出库拣货单货位通道间U型
		pick_overAfterAutoOut: 0, // 拣货完毕后自动出库
		pick_receiveTaskLimitationNumber: 0, // 拣货领取任务上限
		outer_pickQuantity: 0,
		outer_outScanExpressAndOrder: 0,
		outer_caseNumber: 0,
		in_receivePosition: 0,
		outer_wrapperBarcode: 0,
		outer_batchPartialCheck: 0,
		outer_expressCorpMust: 0,
		outer_expressCode: 0,
		outer_expressCodeMust: 0,
		outer_printBill: 0,
		outer_printOrderDetail: 0,
		outer_printCaseNumber: 0,
		outer_singleCaseNumberNoPrint: 0,
		outer_autoPrint: 0,
		outer_autoConfirm: 0,
		outer_weightWhreshold: 0,
		outer_openPackage: 0,
		outer_cartCode: 0, // 拣货框码开关
		outer_packageNoPickQty: 0, // 出库打包未下架的数量不校验
		outer_onekey_factQtyNoMoreQtyOrder: 0, // 实际出库数量不允许大于出库数量 开关
		outer_isAuditAfter: 0, // 审核后出库
		outer_scanDetails: [], // 出库打包校验 扫描明细必填项

		batch_caseNumber: 0,
		batch_wrapperBarcode: 0,
		batch_expressCode: 0,
		batch_expressCodeMust: 0,
		batch_batchPartialCheck: 0,
		batch_printBill: 0,
		batch_printOrderDetail: 0,
		batch_printCaseNumber: 0,
		batch_singleCaseNumberNoPrint: 0,
		batch_autoPrint: 0,
		batch_confirmTip: 0,
		out_sendNoWeight: 0,
		batch_onlyAutomatic: 0, // 自动生成波次单
		pda_barcodeList_shelveScan: [], // 常规上架
		pda_barcodeList_pickingScan: [], // 拣货下架
	} as any,
	// 接口数据
	valueList: [] as any[],
});
//#endregion

let base = settingsHook({ state });
onMounted(() => {
	let callback = (configKey: string, configValue: string) => {
		if (['pda_barcodeList_shelveScan', 'pda_barcodeList_pickingScan', 'outer_scanDetails'].indexOf(configKey) >= 0) {
			state.formData[configKey] = configValue ? configValue.split(',') : [];
		} else {
			state.formData[configKey] = configValue;
		}
	};
	base.loadParam(callback);
});

//#region 保存数据
const onSave = () => {
	let callback = (configKey: string, item: any) => {
		let configValue = state.formData[configKey];
		if (['pda_barcodeList_shelveScan', 'pda_barcodeList_pickingScan', 'outer_scanDetails'].indexOf(configKey) >= 0) {
			configValue = configValue.join(',');
		}

		if (item) {
			item.configValue = configValue;
		} else {
			state.valueList.push({
				configKey: configKey,
				configType: 'N',
				configValue: configValue,
			});
		}
	};

	base.onSave(callback);
};
//#endregion
</script>

<style lang="scss" scoped>
.settings-sub-container {
	margin-bottom: 90px;

	::v-deep .sub-title {
		font-size: 14px;
		padding-bottom: 10px;
		border-bottom: 1px solid #ebeef5;
		padding-top: 20px;
		margin-bottom: 10px;
	}

	::v-deep .el-form-item__label {
		font-weight: normal;
	}

	.remark {
		color: #888;
		margin-left: 10px;
	}

	::v-deep .el-form-item {
		margin-bottom: 0px;
	}

	.form-footer {
		margin-top: 30px;

		&.fixed-footer {
			position: fixed;
			bottom: 0;
			left: 472px;
			right: 10px;
			background-color: white;
			border-top: 1px solid #ebeef5;
			padding: 20px;
		}
	}

	::v-deep .el-checkbox {
		margin-right: 15px;
	}

	::v-deep .el-checkbox__label {
		padding-left: 2px;
	}
}
</style>
