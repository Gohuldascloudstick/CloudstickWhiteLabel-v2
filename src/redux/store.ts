import { configureStore } from '@reduxjs/toolkit';
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
export const store = configureStore({
  reducer: {
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
  },
});


export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch