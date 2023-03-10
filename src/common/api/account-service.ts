import MainService from "./main-api-service";
import base64 from "base-64";
import Cookies from "universal-cookie";
import AsyncStorage from "@react-native-community/async-storage";
export default class AccountService extends MainService {
	walletSync = async (accountId: string, wallet: string) => {
		return await this.patch({
			path: `/account/${accountId}`,
			data: {
				wallet: wallet,
			},
		});
	};

	login = async (username: string, password: string) => {
		return await this.get({
			path: "/account",
			headers: {
				Authorization: `Basic ${base64.encode(username + ":" + password)}`,
			},
		});
	};

	checkSession = async () => {
		const response = await this.get({
			path: "/account",
		});
		return response;
	};

	logout = async () => {
		return await this.post({
			path: "/account/logout",
		});
	};
	confirmEmail = async (token: string) => {
		return await this.post({
			path: `/account/${token}`,
		});
	};
	confirmEmailWithPassword = async (token: string, password: string) => {
		return await this.post({
			path: `/account/${token}`,
			data: {
				password: password,
			},
		});
	};

	getKYC = async () => {
		const cookies = new Cookies();
		const kyc = cookies.get("kyc");
		if (!kyc) {
			return await this.post({
				path: `/kyc/shuftipro/initiate`,
				data: {
					Authorization:
						"Basic " +
						base64.encode(
							"c318b78e-ca58-42d4-bc3c-0fc713ca2ac9:wG4Jy1PzYMh5FT8vaGNpVIoNCeoAvPx4",
						),
				},
			});
		}
	};

	createAccount = async (
		username: string,
		name: string,
		password: string,
		language: string,
	) => {
		return await this.put({
			path: "/account",
			data: {
				name: name,
				email: username,
				password: password,
				currentLanguage: language,
			},
		});
	};
	inviteAccount = async (username: string, name: string, language: string) => {
		return await this.put({
			path: `/account`,
			data: {
				name: name,
				email: username,
				currentLanguage: language,
			},
		});
	};
	updateAccount = async (name: string, phone: string) => {
		return await this.patch({
			path: "/account",
			data: {
				name: name,
				phone: phone,
			},
		});
	};
	updatePassword = async (current: string, password: string) => {
		return await this.patch({
			path: "/account",
			data: {
				current: current,
				password: password,
			},
		});
	};
	checkUsername = async (username: string) => {
		return await this.get({
			path: `/account/${username}`,
		});
	};

	passwordResetInitiate = async (username: string, language: string) => {
		const cookies = new Cookies();
		if (
			cookies.get("resetPassword") &&
			cookies.get("resetPassword") === username
		) {
			return "It has not been 30 minutes since your last reset.";
		} else {
			const expireDate = new Date();
			expireDate.setMinutes(expireDate.getMinutes() + 30);
			cookies.set("resetPassword", username, { expires: expireDate });
			return await this.put({
				path: "/reset",
				data: {
					email: username,
					currentLanguage: language,
				},
			});
		}
	};

	passwordResetCheckToken = async (token: string) => {
		return await this.get({
			path: `/reset/${token}`,
		});
	};

	passwordResetConfirm = async (token: string, password: string) => {
		return await this.post({
			path: `/reset/${token}`,
			data: {
				password: password,
			},
		});
	};

	deleteUser = async (email: string) => {
		return await this.delete({
			path: `/account/${email}`,
		});
	};

	updateUser = async (email: string, newName: string, newEmail: string) => {
		return await this.put({
			path: `/account/${email}`,
			data: {
				name: newName,
				email: newEmail,
			},
		});
	};

	resendVerificationEmail = async (language: string) => {
		console.log("here", language);
		return await this.post({
			path: `/send-verification-email`,
			data: {
				currentLanguage: language,
			},
		});
	};
}

export const accountService = new AccountService();
