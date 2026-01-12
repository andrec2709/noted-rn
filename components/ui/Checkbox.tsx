import { ColorValue } from "react-native";
import Svg, { SvgProps, Path } from "react-native-svg"

type Props = Omit<SvgProps, 'color' | 'fill' | 'width' | 'height'> & {
    checkedState: boolean;
    size?: number;
    color?: ColorValue;
    colorChecked?: ColorValue;
};

export default function Checkbox({
    checkedState,
    size = 24,
    color = '#0c0c0cff',
    colorChecked = '#0c0c0cff',
    ...props
}: Props) {

    if (checkedState) {
        return (
            <Svg
                // xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                fill={colorChecked}
                viewBox="0 -960 960 960"
                {...props}
            >
                <Path d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
            </Svg>
        );
    } else {
        return (
            <Svg
                // xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                fill={color}
                viewBox="0 -960 960 960"
                {...props}
            >
                <Path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z" />
            </Svg>
        );
    }
}