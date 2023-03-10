import React, { Component } from "react";
import { View, Text, ActivityIndicator, RefreshControl } from "react-native";
import { connect } from "react-redux";
import ApplicationState from "@mele-wallet/redux/application-state";
import {
	mapDispatchToProps,
	IActionCreators,
} from "@mele-wallet/redux/methods/map-dispatch-to-props";
import { styles } from "./styles";
import { commonStyles } from "@mele-wallet/app/common/styles/common-styles";
import ShieldBlue from "@mele-wallet/resources/icons/shield-blue.svg";
import Ripple from "react-native-material-ripple";
import { Actions } from "react-native-router-flux";
import { ROUTES } from "@mele-wallet/app/router/routes";
import {
	TransactionState,
	LoadTransactionsStatus,
	ITransactionList,
	PurchaseFlowStatus,
} from "@mele-wallet/redux/reducers/transaction-reducer";
import { BlueButton } from "@mele-wallet/app/common/buttons/blue-button";
import { ITransactionModel } from "@mele-wallet/common/model/transaction.model";
import moment from "moment";
import { MeleCalculator } from "@mele-wallet/common/mele-calculator/mele-calculator";
import { StaticState } from "@mele-wallet/redux/reducers/static-reducer";
import { Wallet } from "@mele-wallet/common/utils/wallet";
import { ScrollView } from "react-native-gesture-handler";
import { LanguageState } from "@mele-wallet/redux/reducers/language-reducer";
import AsyncStorage from "@react-native-community/async-storage";

interface ITransactionComponentProps {
	transactionState: TransactionState;
	staticState: StaticState;
	actionCreators: IActionCreators;
	transactionType?: string;
	transactionStatus?: string;
	transactionListKeyword: string;
	customEmptyScreen?: React.ReactNode;
	languageState: LanguageState;
}

interface ITransactionComponentState {
	fromStorage: boolean;
	transactions: ITransactionList;
}

const languages = {
	en: require("../../translations/en.json"),
	ar: require("../../translations/ar.json"),
};

class TransactionComponent extends Component<
	ITransactionComponentProps,
	ITransactionComponentState
