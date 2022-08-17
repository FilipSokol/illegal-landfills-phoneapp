import React, { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as Location from 'expo-location';

// components
import {
  StyledPhotoContainer,
  StyledButtonMenu,
  ButtonText,
  StyledButtonsArea,
  StyledPhotoButtonsArea,
} from '../components/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  styledButtonMenu: {
    padding: 15,
    backgroundColor: '#0CE363',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
    width: 190,
    height: 60,
  },
  styledButtonMenuDisabled: {
    padding: 15,
    backgroundColor: '#b3c9bc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
    width: 190,
    height: 60,
  },
});

const Photo = () => {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [useCamera, setUseCamera] = useState(false);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);

  const cameraRef = useRef(null);

  // ! Dodać ponowne proszenie o lokalizacje

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Potrzebna jest zgoda na użycie lokalizacji');
        return;
      }
      console.log(status);
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
    <StyledPhotoContainer>
      {useCamera ? (
        <View>
          <Camera style={styles.camera} type={CameraType.back} ref={cameraRef}>
            <View style={{ flex: 9 }}></View>
            <StyledPhotoButtonsArea>
              <StyledButtonMenu
                onPress={() => {
                  setUseCamera(false);
                }}
              >
                <ButtonText>ANULUJ</ButtonText>
              </StyledButtonMenu>
              <StyledButtonMenu
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
                <ButtonText>ZDJĘCIE</ButtonText>
              </StyledButtonMenu>
            </StyledPhotoButtonsArea>
          </Camera>
        </View>
      ) : (
        <>
          <View style={{ width: '100%' }}>
            <View style={{ width: '100%', alignItems: 'center' }}>
              {true && (
                <Image
                  resizeMode={image === null ? 'center' : 'cover'}
                  source={image === null ? require('../assets/camera.png') : { uri: image }}
                  style={{ width: 300, height: 500, borderColor: '#e6e6e6', borderWidth: 2 }}
                />
              )}
            </View>
            <StyledButtonsArea>
              <TouchableOpacity
                style={image === null ? [styles.styledButtonMenuDisabled] : [styles.styledButtonMenu]}
                onPress={async () => {
                  console.log('WYŚLIJ');
                }}
                disabled={image === null ? true : false}
              >
                <ButtonText>WYŚLIJ</ButtonText>
              </TouchableOpacity>
              <StyledButtonMenu
                onPress={async () => {
                  console.log('W trybie aparatu');
                  setUseCamera(true);
                }}
              >
                <ButtonText>NOWE ZDJĘCIE</ButtonText>
              </StyledButtonMenu>
            </StyledButtonsArea>
          </View>
        </>
      )}
    </StyledPhotoContainer>
  );
};

export default Photo;
