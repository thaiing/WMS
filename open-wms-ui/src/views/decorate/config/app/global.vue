<!--全局 - 参数设置-->
<template>
  <div class="config-container">
    <h4>
      {{ config.title }}
    </h4>
    <el-form label-position="right" label-width="100px" :model="config" class="setting">
      <el-form-item label="页面类型">
        <el-select v-model="config.pageType" placeholder="请选择" style="width: 100%">
          <el-option label="PC" value="list"></el-option>
          <el-option label="APP" value="editor"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item required label="APP名称">
        <el-input v-model="config.appName"></el-input>
      </el-form-item>
      <el-form-item required label="页面名称">
        <el-input v-model="config.decorateName"></el-input>
      </el-form-item>
      <el-form-item required label="appMenuId">
        <el-input v-model.number="config.appMenuId"></el-input>
      </el-form-item>
      <el-form-item required label="menuId">
        <el-input v-model.number="config.menuId"></el-input>
      </el-form-item>
      <el-form-item required label="每页大小">
        <el-input v-model.number="config.pageSize"></el-input>
      </el-form-item>
      <el-form-item required label="当前页面">
        <el-input v-model.number="config.pageIndex"></el-input>
      </el-form-item>
      <el-form-item required label="表名">
        <el-input v-model.number="config.tableName"></el-input>
      </el-form-item>
      <el-form-item required label="主键名称">
        <el-input v-model.number="config.idField"></el-input>
      </el-form-item>
      <el-form-item required label="连接字段">
        <el-input v-model.number="config.linkColumn"></el-input>
      </el-form-item>
      <el-form-item required label="后端路由">
        <el-input v-model.number="config.prefixRouter"></el-input>
      </el-form-item>
      <el-form-item label="列表自定义方法" label-width="130px">
        <el-input v-model.number="config.listMethod"></el-input>
      </el-form-item>
      <el-form-item label="开启tab分组">
        <el-switch v-model="config.openTabGroup" :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
      </el-form-item>
      <el-form-item label="关闭司机权限">
        <el-switch v-model="config.isAuth" :active-value="true" :inactive-value="false" active-text="是" inactive-text="否"></el-switch>
      </el-form-item>
    </el-form>

    <!--文件选择器-->
    <filer-dialog v-model="filerVisible" single-select is-viewer></filer-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, nextTick, getCurrentInstance, computed } from 'vue';
import draggable from '/@/utils/vuedraggable/index.js';
import filerDialog from '/@/components/base/filer-dialog.vue';
import { predefineColors } from '/@/utils/commonFunction';

export default {
  name: 'app-design-left-panel',
  components: {
    draggable,
    filerDialog,
  },
  props: {
    config: {
      type: Object, // 选中项
      default: () => {
        return {
          items: [],
        };
      },
    },
  },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive({
      tabActive: 't1', // 左侧tab导航
      formData: {}, // 参数设置
      configComponent: null, // 参数配置
      filerVisible: false, // 显示文件选择器
      predefineColors,
    });

    //#region 计算属性
    // 当前值
    let orderBy = computed({
      get: function () {
        return JSON.stringify(proxy.config.orderBy || proxy.config.sortName);
      },
      set: function (val: any) {
        try {
          if (!val) {
            proxy.config.orderBy = null;
            return;
          }
          const orderBy = JSON.parse(val);
          proxy.config.orderBy = orderBy;
          proxy.$message.success('列表排序方式格式正确');
        } catch (error) {
          proxy.$message.error('列表排序方式不是有效的JSON格式');
        }
      },
    });

    // fixedWhere JSON加载属性
    let currentFixedWhere = computed({
      get: function () {
        var params = proxy.config.fixedWhere;
        if (params) {
          let replacer: any = 0;
          return JSON.stringify(params, replacer, 2);
        } else {
          return '';
        }
      },
      set: function (val: any) {
        try {
          proxy.config.fixedWhere = JSON.parse(val);
          proxy.$message.success('json格式正确');
        } catch (error: any) {
          proxy.$message.error('数据结构不正确，不是有效的json格式，' + error.message);
        }
      },
    });

    //#endregion

    //#region 方法
    let method = {
      addItem() {
        proxy.config.items.push({
          image: 'https://qiniu.crmeb.net/attach/2021/12/0ee9620211217175022978.jpg',
          title: '',
          url: '',
        });
      },
      // 删除项
      delItem(element: any, index: number) {
        if (proxy.config.items.length === 1) {
          proxy.$message.error('至少保留一项！');
          return;
        }
        proxy.config.items.splice(index, 1);
      },
      // 选择文件
      selectFile(item: any) {
        proxy.currentItem = item;
        proxy.filerVisible = true;
      },
    };
    //#endregion

    onMounted(async () => {});

    return {
      ...toRefs(state),
      orderBy,
      currentFixedWhere,
      ...method,
    };
  },
};
</script>

<style lang="scss" scoped>
.config-container {
  position: fixed;
  right: 0;
  top: 53px;
  bottom: 0;
  width: 400px;
  background-color: var(--color-whites);
  overflow: auto;
  h4 {
    padding: 10px;
    border-bottom: 1px solid var(--el-border-color-light);
  }
}

.setting {
  padding: 10px 10px 10px 0;
  :deep(.el-form-item__content) {
    display: block;
    flex-wrap: inherit;
  }
}
</style>
