import { configureStore } from '@reduxjs/toolkit';
import EmailSlice from './slice/EmailSlice'
import website from './slice/websiteSlice'
import datbaseSlice from './slice/databaseSlice'
import SubdomainSlice from './slice/SudomainSlice'
import FileManagerSlice from './slice/FIlemanagerSlice'
export const store = configureStore({
  reducer: {
    Email: EmailSlice,
    website: website,
    Database: datbaseSlice,
    Subdomain:SubdomainSlice,
    FileManger :FileManagerSlice,
  },
});


export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch