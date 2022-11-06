import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import React, { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import jwt_decode from 'jwt-decode';
import Axios from 'axios';
import { Camera, CameraType } from 'expo-camera';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import {
  StyledPhotoContainer,
  StyledMainContainer,
  StyledButtonMenu,
  ButtonText,
  StyledButtonsArea,
  StyledPhotoButtonsArea,
  StyledPhotoCancelButton,
  StyledPhotoCircleButton,
} from '../components/styles';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

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
    width: 175,
    height: 60,
  },
  styledButtonMenuDisabled: {
    padding: 15,
    backgroundColor: '#b3c9bc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
    width: 175,
    height: 60,
  },
  imageStyleBox: {
    width: 300,
    height: 500,
    borderColor: '#e6e6e6',
    borderWidth: 2,
    marginBottom: 10,
  },
  descriptionTextArea: {
    height: 95,
    width: 300,
    marginTop: 10,
    padding: 10,
    borderColor: '#e6e6e6',
    borderWidth: 2,
  },
  selectBoxTextArea: {
    color: '#C1C1C6',
  },
  selectBoxContainer: {
    width: 300,
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  selectBoxBorder: {
    borderColor: '#e6e6e6',
    backgroundColor: '#F2F2F2',
    borderRadius: 0,
  },
});

const Photo = () => {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [useCamera, setUseCamera] = useState(false);
  const [location, setLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageIsProcessed, setimageIsProcessed] = useState(false);
  const [tokenData, setTokenData] = useState([]);
  const [description, setDescription] = useState(null);
  const [typeValue, setTypeValue] = useState(null);
  const [openSelectBox, setOpenSelectBox] = useState(false);

  const selectBoxData = [
    { label: 'Mieści się w workach', value: 'bag' },
    { label: 'Potrzeba pojazdu', value: 'car' },
  ];

  const cameraRef = useRef(null);

  const AuthVerify = async () => {
    const user = await AsyncStorage.getItem('user');
    if (user != null) {
      const decodedToken = jwt_decode(user);
      setTokenData(decodedToken);
    }
  };

  useEffect(() => {
    AuthVerify();
  }, []);

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

  const createMarker = () => {
    setimageIsProcessed(true);
    description === '' && setDescription(null);

    let base64Img = `data:image/jpg;base64,${imageBase64}`;

    Axios.post('http://localhost:3001/api/images', {
      userid: tokenData.userid,
      image: base64Img,
    })
      .then(async (response) => {
        if (response.data.imageurl) {
          Axios.post('http://localhost:3001/api/createmarker', {
            userid: tokenData.userid,
            imageurl: response.data.imageurl,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            type: typeValue,
            description: description,
          })
            .then(() => {
              alert('Pomyślnie dodano post');
              setimageIsProcessed(false);
              setDescription(null);
              setTypeValue(null);
              setImage(null);

              Axios.post('http://localhost:3001/api/addpoints', {
                score: 20,
                userid: tokenData.userid,
              });
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
              <StyledPhotoCancelButton
                onPress={() => {
                  setUseCamera(false);
                }}
              >
                <AntDesign name="close" size={50} color="#0CE363" />
              </StyledPhotoCancelButton>
              <StyledPhotoCircleButton
                onPress={async () => {
                  await takePicture();
                }}
              >
                <FontAwesome name="circle" size={90} color="#0CE363" />
              </StyledPhotoCircleButton>
            </StyledPhotoButtonsArea>
          </Camera>
        </View>
      ) : (
        <KeyboardAvoidingWrapper>
          <StyledMainContainer>
            <View style={{ width: '100%' }}>
              <View style={{ width: '100%', alignItems: 'center' }}>
                <Text style={{ color: '#b3c9bc', marginBottom: 5 }}>Witaj {tokenData.username}!</Text>

                {true && (
                  <Image
                    resizeMode={image === null ? 'center' : 'cover'}
                    source={image === null ? require('../assets/camera.png') : { uri: image }}
                    style={styles.imageStyleBox}
                  />
                )}
                <DropDownPicker
                  open={openSelectBox}
                  value={typeValue}
                  items={selectBoxData}
                  setOpen={setOpenSelectBox}
                  setValue={setTypeValue}
                  setItems={selectBoxData}
                  placeholder="Wybierz wielkość..."
                  style={styles.selectBoxBorder}
                  labelStyle={styles.selectBoxlabel}
                  containerStyle={styles.selectBoxContainer}
                  placeholderStyle={styles.selectBoxTextArea}
                  dropDownContainerStyle={styles.selectBoxBorder}
                  listMode="SCROLLVIEW"
                />
                <TextInput
                  onChangeText={(text) => setDescription(text)}
                  placeholder="Dodaj opis..."
                  textAlignVertical="top"
                  value={description}
                  multiline={true}
                  maxLength={180}
                  style={styles.descriptionTextArea}
                />
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
          </StyledMainContainer>
        </KeyboardAvoidingWrapper>
      )}
    </StyledPhotoContainer>
  );
};

export default Photo;
