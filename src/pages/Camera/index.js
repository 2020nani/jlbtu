import React, { Component } from 'react';

import { StatusBar, Modal,StyleSheet,PermissionsAndroid, AsyncStorage } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Background from '~/components/Background';

import { RNCamera } from 'react-native-camera';
import Geolocation from 'react-native-geolocation-service';

import MapView, {Marker} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
 

 Geocoder.init("AIzaSyAm7cwW_QWAGx7w5BCUt45XvUI3jGclyoo", {language : "en"}); // set the language

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
    locations : [],
    
    
    newRealty: false,
    cameraModalOpened: false,
    dataModalOpened: false,
    realtyData: {
      
      position: "",
      images:[],
    },
  };
  componentDidMount() {
    this.getLocation();
  }

  getLocation = async () => {
    try {
      const response = await  {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        
      }

      this.setState({ locations: response.data });
    } catch (err) {
      console.tron.log(err);
    }
  }

  handleNewRealtyPress = () => this.setState({ newRealty: !this.state.newRealty })

  handleCameraModalClose = () => this.setState({ cameraModalOpened: !this.state.cameraModalOpened })

  handleDataModalClose = () => this.setState({
    dataModalOpened: !this.state.dataModalOpened,
    cameraModalOpened: false,
  })
  
  handleGetPositionPress = async () => {
    try {
      const request_location_runtime_permission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Permissão de Localização',
              message: 'A aplicação precisa da permissão de localização.',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            Geolocation.getCurrentPosition(
              pos => {
                setPosition({
                  
                    ...position,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    latitude: pos.coords.latitudeDelta,
                    longitude: pos.coords.longitudeDelta,
                  
                  
                });
              },
              error => {
                console.log(error);

                Alert.alert('Houve um erro ao pegar a latitude e longitude.');
              },
              { enableHighAccuracy: true, timeout: 15000, maximumAge:10000 }
            );
          } else {
            Alert.alert('Permissão de localização não concedida');
          }
        } catch (err) {
          console.log(err);
        }
      };
      const localEndereco = async () => {
      Geocoder.from(position)
      .then(json => {
          var address = json.results[0].formatted_address;
        //setAddressComponent({
         // ...addressComponent,
         // locality: address.locality,
         // streetNumber: address.streetNumber,
        //  streetName: address.streetName
       // });
       this.setState({
        cameraModalOpened: true,
        realtyData: {
          ...this.state.realtyData,
        position: address
        },
      });
        
      })
      .catch(error => console.warn(error));
    }

     
    } catch (err) {
      console.tron.log(err);
    }
    //try {
      // this.setState({
       // cameraModalOpened: true,       
      //});
    //} catch (err) {
     // console.tron.log(err);
   // }
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
          position,
          images
        }
      } = this.state;
      const newRealtyResponse = await api.post('/files', {
        position
      });
        

      const imagesData  = new FormData();

      images.forEach((image, index) => {
        imagesData.append('files', {
          local:newRealtyResponse.data.position,
          uri: image.uri,
          type: 'image/jpeg',
          name: imagesData.originalName.jpg
        });
      });
      await api.post(
        `/files`,
        imagesData,
      );
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
     <ModalContainer>
     <MapView
      style={styles.map}
      region={this.state.realtyData.position.longitude,
        this.state.realtyData.position.latitude,
        this.state.realtyData.position.longitudeDelta,
        this.state.realtyData.position.latitudeDelta
      }
      //onPress={e =>
       // setPosition({
      //    ...position,
        //  latitude: e.nativeEvent.coordinate.latitude,
        //  longitude: e.nativeEvent.coordinate.longitude,
     //   })
    //  }}
     >
      <Marker
          coordinate={this.state.realtyData.position.longitude,
            this.state.realtyData.position.latitude,
            this.state.realtyData.position.longitudeDelta,
            this.state.realtyData.position.latitudeDelta  
          }
          title={'Marcador'}
          description={'Testando o marcador no mapa'}
        />
    </MapView>
        </ModalContainer>

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
       <MapView
      style={styles.map}
      region={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
     >
      <Marker
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          title={'Marcador'}
          description={'Testando o marcador no mapa'}
        />
    </MapView>
        
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    backgroundColor: '#4682B4',
    height: '100%',
    width: '100%',
  },
 
});