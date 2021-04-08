import React, { Component } from "react";
import {
	View,
	Text,
	ScrollView,
	StatusBar,
	RefreshControl,
} from "react-native";
import Clipboard from "@react-native-community/clipboard";
import { connect } from "react-redux";
import ApplicationState from "@mele-wallet/redux/application-state";
import {
	mapDispatchToProps,
	IActionCreators,
} from "@mele-wallet/redux/methods/map-dispatch-to-props";
import { AccountState } from "@mele-wallet/redux/reducers/account-reducer";
import { styles } from "./styles";
import { commonStyles } from "@mele-wallet/app/common/styles/common-styles";
import WiteInfoIcon from "@mele-wallet/resources/icons/info-white.svg";
import ScanBarcodeIcon from "@mele-wallet/resources/icons/scan-barcode.svg";
import CopyIcon from "@mele-wallet/resources/icons/copy.svg";
import Ripple from "react-native-material-ripple";
import { Calculator } from "@mele-wallet/app/common/calculator/calculator";
import { Wallet } from "@mele-wallet/common/utils/wallet";
import { StaticState } from "@mele-wallet/redux/reducers/static-reducer";
import { Actions as UserActions } from "@mele-wallet/app/modules/home/actions";
import { Actions } from "react-native-router-flux";
import { ROUTES } from "@mele-wallet/app/router/routes";
import { MeleCalculator } from "@mele-wallet/common/mele-calculator/mele-calculator";
import { IAccountModel } from "@mele-wallet/common/model/account.model";
import { Transactions } from "@mele-wallet/app/common/transactions/transactions";

interface IHomeComponentProps {
	actionCreators: IActionCreators;
	accountState: AccountState;
	staticState: StaticState;
}

interface IHomeComponentState {
	refreshing: boolean;
}

class HomeComponent extends Component<
	IHomeComponentProps,
	IHomeComponentState
> {
	constructor(props: IHomeComponentProps) {
		super(props);
		this.state = {
			refreshing: false,
		};
		this._refresh = this._refresh.bind(this);
	}

	componentDidMount() {
		this.props.actionCreators.transaction.resetPurchaseFlow;
	}

	_refresh = async () => {
		this.setState({ refreshing: true });
		await this.props.actionCreators.account.accountSync();
		this.setState({ refreshing: false });
	};

	render() {
		const account: IAccountModel =
			this.props.accountState.account || ({} as any);
		const wallet = Wallet.getWallet(this.props.staticState.mnemonic);
		return (
			<ScrollView
				style={[styles.scrollView]}
				contentContainerStyle={styles.content}
				refreshControl={
					<RefreshControl
						refreshing={this.state.refreshing}
						onRefresh={() => this._refresh()}
					/>
				}
			>
				<StatusBar barStyle="light-content" />
				<View style={[styles.header, commonStyles.blueBackground]}>
					<View style={[styles.balanceHeader]}>
						<View style={[styles.titleContainer]}>
							<Text style={[styles.title, commonStyles.fontBold]}>Balance</Text>
							<View style={[styles.balanceContainer]}>
								<Text style={[commonStyles.whiteHeader, styles.balance]}>
									${MeleCalculator.centsToUSDFormatted(account.balance || "0")}
								</Text>
								<WiteInfoIcon style={styles.infoIcon} />
							</View>
						</View>
						<View style={[styles.barcodeIconContainer]}>
							{!this.props.staticState.accountId ? (
								<Ripple
									onPress={() => {
										Actions.jump(ROUTES.scanQRCode);
									}}
									style={[styles.barcodeIcon]}
									rippleContainerBorderRadius={30}
								>
									<ScanBarcodeIcon />
								</Ripple>
							) : null}
						</View>
					</View>
					<Calculator
						centsAmount={account.balance || "0"}
						style={[styles.calculator]}
					/>
					<Ripple
						style={[styles.walletAddressContainer]}
						onPress={() => {
							Clipboard.setString(wallet.getAddress());
						}}
					>
						<Text
							style={[styles.walletAddress, commonStyles.fontBook]}
							adjustsFontSizeToFit={true}
							numberOfLines={1}
						>
							{wallet.getAddress()}
						</Text>
						<CopyIcon style={[styles.walletCopy]} />
					</Ripple>
				</View>
				<View style={[styles.actions]}>
					<UserActions />
				</View>
				<View style={[styles.transactions]}>
					<Transactions transactionListKeyword="HOME_RECENT_TRANSACTIONS" />
				</View>
			</ScrollView>
		);
	}
}

const mapStateToProps = (state: ApplicationState) => {
	return {
		accountState: state.account,
		staticState: state.static,
	};
};

export const Home = connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
