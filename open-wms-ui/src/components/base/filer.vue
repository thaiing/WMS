<template>
  <div ref="container" class="filer-container">
    <split-pane :max-width="500" :default-width="260" split="vertical">
      <template #paneL>
        <div class="left-container">
          <el-form class="form-tool">
            <el-form-item class="padding-left-5">
              <el-input v-model="filterText" placeholder="搜索名称" prefix-icon="el-icon-search" class="search-input margin-right-5"></el-input>
              <el-button title="刷新" class="btn-refresh" @click="treeRefresh">
                <i class="iconfont icon-zhongzhi2"></i>
              </el-button>
            </el-form-item>
            <el-form-item class="align-center">
              <!--数据tree-->
              <el-tree ref="tree" :data="treeList" :expand-on-click-node="false" :filter-node-method="filterTreeNode" :props="props" :default-expand-all="true" :current-node-key="currentData.path" node-key="path" @node-click="nodeClick">
                <template #default="{ node, data }">
                  <span class="custom-tree-node" @mouseover="() => treeNodeOver(node, data)" @mouseout="() => treeNodeOut(node, data)">
                    <span>
                      <i v-if="data.children" class="el-icon-menu"></i>
                      <i v-else class="el-icon-tickets"></i>
                      {{ node.label }}
                    </span>
                    <span v-show="data.label == treeNodeOverId">
                      <el-button type="primary" link size="small" @click="() => treeNodeAppend(node, data, 'samelevel')">
                        <i class="icon-jiahao1" title="新建同级目录"></i>
                      </el-button>
                      <el-button type="primary" link size="small" @click="() => treeNodeAppend(node, data, 'nextlevel')">
                        <i class="icon-yuanquanjiahao" title="新建子级目录"></i>
                      </el-button>
                      <el-button type="primary" link size="small" @click="() => treeNodeEdit(node, data)">
                        <i class="icon-iconfontcolor32" title="修改目录"></i>
                      </el-button>
                      <el-button type="primary" link size="small" @click="() => treeNodeRemove(node, data)">
                        <i class="yrt-shanchu1" title="删除目录"></i>
                      </el-button>
                    </span>
                  </span>
                </template>
              </el-tree>
              <el-button v-if="!treeList.length" type="primary" link @click="treeNodeAppend">新建文件夹</el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <!--右侧主区-->
      <template #paneR>
        <el-card shadow="hover" class="card-right">
          <el-form :inline="true" class="right-tool">
            <el-form-item>
              <el-button v-if="isViewer" type="primary" @click="selectFile">
                <i class="iconfont icon-gouxuan1"></i>
                选择文件
              </el-button>
              <el-button v-if="!isViewer" type="primary" @click="uploadFile">
                <i class="iconfont icon-jiahao1"></i>
                上传文件
              </el-button>
              <el-button v-if="!isViewer" type="primary" @click="deleteFile">
                <i class="iconfont icon-chacha"></i>
                删除
              </el-button>
              <el-button type="primary" @click="refresh">
                <i class="iconfont icon-zhongzhi2"></i>
                刷新
              </el-button>
            </el-form-item>
          </el-form>
          <div v-loading="loading" class="img-box">
            <template v-for="(item, index) in filterObjects">
              <div class="item">
                <el-image v-if="isPic(item)" :class="['img', item.isSelected ? 'is-selected' : '']" :src="item.url + '?x-oss-process=style/300'" fit="scale-down" @click="selectItem(item)" @dblclick="selectFile(item)"></el-image>
                <div v-else :class="['file', item.isSelected ? 'is-selected' : '']" @click="selectItem(item)">{{ getExt(item) }}文件</div>
                <div class="txt" @click="previewImg(index)">{{ item.name }}</div>
              </div>
            </template>
            <div v-if="!filterObjects.length" class="item-none">
              <el-result icon="error" title="暂无文件" sub-title="请点击上传按钮上传">
                <template #extra>
                  <el-button type="primary">上传文件</el-button>
                </template>
              </el-result>
            </div>
            <div class="item-empty"></div>
            <div class="item-empty"></div>
            <div class="item-empty"></div>
            <div class="item-empty"></div>
            <div class="item-empty"></div>
            <div class="item-empty"></div>
            <div class="item-empty"></div>
            <div class="item-empty"></div>
          </div>
          <div class="card-footer">文件夹路径：{{ currentData.path }}</div>
        </el-card>
      </template>
    </split-pane>
    <!--上传文件-->
    <upload-dialog v-model="uploadVisible" :options="uploadOptions" :path="currentData.path"></upload-dialog>
    <!--预览图片-->
    <img-preview :options="previewOptions"></img-preview>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, getCurrentInstance, onMounted, nextTick } from 'vue';
