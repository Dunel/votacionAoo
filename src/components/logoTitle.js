import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const LogoTitle = () => {
  return (
    <View style={styles.container}>
    <Image
      style={styles.logo}
      source={require('../../assets/ic_launcher.png')}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 40,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
});

export default LogoTitle;
