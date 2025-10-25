import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { onboarding } from "@/constants";

const { width } = Dimensions.get("window");

const Onboarding = () => {
  const scrollRef = useRef<ScrollView | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [message, setMessage] = useState("");

  const isLast = activeIndex === onboarding.length - 1;

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(x / width);
    setActiveIndex(newIndex);
  };

  const goNext = () => {
    if (!isLast) {
      const next = (activeIndex + 1) * width;
      scrollRef.current?.scrollTo({ x: next, animated: true });
    } else {
      router.replace("/(root)/(tabs)/hormi");
    }
  };

  const sendToHormi = () => {
    router.push({ pathname: "/hormi", params: { message } } as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableOpacity
        onPress={() => router.replace("/(auth)/sign-up")}
        className="w-full flex justify-end items-end p-4"
      >
        <Text className="text-black text-md font-FunnelSansBold">Skip</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {onboarding.map((item) => (
          <View
            key={item.id}
            style={{ width }}
            className="flex-1 items-center justify-center p-5"
          >
            <Image source={item.image} className="w-full h-[300px]" />

            <View className="flex flex-row items-center justify-center w-full mt-10">
              <Text className="text-black text-3xl font-bold mx-10 text-center">
                {item.title}
              </Text>
            </View>
            <Text className="text-lg font-FunnelSansSemiBold text-center text-[#858585] mx-10 mt-3">
              {item.description}
            </Text>

            {/* If this is the last slide show the message composer */}
            {item.id === onboarding.length && (
              <View className="w-full px-6 mt-6">
                <TextInput
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Escribe un mensaje para Hormi..."
                  multiline
                  className="border border-gray-200 rounded-md p-3 h-28 text-base"
                />

                <TouchableOpacity
                  onPress={sendToHormi}
                  className="bg-blue-500 rounded-md py-3 items-center mt-4"
                >
                  <Text className="text-white font-medium">Enviar a Hormi</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View className="flex-row justify-center items-center mt-6">
        {onboarding.map((_, idx) => (
          <View
            key={idx}
            className="mx-1 rounded-full"
            style={{
              width: 32,
              height: 4,
              backgroundColor: idx === activeIndex ? "#0286FF" : "#E2E8F0",
              borderRadius: 999,
            }}
          />
        ))}
      </View>

      <View className="w-full items-center px-6 mt-6 mb-8">
        <TouchableOpacity
          onPress={goNext}
          className="w-full bg-blue-500 rounded-md py-3 items-center"
        >
          <Text className="text-white font-medium">
            {isLast ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
