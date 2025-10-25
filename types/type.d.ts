import { TextInputProps, TouchableOpacityProps } from "react-native";

declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
}

declare interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}

declare interface PaymentProps {
  fullName: string;
  email: string;
  amount: string;
  mariachiId: number;
  selectedMariachiData?: Mariachi;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
}

export interface Service {
  id: string;
  name: string;
  provider: string;
  amount: number;
  dueDate: string;
  accountNumber: string;
  icon: "lightbulb" | "flame" | "droplet" | "wifi" | "phone";
  status: "pending" | "overdue" | "paid";
}

export type View = "login" | "home" | "hormi" | "payments";

export interface Service {
  id: string;
  name: string;
  provider: string;
  amount: number;
  dueDate: string;
  accountNumber: string;
  icon: "lightbulb" | "flame" | "droplet" | "wifi" | "phone";
  status: "pending" | "overdue" | "paid";
}
