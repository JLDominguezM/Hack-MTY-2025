import { Text, View } from "react-native";
import { startChat } from "app/(api)/gemini+api";
import { useEffect, useState } from "react";

const Welcome = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const result = await startChat();
        setMessage(result ?? "No message received");
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessage();
  }, []);

  return (
    <View className="flex-1 justify-center items-center p-6">
      <Text className="text-3xl">Welcome to the App!</Text>
      <Text> {message}</Text>
    </View>
  );
};

export default Welcome;
