<template>
  <div class="info-contianer">
    <div class="user-container-body">
      <h1 class="user-title">账号应用信息</h1>
      <el-card style="max-width: 100%; margin-bottom: 20px">
        <template #header>
          <div class="card-header">
            <span>账号资料</span>
          </div>
        </template>
        <el-form label-width="auto" style="max-width: 1000px">
          <el-form-item class="form-item" label="套餐名称">
            <span class="content">{{ state.tenantInfo.packageName }}</span>
          </el-form-item>
          <el-form-item class="form-item" label="应用编号">
            <span class="content">{{ state.tenantInfo.tenantId }}</span>
          </el-form-item>
          <el-form-item class="form-item" label="过期时间">
            <span class="content">{{ state.tenantInfo.expireTime }}</span>
          </el-form-item>
          <el-form-item class="form-item" label="租户状态">
            <span class="content">{{ state.tenantInfo.status === 1 ? '正常' : '停用' }}</span>
          </el-form-item>
          <el-form-item class="form-item" label="域名">
            <template v-if="state.currentName !== 'domain'">
              <span class="content mr-20">{{ state.tenantInfo.domain }}</span>
              <svg-icon name="ele-Edit" title="编辑" class="edit-icon" @click="editField('domain', state.tenantInfo.domain)"></svg-icon>
            </template>
            <template v-if="state.currentName === 'domain'">
              <el-input v-model="state.currentValue" style="width: 240px" placeholder="请输入" />
              <el-button type="primary" @click="saveEdit">保存</el-button>
              <el-button type="default" @click="cancelEdit">取消</el-button>
            </template>
          </el-form-item>
          <el-form-item class="form-item" label="系统全称">
            <template v-if="state.currentName !== 'sysFullName'">
              <span class="content mr-20">{{ state.tenantInfo.sysFullName }}</span>
              <svg-icon name="ele-Edit" title="编辑" class="edit-icon" @click="editField('sysFullName', state.tenantInfo.sysFullName)"></svg-icon>
            </template>
            <template v-if="state.currentName === 'sysFullName'">
              <el-input v-model="state.currentValue" style="width: 240px" placeholder="请输入" />
              <el-button type="primary" @click="saveEdit">保存</el-button>
              <el-button type="default" @click="cancelEdit">取消</el-button>
            </template>
          </el-form-item>
          <el-form-item class="form-item" label="系统简称">
            <template v-if="state.currentName !== 'sysShortName'">
              <span class="content mr-20">{{ state.tenantInfo.sysShortName }}</span>
              <svg-icon name="ele-Edit" title="编辑" class="edit-icon" @click="editField('sysShortName', state.tenantInfo.sysShortName)"></svg-icon>
            </template>
            <template v-if="state.currentName === 'sysShortName'">
              <el-input v-model="state.currentValue" style="width: 240px" placeholder="请输入" />
              <el-button type="primary" @click="saveEdit">保存</el-button>
              <el-button type="default" @click="cancelEdit">取消</el-button>
            </template>
          </el-form-item>
          <el-form-item class="form-item" label="联系电话">
            <template v-if="state.currentName !== 'contactPhone'">
              <span class="content mr-20">{{ state.tenantInfo.contactPhone }}</span>
              <svg-icon name="ele-Edit" title="编辑" class="edit-icon" @click="editField('contactPhone', state.tenantInfo.contactPhone)"></svg-icon>
            </template>
            <template v-if="state.currentName === 'contactPhone'">
              <el-input v-model="state.currentValue" style="width: 240px" placeholder="请输入" />
              <el-button type="primary" @click="saveEdit">保存</el-button>
              <el-button type="default" @click="cancelEdit">取消</el-button>
            </template>
          </el-form-item>
          <el-form-item class="form-item" label="联系人">
            <template v-if="state.currentName !== 'contactUserName'">
              <span class="content mr-20">{{ state.tenantInfo.contactUserName }}</span>
              <svg-icon name="ele-Edit" title="编辑" class="edit-icon" @click="editField('contactUserName', state.tenantInfo.contactUserName)"></svg-icon>
            </template>
            <template v-if="state.currentName === 'contactUserName'">
              <el-input v-model="state.currentValue" style="width: 240px" placeholder="请输入" />
              <el-button type="primary" @click="saveEdit">保存</el-button>
              <el-button type="default" @click="cancelEdit">取消</el-button>
            </template>
          </el-form-item>
          <el-form-item class="form-item" label="统一社会信用代码">
            <template v-if="state.currentName !== 'licenseNumber'">
              <span class="content mr-20">{{ state.tenantInfo.licenseNumber }}</span>
              <svg-icon name="ele-Edit" title="编辑" class="edit-icon" @click="editField('licenseNumber', state.tenantInfo.licenseNumber)"></svg-icon>
            </template>
            <template v-if="state.currentName === 'licenseNumber'">
              <el-input v-model="state.currentValue" style="width: 240px" placeholder="请输入" />
              <el-button type="primary" @click="saveEdit">保存</el-button>
              <el-button type="default" @click="cancelEdit">取消</el-button>
            </template>
          </el-form-item>
          <el-form-item class="form-item" label="地址">
            <template v-if="state.currentName !== 'address'">
              <span class="content mr-20">{{ state.tenantInfo.address }}</span>
              <svg-icon name="ele-Edit" title="编辑" class="edit-icon" @click="editField('address', state.tenantInfo.address)"></svg-icon>
            </template>
            <template v-if="state.currentName === 'address'">
              <el-input v-model="state.currentValue" style="width: 240px" placeholder="请输入" />
              <el-button type="primary" @click="saveEdit">保存</el-button>
              <el-button type="default" @click="cancelEdit">取消</el-button>
            </template>
          </el-form-item>
          <el-form-item class="form-item" label="企业简介">
            <template v-if="state.currentName !== 'intro'">
              <span class="content mr-20">{{ state.tenantInfo.intro }}</span>
              <svg-icon name="ele-Edit" title="编辑" class="edit-icon" @click="editField('intro', state.tenantInfo.intro)"></svg-icon>
            </template>
            <template v-if="state.currentName === 'intro'">
              <el-input v-model="state.currentValue" style="width: 240px" placeholder="请输入" />
              <el-button type="primary" @click="saveEdit">保存</el-button>
              <el-button type="default" @click="cancelEdit">取消</el-button>
            </template>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="danger" @click="clearData">清空账号数据</el-button>
            <el-button type="danger" @click="cancelApp">注销应用</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card style="max-width: 100%; margin-bottom: 20px">
        <template #header>
          <div class="card-header">
            <span class="mr-20">应用主题</span>
          </div>
        </template>
        <el-form label-width="auto" style="max-width: 1000px">
          <el-form-item class="form-item" label="登录页模板">
            <div class="img-box">
              <div v-for="(item, index) in state.loginTemplate" :key="item.url" class="img-item">
                <el-image style="width: 180px; height: 100px" :src="item.url + '?x-oss-process=style/200'" fit="fill" :class="['img', state.tenantInfo.loginTemplate === item.name ? 'active' : '']" :preview-src-list="state.loginTemplate.map((m) => m.url)" :initial-index="index" />
                <el-radio v-model="state.tenantInfo.loginTemplate" :value="item.name" size="large" @change="editField('loginTemplate', state.tenantInfo.loginTemplate)">
                  <div class="name">{{ item.name }}</div>
                </el-radio>
              </div>
            </div>
            <div class="img-item">
              <template v-if="state.currentName === 'loginTemplate'">
                <el-button type="primary" @click="saveEdit">保存</el-button>
                <el-button type="default" @click="cancelEdit">取消</el-button>
              </template>
            </div>
          </el-form-item>
          <el-form-item class="form-item" label="主界面模板">
            <div class="layout-drawer-content-flex">
              <!-- defaults 布局 -->
              <div class="item-box">
                <div class="layout-drawer-content-item" @click="onSetLayout('defaults')">
                  <section class="el-container el-circular" :class="{ 'drawer-layout-active': state.tenantInfo.mainTemplate === 'defaults' }">
                    <aside class="el-aside" style="width: 20px"></aside>
                    <section class="el-container is-vertical">
                      <header class="el-header" style="height: 10px"></header>
                      <main class="el-main"></main>
                    </section>
                  </section>
                  <div class="layout-tips-warp" :class="{ 'layout-tips-warp-active': state.tenantInfo.mainTemplate === 'defaults' }">
                    <div class="layout-tips-box">
                      <p class="layout-tips-txt">{{ $t('message.layout.sixDefaults') }}</p>
                    </div>
                  </div>
                </div>
                <el-radio v-model="state.tenantInfo.mainTemplate" value="defaults" size="small" @change="onSetLayout('defaults')">
                  <div class="name">默认</div>
                </el-radio>
              </div>
              <!-- classic 布局 -->
              <div class="item-box">
                <div class="layout-drawer-content-item" @click="onSetLayout('classic')">
                  <section class="el-container is-vertical el-circular" :class="{ 'drawer-layout-active': state.tenantInfo.mainTemplate === 'classic' }">
                    <header class="el-header" style="height: 10px"></header>
                    <section class="el-container">
                      <aside class="el-aside" style="width: 20px"></aside>
                      <section class="el-container is-vertical">
                        <main class="el-main"></main>
                      </section>
                    </section>
                  </section>
                  <div class="layout-tips-warp" :class="{ 'layout-tips-warp-active': state.tenantInfo.mainTemplate === 'classic' }">
                    <div class="layout-tips-box">
                      <p class="layout-tips-txt">{{ $t('message.layout.sixClassic') }}</p>
                    </div>
                  </div>
                </div>
                <el-radio v-model="state.tenantInfo.mainTemplate" value="classic" size="small" @change="onSetLayout('classic')">
                  <div class="name">经典</div>
                </el-radio>
              </div>
              <!-- transverse 布局 -->
              <div class="item-box">
                <div class="layout-drawer-content-item" @click="onSetLayout('transverse')">
                  <section class="el-container is-vertical el-circular" :class="{ 'drawer-layout-active': state.tenantInfo.mainTemplate === 'transverse' }">
                    <header class="el-header" style="height: 10px"></header>
                    <section class="el-container">
                      <section class="el-container is-vertical">
                        <main class="el-main"></main>
                      </section>
                    </section>
                  </section>
                  <div class="layout-tips-warp" :class="{ 'layout-tips-warp-active': state.tenantInfo.mainTemplate === 'transverse' }">
                    <div class="layout-tips-box">
                      <p class="layout-tips-txt">{{ $t('message.layout.sixTransverse') }}</p>
                    </div>
                  </div>
                </div>
                <el-radio v-model="state.tenantInfo.mainTemplate" value="transverse" size="small" @change="onSetLayout('transverse')">
                  <div class="name">横向</div>
                </el-radio>
              </div>
              <!-- columns 布局 -->
              <div class="item-box">
                <div class="layout-drawer-content-item" @click="onSetLayout('columns')">
                  <section class="el-container el-circular" :class="{ 'drawer-layout-active': state.tenantInfo.mainTemplate === 'columns' }">
                    <aside class="el-aside-dark" style="width: 10px"></aside>
                    <aside class="el-aside" style="width: 20px"></aside>
                    <section class="el-container is-vertical">
                      <header class="el-header" style="height: 10px"></header>
                      <main class="el-main"></main>
                    </section>
                  </section>
                  <div class="layout-tips-warp" :class="{ 'layout-tips-warp-active': state.tenantInfo.mainTemplate === 'columns' }">
                    <div class="layout-tips-box">
                      <p class="layout-tips-txt">{{ $t('message.layout.sixColumns') }}</p>
                    </div>
                  </div>
                </div>
                <el-radio v-model="state.tenantInfo.mainTemplate" value="columns" size="small" @change="onSetLayout('columns')">
                  <div class="name">分栏</div>
                </el-radio>
              </div>
              <!-- tile 平铺布局 -->
              <div class="item-box">
                <div class="layout-drawer-content-item" @click="onSetLayout('tile')">
                  <section class="el-container el-circular" :class="{ 'drawer-layout-active': state.tenantInfo.mainTemplate === 'tile' }">
                    <aside class="el-aside" style="width: 20px"></aside>
                    <div class="sub-menu">
                      <div class="menu-item"></div>
                      <div class="menu-item"></div>
                      <div class="menu-item"></div>
                    </div>
                    <section class="el-container is-vertical">
                      <header class="el-header" style="height: 10px"></header>
                      <main class="el-main"></main>
                    </section>
                  </section>
                  <div class="layout-tips-warp" :class="{ 'layout-tips-warp-active': state.tenantInfo.mainTemplate === 'tile' }">
                    <div class="layout-tips-box">
                      <p class="layout-tips-txt">{{ $t('message.layout.sixTile') }}</p>
                    </div>
                  </div>
                </div>
                <el-radio v-model="state.tenantInfo.mainTemplate" value="tile" size="small" @change="onSetLayout('tile')">
                  <div class="name">平铺</div>
                </el-radio>
              </div>
              <div class="item-box-save">
                <template v-if="state.currentName === 'mainTemplate'">
                  <el-button type="primary" @click="saveEdit">保存</el-button>
                  <el-button type="default" @click="cancelEdit">取消</el-button>
                </template>
              </div>
            </div>
          </el-form-item>
          <el-form-item class="form-item" label="左侧大图">
            <el-upload class="avatar-uploader" :headers="headers" :action="uploadImgUrl" :show-file-list="false" :on-success="(res:any, uploadFile:any) => handleAvatarSuccess(res, uploadFile, 'bigPic')" :before-upload="beforeAvatarUpload">
              <img v-if="state.tenantInfo.bigPicUrl" :src="state.tenantInfo.bigPicUrl" class="upload-img" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <template v-if="state.currentName === 'bigPic'">
              <el-button type="primary" class="ml-20" @click="saveEdit">保存</el-button>
              <el-button type="default" @click="cancelEdit">取消</el-button>
            </template>
          </el-form-item>
          <el-form-item class="form-item" label="背景颜色">
            <el-color-picker v-model="state.tenantInfo.bgColor" :predefine="predefineColors" show-alpha @change="editField('bgColor', state.tenantInfo.bgColor)"></el-color-picker>
            <template v-if="state.currentName === 'bgColor'">
              <el-button type="primary" class="ml-20" @click="saveEdit">保存</el-button>
              <el-button type="default" @click="cancelEdit">取消</el-button>
            </template>
          </el-form-item>
          <el-form-item class="form-item" label="长logo">
            <el-upload class="avatar-uploader" :headers="headers" :action="uploadImgUrl" :show-file-list="false" :on-success="(res:any, uploadFile:any) => handleAvatarSuccess(res, uploadFile, 'logoLong')" :before-upload="beforeAvatarUpload">
              <img v-if="state.tenantInfo.logoLongUrl" :src="state.tenantInfo.logoLongUrl" class="upload-img" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <template v-if="state.currentName === 'logoLong'">
              <el-button type="primary" class="ml-20" @click="saveEdit">保存</el-button>
              <el-button type="default" @click="cancelEdit">取消</el-button>
            </template>
          </el-form-item>
          <el-form-item class="form-item" label="短logo">
            <el-upload class="avatar-uploader" :headers="headers" :action="uploadImgUrl" :show-file-list="false" :on-success="(res:any, uploadFile:any) => handleAvatarSuccess(res, uploadFile, 'logoShort')" :before-upload="beforeAvatarUpload">
              <img v-if="state.tenantInfo.logoShortUrl" :src="state.tenantInfo.logoShortUrl" class="upload-img" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <template v-if="state.currentName === 'logoShort'">
              <el-button type="primary" class="ml-20" @click="saveEdit">保存</el-button>
              <el-button type="default" @click="cancelEdit">取消</el-button>
            </template>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup name="system-tenant-tenant-info">
import { BaseProperties, DetailField } from '/@/types/base-type';
import { reactive, ComponentInternalInstance } from 'vue';
import { predefineColors } from '/@/utils/colorUtil';

import to from 'await-to-js';
import { getData, postData } from '/@/api/common/baseApi';
import { DataType, QueryType } from '/@/types/common';
import { UploadProps } from 'element-plus';
import { globalHeaders } from '/@/utils/request';
let ins = getCurrentInstance() as ComponentInternalInstance;
let proxy = ins.proxy as BaseProperties;

const baseUrl = import.meta.env.VITE_APP_BASE_API;
const uploadImgUrl = ref(baseUrl + '/system/core/oss/upload'); // 上传的图片服务器地址
const headers = ref(globalHeaders());

// do not use same name with ref
const state = reactive({
  tenantInfo: {
    loginTemplate: '天空蓝',
    mainTemplate: 'defaults',
    logoLong: '',
    logoShort: '',
  } as any,
  loginTemplate: [
    {
      url: 'https://auod-beijing.oss-cn-beijing.aliyuncs.com/wms/dijing/login-01.png',
      name: '天空蓝',
    },
    {
      url: 'https://auod-beijing.oss-cn-beijing.aliyuncs.com/wms/dijing/login-02.png',
      name: '翡翠绿',
    },
    {
      url: 'https://auod-beijing.oss-cn-beijing.aliyuncs.com/wms/dijing/login-03.png',
      name: '智慧蓝',
    },
    {
      url: 'https://auod-beijing.oss-cn-beijing.aliyuncs.com/wms/dijing/login-04.png',
      name: '科技紫',
    },
  ],
  currentName: '',
  currentValue: '',
});

