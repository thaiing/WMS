<template>
  <div class="biz-container">
    <!--数据Table-->
    <yrt-data-list v-show="state.showPageList" :ref="dataListRefName" :editor-ref="editorRefName" :data-options="state.dataOptions" v-model:fields="state.dataListOptions.fields" :buttons="state.dataListOptions.buttons" :button-click="base.buttonClick" v-model:data-list-selections="state.dataListSelections" :auth-nodes="state.authNodes" :on-delete-before="onDeleteBefore"></yrt-data-list>

    <!--数据编辑器Editor-->
    <yrt-editor :ref="editorInfo.refName" :editor-type="state.dataOptions.editorType" v-model:action="editorInfo.action" :data-list-ref="dataListRefName" v-model:config="state.editorOptions.config" :data-options="state.dataOptions" :editorOptions="state.editorOptions" :detail-button-click="detailButtonClick" :auth-nodes="state.authNodes" @on-change="base.onChange" @on-edit-load-after="base.onEditLoadAfter" @on-tab-change="onTabChange">
      <!--自定义按钮插槽-->
      <template #footer-button-region="{ formData, details }">
        <!--修改密码按钮-->
        <el-button type="success" @click="modifypwd(formData, details)">
          <template #icon>
            <svg-icon name="ele-Lock" class="text-size-n" :size="14" />
          </template>
          修改密码
        </el-button>
      </template>
      <template #blank-baiduMap> <div ref="mapContainer" style="width: 100%; height: 500px"></div></template>
    </yrt-editor>

    <!--修改密码弹出页面-->
    <modify-pwd ref="modifypwdDialogRef" v-model:visible="state.modifyPwdVisible" :is-orgin-pwd="false"></modify-pwd>
    <!--销售等级弹出页面-->
    <sales-level-setting ref="salesLevelSettingDialogRef" v-model:visible="state.salesLevelSettingVisible.isShowDialog"></sales-level-setting>
  </div>
</template>

<script setup lang="ts" name="basic-base-consignor">
import { ComponentInternalInstance } from 'vue';
import { BaseProperties } from '/@/types/base-type';
import to from 'await-to-js';
import { postData } from '/@/api/common/baseApi';
import baseHook from '/@/components/hooks/baseHook';
import useDropdownStore from '/@/stores/modules/dropdown';
import { DataType, OrderByType, OrderItem, QueryBo, QueryType } from '/@/types/common';
import modifyPwd from './components/modify-pwd.vue';
import salesLevelSetting from './components/sales-level-setting.vue';

import YrtDataList from '/@/components/common/yrtDataList.vue';
// import { Loader } from '@googlemaps/js-api-loader';

const yrtEditor = defineAsyncComponent(() => import('/@/components/common/yrtEditor.vue'));
const dropdownStore = useDropdownStore();
const base = baseHook();
const { baseState, dataListRefName, editorRefName, buttonClick, detailButtonClick, editorInfo, masterData } = base;
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;
const modifypwdDialogRef = ref();
let currentMarker = null as any;

//#region 定义变量
const state = reactive({
  ...toRefs(baseState),
  // 修改密码页面默认不显示
  modifyPwdVisible: false,
  // 销售等级设置对话框
  salesLevelSettingVisible: {
    isShowDialog: false,
  },
  consignorId: '',
  googleMap: null as any,
  geocoder: null as any,
  currentLocation: null as any,
  address: null as any,
});
//#endregion

onMounted(() => {});
// 列表页面按钮事件
base.buttonClick = (authNode: string) => {
  switch (authNode) {
    case 'salesLevel':
      levelSetting();
      return true;
  }
};

// 销售等级设置
const levelSetting = () => {
  // const ids = state.dataListSelections.map((m) => {
  //   return m['consignorId'];
  // });
  // if (!ids.length) {
  //   proxy.$message.error('请选中一行数据！');
  //   return;
  // }

  // if (ids.length > 1) {
  //   proxy.$message.error('只能选中一行数据！');
  //   return;
  // }
  // state.consignorId = state.dataListSelections[0].consignorId;

  proxy.$refs.salesLevelSettingDialogRef.initData();

  state.salesLevelSettingVisible = {
    isShowDialog: true,
  };
};

// 字段值改变事件
base.onChange = (ref: any, val: any, field: any, formData: any) => {
  // 记录ID和Name
  if (field.options.prop === 'provinceName') {
    // 改变市级下拉框
    loadChildrenNode(val, 614, field.options.prop);
  } else if (field.options.prop === 'cityName') {
    // 改变区级下拉框
    loadChildrenNode(val, 615, field.options.prop);
  } else if (field.options.prop === 'clientShortName') {
    // 改变区级下拉框
    getClientInfo(val);
  } else if (field.options.prop === 'firstCustomer') {
    // 改变二级客户下拉框值
    getDeptList(val, formData);
  }
};

const getDeptList = async (val: any, formData: any) => {
  try {
    const url = '/system/permission/dept/pageList';
    const params = {
      menuId: 1505,
      orderByColumn: 'deptId',
      otherParams: { currentDeptId: val },
      prefixRouter: '/system/permission/dept',
      tableName: 'sys_dept',
    };
    let [err, res] = await to(postData(url, params));
    if (err) {
      return;
    }
    if (res?.result) {
      //把当前选中的项给取消掉
      let list = res.rows?.filter((item: any) => item.deptId != val);

      list = list?.map((item: any) => {
        return {
          value: item.deptId,
          label: item.deptName,
          secondaryCustomerId: item.deptId,
          secondaryCustomer: item.deptName,
        };
      });
      if (list && list.length) {
        formData.secondaryCustomerId = list[0].secondaryCustomerId;
        formData.secondaryCustomer = list[0].secondaryCustomer;
      } else {
        list = [];
      }

      dropdownStore.setDropDown(1164, list);
    }
  } catch (error: any) {
    proxy.$message.error(error.message);
  }
};

