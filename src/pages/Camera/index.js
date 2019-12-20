import React, { Component } from 'react';

import { StatusBar, Modal,PermissionsAndroid, AsyncStorage } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Background from '~/components/Background';

import { RNCamera } from 'react-native-camera';

import api from '../../services/api';

import {
  Container,
  AnnotationContainer,
  AnnotationText,
  NewButtonContainer,
  ButtonsWrapper,
  CancelButtonContainer,
  SelectButtonContainer,
  ButtonText,
  Marker,
  ModalContainer,
  ModalImagesListContainer,
  ModalImagesList,
  ModalImageItem,
  ModalButtons,
  CameraButtonContainer,
  CancelButtonText,
  ContinueButtonText,
  TakePictureButtonContainer,
  TakePictureButtonLabel,
  DataButtonsWrapper,
  MarkerContainer,
  MarkerLabel,
  Form,
  Input,

} from './styles';



export default class Camera extends Component {
  


  static navigationOptions = {
    header: null,
  };
  
  state = {
    newRealty: false,
    cameraModalOpened: false,
    dataModalOpened: false,
    realtyData: {
      
      images: [],
    },
  };
  

  //findCoordinates = () => {
   // navigator.geolocation.getCurrentPosition(
     // position => {
       // const location = JSON.stringify(position);

        //this.setState({ location });
      //},
      //error => Alert.alert(error.message),
      //{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    //);
  //};
  
  componentDidMount() {
    
    this. renderConditionalsButtons 
  }

  handleNewRealtyPress = () => this.setState({ newRealty: !this.state.newRealty })

  handleCameraModalClose = () => this.setState({ cameraModalOpened: !this.state.cameraModalOpened })

  handleDataModalClose = () => this.setState({
    dataModalOpened: !this.state.dataModalOpened,
    cameraModalOpened: false,
  })
  



  handleGetPositionPress = async () => {

    try {
      
      
      this.setState({
        cameraModalOpened: true,
        
      });
    } catch (err) {
      console.tron.log(err);
    }
  }
  


  handleTakePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true, forceUpOrientation: true, fixOrientation: true, };
      const data = await this.camera.takePictureAsync(options)
      const { realtyData } = this.state;
      this.setState({ realtyData: {
        ...realtyData,
       
        images: [
          ...realtyData.images,
          data,
        ]
      }})
    }
  }

  saveRealty = async () => {
    try {
      const {
        realtyData: {
         
          files
        }
      } = this.state;

      

      const imagesData = new FormData();

      files.forEach((image,index) => {
        imagesData.append('image', {
          uri: image.uri,
          type: 'image/jpeg',
          id:image.id
          
        });
      });

      await api.post( `/files`,
        imagesData,
      );

      
      
      this.getLocation()
      this.setState({ newRealty:false });
      this.handleDataModalClose()
      
    } catch (err) {
      console.tron.log(err);
    }
  }

  renderConditionalsButtons = () => (
    !this.state.newRealty ? (
      <NewButtonContainer onPress={this.handleNewRealtyPress}>
        <ButtonText>Nova Denuncia</ButtonText>
      </NewButtonContainer>
    ) : (
      <ButtonsWrapper>
        <SelectButtonContainer onPress={this.handleGetPositionPress}>
          <ButtonText>Mande sua foto</ButtonText>
        </SelectButtonContainer>
        <CancelButtonContainer onPress={this.handleNewRealtyPress}>
          <ButtonText>Cancelar</ButtonText>
        </CancelButtonContainer>
      </ButtonsWrapper>
    )
  )
  

  renderImagesList = () => (
    this.state.realtyData.images.length !== 0 ? (
      <ModalImagesListContainer>
        <ModalImagesList horizontal>
          { this.state.realtyData.images.map(image => (
            <ModalImageItem source={{ uri: image.uri }} resizeMode="stretch" />
          ))}
        </ModalImagesList>
      </ModalImagesListContainer>
    ) : null
  )

  renderCameraModal = () => (

  

    <Modal
      visible={this.state.cameraModalOpened}
      transparent={false}
      animationType="slide"
      onRequestClose={this.handleCameraModalClose}
    >
       
  
      <ModalContainer>
        <ModalContainer>
          <RNCamera
            ref={camera => {
              this.camera = camera;
            }}
          //  androidCameraPermissionOptions={{
             // title: "Permissão para usar a câmera",
              //message: "Precisamos da sua permissão para usar a câmera.",
              //buttonPositive: "Ok",
              //buttonNegative: "Cancelar"
            //}}

            style={{ flex: 1 }}
            type={RNCamera.Constants.Type.back}
            autoFocus={RNCamera.Constants.AutoFocus.on}
            flashMode={RNCamera.Constants.FlashMode.off}
            captureAudio={false} 
           
          />
          <TakePictureButtonContainer onPress={this.handleTakePicture}>
            <TakePictureButtonLabel />
          </TakePictureButtonContainer>
        </ModalContainer>
        { this.renderImagesList() }
        <ModalButtons>
          <CameraButtonContainer onPress={this.handleCameraModalClose}>
            <CancelButtonText>Cancelar</CancelButtonText>
          </CameraButtonContainer>
          <CameraButtonContainer onPress={this.handleDataModalClose}>
            <ContinueButtonText>Continuar</ContinueButtonText>
          </CameraButtonContainer>
        </ModalButtons>
      </ModalContainer>
    </Modal>
  )

  renderDataModal = () => (
    <Modal
      visible={this.state.dataModalOpened}
      transparent={false}
      animationType="slide"
      onRequestClose={this.handleDataModalClose}
    >
      <ModalContainer>

        { this.renderImagesList() }
        <DataButtonsWrapper>
          <SelectButtonContainer onPress={this.saveRealty}>
            <ButtonText>Enviar Foto</ButtonText>
          </SelectButtonContainer>
          <CancelButtonContainer onPress={this.handleDataModalClose}>
            <ButtonText>Cancelar</ButtonText>
          </CancelButtonContainer>
        </DataButtonsWrapper>
      </ModalContainer>
    </Modal>
  )

  render() {
    return (
      <Container>
       <StatusBar barStyle="light-content" />
        <Background></Background>
        
        { this.renderConditionalsButtons() }
        
        { this.renderCameraModal() }
        { this.renderDataModal() }
      </Container>
    );
  }
}

Camera.navigationOptions = {
  tabBarLabel: 'Denuncie,envie sua foto',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="photo" size={20} color={tintColor} />
  ),
}