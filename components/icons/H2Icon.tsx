import { ColorValue } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

type Props = Omit<SvgProps, 'width' | 'height' | 'fill' | 'color'> & {
    color?: ColorValue;
    size?: number;
};

export default function H2Icon({
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
            <Path d="M120-280v-400h80v160h160v-160h80v400h-80v-160H200v160h-80Zm400 0v-160q0-33 23.5-56.5T600-520h160v-80H520v-80h240q33 0 56.5 23.5T840-600v80q0 33-23.5 56.5T760-440H600v80h240v80H520Z" />
        </Svg>
    );
}