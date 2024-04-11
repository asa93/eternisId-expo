import { WebView } from "react-native-webview";

export function ReclaimWebview({ navigation, appDeepLink }) {
  return (
    <WebView
      source={{ uri: "https://eternisid-frontend-dev.up.railway.app/" }}
      style={{ flex: 1 }}
    />
  );
}
