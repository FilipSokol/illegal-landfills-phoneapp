import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Axios from 'axios';

import { Octicons, Ionicons } from '@expo/vector-icons';

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

const { brand, darkLight } = Colors;

const Signup = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideSecPassword, setHideSecPassword] = useState(true);

  Axios.defaults.withCredentials = true;

  const [usernameVal, setUsernameVal] = useState();
  const [emailVal, setEmailVal] = useState();
  const [passwordVal, setPasswordVal] = useState();
  const [secPasswordVal, setSecPasswordVal] = useState();
  const [valStatus, setValStatus] = useState();

  const [usernameMes, setUsernameMes] = useState('');
  const [emailMes, setEmailMes] = useState('');
  const [passwordMes, setPasswordMes] = useState('');
  const [secPasswordMes, setSecPasswordMes] = useState('');

  const [usernameReg, setUsernameReg] = useState('');
  const [emailReg, setEmailReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [secPasswordReg, setSecPasswordReg] = useState('');

  const [registerStatus, setRegisterStatus] = useState('');

  const validation = () => {
    const usernameRegex = /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;

    usernameRegex.test(usernameReg)
      ? (setUsernameVal(true), setUsernameMes(''))
      : (setUsernameVal(false), setUsernameMes('Niepoprawna sk??adnia nazwy u??ytkownika'));

    emailRegex.test(emailReg)
      ? (setEmailVal(true), setEmailMes(''))
      : (setEmailVal(false), setEmailMes('Niepoprawna sk??adnia e-maila'));

    passwordRegex.test(passwordReg)
      ? (setPasswordVal(true), setPasswordMes(''))
      : (setPasswordVal(false), setPasswordMes('Niepoprawna sk??adnia has??a'));

    passwordReg === secPasswordReg
      ? (setSecPasswordVal(true), setSecPasswordMes(''))
      : (setSecPasswordVal(false), setSecPasswordMes('Podane has??a nie zgadzaj?? si??'));

    if (usernameVal === true && emailVal === true && passwordVal === true && secPasswordVal === true) {
      setValStatus(true);
    }
  };

  const register = () => {
    if (valStatus === true) {
      Axios.post('http://localhost:3001/api/register', {
        username: usernameReg,
        email: emailReg,
        password: passwordReg,
      }).then((response) => {
        if (response.data.message === '') {
          Alert.alert('Zarejestrowano pomy??lnie');
          navigation.push('Login');
        } else {
          setRegisterStatus(response.data.message);
        }
      });
    } else {
      validation();
    }
  };

  useEffect(() => {
    if (usernameReg !== '' || emailReg !== '' || passwordReg !== '') {
      validation();
    }
  });

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <PageLogo resizeMode="cover" source={require('../assets/logo.png')} />
          <PageTitle>Praca In??ynierska</PageTitle>
          <SubTitle>Rejestracja</SubTitle>

          <StyledFormArea>
            <MyTextInput
              label="Nazwa U??ytkownika"
              icon="person"
              onChangeText={(nameText) => setUsernameReg(nameText)}
              defaultValue={usernameReg}
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <MsgBox>{usernameMes}</MsgBox>
            <MyTextInput
              label="E-mail"
              icon="mail"
              onChangeText={(emailText) => setEmailReg(emailText)}
              defaultValue={emailReg}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <MsgBox>{emailMes}</MsgBox>
            <MyTextInput
              label="Has??o"
              icon="lock"
              onChangeText={(passwordText) => setPasswordReg(passwordText)}
              defaultValue={passwordReg}
              secureTextEntry={hidePassword}
              isPassword={true}
              hidePassword={hidePassword}
              setHidePassword={setHidePassword}
            />
            <MsgBox>{passwordMes}</MsgBox>
            <MyTextInput
              label="Powt??rz has??o"
              icon="lock"
              onChangeText={(passwordText) => setSecPasswordReg(passwordText)}
              defaultValue={secPasswordReg}
              secureTextEntry={hideSecPassword}
              isPassword={true}
              hidePassword={hideSecPassword}
              setHidePassword={setHideSecPassword}
            />
            <MsgBox>{secPasswordMes === '' ? registerStatus : secPasswordMes}</MsgBox>
            <StyledButton onPress={register}>
              <ButtonText>Zarejestruj</ButtonText>
            </StyledButton>
            <Line />
            <ExtraView>
              <ExtraText>Posiadasz ju?? konto? </ExtraText>
              <TextLink>
                <TextLinkContent
                  onPress={() => {
                    navigation.push('Login');
                  }}
                >
                  Zaloguj
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

export default Signup;
