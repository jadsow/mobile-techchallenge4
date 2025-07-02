import React from "react";
import { View, Text } from "react-native";
import { BaseToastProps } from "react-native-toast-message";
import Icon from "react-native-vector-icons/Feather";

const ToastBox = ({
  text1,
  text2,
  icon,
  borderColor,
}: {
  text1?: string;
  text2?: string;
  icon: string;
  borderColor: string;
}) => (
  <View
    className={`bg-fiap-primary p-4 rounded-xl mx-4 shadow-md flex-row items-start gap-3 border-l-4`}
    style={{ borderLeftColor: borderColor }}
  >
    <Icon name={icon} size={20} color={borderColor} className="mt-1" />
    <View className="flex-1">
      <Text className="text-white font-bold text-base">{text1}</Text>
      {text2 ? <Text className="text-white text-sm mt-1">{text2}</Text> : null}
    </View>
  </View>
);

export const toastConfig = {
  success: (props: BaseToastProps) =>
    ToastBox({ ...props, icon: "check-circle", borderColor: "#32CD32" }), // verde-limão

  error: (props: BaseToastProps) =>
    ToastBox({ ...props, icon: "x-circle", borderColor: "#FF6B6B" }), // vermelho-claro
};
