import { useNotedTheme } from "@/contexts/NotedThemeProvider";
import { IconProps } from "@/ui/icon/types";
import { ColorValue } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

export default function PlusIcon({
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
            {...props}
            viewBox="0 -960 960 960"
        >
            <Path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
        </Svg>

    );
}