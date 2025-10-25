import * as React from "react";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Text,
  ScrollView,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import ReactNativeModal from "react-native-modal";
import { useSignUp } from "@clerk/clerk-expo";
import { fetchAPI } from "@/lib/fetch";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
    isVerifying: false,
  });

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({ ...verification, state: "pending" });
    } catch (err: any) {
      const errorMessage =
        err.errors?.[0]?.longMessage || "Error al crear la cuenta";
      Alert.alert("Error", errorMessage);
    }
  };

  const onResendCode = async () => {
    if (!isLoaded || !signUp) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({
        ...verification,
        error: "",
        code: "",
      });
      console.log("Código reenviado exitosamente");
    } catch (err: any) {
      console.log("Error al reenviar código:", err);
      setVerification({
        ...verification,
        error: "Error al reenviar el código. Intenta nuevamente.",
      });
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) {
      console.log("Clerk no está cargado aún");
      return;
    }

    if (!signUp) {
      console.log("SignUp object no está disponible");
      setVerification({
        ...verification,
        error: "Error: Sesión de registro no encontrada",
      });
      return;
    }

    if (!verification.code.trim()) {
      setVerification({
        ...verification,
        error: "Por favor ingresa el código de verificación",
      });
      return;
    }

    // Activar estado de carga
    setVerification({
      ...verification,
      isVerifying: true,
      error: "",
    });

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (signUpAttempt.status === "complete") {
        console.log("Verificación exitosa, redirigiendo al home...");

        try {
          await fetchAPI("/(api)/user", {
            method: "POST",
            body: JSON.stringify({
              name: form.name,
              email: form.email,
              clerkId: signUp.createdUserId,
            }),
          });
        } catch (apiError) {
          console.log(
            "Error al crear usuario en API, pero continuando...",
            apiError
          );
        }

        await setActive({ session: signUpAttempt.createdSessionId });

        // Intentar diferentes rutas de redirección
        try {
          router.replace("/(root)/(tabs)/home");
        } catch (routeError) {
          console.log("Error con ruta específica, intentando ruta simple...");
          router.replace("/");
        }
      } else {
        // Manejar diferentes tipos de estados
        if (signUpAttempt.status === "missing_requirements") {
          console.log("Faltan requisitos. Estado completo:", signUpAttempt);
          console.log("Campos faltantes:", signUpAttempt.missingFields);
          console.log(
            "Verificaciones requeridas:",
            signUpAttempt.unverifiedFields
          );

          setVerification({
            ...verification,
            state: "failed",
            error:
              "El código es correcto pero faltan algunos requisitos. Intenta reenviar el código.",
            isVerifying: false,
          });
        } else {
          console.log("SignUp attempt failed:", signUpAttempt.status);
          setVerification({
            ...verification,
            state: "failed",
            error: "Código de verificación incorrecto",
            isVerifying: false,
          });
        }
      }
    } catch (err: any) {
      let errorMessage = "Error de verificación";

      if (err.errors && err.errors.length > 0) {
        errorMessage =
          err.errors[0].longMessage || err.errors[0].message || errorMessage;
      }

      setVerification({
        ...verification,
        state: "failed",
        error: errorMessage,
        isVerifying: false,
      });
      console.log("Verification error:", errorMessage);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white justify-center px-6">
        <View className="mb-8 mt-16">
          <Text className="text-3xl font-bold text-red-600 text-center mb-2">
            Crear Cuenta
          </Text>
          <Text className="text-lg text-gray-500 text-center">
            Únete a nosotros hoy
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2 text-red-600">
            Nombre
          </Text>
          <TextInput
            className="w-full p-4 border-2 border-red-200 rounded-xl text-gray-800 focus:border-red-500"
            placeholder="Ingresa tu nombre"
            placeholderTextColor="#9CA3AF"
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
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
          onPress={onSignUpPress}
          className="w-full bg-red-600 p-4 rounded-xl mb-6"
        >
          <Text className="text-white text-lg font-bold text-center">
            Crear Cuenta
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-500">¿Ya tienes cuenta? </Text>
          <Link href="/sign-in">
            <Text className="text-red-600 font-semibold">Inicia Sesión</Text>
          </Link>
        </View>

        <ReactNativeModal isVisible={verification.state === "pending"}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-bold mb-2 text-red-600">
              Verificación
            </Text>
            <Text className="text-gray-600 mb-5">
              Hemos enviado un código de verificación a {form.email}
            </Text>

            <View className="mb-4">
              <Text className="text-lg font-semibold mb-2 text-red-600">
                Código
              </Text>
              <TextInput
                className="w-full p-4 border-2 border-red-200 rounded-xl text-gray-800 focus:border-red-500"
                placeholder="12345"
                placeholderTextColor="#9CA3AF"
                value={verification.code}
                onChangeText={(code: string) =>
                  setVerification({ ...verification, code, error: "" })
                }
                keyboardType="numeric"
                maxLength={6}
              />
            </View>

            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}

            <TouchableOpacity
              onPress={onVerifyPress}
              disabled={verification.isVerifying}
              className={`w-full p-4 rounded-xl mt-5 ${
                verification.isVerifying ? "bg-green-300" : "bg-green-500"
              }`}
            >
              <Text className="text-white text-lg font-bold text-center">
                {verification.isVerifying
                  ? "Verificando..."
                  : "Verificar Email"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onResendCode}
              disabled={verification.isVerifying}
              className="w-full p-3 mt-3"
            >
              <Text className="text-red-600 text-center font-semibold">
                ¿No recibiste el código? Reenviar
              </Text>
            </TouchableOpacity>
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