// 根据省ID获得市
const loadChildrenNode = async (id: any, dropdownId: any, prop: any) => {
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
          city_Id: item.value,
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
  } else {
    proxy.$message.error(res.msg);
  }
};

const getClientInfo = async (val: any) => {
  try {
    const url = '/basic/client/client/getClientInfo';
    const params = {
      clientId: val.clientId,
    };
    let [err, res] = await to(postData(url, params));
    if (err) {
      return;
    }
    if (res?.result) {
      let formData = masterData.value; // 主表
      let data = res.data;
      formData.shippingName = data.shippingName;
      formData.telephone = data.tel;
      formData.mobile = data.mobile;
      formData.shippingAddress = data.shippingAddress;
      formData.countryName = data.countryName;
      formData.provinceName = data.provinceName;
      formData.shippingName = data.shippingName;
      formData.cityName = data.cityName;
      formData.regionName = data.regionName;
      formData.email = data.email;
      formData.lineName = data.lineName;
    }
  } catch (error: any) {
    proxy.$message.error(error.message);
  }
};
// 删除前事件
const onDeleteBefore = (dataOptions: any, rows: any[]) => {
  dataOptions.deleteUrl = '/composite/basic/baseConsignorComposite/remove';
  return true;
};

// const loader = new Loader({
//   apiKey: 'AIzaSyBh-_E0OcqpLIcqHadZLXPDFw7pJzdVPJ8',
//   version: 'weekly',
//   libraries: ['places'],
// });

base.onEditLoadAfter = (master: any) => {
  setTimeout(() => {
    getCurrentLocation();
  }, 500);
};
// 获取当前定位
const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => handleLocationSuccess(position),
      (error) => handleLocationError(error)
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
};

// 获取当前定位信息
const handleLocationSuccess = (position: any) => {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  // 更新当前定位
  state.currentLocation = { lat, lng };
  initMap();
};
const requestAddressFromCoordinates = (location: any) => {
  state.geocoder.geocode({ location: location }, (results: any, status: any) => {
    if (status === 'OK') {
      if (results[0]) {
        state.address = results[0].formatted_address;
        masterData.value.address = state.address;
      } else {
        console.warn('No results found');
      }
    } else {
      console.error('Geocoder failed due to: ' + status);
    }
  });
};

const handleLocationError = (error: any) => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.error('User denied the request for Geolocation.');
      break;
    case error.POSITION_UNAVAILABLE:
      console.error('Location information is unavailable.');
      break;
    case error.TIMEOUT:
      console.error('The request to get user location timed out.');
      break;
    case error.UNKNOWN_ERROR:
      console.error('An unknown error occurred.');
      break;
  }
};

const initMap = async () => {
  try {
    // 确保 API 完全加载
    // await loader.load();

    const mapElement = proxy.$refs.mapContainer;
    if (!mapElement) {
      console.error('Map container element not found.');
      return;
    }

    if (masterData.value.lat) {
      state.currentLocation.lat = Number(masterData.value.lat);
    }
    if (masterData.value.lng) {
      state.currentLocation.lng = Number(masterData.value.lng);
    }

    // 北京市中心的经纬度
    const beijingCenter = { lat: state.currentLocation.lat, lng: state.currentLocation.lng };

    const mapOptions = {
      center: beijingCenter,
      zoom: 16, // 根据需要调整缩放级别
    };

    // 创建地图实例
    state.googleMap = new google.maps.Map(mapElement, mapOptions);

    // 初始化地理编码器
    state.geocoder = new google.maps.Geocoder();

    // 请求位置名称
    requestAddressFromCoordinates(state.currentLocation);
    // 更新地图中心点
    state.googleMap.setCenter(state.currentLocation);
    //添加标记
    addMarker(state.currentLocation.lat, state.currentLocation.lng);

    masterData.value.lat = state.currentLocation.lat;
    masterData.value.lng = state.currentLocation.lng;

    // 添加点击事件监听器
    google.maps.event.addListener(state.googleMap, 'click', (event: any) => {
      // 更新地图中心点
      state.googleMap.setCenter(event.latLng);
      //添加标记
      addMarker(event.latLng.lat(), event.latLng.lng());
    });

    masterData.value.lat = state.currentLocation.lat;
    masterData.value.lng = state.currentLocation.lng;
  } catch (error) {
    console.error('Failed to load Google Maps API or initialize map:', error);
  }
};

const addMarker = (lat: any, lng: any) => {
  // 移除旧的标记（如果存在）
  if (currentMarker) {
    currentMarker.setMap(null);
  }
  // 添加新标记
  currentMarker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: state.googleMap,
    title: 'Selected Location',
  });

  masterData.value.lat = lat;
  masterData.value.lng = lng;
  // 请求位置名称
  requestAddressFromCoordinates({ lat: lat, lng: lng });

  // 可选：显示信息窗口
  // const infowindow = new google.maps.InfoWindow({
  //   content: `Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`
  // });

  // infowindow.open(state.googleMap, window.currentMarker);
};

const onTabChange = (tabInfo: any) => {
  setTimeout(() => {
    initMap();
  }, 500);
};

// 修改密码
const modifypwd = (formData: any, details: any) => {
  state.modifyPwdVisible = true;
  modifypwdDialogRef.value.setConsignorId(formData.consignorId);
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 500px;
}
</style>
