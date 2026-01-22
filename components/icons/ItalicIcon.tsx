import { IconProps } from "@/ui/icon/types";
import { ColorValue } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

export default function ItalicIcon({
    color = '#0c0c0cff',
    size = 24,
    ...props
}: IconProps
) {
    return (
        <Svg
            // xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill={color}
            viewBox="0 -960 960 960"
            {...props}
        >
            <Path d="M200-200v-100h160l120-360H320v-100h400v100H580L460-300h140v100H200Z" />
        </Svg>
    );
}