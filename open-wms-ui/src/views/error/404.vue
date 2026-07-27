<template>
  <div class="error layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <div class="error-flex">
        <div class="left">
          <div class="left-item">
            <div class="left-item-animation left-item-num">404</div>
            <div class="left-item-animation left-item-title">{{ $t('message.notFound.foundTitle') }}</div>
            <div class="left-item-animation left-item-msg">{{ $t('message.notFound.foundMsg') }}</div>
            <div class="left-item-animation left-item-btn">
              <el-button type="primary" size="default" round @click="onGoHome">{{ $t('message.notFound.foundBtn') }}</el-button>
              <el-button type="danger" size="default" round @click="logout">{{ $t('message.notFound.logout') }}</el-button>
            </div>
          </div>
        </div>
        <div class="right">
          <img src="https://auod-beijing.oss-cn-beijing.aliyuncs.com/wms/error/404.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="notFound">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '/@/stores/modules/user';
import { Session, Local } from '/@/utils/storage';

const userStore = useUserStore();
const route = useRoute();
// 定义变量内容
const router = useRouter();
// 定义变量内容
const { t } = useI18n();

// 返回首页
const onGoHome = () => {
  router.push('/');
};

const logout = async () => {
  ElMessageBox({
    closeOnClickModal: false,
    closeOnPressEscape: false,
    title: t('message.user.logOutTitle'),
    message: t('message.user.logOutMessage'),
    showCancelButton: true,
    confirmButtonText: t('message.user.logOutConfirm'),
    cancelButtonText: t('message.user.logOutCancel'),
    buttonSize: 'default',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true;
        instance.confirmButtonText = t('message.user.logOutExit');
        setTimeout(() => {
          done();
          setTimeout(() => {
            instance.confirmButtonLoading = false;
          }, 300);
        }, 700);
      } else {
        done();
      }
    },
  })
    .then(async () => {
      // 清除缓存/token等
      await userStore.logout();
      Session.clear();
      // 使用 reload 时，不需要调用 resetRoute() 重置路由
      window.location.reload();
    })
    .catch(() => {});
};
</script>

<style scoped lang="scss">
.error {
  height: 100%;
  .error-flex {
    margin: auto;
    display: flex;
    height: 350px;
    width: 1100px;
    .left {
      width: 400px;
      height: 100%;
      align-items: center;
      display: flex;
      .left-item {
        .left-item-animation {
          opacity: 0;
          animation-name: error-num;
          animation-duration: 0.5s;
          animation-fill-mode: forwards;
        }
        .left-item-num {
          color: var(--el-color-info);
          font-size: 55px;
        }
        .left-item-title {
          font-size: 20px;
          color: var(--el-text-color-primary);
          margin: 15px 0 5px 0;
          animation-delay: 0.1s;
        }
        .left-item-msg {
          color: var(--el-text-color-secondary);
          font-size: 12px;
          margin-bottom: 30px;
          animation-delay: 0.2s;
        }
        .left-item-btn {
          animation-delay: 0.2s;
        }
      }
    }
    .right {
      flex: 1;
      opacity: 0;
      animation-name: error-img;
      animation-duration: 2s;
      animation-fill-mode: forwards;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
