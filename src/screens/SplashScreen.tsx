import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';
import { Theme } from '../tokens';
import { LabelCapsText } from '../atoms';
import { AppBackground } from '../components';
import { useAuthContext } from '../context';

type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #000;
    overflow: hidden;
}

svg {
    width: 80vw;
    height: 80vh;
    max-width: 500px;
    max-height: 500px;
}

.logo-group {
    animation: finalImpact .35s ease-out forwards 2.8s;
}

/* Border Rectangle */
#frame {
    stroke-dasharray: 3400;
    stroke-dashoffset: 3400;
    stroke-linecap: round;
    transform-origin: center;
    transform-box: fill-box;
    animation: frameReveal 2.8s cubic-bezier(.25,.46,.45,.94) forwards;
}

/* Right Bracket */
#shell {
    stroke-dasharray: 2500;
    stroke-dashoffset: 2500;
    transform-origin: center;
    transform-box: fill-box;
    animation: shellReveal 1.9s ease forwards 0.9s;
}

/* Left Arrow */
#arrow {
    stroke-dasharray: 1200;
    stroke-dashoffset: 1200;
    transform-origin: center;
    transform-box: fill-box;
    animation: arrowReveal 1s ease forwards 1.8s;
}

/* Middle Line */
#dash {
    opacity: 0;
    transform-origin: left center;
    transform-box: fill-box;
    filter: blur(12px);
    animation: lineReveal 1s ease forwards 1.8s;
}

/* ---------------------- */
/* KEYFRAMES */
/* ---------------------- */

@keyframes frameReveal {
    0% {
        opacity: 0;
        stroke-dashoffset: 3400;
        transform: scale(2.4) rotate(-220deg);
    }
    35% {
        opacity: 1;
        stroke-dashoffset: 2200;
    }
    65% {
        stroke-dashoffset: 900;
        transform: scale(.92) rotate(10deg);
    }
    85% {
        stroke-dashoffset: 250;
        transform: scale(1.02) rotate(-2deg);
    }
    100% {
        stroke-dashoffset: 0;
        transform: scale(1) rotate(0deg);
    }
}

@keyframes shellReveal {
    0% {
        stroke-dashoffset: 2500;
        transform: translateX(80px) translateY(-40px) rotate(180deg) scale(0.6);
        opacity: 0;
    }
    35% {
        stroke-dashoffset: 1600;
        transform: translateX(-30px) translateY(15px) rotate(-75deg) scale(1.15);
        opacity: 0.6;
    }
    65% {
        stroke-dashoffset: 800;
        transform: translateX(15px) translateY(-5px) rotate(20deg) scale(0.95);
        opacity: 0.9;
    }
    85% {
        stroke-dashoffset: 200;
        transform: translateX(-5px) translateY(2px) rotate(-6deg) scale(1.02);
        opacity: 1;
    }
    100% {
        stroke-dashoffset: 0;
        transform: translateX(0) translateY(0) rotate(0deg) scale(1);
        opacity: 1;
    }
}

@keyframes arrowReveal {
    0% {
        stroke-dashoffset: 1200;
        transform: translateX(-250px);
        opacity: 0;
    }
    70% {
        opacity: 1;
        transform: translateX(10px);
    }
    100% {
        stroke-dashoffset: 0;
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes lineReveal {
    0% {
        opacity: 0;
        filter: blur(12px);
        transform: scaleX(0);
    }
    60% {
        opacity: 1;
        filter: blur(4px);
        transform: scaleX(1.08);
    }
    100% {
        opacity: 1;
        filter: blur(0);
        transform: scaleX(1);
    }
}

@keyframes finalImpact {
    0% {
        transform: scale(1);
    }
    40% {
        transform: scale(1.035);
    }
    100% {
        transform: scale(1);
    }
}
</style>
</head>
<body>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="1024" height="1024" fill="black"/>
    <g class="logo-group">
    <rect
        id="frame"
        x="93"
        y="93"
        width="838"
        height="838"
        rx="114"
        fill="black"
        stroke="url(#paint0_linear_0_1)"
        stroke-width="12"
    />
    <path
        id="arrow"
        d="M257.576 647.732C355.777 547.736 403.201 499.445 411.63 490.863C412.404 490.075 412.403 488.859 411.615 488.085C403.932 480.54 363.126 440.466 254.424 333.715"
        stroke="url(#paint1_linear_0_1)"
        stroke-width="60"
        stroke-linecap="round"
    />
    <line
        id="dash"
        x1="402.239"
        y1="667.242"
        x2="532.233"
        y2="668.491"
        stroke="url(#paint2_linear_0_1)"
        stroke-width="50"
        stroke-linecap="round"
    />
    <path
        id="shell"
        d="M583.5 770H648.922C664.853 770 679.83 762.409 689.248 749.561L827.326 561.197C833.611 552.623 837 542.268 837 531.637V449.898C837 438.937 833.398 428.28 826.749 419.566L689.274 239.41C679.815 227.015 665.116 219.741 649.525 219.741H444"
        stroke="url(#paint3_linear_0_1)"
        stroke-width="60"
        stroke-linecap="round"
    />
    </g>
    <defs>
        <linearGradient id="paint0_linear_0_1" x1="937" y1="512" x2="87" y2="512" gradientUnits="userSpaceOnUse">
            <stop stop-color="#34D399"/>
            <stop offset="1" stop-color="#3B82F6"/>
        </linearGradient>
        <linearGradient id="paint1_linear_0_1" x1="178.282" y1="569.861" x2="333.718" y2="411.585" gradientUnits="userSpaceOnUse">
            <stop stop-color="#3B82F6"/>
            <stop offset="1" stop-color="#A5C8FF"/>
        </linearGradient>
        <linearGradient id="paint2_linear_0_1" x1="376.995" y1="692.5" x2="556.987" y2="694.231" gradientUnits="userSpaceOnUse">
            <stop stop-color="#3B82F6"/>
            <stop offset="1" stop-color="#A5C8FF"/>
        </linearGradient>
        <linearGradient id="paint3_linear_0_1" x1="593.231" y1="219.741" x2="593.231" y2="770" gradientUnits="userSpaceOnUse">
            <stop stop-color="#A7F3D0"/>
            <stop offset="1" stop-color="#22D3EE"/>
        </linearGradient>
    </defs>
</svg>
</body>
</html>
`;

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, isOnboarded } = useAuthContext();

  useEffect(() => {
    const routingTimeout = setTimeout(() => {
      if (user && isOnboarded) {
        navigation.replace('Main');
      } else {
        navigation.replace('Auth');
      }
    }, 3500);

    return () => clearTimeout(routingTimeout);
  }, [navigation, user, isOnboarded]);

  return (
    <AppBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <WebView
            originWhitelist={['*']}
            source={{ html: HTML_CONTENT }}
            style={styles.webView}
            scrollEnabled={false}
            overScrollMode="never"
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            backgroundColor="transparent"
          />
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
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  webView: {
    flex: 1,
    backgroundColor: '#000000',
  },
  footer: {
    position: 'absolute',
    bottom: Theme.spacing.xl,
    alignSelf: 'center',
  },
});