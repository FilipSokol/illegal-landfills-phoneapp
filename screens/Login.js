import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Axios from 'axios';

// icons
import { Octicons, Ionicons } from '@expo/vector-icons';

// components
import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  LeftIcon,
  RightIcon,
  StyledInputLabel,
  StyledTextInput,
  StyledButton,
  ButtonText,
  Colors,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
} from '../components/styles';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

// colors
const { brand, darkLight } = Colors;

const Login = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  Axios.defaults.withCredentials = true;

  const Login = (e) => {
    // Axios.post('http://localhost:3001/api/login', {
    Axios.post('http://192.168.100.10:3001/api/login', {
      email: email,
      password: password,
    }).then((response) => {
      if (response.data.accessToken) {
        AsyncStorage.setItem('user', JSON.stringify(response.data));
        navigation.push('Photo');
      } else {
        setLoginStatus(response.data.message);
      }
    });
  };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <PageLogo resizeMode="cover" source={require('../assets/logo.png')} />
          <PageTitle>Praca Inżynierska</PageTitle>
          <SubTitle>Logowanie</SubTitle>

          <StyledFormArea>
            <MyTextInput
              label="E-mail"
              icon="mail"
              onChangeText={(emailText) => setEmail(emailText)}
              defaultValue={email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <MsgBox />
            <MyTextInput
              label="Hasło"
              icon="lock"
              onChangeText={(passwordText) => setPassword(passwordText)}
              defaultValue={password}
              secureTextEntry={hidePassword}
              isPassword={true}
              hidePassword={hidePassword}
              setHidePassword={setHidePassword}
            />
            <MsgBox>{loginStatus}</MsgBox>
            <StyledButton onPress={Login}>
              <ButtonText>Zaloguj</ButtonText>
            </StyledButton>
            <Line />
            <ExtraView>
              <ExtraText>Nie posiadasz konta? </ExtraText>
              <TextLink>
                <TextLinkContent
                  onPress={() => {
                    navigation.push('Signup');
                  }}
                >
                  Zarejestruj
                </TextLinkContent>
              </TextLink>
            </ExtraView>
          </StyledFormArea>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkLight} />
        </RightIcon>
      )}
    </View>
  );
};

export default Login;
