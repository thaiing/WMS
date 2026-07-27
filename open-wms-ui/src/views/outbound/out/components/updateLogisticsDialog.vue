<template>
  <div>
    <el-dialog draggable v-model="currentVisible" title="修改物流信息" width="50%" class="dialog-container">
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item :label="$tt('省')" label-width="100px">
            <el-select v-model="state.formData.provinceId" :placeholder="$tt('请选择省')" class="input-300" @change="onChange(1)">
              <el-option v-for="item in state.provinceNameList" :key="item.provinceId" :label="item.provinceName" :value="item.provinceId"></el-option>
            </el-select>

            <el-select v-model="state.formData.cityId" :placeholder="$tt('请选择市')" class="input-300" @change="onChange(2)">
              <el-option v-for="item in state.cityNameList" :key="item.cityId" :label="item.cityName" :value="item.cityId"></el-option>
            </el-select>

            <el-select v-model="state.formData.regionName" :placeholder="$tt('请选择区')" class="input-300" @change="onChange(3)">
              <el-option v-for="item in state.regionNameList" :key="item.regionId" :label="item.regionName" :value="item.regionName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="20">
          <el-form ref="form" :model="state.formData" label-width="100px">
            <el-form-item :label="$tt('收货地址')">
              <el-input v-model="state.formData.shippingAddress" link></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="10">
          <el-form ref="form" :model="state.formData" label-width="100px">
            <el-form-item :label="$tt('收货人')">
              <el-input v-model="state.formData.shippingName" link></el-input>
            </el-form-item>

            <!-- <el-form-item :label="$tt('市')"> </el-form-item> -->
            <el-form-item :label="$tt('快递类别')">
              <el-select v-model="state.formData.expressCorpType" :disabled="true" :placeholder="$tt('请选择快递类别')" class="input-300">
                <el-option v-for="item in state.expressCorpTypeList" :key="item.expressCorpType" :label="item.value02" :value="item.expressCorpType"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$tt('配送线路')">
              <el-select v-model="state.formData.lineId" :placeholder="$tt('请选择配送线路')" class="input-300">
                <el-option v-for="item in state.lineNameList" :key="item.lineId" :label="item.lineName" :value="item.lineId"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$tt('手机号')">
              <el-input v-model="state.formData.mobile" link style="width: 140px"></el-input>
            </el-form-item>

            <el-form-item :label="$tt('快递单号')">
              <el-input v-model="state.formData.expressCode" link style="width: 140px"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="10">
          <el-form ref="form" :model="state.formData" label-width="100px">
            <el-form-item :label="$tt('电话')">
              <el-input v-model="state.formData.telephone" link style="width: 140px"></el-input>
            </el-form-item>
            <el-form-item :label="$tt('邮编')">
              <el-input v-model="state.formData.postCode" link style="width: 140px"></el-input>
            </el-form-item>

            <el-form-item :label="$tt('快递名称')">
              <el-select v-model="state.formData.expressCorpName" :placeholder="$tt('请选择快递名称')" class="input-300" @change="getExpressCorpType">
                <el-option v-for="item in state.expressCorpNameList" :key="item.expressCorpId" :label="item.expressCorpName" :value="item.expressCorpName"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$tt('配送类型')">
              <el-select v-model="state.formData.distributionType" :placeholder="$tt('请选择配送类型')" class="input-300">
                <el-option v-for="item in state.distributionTypeList" :key="item.value01" :label="item.value01" :value="item.value01"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$tt('国家')">
              <el-select v-model="state.formData.countryId" :placeholder="$tt('请选择国家')" class="input-300">
                <el-option v-for="item in state.countryList" :key="item.countryId" :label="item.countryName" :value="item.countryId"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>

        <el-col :span="10">
          <el-form ref="form" :model="state.formData" label-width="100px">
            <!-- <el-form-item :label="$tt('区')">
						</el-form-item> -->
          </el-form>
        </el-col>
      </el-row>
      <template class="right" #footer>
        <span>
          <el-button @click="currentVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateLogistics">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="update-logistics-dialog">
import { ComponentInternalInstance } from 'vue';

import { BaseProperties } from '/@/types/base-type';
import to from 'await-to-js';
import useDropdownStore from '/@/stores/modules/dropdown';
import { postData } from '/@/api/common/baseApi';
import { OrderItem, OrderByType, DataType, QueryType, QueryBo } from '/@/types/common';
import { debug } from 'console';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const dropdownStore = useDropdownStore();

const emit = defineEmits(['update:visible', 'on-closed']);
//#region 定义属性
const props = defineProps({
  visible: Boolean,
  ids: Number,
  // 选中的订单ID
  dataListSelections: {
    type: Array,
    default: () => {
      return [];
    },
  },
});
//#endregion

//#region 定义变量
const state = reactive({
  number: 0,

  formData: {
    shippingName: '',
    telephone: '',
    consignorId: '',
    consignorName: '',
    areaCode: '',
    channelCode: '',
    checkType: '',
    checked: 0,
    input: '',
  } as any,

  countryList: [] as any[],
  provinceNameList: [] as any[],
  expressCorpTypeList: [] as any[],
  expressCorpNameList: [] as any[],
  lineNameList: [] as any[],
  distributionTypeList: [] as any[],
  cityNameList: [] as any[],
  regionNameList: [] as any[],
});

//#endregion

//#region onMounted
onMounted(async () => {
  await getCountryList();

  changeExpressCorpType();
});
//#endregion

