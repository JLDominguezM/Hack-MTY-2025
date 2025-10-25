import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();
  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to your desired page
      Linking.openURL(Linking.createURL("/(auth)/sign-in"));
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <TouchableOpacity onPress={handleSignOut}>
      <View className="flex-row items-center">
        <MaterialIcons name="logout" size={24} color="white" />
      </View>
    </TouchableOpacity>
  );
};
