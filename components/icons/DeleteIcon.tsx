import { ColorValue } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

type Props = Omit<SvgProps, 'width' | 'height' | 'color' | 'fill'> & {
    size?: number;
    color?: ColorValue;
}

export default function DeleteIcon({ size = 24, color = '#0c0c0cff', ...props }: Props) {

    return (
        <Svg
            // xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill={color}
            viewBox="0 -960 960 960"
            {...props}
        >
            <Path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
        </Svg>
    );
}