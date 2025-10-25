import { Link, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Text,
  ScrollView,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      let errorMessage = "Error al iniciar sesión";

      if (err.errors && err.errors.length > 0) {
        const errorCode = err.errors[0].code;

        if (errorCode === "form_password_incorrect") {
          errorMessage = "Contraseña incorrecta";
        } else if (errorCode === "form_identifier_not_found") {
          errorMessage = "Email no encontrado";
        } else if (errorCode === "form_password_pwned") {
          errorMessage =
            "Esta contraseña ha sido comprometida, por favor usa otra";
        } else {
          errorMessage = err.errors[0].message || "Error al iniciar sesión";
        }
      }

      Alert.alert("Error", errorMessage, [{ text: "OK" }]);
    }
  }, [isLoaded, form.email, form.password]);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white justify-center px-6">
        <View className="mb-8 mt-16">
          <Text className="text-3xl font-bold text-red-600 text-center mb-2">
            Bienvenido de vuelta
          </Text>
          <Text className="text-lg text-gray-500 text-center">
            Inicia sesión en tu cuenta
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2 text-red-600">Email</Text>
          <TextInput
            className="w-full p-4 border-2 border-red-200 rounded-xl text-gray-800 focus:border-red-500"
            placeholder="Ingresa tu email"
            placeholderTextColor="#9CA3AF"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2 text-red-600">
            Contraseña
          </Text>
          <TextInput
            className="w-full p-4 border-2 border-red-200 rounded-xl text-gray-800 focus:border-red-500"
            placeholder="Ingresa tu contraseña"
            placeholderTextColor="#9CA3AF"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity
          onPress={onSignInPress}
          className="w-full bg-red-600 p-4 rounded-xl mb-6"
        >
          <Text className="text-white text-lg font-bold text-center">
            Iniciar Sesión
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-500">¿No tienes cuenta? </Text>
          <Link href="/sign-up">
            <Text className="text-red-600 font-semibold">Regístrate</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
