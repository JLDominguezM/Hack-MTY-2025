import React from "react";
import { View, Text, Pressable, StatusBar, Platform } from "react-native";
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
    <>
      <StatusBar barStyle="light-content" backgroundColor="#EC0000" />
      <View className="bg-[#EC0000] flex-row items-center justify-between px-6 py-8 pt-20">
        {showBackButton ? (
          <Pressable onPress={handleBackPress} className="p-2 -ml-2">
            <ArrowLeft color="white" size={24} />
          </Pressable>
        ) : (
          <View className="w-10" />
        )}
        <Text className="text-white text-xl font-bold flex-1 text-center">
          {title}
        </Text>
        <Pressable className="p-2 -mr-2">
          <MoreVertical color="white" size={24} />
        </Pressable>
      </View>
    </>
  );
}