onMounted(() => {
  getTenantInfo();
});

// 5、布局切换
const onSetLayout = (layout: string) => {
  state.tenantInfo.mainTemplate = layout;
  editField('mainTemplate', state.tenantInfo.mainTemplate);
};

const getTenantInfo = async () => {
  let url = '/system/tenant/tenant/getTenantInfo/' + proxy.common.getUserInfo().tenantId;
  const [err, res] = await to(postData(url, {}));
  if (err) {
    return;
  }

  debugger;
  if (res.result) {
    state.tenantInfo = res.data;
    if (state.tenantInfo.expandFields) {
      state.tenantInfo.bigPicUrl = state.tenantInfo.expandFields.bigPic;
      state.tenantInfo.bgColor = state.tenantInfo.expandFields.bgColor;
    }
    state.tenantInfo.loginTemplate = res.data.loginTemplate;
    state.tenantInfo.mainTemplate = res.data.mainTemplate;
    let logoLong = res.data.logoLong;
    if (logoLong) {
      state.tenantInfo.logoLongUrl = JSON.parse(logoLong).map((m: any) => m.url)[0];
    }
    let logoShort = res.data.logoShort;
    if (logoShort) {
      state.tenantInfo.logoShortUrl = JSON.parse(logoShort).map((m: any) => m.url)[0];
    }
  }
};

