import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import EmailSlice from './slice/EmailSlice'
import website from './slice/websiteSlice'
import dataBaseSlice from './slice/dataBaseSlice'
import SubdomainSlice from './slice/SudomainSlice'
import CronJob from './slice/CronjobSlice'
import appsettingsSlice from './slice/appSettingSlice'
import SSLManagementSLice from './slice/SLLMangerSLice'
import serverSlice from './slice/serverslice'
import thirdPartyIntegrationSlice from './slice/thirdpartyintergration'
import dns from './slice/dnsSlice'
import WSslice from './slice/WSslice'
import worpressManager from './slice/WordPressManager'
import fileManager from './slice/FileManagerSlice'
import authSlice from './slice/authSlice'

// 1. Combine Reducers
const rootReducer = combineReducers({
    ws: WSslice,
    Email: EmailSlice,
    website: website,
    Database: dataBaseSlice,
    Subdomain: SubdomainSlice,
    CronJob: CronJob,
    Appsettings: appsettingsSlice,
    SSL: SSLManagementSLice,
    server: serverSlice,
    thirdparty: thirdPartyIntegrationSlice,
    dns: dns,
    wordPressManger: worpressManager,
    fileManager: fileManager,
    auth: authSlice,
});

// 2. Persist Config
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'], // Only persist the auth slice
};

// 3. Create Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configure Store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required for redux-persist
        }),
});

// 5. Create Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;