import splitPane from '/@/components/splitPane/index.vue';
import uploadDialog from '/@/components/base/upload-dialog.vue';
import imgPreview from '/@/components/img-preview/index.vue';
let ossClient = (uploadConf:any)=>{};

export default {
  name: 'filer',
  components: {
    splitPane,
    uploadDialog,
    imgPreview,
  },
  props: {
    // 单选
    singleSelect: {
      type: Boolean,
      default: false,
    },
    // 预览模式
    isViewer: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { proxy } = getCurrentInstance() as any;

    //#region 变量
    const state: any = reactive({
      filterText: '',
      currentData: {
        path: 'bbc/',
      }, // 当前选择目录
      // 鼠标滑过的ID
      treeNodeOverId: 0,
      props: {
        label: 'label',
        children: 'children',
      },
      // 显示下一页
      continuationToken: null,
      // 文件夹前缀
      prefix: 'bbc/',
      // 所有文件对象
      allObjects: [],
      // 文件夹列表
      treeList: [],
      // 查询数据
      filterObjects: [],
      uploadVisible: false, // 上传文件
      // 上传对话框参数
      uploadOptions: {
        multiple: true,
        disabled: false,
        listType: 'text', // text/picture/picture-card
        buttonType: 'primary',
        fileType: ['pdf', 'xls', 'xlsx', 'doc', 'docx', 'pdf', 'jpeg', 'jpg', 'png', 'bmp', 'gif', 'zip', 'mp3', 'mp4', 'jfif'], // 文件类型
      },
      // 图片预览参数
      previewOptions: {
        multiple: true,
        nowImgIndex: 0,
        imgList: [],
        show: false,
      },
      // 加载
      loading: false,
    });
    //#endregion

    //#region 方法
    let method = {
      // 搜索导航
      filterTreeNode(value: any, data: any) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 点击tree导航节点
      nodeClick(data: any) {
        proxy.currentData = data;
        proxy.filterObjects = proxy.allObjects.filter((item: any) => {
          let exist = item.name.indexOf(data.path) === 0 && item.name.lastIndexOf('/') !== item.name.length - 1;
          return exist;
        });
      },
      // 刷新tree
      treeRefresh() {
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
      // 新建节点
      treeNodeAppend(node: any, data: any, level: any) {
        let title = level === 'samelevel' ? '新建同级目录' : '新建子级目录';
        proxy
          .$prompt('请输入新名称', title, {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
          })
          .then(async ({ value }: { value: any }) => {
            let paths = data.path.split('/');
            if (level === 'samelevel') {
              paths[node.level] = value;
            } else {
              paths[paths.length - 1] = value + '/';
            }
            let newPath = paths.join('/');
            let client = ossClient(proxy.common.uploadConf);
            let b = client.buffer('');
            await client.put(newPath, b);
            proxy.$message.success(`新建成功`);
            data.path = newPath;
            data.label = value;
            proxy.currentData = data;
            proxy.refresh(false);
          })
          .catch((e: any) => {
            proxy.$message.success(`取消操作${e.message}`);
          });
      },
      // 编辑节点
      treeNodeEdit(node: any, data: any) {
        proxy
          .$prompt('请输入新名称', '修改文件夹', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
          })
          .then(async ({ value }: { value: any }) => {
            let paths = data.path.split('/');
            paths[node.level] = value;
            let newPath = paths.join('/');
            let items = proxy.allObjects.filter((item: any) => item.name.indexOf(data.path) >= 0);
            let client = ossClient(proxy.common.uploadConf);
            for (let item of items) {
              let newName = item.name.replace(data.path, newPath);
              await client.copy(newName, item.name);
              await client.deleteMulti([item.name], { quiet: true });
            }
            proxy.$message.success(`修改成功`);
            data.path = newPath;
            data.label = value;
            proxy.currentData = data;
            proxy.refresh(false);
          })
          .catch(() => {
            proxy.$message.success(`取消操作`);
          });
      },
      // 删除
      treeNodeRemove(node: any, data: any) {
        proxy
          .$confirm('确定要删除文件夹吗，文件夹内的文件也将删除', '删除文件夹', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
          })
          .then(async ({ value }: { value: any }) => {
            let paths = data.path.split('/');
            paths[node.level] = value;
            let items = proxy.allObjects.filter((item: any) => item.name.indexOf(data.path) >= 0);
            let client = ossClient(proxy.common.uploadConf);
            for (let item of items) {
              await client.deleteMulti([item.name], { quiet: true });
            }
            proxy.$message.success(`修改成功`);
            data.path = proxy.prefix;
            data.label = proxy.prefix.trim('/');
            proxy.currentData = data;
            proxy.refresh(false);
          })
          .catch(() => {
            proxy.$message.success(`取消操作`);
          });
      },
      treeNodeOver(node: any, data: any) {
        proxy.treeNodeOverId = data.label;
      },
      treeNodeOut() {
        proxy.treeNodeOverId = -1;
      },
      // 获取所有文件对象
      async getAllObject() {
        proxy.loading = true;
        let client = ossClient(proxy.common.uploadConf);
        proxy.allObjects = [];
        do {
          let result = await client.listV2({
            'continuation-token': proxy.continuationToken,
            'max-keys': 5,
            prefix: proxy.prefix,
          });
          proxy.continuationToken = result.nextContinuationToken;
          proxy.allObjects.push(...result.objects);
        } while (proxy.continuationToken);
        proxy.loading = false;
      },
      // 列举文件夹
      async getFolders() {
        let folderList: any = new Set();
        // 获得数据
        if (!proxy.allObjects.length) {
          await proxy.getAllObject();
        }

        proxy.allObjects
          .filter((item: any) => {
            if (item.name.indexOf(proxy.prefix) >= 0 && item.name.lastIndexOf('/') === item.name.length - 1) {
              return true;
            }
            return false;
          })
          .forEach((item: any) => {
            folderList.add(item.name);
          });

        // 添加子节点
        let addChildren = (item: any, label: string, path: string) => {
          let child = findNode(proxy.treeList, path);
          if (!child) {
            child = {
              label: label,
              path: path,
            };
            if (!item.children) {
              item.children = [];
            }
            item.children.push(child);
          }

          return child;
        };

        // 查找节点
        let findNode = (items: Array<any>, path: string): any => {
          for (let item of items) {
            if (item.path === path) {
              return item;
            } else {
              if (item.children) {
                let exist = findNode(item.children, path);
                if (exist) {
                  return exist;
                }
              }
            }
          }
          return null;
        };

        for (let folder of folderList) {
          let children = folder.split('/').filter((item: any) => item);
          let path = children[0] + '/';
          let item = findNode(proxy.treeList, path);

          if (!item) {
            item = {
              label: children[0],
              path: path,
            };
            proxy.treeList.push(item);
          }
          children.splice(0, 1);
          for (let label of children) {
            path += label + '/';
            item = addChildren(item, label, path);
          }
        }

        if (proxy.treeList.length) {
          if (!proxy.currentData.label) {
            proxy.currentData = proxy.treeList[0];
          }
          nextTick(() => {
            proxy.$refs.tree.setCurrentKey(proxy.currentData.path);
            proxy.nodeClick(proxy.currentData);
          });

          proxy.treeList = proxy.treeList[0].children;
          proxy.treeList.splice(0, 0, {
            label: '[全部]',
            path: proxy.prefix,
          });
        }

        proxy.filterObjects = proxy.allObjects.filter((item: any) => {
          let exist = item.name.lastIndexOf('/') !== item.name.length - 1;
          return exist;
        });
      },
      // 上传文件
      uploadFile() {
        proxy.uploadVisible = true;
      },
      // 刷新数据
      async refresh(isTip: boolean) {
        proxy.loading = true;
        proxy.allObjects = [];
        proxy.treeList = [];
        proxy.filterObjects = [];

        await proxy.getFolders();
        if (isTip) {
          proxy.$message.success('刷新成功');
        }
        proxy.loading = false;
      },
      // 获取扩展名
      getExt(item: any) {
        const names = item.name.split('.');
        const extName = names[names.length - 1];

        return extName;
      },
      // 是否为图片
      isPic(item: any) {
        const names = item.name.split('.');
        const extName = names[names.length - 1];
        let type = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'jfif'];
        return type.indexOf(extName) >= 0;
      },
      // 删除文件
      deleteFile() {
        let files = proxy.filterObjects.filter((item: any) => item.isSelected);
        if (!files.length) {
          proxy.$message.error('请选择需要删除的文件');
          return;
        }
        proxy
          .$confirm('确定要删除文件吗，删除后将无法还原？', '删除文件', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(async () => {
            let client = ossClient(proxy.common.uploadConf);
            files = files.map((m: any) => m.name);
            await client.deleteMulti(files, { quiet: true });
            proxy.$message.success('删除成功');
            await proxy.refresh(false);
          })
          .catch(() => {
            proxy.$message.info('取消删除');
          });
      },
      // 选中文件
      selectItem(item: any) {
        // 单选
        if (proxy.singleSelect) {
          proxy.filterObjects
            .filter((f: any) => f.isSelected)
            .forEach((el: any) => {
              if (item !== el) {
                el.isSelected = false;
              }
            });
        }
        item.isSelected = !item.isSelected;
      },
      // 选中文件
      selectFile(item: any) {
        if (!item) {
          item = proxy.filterObjects.find((f: any) => f.isSelected);
        }

        if (!item) {
          proxy.$message.error('请选择文件！');
          return;
        }
        // 触发选中文件事件
        proxy.mittBus.emit('onSelectFile', item);
      },
      // 预览图片
      previewImg(index: number) {
        nextTick(() => {
          proxy.previewOptions.show = true;
          proxy.previewOptions.nowImgIndex = index;
          proxy.previewOptions.imgList = proxy.filterObjects.map((m: any) => m.url);
        });
      },
    };
    //#endregion

    onMounted(async () => {
      await method.getFolders();
      // 监听布局配置弹窗点击打开
      proxy.mittBus.on('onUploadFinished', async () => {
        proxy.uploadVisible = false;
        await proxy.refresh(false);
      });
    });

    return {
      ...toRefs(state),
      ...method,
    };
  },
};
</script>

<style lang="scss" scoped>
.filer-container {
  background-color: #f8f8f8;
}
.left-container {
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 4px;
  border-radius: var(--border-radius);
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-color-white);

  .form-tool {
    padding-top: 10px;

    .el-form-item {
      padding: 0 0px;
    }

    .search-input {
      width: calc(100% - 48px);
    }

    .btn-refresh {
      padding: 10px 3px 10px 8px;
    }
  }

  :deep(.el-tree-node.is-current > .el-tree-node__content) {
    background-color: #a7ccf7;
    color: white;

    .el-button--text {
      color: white;
    }
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}

.card-right {
  :deep(.el-card__body) {
    padding: 0;
  }
  .right-tool {
    padding: 10px 10px 0;
  }
}

.img-box {
  $--img-size: 120px !default;
  --img-size: #{$--img-size};
  $--img-size-box: 125px !default;
  --img-size-box: #{$--img-size-box};

  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 0 0px 10px;
  overflow-y: auto;
  max-height: 600px;
  .item {
    width: var(--img-size-box);
    margin-bottom: 10px;
    .img {
      border: 1px solid var(--el-border-color-light);
      width: var(--img-size);
      height: var(--img-size);
      padding: 2px;
      cursor: pointer;
      &.is-selected {
        border: 1px solid var(--color-danger);
        position: relative;
        &::after {
          content: '√';
          font-size: 5px;
          color: white;
          position: absolute;
          bottom: 0px;
          right: 0px;
          background-color: var(--color-danger);
          padding: 4px;
        }
      }
    }
    .file {
      border: 1px solid var(--el-border-color-light);
      width: var(--img-size);
      height: var(--img-size);
      padding: 2px;
      background-color: var(--el-background-color-base);
      text-align: center;
      vertical-align: middle;
      line-height: var(--img-size);
      color: var(--el-color-info);
      cursor: pointer;
      font-size: 20px;
      &.is-selected {
        border: 1px solid var(--color-danger);
        position: relative;
        &::after {
          content: '√';
          font-size: 5px;
          color: white;
          position: absolute;
          bottom: 0px;
          right: 0px;
          background-color: var(--color-danger);
          padding: 4px;
          line-height: 1.2;
        }
      }
    }
    .txt {
      text-align: center;
      line-height: 1.5;
      padding-top: 5px;
      cursor: pointer;
    }
  }
  .item-empty {
    width: var(--img-size-box);
    height: 0;
  }
}
.item-none {
  text-align: center;
  width: 100%;
}
.card-footer {
  border-top: 1px solid var(--el-border-color-light);
  padding: 10px;
}
</style>
