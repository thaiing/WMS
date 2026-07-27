<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="small" type="primary" @click="dialogVisible=true">上传图片
    </el-button>
    <el-dialog v-model:visible="dialogVisible" append-to-body>
      <el-upload :http-request="uploadHttp" :multiple="true" :file-list="fileList" :show-file-list="true" :on-remove="handleRemove" :on-success="handleSuccess" :before-upload="beforeUpload" class="editor-slide-upload" action="" list-type="picture-card">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
	name: "EditorSlideUpload",
	props: {
		color: {
			type: String,
			default: "#1890ff",
		},
	},
	data() {
		return {
			// 图片域名地址
			BASE_API: this.common.ossDomain,
			dialogVisible: false,
			listObj: {},
			fileList: [],
			// 图片地址
			ImageUrls: [],
			uploadConf: this.common.uploadConf,
		};
	},
	methods: {
		// 文件上传成功时的钩子
		handleSuccess(response, file) {
			const uid = file.uid;
			const objKeyArr = Object.keys(this.listObj);
			for (let i = 0, len = objKeyArr.length; i < len; i++) {
				if (this.listObj[objKeyArr[i]].uid === uid) {
					this.listObj[objKeyArr[i]].url = response.files.file;
					this.listObj[objKeyArr[i]].hasSuccess = true;
					return;
				}
			}
		},
		// 文件列表移除文件时的钩子
		handleRemove(file) {
			const uid = file.uid;
			const objKeyArr = Object.keys(this.listObj);
			for (let i = 0, len = objKeyArr.length; i < len; i++) {
				if (this.listObj[objKeyArr[i]].uid === uid) {
					delete this.listObj[objKeyArr[i]];
					return;
				}
			}
		},
		/**
		 * 图片限制
		 */
		beforeUpload(file) {
			const isJPEG = file.name.split(".")[1] === "jpeg";
			const isJPG = file.name.split(".")[1] === "jpg";
			const isPNG = file.name.split(".")[1] === "png";
			const isLt5MB = file.size / 1024 / 1024 < 5;
			if (!isJPG && !isJPEG && !isPNG) {
				this.$message.error("上传图片只能是 JPEG/JPG/PNG 格式!");
			}
			if (!isLt5MB) {
				this.$message.error("单张图片大小不能超过 5MB!");
			}
			return (isJPEG || isJPG || isPNG) && isLt5MB;
		},
		// 上传图片到阿里云
		uploadHttp({ file }) {
			const fileName = `Upload/Temp/${this.common.formatDate(new Date(), "YYYY-MM-DD")}/${new Date().valueOf()}-${this.common.getGUID()}.jpg`; // 定义唯一的文件名
			// ossClient(this.uploadConf)
			// 	.put(fileName, file, {
			// 		ContentType: "image/jpeg",
			// 	})
			// 	.then(({ res }) => {
			// 		if (res && res.status === 200) {
			// 			this.ImageUrls.push(res.requestUrls[0]);
			// 		}
			// 	})
			// 	.catch((err) => {
			// 		this.$message.error(`上传图片失败` + err.message);
			// 	});
		},
		// 上传图片到编辑器
		handleSubmit() {
			if (!this.checkAllSuccess()) {
				this.$message("请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！");
				return;
			}
			this.$emit("success-cbk", this.ImageUrls);
			this.ImageUrls = [];
			this.listObj = {};
			this.fileList = [];
			this.dialogVisible = false;
		},
		checkAllSuccess() {
			return Object.keys(this.listObj).every((item) => this.listObj[item].hasSuccess);
		},
	},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.editor-slide-upload {
	margin-bottom: 20px;
	:deep(.el-upload--picture-card) {
		width: 100%;
	}
}
</style>
