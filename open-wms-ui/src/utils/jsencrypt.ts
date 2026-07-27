import JSEncrypt from 'jsencrypt';
import { decryptApi } from '/@/api/common/baseApi';
import to from 'await-to-js';
// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = import.meta.env.VITE_APP_RSA_PUBLIC_KEY;

// 前端不建议存放私钥 不建议解密数据 因为都是透明的意义不大
const privateKey = '---';

// 加密
export const encrypt = (txt: string) => {
	const encryptor = new JSEncrypt();
	encryptor.setPublicKey(publicKey); // 设置公钥
	return encryptor.encrypt(txt); // 对数据进行加密
};

// 解密
export const decrypt = async (txt: string) => {
	// const encryptor = new JSEncrypt();
	// encryptor.setPrivateKey(privateKey); // 设置私钥
	// return encryptor.decrypt(txt); // 对数据进行解密
	let params = {
		encryptText: txt,
	};
	let [err, res] = await to(decryptApi(params));
	if (err) return;

	return res?.data.decryptText;
};