> {
	constructor(props: ITransactionComponentProps) {
		super(props);
		this.state = {
			fromStorage: true,
			transactions: new ITransactionList(),
		};
	}
	componentDidMount() {
		this.getData();
		this.props.actionCreators.transaction.searchTransactions({
			page: 1,
			size: 100,
			transactionType: this.props.transactionType,
			transactionStatus: this.props.transactionStatus,
			transactionListKeyword: this.props.transactionListKeyword,
		});
	}
	componentDidUpdate(prevProps: ITransactionComponentProps) {
		if (
			this.state.fromStorage &&
			this.props.transactionState.loadedTransactionLists[
				this.props.transactionListKeyword
			].totalCount > 0
		) {
			this.setState({ fromStorage: false });
		}
		if (
			this.props.transactionStatus != prevProps.transactionStatus ||
			this.props.transactionType != prevProps.transactionType
		) {
			this.props.actionCreators.transaction.searchTransactions({
				page: 1,
				size: 100,
				transactionType: this.props.transactionType,
				transactionStatus: this.props.transactionStatus,
				transactionListKeyword: this.props.transactionListKeyword,
			});
		}
		this.setData();
	}

	setData = async () => {
		try {
			await AsyncStorage.setItem(
				"transactions",
				JSON.stringify(
					this.props.transactionState.loadedTransactionLists.HISTORY_PURCHASES,
				),
			);
		} catch (e) {
			console.log(e);
		}
	};

	getData = async () => {
		const value = await AsyncStorage.getItem("transactions");
		if (value !== null) {
			this.setState({ transactions: JSON.parse(value) });
		}
	};

	render() {
		const localeData = languages[this.props.languageState.currentLanguage];
		return (
			<ScrollView
				style={[styles.scroll]}
				contentContainerStyle={[styles.content]}
			>
				<View style={[styles.transactionsTitleContainer]}>
					<ShieldBlue />
					<Text style={[styles.transactionsTitle, commonStyles.fontBook]}>
						{localeData.transactions.title}
					</Text>
					{/* <TouchableOpacity onPress={()=>{
                        Actions.jump(ROUTES.authenticated.history)
                    }}>
                        <Text style={[transactionsStyles.viewAll, commonStyles.fontBold]}>VIEW ALL</Text>
                    </TouchableOpacity> */}
				</View>
				<View style={[styles.transactionsList]}>
					{this.getTransactionList(localeData)}
				</View>
			</ScrollView>
		);
	}

	getTransactionList = (localeData: any) => {
		const loadedTransactionList = this.state.fromStorage
			? this.state.transactions
			: this.props.transactionState.loadedTransactionLists[
					this.props.transactionListKeyword
			  ] || new ITransactionList();

		if (
			loadedTransactionList.loadTransactionsStatus ===
			LoadTransactionsStatus.REQUESTED
		) {
			return (
				<View style={[styles.noTransactionsContainer]}>
					<ActivityIndicator size="large" color="#013EC4" />
				</View>
			);
		}

		if (
			loadedTransactionList.loadedTransactions.length == 0 &&
			this.props.customEmptyScreen
		) {
			return (
				<View style={[styles.noTransactionsContainer]}>
					{this.props.customEmptyScreen}
				</View>
			);
		} else if (
			loadedTransactionList.loadedTransactions.length == 0 &&
			!this.props.staticState.accountId
		) {
			return (
				<View style={[styles.noTransactionsContainer]}>
					<Text
						style={[styles.noTransactionsContainerText, commonStyles.fontBook]}
					>
						{localeData.transactions.noTransactionsOne}
					</Text>
					{/* <Text
						style={[styles.noTransactionsContainerText, commonStyles.fontBook]}
					>
						{localeData.transactions.noTransactionsTwo}
					</Text> */}
					<BlueButton
						text={localeData.transactions.connect}
						onPress={() => {
							Actions.jump(ROUTES.scanQRCode);
						}}
						style={styles.purchaseCoins}
						textStyle={styles.noTransactionsContainerButtonText}
					/>
				</View>
			);
		} else if (loadedTransactionList.loadedTransactions.length == 0) {
			return (
				<View style={[styles.noTransactionsContainer]}>
					<Text
						style={[styles.noTransactionsContainerText, commonStyles.fontBook]}
					>
						{localeData.transactions.noTransactionsOne}
					</Text>
					<Text
						style={[styles.noTransactionsContainerText, commonStyles.fontBook]}
					>
						{localeData.transactions.noTransactionsThree}
					</Text>
					<BlueButton
						text={localeData.transactions.buyCoins}
						style={styles.purchaseCoins}
						textStyle={styles.noTransactionsContainerButtonText}
						onPress={() => {
							Actions.jump(ROUTES.authenticated.buy);
						}}
					/>
				</View>
			);
		}
		return loadedTransactionList.loadedTransactions.map(
			(transaction: ITransactionModel) => {
				const statusStyle =
					transaction.status === "pending"
						? styles.transactionStatusContainerYellow
						: styles.transactionStatusContainerGreen;
				const statusTextStyle =
					transaction.status === "pending"
						? styles.transactionStatusYellow
						: styles.transactionStatusGreen;
				const statusText =
					transaction.status === "pending"
						? localeData.transactions.pending
						: localeData.transactions.complete;

				let transactionTitle = transaction.refCode;

				if (!transactionTitle) {
					if (
						transaction.to.wallet ==
						Wallet.getWallet(this.props!.staticState.mnemonic).getAddress()
					) {
						transactionTitle = `From: ${transaction.from.wallet}`;
					} else {
						transactionTitle = `To: ${transaction.to.wallet}`;
					}
				}
				return (
					<Ripple
						style={[styles.transactionContainer]}
						key={transaction.id}
						onPress={() => {
							Actions.jump(ROUTES.authenticated.transaction, {
								transaction: transaction,
							});
						}}
					>
						<View style={[styles.transactionContainerRow]}>
							<Text
								adjustsFontSizeToFit={true}
								numberOfLines={2}
								style={[
									styles.transactionContainerAddress,
									commonStyles.fontBold,
								]}
							>
								{transactionTitle}
							</Text>
							<View style={[styles.transactionContainerAmountContainer]}>
								<Text
									style={[
										styles.transactionContainerAmount,
										commonStyles.fontBold,
									]}
								>
									${MeleCalculator.centsToUSDFormatted(transaction.amount)}
								</Text>
							</View>
						</View>
						<View style={[styles.transactionContainerRow]}>
							<View style={[styles.transactionTypeContainer]}>
								<Text style={[styles.transactionType, commonStyles.fontBook]}>
									{transaction.type}
								</Text>
							</View>
							<View style={[styles.transactionStatusContainer, statusStyle]}>
								<Text
									style={[
										styles.transactionStatus,
										statusTextStyle,
										commonStyles.fontBook,
									]}
								>
									{statusText}
								</Text>
							</View>
							<Text style={[styles.transactionDate, commonStyles.fontBook]}>
								{moment(transaction.createdAt).format("D MMM yyyy")}
							</Text>
						</View>
					</Ripple>
				);
			},
		);
	};
}

const mapStateToProps = (state: ApplicationState) => {
	return {
		transactionState: state.transaction,
		staticState: state.static,
		languageState: state.language,
	};
};

export const Transactions = connect(
	mapStateToProps,
	mapDispatchToProps,
)(TransactionComponent);
