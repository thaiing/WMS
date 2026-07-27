export interface ProcessVO extends BaseEntity {
	category: string;
	definitionId: string;
	deploymentId: string;
	deploymentTime: string;
	formId: string | number;
	formName: string;
	processKey: string;
	processName: string;
	taskId: string;
	suspended: boolean;
	version: number;
	procInsId?: string;
	menuId: number | null;
	menuName: string;
	billId: number | null;
	billCode: string;
}

export interface ProcessQuery extends PageQuery {
	processKey?: string;
	processName?: string;
	category?: string;
	state?: string;
	originatorName?: string;
}

export interface TaskForm {
	comment: string;
	procInsId: string;
	taskId: string;
	userId: string;
	copyUserIds: string;
	nextUserIds: string;
	vars: string;
	targetKey: string;
	menuId: number | null;
	menuName: string;
	billId: number | null;
	billCode: string;
}
