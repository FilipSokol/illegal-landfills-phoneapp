import React, { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as Location from 'expo-location';

// components
import { StyledContainer, InnerContainer, MsgBox } from '../components/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    minWidth: '100%',
    flex: 1,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 40,
    margin: 8,
    backgroundColor: 'grey',
  },
  text: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

const Photo = () => {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [useCamera, setUseCamera] = useState(false);
  const [image, setImage] = useState(null);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg('Oops, this will not work on Snack in an Android Emulator. Try it on your device!');
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location.coords.latitude + ' ' + location.coords.longitude);
    })();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Potrzebna jest zgoda na użycie kamery</Text>
        <Button onPress={requestPermission} title="Nadaj uprawnienia" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef) {
      console.log('Robie zdjecie');
      try {
        let photo = await cameraRef.current.takePictureAsync({
          allowsEditring: true,
          aspect: [4, 3],
          quality: 1,
        });
        return photo;
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {useCamera ? (
        <View>
          <Camera style={styles.camera} type={CameraType.back} ref={cameraRef}>
            <View style={{ flex: 9 }}></View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setUseCamera(false);
                }}
              >
                <Text style={styles.text}>ANULUJ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button]}
                onPress={async () => {
                  console.log('W trybie aparatu');
                  const r = await takePicture();
                  setUseCamera(false);
                  if (!r.cancelled) {
                    setImage(r.uri);
                  }
                  console.log('Zdjecie - ', JSON.stringify(r));
                }}
              >
                <Text style={styles.text}>ZDJĘCIE</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      ) : (
        <>
          <View style={{ width: '100%' }}>
            <View style={{ width: '100%', alignItems: 'center' }}>
              {true && <Image source={{ uri: image }} style={{ width: 300, height: 500, backgroundColor: 'gray' }} />}
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}
            >
              <TouchableOpacity
                style={[styles.button]}
                onPress={async () => {
                  console.log('WYŚLIJ');
                }}
                disabled={image === null ? true : false}
              >
                <Text style={styles.text}> WYŚLIJ </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button]}
                onPress={async () => {
                  console.log('W trybie aparatu');
                  setUseCamera(true);
                }}
              >
                <Text style={styles.text}> NOWE ZDJĘCIE </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default Photo;
