import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    defaultButton: {
        backgroundColor: "#000",
        paddingHorizontal: 16,
        paddingVertical: 10,
        color: "#fff",
        borderRadius: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Quicksand-Regular",
        gap: 4
    },
    defaultInput: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        backgroundColor: "transparent",
        borderRadius: 6,
        borderColor: "#333",
        fontFamily: "Quicksand-Regular"
    },
    defaultFont: {
        fontFamily: "Quicksand-Regular"
    },
    ghostButton: {
        paddingHorizontal: 12,
        paddingVertical: 5,
    }
})

export default styles