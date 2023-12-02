import { legacy_createStore as createStore } from "redux";
import sourceListReducer from './sourcelist_reducers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' 

export const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, sourceListReducer)

export const store = createStore(persistedReducer)
export const persistor = persistStore(store)

