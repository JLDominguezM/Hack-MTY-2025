import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowLeft, MoreVertical } from "lucide-react-native"; 
import { useRouter } from "expo-router";

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  
}

export default function CustomHeader({
  title,
  showBackButton = false,
}: CustomHeaderProps) {
  const router = useRouter();

  const handleBackPress = () => {
    if (router.canGoBack()) {
      
      router.back();
    }
    
  };

  return (
    <View style={styles.headerContainer}>
      {showBackButton ? (
        <TouchableOpacity onPress={handleBackPress} style={styles.button}>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} /> 
      )}
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.button}>
        <MoreVertical color="white" size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#EC0000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    
  },
  button: {
    padding: 8,
  },
  placeholder: {
    
    width: 40, 
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
