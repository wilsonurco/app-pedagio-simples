import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

export function OnboardingSlideScrim() {
  const { width, height } = useWindowDimensions();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="topScrim" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#000000" stopOpacity={0.42} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0} />
          </LinearGradient>
          <LinearGradient id="bottomScrim" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#000000" stopOpacity={0} />
            <Stop offset="0.28" stopColor="#000000" stopOpacity={0.45} />
            <Stop offset="0.55" stopColor="#000000" stopOpacity={0.78} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0.92} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height * 0.34} fill="url(#topScrim)" />
        <Rect x={0} y={height * 0.42} width={width} height={height * 0.58} fill="url(#bottomScrim)" />
      </Svg>
    </View>
  );
}
