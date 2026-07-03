import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

export function OnboardingSlideScrim() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  };

  if (size.width === 0 || size.height === 0) {
    return <View style={StyleSheet.absoluteFill} onLayout={onLayout} pointerEvents="none" />;
  }

  return (
    <View style={StyleSheet.absoluteFill} onLayout={onLayout} pointerEvents="none">
      <Svg width={size.width} height={size.height}>
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
        <Rect x={0} y={0} width={size.width} height={size.height * 0.34} fill="url(#topScrim)" />
        <Rect x={0} y={size.height * 0.42} width={size.width} height={size.height * 0.58} fill="url(#bottomScrim)" />
      </Svg>
    </View>
  );
}
