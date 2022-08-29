import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
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
    justifyContent: 'center',
    alignItems: 'center',
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
  const [imageBase64, setImageBase64] = useState(null);
  const [imageIsProcessed, setimageIsProcessed] = useState(false);
  const [location, setLocation] = useState(null);

  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Potrzebna jest zgoda na użycie lokalizacji');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
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
      try {
        let photo = await cameraRef.current.takePictureAsync({
          aspect: [4, 3],
          quality: 0.2,
          base64: true,
        });

        setImageBase64(photo.base64);

        setUseCamera(false);
        if (!photo.cancelled) {
          setImage(photo.uri);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const createMarker = (e) => {
    setimageIsProcessed(true);

    let base64Img = `data:image/jpg;base64,${imageBase64}`;
    Axios.post('https://api.cloudinary.com/v1_1/ddqprz03r/image/upload', {
      file: base64Img,
      upload_preset: 'PracaInzynierska',
    })
      .then(async (response) => {
        if (response.data.secure_url) {
          Axios.post('http://192.168.100.15:3001/api/createmarker', {
            userid: 0,
            imageurl: response.data.secure_url,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            description: 'test',
          })
            .then((response) => {
              alert('Pomyślnie dodano post');
              setimageIsProcessed(false);
              setImage(null);
            })
            .catch((err) => {
              alert('Błąd dodawania posta');
              setimageIsProcessed(false);
              console.log(err);
            });
        }
      })
      .catch((err) => {
        alert('Błąd wysyłania zdjęcia');
        setimageIsProcessed(false);
        console.log(err);
      });
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
                  await takePicture();
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
                style={
                  image === null || imageIsProcessed === true
                    ? [styles.styledButtonMenuDisabled]
                    : [styles.styledButtonMenu]
                }
                onPress={async () => {
                  createMarker();
                }}
                disabled={image === null ? true : false}
              >
                <ButtonText>WYŚLIJ</ButtonText>
              </TouchableOpacity>
              <StyledButtonMenu
                onPress={async () => {
                  setUseCamera(true);
                  setimageIsProcessed(false);
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
