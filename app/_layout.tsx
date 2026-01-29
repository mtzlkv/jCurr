import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000000',
          },
          headerTintColor: '#FFFFFF',
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Text style={styles.headerText}>
                <Text style={styles.orangeJ}>j</Text>
                <Text style={styles.whiteText}>Currency</Text>
              </Text>
            </View>
          ),
        }}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
  },
  orangeJ: {
    color: '#FF6B35',
  },
  whiteText: {
    color: '#FFFFFF',
  },
});
