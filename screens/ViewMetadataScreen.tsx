import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AppBar from "../components/AppBar";

const styles = StyleSheet.create({
  metadataContainer: {
    marginLeft: 10,
  },
  keyText: {
    fontSize: 20,
    fontFamily: "monospace",
    color: "#000",
    fontWeight: "bold",
    lineHeight: 30
  },
  valueText: {
    fontSize: 14,
    fontFamily: "monospace",
    color: "#000"
  },
  image: {
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    resizeMode: "contain", // Choose the appropriate resizeMode
  },
});

export default function ViewMetadataScreen({ route, navigation } : any) {
  const { metadata } = route.params;

  const renderMetadata = (data: any[], depth = 0) => {
    return Object.entries(data).map(([key, value]: any, index) => (
      <View key={index} style={[styles.metadataContainer, { marginLeft: depth * 10, marginBottom: 4 }]}>
        <Text style={styles.keyText}>{key.toUpperCase()}</Text>
        {typeof value === "object" ? (
          renderMetadata(value, depth + 1)
        ) : (
          <Text style={styles.valueText}>{value}</Text>
        )}
      </View>
    ));
  };

  return (
    <View>
      <AppBar title="View Metadata" isBackable navigation={navigation} />
      <View style={{
        padding: 15
      }}>
          {renderMetadata(metadata)}
      </View>
    </View>
  );
}
