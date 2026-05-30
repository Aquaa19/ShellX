import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Rect, Path, Line, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { Theme } from '../tokens';
import { LabelCapsText } from '../atoms';
import { AppBackground, ScanlineOverlay } from '../components';
import { useAuthContext } from '../context';

type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedG = Animated.createAnimatedComponent(G);

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthContext();

  const frameAnim = useRef(new Animated.Value(0)).current;
  const shellAnim = useRef(new Animated.Value(0)).current;
  const arrowAnim = useRef(new Animated.Value(0)).current;
  const dashAnim = useRef(new Animated.Value(0)).current;
  const impactAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset values
    frameAnim.setValue(0);
    shellAnim.setValue(0);
    arrowAnim.setValue(0);
    dashAnim.setValue(0);
    impactAnim.setValue(0);

    // Play animation timelines sequentially matching the CSS keyframes
    Animated.parallel([
      Animated.timing(frameAnim, {
        toValue: 1,
        duration: 2800,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.delay(900),
        Animated.timing(shellAnim, {
          toValue: 1,
          duration: 1900,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ]),
      Animated.sequence([
        Animated.delay(1800),
        Animated.timing(arrowAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ]),
      Animated.sequence([
        Animated.delay(1800),
        Animated.timing(dashAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ]),
      Animated.sequence([
        Animated.delay(2800),
        Animated.timing(impactAnim, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    // Redirect to main stack or login panel when animation ends (approx 3.5s total time)
    const routingTimeout = setTimeout(() => {
      if (user) {
        navigation.replace('Main');
      } else {
        navigation.replace('Auth');
      }
    }, 3500);

    return () => clearTimeout(routingTimeout);
  }, [navigation, user, frameAnim, shellAnim, arrowAnim, dashAnim, impactAnim]);

  // Frame Interpolations
  const frameOffset = frameAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [3400, 0],
  });
  const frameOpacity = frameAnim.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [0, 1, 1],
  });
  const frameScale = frameAnim.interpolate({
    inputRange: [0, 0.65, 0.85, 1],
    outputRange: [2.4, 0.92, 1.02, 1.0],
  });
  const frameRotate = frameAnim.interpolate({
    inputRange: [0, 0.65, 0.85, 1],
    outputRange: [-220, 10, -2, 0],
  });

  // Shell Interpolations
  const shellOffset = shellAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2500, 0],
  });
  const shellOpacity = shellAnim.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [0, 1, 1],
  });
  const shellTranslateX = shellAnim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [40, -8, 0],
  });
  const shellRotate = shellAnim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [35, -4, 0],
  });

  // Arrow Interpolations
  const arrowOffset = arrowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1200, 0],
  });
  const arrowOpacity = arrowAnim.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [0, 1, 1],
  });
  const arrowTranslateX = arrowAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [-250, 10, 0],
  });

  // Dash Interpolations
  const dashOpacity = dashAnim.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [0, 1, 1],
  });
  const dashScaleX = dashAnim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0, 1.08, 1],
  });

  // Impact Interpolation
  const impactScale = impactAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [1, 1.035, 1],
  });

  return (
    <AppBackground>
      <ScanlineOverlay />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Svg
            width={280}
            height={280}
            viewBox="0 0 1024 1024"
            fill="none"
          >
            <Rect width="1024" height="1024" fill="black" />
            <AnimatedG
              scale={impactScale}
              originX={512}
              originY={512}
            >
              <AnimatedRect
                x="93"
                y="93"
                width="838"
                height="838"
                rx="114"
                fill="black"
                stroke="url(#paint0_linear_0_1)"
                strokeWidth="12"
                strokeDasharray="3400"
                strokeDashoffset={frameOffset}
                opacity={frameOpacity}
                scale={frameScale}
                rotation={frameRotate}
                originX={512}
                originY={512}
              />

              <AnimatedPath
                d="M257.576 647.732C355.777 547.736 403.201 499.445 411.63 490.863C412.404 490.075 412.403 488.859 411.615 488.085C403.932 480.54 363.126 440.466 254.424 333.715"
                stroke="url(#paint1_linear_0_1)"
                strokeWidth="60"
                strokeLinecap="round"
                strokeDasharray="1200"
                strokeDashoffset={arrowOffset}
                opacity={arrowOpacity}
                x={arrowTranslateX}
                originX={333}
                originY={490}
              />

              <AnimatedLine
                x1="402.239"
                y1="667.242"
                x2="532.233"
                y2="668.491"
                stroke="url(#paint2_linear_0_1)"
                strokeWidth="50"
                strokeLinecap="round"
                opacity={dashOpacity}
                scaleX={dashScaleX}
                originX={402}
                originY={667}
              />

              <AnimatedPath
                d="M583.5 770H648.922C664.853 770 679.83 762.409 689.248 749.561L827.326 561.197C833.611 552.623 837 542.268 837 531.637V449.898C837 438.937 833.398 428.28 826.749 419.566L689.274 239.41C679.815 227.015 665.116 219.741 649.525 219.741H444"
                stroke="url(#paint3_linear_0_1)"
                strokeWidth="60"
                strokeLinecap="round"
                strokeDasharray="2500"
                strokeDashoffset={shellOffset}
                opacity={shellOpacity}
                x={shellTranslateX}
                rotation={shellRotate}
                originX={640}
                originY={495}
              />
            </AnimatedG>
            <Defs>
              <LinearGradient id="paint0_linear_0_1" x1="937" y1="512" x2="87" y2="512" gradientUnits="userSpaceOnUse">
                <Stop stopColor="#34D399" />
                <Stop offset="1" stopColor="#3B82F6" />
              </LinearGradient>

              <LinearGradient id="paint1_linear_0_1" x1="178.282" y1="569.861" x2="333.718" y2="411.585" gradientUnits="userSpaceOnUse">
                <Stop stopColor="#3B82F6" />
                <Stop offset="1" stopColor="#A5C8FF" />
              </LinearGradient>

              <LinearGradient id="paint2_linear_0_1" x1="376.995" y1="692.5" x2="556.987" y2="694.231" gradientUnits="userSpaceOnUse">
                <Stop stopColor="#3B82F6" />
                <Stop offset="1" stopColor="#A5C8FF" />
              </LinearGradient>

              <LinearGradient id="paint3_linear_0_1" x1="593.231" y1="219.741" x2="593.231" y2="770" gradientUnits="userSpaceOnUse">
                <Stop stopColor="#A7F3D0" />
                <Stop offset="1" stopColor="#22D3EE" />
              </LinearGradient>
            </Defs>
          </Svg>
        </View>

        <View style={styles.footer}>
          <LabelCapsText color={Theme.colors.text.tertiary}>
            SHELLX v1.0.0
          </LabelCapsText>
        </View>
      </SafeAreaView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoContainer: {
    ...Theme.noShadow,
  },
  footer: {
    position: 'absolute',
    bottom: Theme.spacing.xl,
  },
});