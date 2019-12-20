
import React from 'react'; 
import Icon from 'react-native-vector-icons/MaterialIcons';

import Background from '~/components/Background';

import {Container, Title} from './styles';



  export default function Dashboard(){
  return (
    <Background>
      <Container>
        <Title> informacoes </Title>
       
        
      </Container>
    </Background>
  );
}


Dashboard.navigationOptions = {
  tabBarLabel: 'Informacoes uteis',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="info" size={20} color={tintColor} />
  ),
};