// 开始编辑
const editField = (fieldName: string, fieldValue: string) => {
  state.currentName = fieldName;
  state.currentValue = fieldValue;
};

// 取消编辑
const cancelEdit = () => {
  state.currentName = '';
  state.currentValue = '';
};

// 保存编辑
const saveEdit = async () => {
  let url = '';
  let params: any;
  if (['bgColor', 'bigPic'].indexOf(state.currentName) >= 0) {
    url = '/system/tenant/tenant/updateExpandField';
    params = {
      id: state.tenantInfo.id,
      expandFields: {},
    };
    if (state.currentName === 'bigPic') {
      let bigPic = JSON.parse(state.currentValue);
      if (bigPic) {
        state.currentValue = bigPic[0].url;
      }
    }
    params.expandFields[state.currentName] = state.currentValue;
  } else {
    url = '/system/tenant/tenant/update-multi-condition';
    params = {
      // 更新字段
      columns: {},
      // 更新条件
      queryBoList: [
        {
          column: 'tenantId',
          values: state.tenantInfo.tenantId,
          queryType: QueryType.EQ,
          dataType: DataType.STRING,
        },
      ],
    };
    params.columns[state.currentName] = state.currentValue;
  }
  const [err, res] = await to(postData(url, params));
  if (err) {
    return;
  }
  state.tenantInfo[state.currentName] = state.currentValue;
  proxy.common.showMsg(res);
  state.currentName = '';
  state.currentValue = '';
};

