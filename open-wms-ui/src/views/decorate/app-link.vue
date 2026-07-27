<template>
  <div ref="container" class="page-list-container">
    <split-pane :max-width="500" :default-width="260" split="vertical">
      <template #paneL>
        <div class="left-container">
          <el-form class="form-tool">
            <el-form-item>
              <el-input v-model="filterText" placeholder="搜索名称" class="search-input margin-right-5">
                <template #prefix>
                  <el-icon class="el-input__icon">
                    <search />
                  </el-icon>
                </template>
              </el-input>
              <el-button title="刷新" class="btn-refresh" @click="treeRefresh">
                <i class="el-icon-yrt-shuaxin"></i>
              </el-button>
            </el-form-item>
            <el-form-item class="align-center">
              <!--数据tree-->
              <el-tree
                ref="tree"
                :load="
                  (node, resolve) => {
                    loadTreeNode(node, resolve);
                  }
                "
                :expand-on-click-node="false"
                :filter-node-method="filterTreeNode"
                :props="props"
                :default-expand-all="false"
                node-key="treeKey"
                highlight-current
                lazy
                @node-click="nodeClick"
              >
                <template #default="{ node, data }">
                  <span class="custom-tree-node" @mouseover="() => treeNodeOver(node, data)" @mouseout="() => treeNodeOut(node, data)">
                    <span>
                      <i v-if="data.hasChild" class="el-icon-menu"></i>
                      <i v-else class="el-icon-tickets"></i>
                      {{ node.label }}
                    </span>
                  </span>
                </template>
              </el-tree>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <!--右侧主区-->
      <template #paneR>
        <div class="right-container">
          <!--数据Table-->
          <yrt-data-list :ref="dataListRef" v-model:fields="dataListOptions.fields" v-model:data-list-selections="dataListSelections" :editor-ref="editorRef" :data-options="dataOptions" :buttons="dataListOptions.buttons" :button-click="buttonClick" :auth-nodes="authNodes" :fixed-where="fixedWhere"> </yrt-data-list>
          <!--数据编辑器Editor-->
          <yrt-editor :ref="editorRef" v-model:action="editorOptions.action" v-model:visible="editorOptions.config.visible" :data-list-ref="dataListRef" :fields="editorOptions.fields" :config="editorOptions.config" :data-options="dataOptions" :detail-button-click="detailButtonClick" :auth-nodes="authNodes"> </yrt-editor>
        </div>
      </template>
    </split-pane>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, getCurrentInstance, ComponentInternalInstance } from 'vue';
// import baseLayout from '/@/components/common/base-layout.ts';
import yrtDataList from '/@/components/common/yrtDataList.vue';
import yrtEditor from '/@/components/common/yrtEditor.vue';
import { BaseProperties } from '/@/types/base-type';
import splitPane from '/@/components/splitPane/index.vue';
import { Search, Loading } from '@element-plus/icons-vue';

interface CustomProperties extends BaseProperties {
  /**
   * 查询字符串
   */
  filterText: string;
  /**
   * 鼠标滑过的ID
   */
  treeNodeOverId: number;
  /**
   * 编辑级联是否加载完毕
   */
  isTreeLoaded: boolean;
  /**
   * 是否子节点
   */
  hasDataTree: boolean;
  /**
   * 固定查询条件
   */
  fixedWhere: any;
  /**
   * 删除节点后刷新数据
   */
  treeRefresh: () => {};
  /**
   * 获得左侧类目导航节点数据
   */
  loadTreeNode: (node: any, resolve: any) => {};
}

export default {
  name: 'decorate-link-type',
  components: {
    yrtDataList, // 数据管理器
    yrtEditor, // 编辑页面
    splitPane,
    Search,
    Loading,
  },
  setup() {
    let ins = getCurrentInstance() as ComponentInternalInstance;
    let proxy: CustomProperties;
    if (ins.proxy) {
      proxy = ins.proxy as CustomProperties;
    }
    // const base = baseLayout();
    //#region 变量
    const state: any = reactive({
      filterText: '',
      hasDataTree: false,
      // 鼠标滑过的ID
      treeNodeOverId: 0,
      props: {
        label: 'label',
        children: 'children',
        isLeaf: 'isLeaf',
      },
      // 编辑级联是否加载完毕
      isTreeLoaded: false,
      fixedWhere: {}, // 固定查询条件
    });
    //#endregion

    let method = {
      // 获得左侧类目导航节点数据
      loadTreeNode(node: any, resolve: any) {
        var the = proxy;
        the.$nextTick(() => {
          var userInfo = proxy.common.getUserInfo();
          let where: any = {};
          if (node.level === 0) {
            where = {
              parentId: 0,
              userProduct_Id: userInfo.userProduct_Id,
            };
          } else {
            where = {
              parentId: node.data.typeId,
              userProduct_Id: userInfo.userProduct_Id,
            };
          }

          var url = '/api/common/loadTreeNode';
          var params = {
            openNodeApi: true,
            folder: 'app/design',
            DBServer: 'Sys',
            tableName: 'app_LinkType',
            tableView: 'app_LinkType',
            keyName: 'typeId',
            nodeName: 'typeName',
            fixHasChild: false,
            isBreakWay: false,
            displayBreakWay: false,
            parentName: 'parentId',
            orderBy: 'orderNo desc, typeId',
            where: where,
            extendColumns: '',
          };
          the.common.ajax(
            url,
            params,
            (res: any) => {
              if (res.result) {
                res.data.forEach((element: any) => {
                  element.isLeaf = !element.hasChild;
                });
                resolve(res.data);

                // 判断根节点是否有数据
                if (node.level === 0) {
                  proxy.hasDataTree = res.data.length > 0;
                }
              } else {
                the.$message.error(res.msg);
              }
            },
            true
          );
        });
      },
      // 搜索导航
      filterTreeNode(value: any, data: any) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 点击tree导航节点
      nodeClick(data: any) {
        proxy.fixedWhere = {
          typeId: {
            operator: 'raw',
            value: 'typeId in(Select typeId from dbo.[GetLinkTypeTree](' + data.typeId + '))',
          },
        };
        window.setTimeout(() => {
          proxy.dataList.reload();
        }, 500);
      },
      // 刷新tree
      treeRefresh() {
        proxy.fixedWhere = {};
        window.setTimeout(() => {
          proxy.dataList.reload();
        }, 500);

        proxy.filterText = '';
        var root = proxy.$refs.tree.store.root;
        while (root.childNodes.length) {
          proxy.$refs.tree.remove(root.childNodes[0]);
        }
        proxy.loadTreeNode(root, (data: any) => {
          root.doCreateChildren(data);
        });
        proxy.isTreeLoaded = false;
      },
      treeNodeOver(node: any, data: any) {
        proxy.treeNodeOverId = data.value;
      },
      treeNodeOut() {
        proxy.treeNodeOverId = -1;
      },
    };

    return {
      // ...base,
      ...toRefs(state),
      ...method,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '/@/theme/page.scss';
</style>
