import { IconProps } from "@/ui/icon/types";
import { ColorValue } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

export default function FormatClearIcon({
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
            <Path d="m528-546-93-93-121-121h486v120H568l-40 94ZM792-56 460-388l-80 188H249l119-280L56-792l56-56 736 736-56 56Z" />
        </Svg>
    );
}