import { ColorValue } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

type Props = Omit<SvgProps, 'width' | 'height' | 'fill' | 'color'> & {
    color?: ColorValue;
    size?: number;
};

export default function UnderlineIcon({
    color = '#0c0c0cff',
    size = 24,
    ...props
}: Props
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
            <Path d="M200-120v-80h560v80H200Zm280-160q-101 0-157-63t-56-167v-330h103v336q0 56 28 91t82 35q54 0 82-35t28-91v-336h103v330q0 104-56 167t-157 63Z" />
        </Svg>

    );
}