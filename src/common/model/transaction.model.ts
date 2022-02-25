export interface ITransactionModel {
	id: string;
	from: {
		email: string;
		name: string;
		wallet: string;
	};
	fromAccountId: string;
	to: {
		email: string;
		name: string;
		wallet: string;
	};
	toAccountId: string;
	type: string;
	amount: string;
	amountDetail: {
		MELX: number;
		MELG: number;
	};
	createdAt: string;
	approvedAt: string;
	updatedAt: string;
	status: string;
	refCode: string;
}

export function emptyTransaction(): ITransactionModel {
	return {
		id: "",
		from: {
			email: "",
			name: "",
			wallet: "",
		},
		fromAccountId: "",
		to: {
			email: "",
			name: "",
			wallet: "",
		},
		toAccountId: "",
		type: "",
		amount: "",
		amountDetail: {
			MELG: 0,
			MELX: 0,
		},
		createdAt: "",
		approvedAt: "",
		updatedAt: "",
		status: "",
		refCode: "",
	};
}
