import {
  ActivityIndicator,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface Props extends TouchableOpacityProps {
  loading?: boolean;
  text: string;
  textProps?: TextProps;
}

export function LoadingButton({
  loading = false,
  text,
  textProps,
  ...props
}: Props) {
  return (
    <TouchableOpacity {...props}>
      {loading ? (
        <ActivityIndicator className="color-fiap-gray" />
      ) : (
        <Text className="color-white font-semibold text-md" {...textProps}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
}
