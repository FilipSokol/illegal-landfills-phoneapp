import styled from 'styled-components';
import Constants from 'expo-constants';

const StatusBarHeight = Constants.statusBarHeight;

// colors
export const Colors = {
  primary: '#ffffff',
  secondary: '#E5E7EB',
  tertiary: '#1F2937',
  darkLight: '#9CA3AF',
  brand: '#0CE363',
  green: '#10B981',
  red: '#EF4444',
};

// colors: {
//   lightgreen: "#0ce363",
//   darkgreen: "#00c67f",
//   lightblack: "#293231",

const { primary, secondary, tertiary, darkLight, brand, green, red } = Colors;

export const StyledContainer = styled.View`
  flex: 1;
  padding: 25px;
  padding-top: ${StatusBarHeight + 10}px;
  backgorund-color: ${primary};
`;

export const StyledPhotoContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const InnerContainer = styled.View`
  flex: 1;
  width:100%
  align-items: center;
`;

export const PageLogo = styled.Image`
  width: 138px;
  height: 100px;
`;

export const PageTitle = styled.Text`
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  color: ${brand};
  padding: 10px;
`;

export const SubTitle = styled.Text`
  font-size: 18px;
  margin-bottom: 20px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${tertiary};
`;

export const StyledFormArea = styled.View`
  width: 90%;
`;

export const StyledButtonsArea = styled.View`
  justify-content: space-around;
  flex-direction: row;
  align-content: center;
  padding: 0 5px 0 5px;
  margin-top: 25px;
  width: 100%;
`;

// export const StyledPhotoButtonsArea = styled.View`
//   justify-content: space-around;
//   flex-direction: row;
//   align-content: center;
//   padding: 5px 5px 5px 5px;
//   margin: 10px 0 35px 0;
//   min-width: 100%;
//   background-color: rgba(76, 76, 76, 0.28);
// `;

export const StyledPhotoButtonsArea = styled.View`
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  padding: 5px 5px 5px 5px;
  margin: 10px 0 35px 0;
  height: 100%;
  min-width: 100%;
`;

export const StyledPhotoCancelButton = styled.TouchableOpacity`
  margin-top: 25px;
  justify-content: center;
  align-self: left;
  align-items: center;
  width: 70px
  height: 70px;
`;

export const StyledPhotoCircleButton = styled.TouchableOpacity`
  margin-bottom:50px;
  justify-content: center;
  align-items: center;
  width: 90px
  height: 90px;
`;

export const StyledTextInput = styled.TextInput`
  background-color: ${secondary};
  padding: 15px;
  padding-left: 55px;
  padding-right: 55px;
  border-radius: 5px;
  font-size: 16px;
  height: 60px;
  margin-vertical: 3px;
  margin-bottom: 10px;
  color: ${tertiary};
`;

export const StyledInputLabel = styled.Text`
  font-size: 13px;
  text-align: left;
  color: ${tertiary};
`;

export const LeftIcon = styled.View`
  left: 15px;
  top: 34px;
  position: absolute;
  z-index: 1;
`;

export const RightIcon = styled.TouchableOpacity`
  right: 15px;
  top: 34px;
  position: absolute;
  z-index: 1;
`;

export const StyledButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${brand};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px
  height: 60px;
`;

export const StyledButtonMenu = styled.TouchableOpacity`
  background-color: ${brand};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px;
  padding: 15px;
  width: 175px;
  height: 60px;
`;

export const ButtonText = styled.Text`
  color: ${primary}
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1.1px;
`;

export const MsgBox = styled.Text`
  height: 16px;
  text-align: center;
  font-size: 13px;
  margin-bottom: 3px;
  color: ${red};
`;

export const Line = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${darkLight};
  margin-vertical: 10px;
`;

export const ExtraView = styled.View`
  justify-content: center;
  flex-direction: row;
  align-content: center;
  padding: 10px;
`;

export const ExtraText = styled.Text`
  justify-content: center;
  align-content: center;
  color: ${tertiary};
  font-size: 15px;
`;

export const TextLink = styled.TouchableOpacity`
  justify-content: center;
  align-content: center;
`;

export const TextLinkContent = styled.Text`
  color: ${brand};
  font-size: 15px;
`;
