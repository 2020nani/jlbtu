import styled from 'styled-components/native';

import Input from '~/components/Input';
import Button from '~/components/Button';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const Separator = styled.View`
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 20px 0 30px;
`;

export const Title = styled.Text`
  font-size: 20;
  color: #fff;
  font-weight: bold;
  align-self: center;
  margin-top: 30px;
`;

export const Form = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { padding: 30 },
})`
  align-self: stretch;
`;

export const FormInput = styled(Input)`
  margin-bottom: 10px;
`;

export const SubmitButton = styled(Button)`
  margin-top: 5px;
`;

export const LogoutButton = styled(Button)`
  margin-top: 10px;
  background: #f64c75;
`;
export const ButtonText = styled.Text`
  color: #fff;
  fontSize: 16px;
  textAlign: center;
  fontWeight: bold;
`;
export const SelectButtonContainerLogout = styled.TouchableHighlight`
  alignSelf: stretch;
  height: 46px;
  background: #f64c75;
  border-radius: 4px;

  align-items: center;
  justify-content: center;
`;
export const SelectButtonContainerAtualizar = styled.TouchableHighlight`
  alignSelf: stretch;
  height: 46px;
  background: #3b9eff;
  border-radius: 4px;

  align-items: center;
  justify-content: center;
  
`;