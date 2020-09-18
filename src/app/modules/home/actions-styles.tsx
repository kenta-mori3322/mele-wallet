import { StyleSheet } from "react-native";

export const actionStyles = StyleSheet.create({
	content: {
		flexDirection: "column",
		backgroundColor: "#ffffff",
		width: "100%",
		alignItems: "center",
		marginLeft: "auto",
		marginRight: "auto",
		display: "flex",
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "#00000029",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 4,
	},
	actionTitleContainer: {
		height: 40,
		display: "flex",
		width: "100%",
		justifyContent: "center",
		paddingLeft: 22,
		borderBottomColor: "#00000029",
		borderBottomWidth: 0.5,
	},
	actionTitle: {
		fontSize: 14,
		color: "#101654",
	},
	actionArea: {
		width: "100%",
		display: "flex",
		padding: 20,
	},
	eachAction: {
		width: "100%",
		height: 40,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},
	actionIcon: {
		width: 24,
		height: 24,
		backgroundColor: "#FBE9E8",
		borderRadius: 12,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	actionLogo: {
		width: 11,
		height: 13,
	},

	actionText: {
		flex: 1,
		paddingLeft: 10,
		color: "#101654",
		fontSize: 12,
	},
	actionButton: {
		height: 31,
		backgroundColor: "#EEEFF8",
		borderRadius: 16,
		paddingLeft: 10,
		paddingRight: 10,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	buttonTitle: {
		fontSize: 12,
		color: "#101654",
	},
});
