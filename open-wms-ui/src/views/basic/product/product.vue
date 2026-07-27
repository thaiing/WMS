<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :on-delete-before="onDeleteBefore" @on-add-load-after="base.onAddLoadAfter">
      <template #common-column-slot="{ row, col }">
        <!--自定义显示图片-->
        <template v-if="col.prop === 'images'">
          <el-image v-for="(pic, index) in base.getPicList(row[col.prop])" :src="base.showSmallPic(pic)" class="pic-small" fit="contain" preview-teleported :preview-src-list="base.getPicList(row[col.prop])" />
        </template>
      </template>
    </yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="base.detailButtonClick" :auth-nodes="state.authNodes" @on-change="base.onChange" @on-edit-load-before="base.onEditLoadBefore" @on-edit-load-after="base.onEditLoadAfter" @on-add-load-after="base.onAddLoadAfter"></yrt-editor>

    <create-security-dialog ref="refSecurity" v-model:visible="state.securityShow" @closed="closed"> </create-security-dialog>
  </div>
</template>

<script setup lang="ts" name="basic-product-product">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties, DetailField } from '/@/types/base-type';
import baseHook from '/@/components/hooks/baseHook';
import YrtDataList from '/@/components/common/yrtDataList.vue';
// import yrtEditor from '/@/components/common/yrtEditor.vue';
const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
const createSecurityDialog = defineAsyncComponent(() => import('./components/create-security-dialog.vue'));
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
import { ElMessageBox } from 'element-plus';
import { postData } from '/@/api/common/baseApi';
import to from 'await-to-js';

const config = ref({
  // 商品编号自动编码
  sku_autoProductCode: false,
  // 商品条码默认同商品编号
  sku_barcodeSyncProductCode: false,
  // 商品编号默认同商品条码
  sku_productCodeSyncBarcode: false,
});
const base = baseHook({ config });

const { baseState, dataListRefName, editorRefName, editorInfo, masterData } = base;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  // 配置参数
  config: config.value,
  securityShow: false,
});
//#endregion

onMounted(() => {});
// 字段值改变事件
base.onChange = (ref: any, val: any, field: any, formData: any) => {
  if (['length', 'width', 'height'].indexOf(field.options.prop) >= 0) {
    var unitCube = formData.length * formData.width * formData.height;
    // formData.unitCube = Math.Round(unitCube, 4);
    masterData.value.unitCube = Math.Round(unitCube, 4);
  }
  if (!state.editorOptions || !state.editorOptions.fields) return;
  let productCodeField = state.editorOptions.fields[1].columns[0].fields[0];
  debugger;
  if (state.config.sku_autoProductCode) {
    // 自动编码字段
    baseState.dataOptions.codeRegular = 'productCode';
    productCodeField.options.required = false;
    productCodeField.options.readonly = true;
    productCodeField.options.placeholder = '系统自动编码';
  } else {
    baseState.dataOptions.codeRegular = null;
    productCodeField.options.required = true;
    productCodeField.options.readonly = false;
    productCodeField.options.placeholder = '手工输入商品编码';
    productCodeField.rules = [
      {
        required: true,
        message: '商品编号必须填写',
      },
    ];
  }

  // 商品条码字段
  const productModelField = state.editorOptions.fields[1].columns[1].fields[0];
  if (state.config.sku_barcodeSyncProductCode) {
    // 商品条码默认同商品编号
    productModelField.options.required = false;
    productModelField.options.readonly = false;
    productModelField.options.placeholder = '商品条码同商品编号';
    productModelField.rules = [];
    masterData.value.productModel = formData.productCode;
  } else if (state.config.sku_productCodeSyncBarcode) {
    // 商品编号默认同商品条码
    productCodeField.options.required = false;
    productCodeField.options.readonly = false;
    productCodeField.options.placeholder = '商品编号同商品条码';
    productCodeField.rules = [];
    masterData.value.productCode = formData.productModel;
  } else {
    productModelField.options.required = true;
    productModelField.options.readonly = false;
    productModelField.options.placeholder = '手工输入商品条码';
    productModelField.rules = [
      {
        required: true,
        message: '条形码必须填写',
      },
    ];
  }
};
// 删除前事件
const onDeleteBefore = (dataOptions: any, rows: any[]) => {
  dataOptions.deleteUrl = '/composite/basic/baseProductComposite/remove';
  return true;
};

// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
  debugger;
  switch (authNode) {
    case 'multiAuditing':
      multiAuditing();
      return true;
    case 'reAudit':
      reAudit();
      return true;
    case 'createSecurity':
      createSecurity();
      return true;
  }
};
//审核
const multiAuditing = async () => {
  const url = '/basic/product/product/multiAuditing';
  let selectInfos: Array<any> = state.dataListSelections;
  if (!selectInfos.length) {
    proxy.$message.error('至少选择一项进行审核');
    return;
  }
  for (const item of selectInfos) {
    if ([0, null].indexOf(item.auditing) == -1) {
      proxy.$message.error('只有待审核的单据才可以进行反审');
      return;
    }
  }
  let ids = selectInfos.map((item) => item.productId);

  ElMessageBox.confirm('确定要审核单据吗', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const params = ids;
      const [err, res] = await to(postData(url, params));
      if (err) {
        proxy.$message.error(err.message);
        return;
      }

      if (res.result) {
        proxy.common.showMsg(res);
        base.dataListRef.value.loadData();
      }
    })
    .catch(() => {});
};
// 反审
const reAudit = async () => {
  let selectInfos: Array<any> = state.dataListSelections;
  if (!selectInfos.length) {
    proxy.$message.error('至少选择一项进行审核');
    return;
  }
  for (const item of selectInfos) {
    if ([2].indexOf(item.auditing) == -1) {
      proxy.$message.error('只有审核成功的单据才可以进行反审');
      return;
    }
  }
  let ids = selectInfos.map((item) => item.productId);
  const url = '/basic/product/product/reAudit/' + ids.join(',');

  ElMessageBox.confirm('确定要反审单据吗', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const params = {};
      const [err, res] = await to(postData(url, params));
      if (err) {
        proxy.$message.error(err.message);
        return;
      }

      if (res.result) {
        proxy.common.showMsg(res);
        base.dataListRef.value.loadData();
      }
    })
    .catch(() => {});
};
base.onAddLoadAfter = () => {
  if (!state.editorOptions || !state.editorOptions.fields) return;
  let productCodeField = state.editorOptions.fields[1].columns[0].fields[0];
  debugger;
  if (state.config.sku_autoProductCode) {
    // 自动编码字段
    baseState.dataOptions.codeRegular = 'productCode';
    productCodeField.options.required = false;
    productCodeField.options.readonly = true;
    productCodeField.options.placeholder = '系统自动编码';
  } else {
    baseState.dataOptions.codeRegular = null;
    productCodeField.options.required = true;
    productCodeField.options.readonly = false;
    productCodeField.options.placeholder = '手工输入商品编码';
    productCodeField.rules = [
      {
        required: true,
        message: '商品编号必须填写',
      },
    ];
  }

  // 商品条码字段
  const productModelField = state.editorOptions.fields[1].columns[1].fields[0];
  if (state.config.sku_barcodeSyncProductCode) {
    // 商品条码默认同商品编号
    productModelField.options.required = false;
    productModelField.options.readonly = false;
    productModelField.options.placeholder = '商品条码同商品编号';
    productModelField.rules = [];
  } else if (state.config.sku_productCodeSyncBarcode) {
    // 商品编号默认同商品条码
    productCodeField.options.required = false;
    productCodeField.options.readonly = false;
    productCodeField.options.placeholder = '商品编号同商品条码';
    productCodeField.rules = [];
  } else {
    productModelField.options.required = true;
    productModelField.options.readonly = false;
    productModelField.options.placeholder = '手工输入商品条码';
    productModelField.rules = [
      {
        required: true,
        message: '条形码必须填写',
      },
    ];
  }
};

// 编辑后事件
base.onEditLoadAfter = (master: any) => {
  if (!master.productDesc) {
    master.productDesc = '';
  }
};

const createSecurity = () => {
  if (state.dataListSelections.length !== 1) {
    proxy.$message.error('请选择一条数据！');
    return;
  }

  proxy.$refs['refSecurity'].initData(state.dataListSelections[0]);
  state.securityShow = true;
};
const closed = () => {
  base.dataListRef.value.loadData();
};
</script>