// 获取国家下拉框
const getCountryList = async () => {
  // 获取下拉框值
  await dropdownStore.loadDropDownById([716]);
  state.countryList = dropdownStore.getDropdown(716)?.value || [];

  // 配送线路
  await dropdownStore.loadDropDownById([1025]);
  state.lineNameList = dropdownStore.getDropdown(1025)?.value || [];

  // 快递类别
  await dropdownStore.loadDropDownById([502]);
  state.expressCorpTypeList = dropdownStore.getDropdown(502)?.value || [];

  // 配送类型
  await dropdownStore.loadDropDownById([1018]);
  state.distributionTypeList = dropdownStore.getDropdown(1018)?.value || [];

  // 省份
  await dropdownStore.loadDropDownById([613]);
  state.provinceNameList = dropdownStore.getDropdown(613)?.value || [];
};

// 是否显示dialog
const currentVisible = computed({
  get() {
    return props.visible;
  },
  set(newValue) {
    emit('update:visible', newValue); // 双向绑定prop.action，通知父级组件变量值同步更新
  },
});

// 修改物流信息
const updateLogistics = async () => {
  debugger;
  if (state.formData.countryId) {
    state.formData.countryName = state.countryList.find((item: any) => item.countryId === state.formData.countryId).countryName;
  }

  if (state.formData.lineId) {
    state.formData.lineName = state.lineNameList.find((item: any) => item.lineId === state.formData.lineId).lineName;
  }

  if (state.formData.provinceId) {
    state.formData.provinceName = state.provinceNameList.find((item: any) => item.provinceId === state.formData.provinceId).provinceName;
  }

  if (state.formData.provinceId) {
    state.formData.provinceName = state.provinceNameList.find((item: any) => item.provinceId === state.formData.provinceId).provinceName;
  }

  if (state.formData.regionName) {
    state.formData.regionId = state.regionNameList.find((item: any) => item.regionName === state.formData.regionName).region_Id;
  }

  const url = '/outbound/out/order/updateLogistics'; //
  const params = {
    shippingName: state.formData.shippingName,
    shippingAddress: state.formData.shippingAddress,
    provinceName: state.formData.provinceName,
    expressCorpType: state.formData.expressCorpType,
    telephone: state.formData.telephone,
    postCode: state.formData.postCode,
    expressCorpName: state.formData.expressCorpName,
    lineName: state.formData.lineName,
    lineId: state.formData.lineId,
    mobile: state.formData.mobile,
    countryName: state.formData.countryName,
    countryId: state.formData.countryId,
    expressCode: state.formData.expressCode,
    distributionType: state.formData.distributionType,
    orderId: state.formData.orderId,
    cityId: state.formData.cityId,
    cityName: state.formData.cityName,
    provinceId: state.formData.provinceId,
    regionName: state.formData.regionName,
    regionId: state.formData.regionId,
  };
  let [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  proxy.common.showMsg(res);
  currentVisible.value = false;
};

// 接受预到货单主表信息
const initData = (selectInfos: any) => {
  selectInfos[0];
  state.formData = selectInfos[0];
  // 加载省
  if (state.formData.provinceId) {
    loadChildrenNode(state.formData.provinceId, 614, 'provinceName');
    state.cityNameList = dropdownStore.getDropdown(614)?.value || [];
  }
  // 加载市
  if (state.formData.cityId) {
    loadChildrenNode(state.formData.cityId, 615, 'cityName');

    state.regionNameList = dropdownStore.getDropdown(615)?.value || [];
  }
};
const onChange = (type: any) => {
  // 记录ID和Name
  if (type == 1) {
    state.formData.provinceName = state.provinceNameList.find((item: any) => item.provinceId === state.formData.provinceId).provinceName;
    // 改变市级下拉框
    loadChildrenNode(state.formData.provinceId, 614, 'provinceName');

    state.cityNameList = dropdownStore.getDropdown(614)?.value || [];
  } else if (type == 2) {
    state.formData.cityName = state.cityNameList.find((item: any) => item.cityId === state.formData.cityId).cityName;
    // 改变区级下拉框
    loadChildrenNode(state.formData.cityId, 615, 'cityName');

    state.regionNameList = dropdownStore.getDropdown(615)?.value || [];
  }
};

// 根据省ID获得市
const loadChildrenNode = async (id: any, dropdownId: any, prop: any) => {
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
          region_Id: item.value,
          regionName: item.label,
          value: item.value,
          label: item.label,
        };
        return newItem;
      }
    });
    dropdownStore.setDropDown(dropdownId, data);
    if (dropdownId == 614) {
      state.cityNameList = data;
    }
    if (dropdownId == 615) {
      state.regionNameList = data;
    }
  } else {
    proxy.$message.error(res.msg);
  }
};
// 获得快递类别
const getExpressCorpType = async () => {
  state.expressCorpNameList;
  if (state.expressCorpNameList.length > 0) {
    var dataList = state.expressCorpNameList.filter((item: any) => {
      return item.expressCorpName == state.formData.expressCorpName;
    });
    state.formData.expressCorpType = dataList[0].expressCorpType;
  }
};

// 快递信息
const changeExpressCorpType = async () => {
  var url = '/basic/base/express-corp/getExpressCorp';
  var params = {};
  const [err, res] = await to(postData(url, params));

  if (err) {
    return;
  }
  proxy.common.showMsg(res);
  if (res.result) {
    res.data.dataList.forEach((item: any) => {
      item.label = item.expressCorpId;
      item.value = item.expressCorpName;
      return item;
    });
    state.expressCorpNameList = res.data.dataList;
  }
};
// 对外暴露属性和方法
defineExpose({
  initData,
});
</script>