// 上传图片
const handleAvatarSuccess = (res: any, uploadFile: any, fieldName: string) => {
  state.tenantInfo[fieldName + 'Url'] = res.data.url;
  state.tenantInfo[fieldName] = JSON.stringify([{ name: res.data.fileName, url: res.data.url }]);
  editField(fieldName, state.tenantInfo[fieldName]);
};

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const names = rawFile.name.split('.');
  const extName = names[names.length - 1];
  const isLt1MB = rawFile.size / 1024 / 1024 < 1; // 图片小于1M
  const type = ['jpeg', 'jpg', 'png', 'bmp', 'jfif', 'gif'];
  if (type.indexOf(extName) < 0) {
    proxy.$message.error('上传图片只能是' + type.join(',') + '格式!');
  }
  if (!isLt1MB) {
    proxy.$message.error('单张图片大小不能超过 5MB!');
  }
  return type.indexOf(extName) >= 0 && isLt1MB;
};

// 清空数据
const clearData = () => {
  proxy.$message.warning('清除需谨慎，请联系运维管理员！');
};

// 注销应用
const cancelApp = () => {
  proxy.$message.warning('注销应用需谨慎，请联系运维管理员！');
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
    }
    .user-title {
      line-height: 3;
      padding-left: 5px;
    }
    .content {
      padding: 0;
    }
    .form-item {
      &:hover {
        .edit-icon {
          transition: all 0.3s ease-in;
          opacity: 1 !important;
        }
      }
    }
    .edit-icon {
      transition: all 0.3s ease-in;
      opacity: 0;
      cursor: pointer;
      color: #1d7bf7;
    }
  }
}

