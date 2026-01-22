import { IconProps } from "@/ui/icon/types";
import { ColorValue } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

export default function NoteIcon({
    size = 24,
    color = "#000000",
    ...props
}: IconProps) {
    return (
        <Svg
            // xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill={color}
            viewBox="0 -960 960 960"
            {...props}
        >
            <Path d="M200-200h360v-200h200v-360H200v560Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v400L600-120H200Zm80-280v-80h200v80H280Zm0-160v-80h400v80H280Zm-80 360v-560 560Z" />
        </Svg>
    );
}