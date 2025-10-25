import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useRef } from "react";
import Swiper from "react-native-swiper";
import { onboarding } from "@/constants";
import CustomButton from "@/components/CustomButton";

function Onboarding() {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Skip Button */}
        <View className="w-full flex justify-end items-end p-4">
          <TouchableOpacity onPress={() => router.replace("/(auth)/sign-up")}>
            <Text className="text-black text-md font-FunnelSansBold">Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Swiper Content */}
        <View className="flex-1">
          <Swiper
            ref={swiperRef}
            loop={false}
            index={activeIndex}
            dot={
              <View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />
            }
            activeDot={
              <View className="w-[32px] h-[4px] mx-1 bg-[#0286FF] rounded-full" />
            }
            onIndexChanged={(index) => setActiveIndex(index)}
            showsPagination={true}
            paginationStyle={{ bottom: 100 }}
          >
            {onboarding.map((item) => (
              <View
                key={item.id}
                className="flex-1 items-center justify-center px-5"
              >
                <Image
                  source={item.image}
                  className="w-full h-[300px] mb-8"
                  resizeMode="contain"
                />
                <View className="flex items-center justify-center w-full">
                  <Text className="text-black text-3xl font-bold text-center mb-4">
                    {item.title}
                  </Text>
                  <Text className="text-lg font-FunnelSansSemiBold text-center text-[#858585] px-4">
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </Swiper>
        </View>

        {/* Next/Get Started Button */}
        <View className="px-5 pb-8">
          <CustomButton
            title={isLastSlide ? "Get Started" : "Next"}
            onPress={() =>
              isLastSlide
                ? router.replace("/(auth)/sign-up")
                : swiperRef.current?.scrollBy(1)
            }
            className="w-full"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Onboarding;