.img-box {
  display: flex;
  flex-direction: row;
  .img-item {
    display: flex;
    flex-direction: column;
    margin-right: 10px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .img {
      border: 1px solid rgb(226, 226, 226);
      &.active {
        border: 1px solid rgb(0, 57, 245);
      }
      &:hover {
        border: 1px solid rgb(0, 57, 245);
        transition: all 0.3s ease-in-out;
      }
    }
  }
}
.layout-drawer-content-flex {
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  margin: 0 -5px;
  .item-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    ::v-deep .name {
      line-height: 1;
      font-size: 14px;
    }
  }
  .item-box-save {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .layout-drawer-content-item {
    width: 150px;
    height: 100px;
    cursor: pointer;
    border: 1px solid transparent;
    position: relative;
    padding: 5px;
    .el-container {
      position: relative;
      height: 100%;
      .el-aside-dark {
        background-color: var(--next-color-seting-header);
      }
      .el-aside {
        background-color: var(--next-color-seting-aside);
      }
      .sub-menu {
        width: 27px;
        height: 47px;
        position: absolute;
        left: 20px;
        top: 23px;
        background-color: var(--next-color-seting-aside);
        z-index: 100;
        padding: 3px;
        .menu-item {
          width: 100%;
          height: 5px;
          margin-top: 4px;
          background-color: var(--next-color-seting-main);
        }
      }
      .el-header {
        background-color: var(--next-color-seting-header);
      }
      .el-main {
        background-color: var(--next-color-seting-main);
      }
    }
    .el-circular {
      border-radius: 2px;
      overflow: hidden;
      border: 1px solid transparent;
      transition: all 0.3s ease-in-out;
    }
    .drawer-layout-active {
      border: 1px solid;
      border-color: var(--el-color-primary);
    }
    .layout-tips-warp,
    .layout-tips-warp-active {
      transition: all 0.3s ease-in-out;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid;
      border-color: var(--el-color-primary-light-5);
      border-radius: 100%;
      padding: 4px;
      .layout-tips-box {
        transition: inherit;
        width: 30px;
        height: 30px;
        z-index: 9;
        border: 1px solid;
        border-color: var(--el-color-primary-light-5);
        border-radius: 100%;
        .layout-tips-txt {
          transition: inherit;
          position: relative;
          top: 5px;
          font-size: 12px;
          line-height: 1;
          letter-spacing: 2px;
          white-space: nowrap;
          color: var(--el-color-primary-light-5);
          text-align: center;
          transform: rotate(30deg);
          left: -1px;
          background-color: var(--next-color-seting-main);
          width: 32px;
          height: 17px;
          line-height: 17px;
        }
      }
    }
    .layout-tips-warp-active {
      border: 1px solid;
      border-color: var(--el-color-primary);
      .layout-tips-box {
        border: 1px solid;
        border-color: var(--el-color-primary);
        .layout-tips-txt {
          color: var(--el-color-primary) !important;
          background-color: var(--next-color-seting-main) !important;
        }
      }
    }
    &:hover {
      .el-circular {
        transition: all 0.3s ease-in-out;
        border: 1px solid;
        border-color: var(--el-color-primary);
      }
      .layout-tips-warp {
        transition: all 0.3s ease-in-out;
        border-color: var(--el-color-primary);
        .layout-tips-box {
          transition: inherit;
          border-color: var(--el-color-primary);
          .layout-tips-txt {
            transition: inherit;
            color: var(--el-color-primary) !important;
            background-color: var(--next-color-seting-main) !important;
          }
        }
      }
    }
  }
}
.upload-img {
  max-height: 100px;
}
.avatar-uploader {
  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    text-align: center;
    border: 1px dashed rgb(212, 212, 212);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    &:hover {
      border: 1px solid rgb(4, 46, 230);
    }
  }
}
</style>
