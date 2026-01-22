import { ColorValue } from "react-native";
import { SvgProps } from "react-native-svg";

export type IconProps = Omit<SvgProps, 'width' | 'height' | 'fill' | 'color'> & {
    color?: ColorValue;
    size?: number;
};