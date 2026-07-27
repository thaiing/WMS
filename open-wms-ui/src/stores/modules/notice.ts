import { defineStore } from 'pinia';

interface NoticeItem {
	title?: string;
	read: boolean;
	message: any;
	time: string;
}

interface BillItem {
	billId: number;
	billCode: string;
	menuId: number;
	menuName: string;
	action: string;
	status: string;
	otherField: Record<string, any>;
}

export const useNoticeStore = defineStore('notice', () => {
	const state = reactive({
		notices: [] as NoticeItem[],
		billList: [] as BillItem[],
	});

	const addNotice = (notice: NoticeItem) => {
		state.notices.push(notice);
		if (typeof notice.message === 'object') {
			let index = state.billList.findIndex((item) => item.billId === notice.message.billId && item.menuId === notice.message.menuId);
			if (index >= 0) {
				state.billList.splice(index, 1);
			}
			state.billList.push(notice.message);
		}
	};

	const removeNotice = (notice: NoticeItem) => {
		state.notices.splice(state.notices.indexOf(notice), 1);
	};

	//实现全部已读
	const readAll = () => {
		state.notices.forEach((item: any) => {
			item.read = true;
		});
	};

	const clearNotice = () => {
		state.notices = [];
	};
	return {
		state,
		addNotice,
		removeNotice,
		readAll,
		clearNotice,
	};
});

export default useNoticeStore;
