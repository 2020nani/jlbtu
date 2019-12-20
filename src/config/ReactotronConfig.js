import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import reactotronSaga from 'reactotron-redux-saga';
import {AsyncStorage} from 'react-native';

if (__DEV__) {
  //host = procurar ip da minha maquina
  const tron = Reactotron
    .setAsyncStorageHandler(AsyncStorage)
    .configure({ host: '10.0.0.102' })
    .useReactNative()
    .use(reactotronRedux())
    .use(reactotronSaga())
    .connect();

  tron.clear();

  console.tron = tron;
}
