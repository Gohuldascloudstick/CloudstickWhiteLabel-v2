import { configureStore } from '@reduxjs/toolkit';
import EmailSlice from './slice/EmailSlice'
import website from './slice/websiteSlice'
import datbaseSlice from './slice/databaseSlice'
import SubdomainSlice from './slice/SudomainSlice'
import CronJob from './slice/CronjobSlice'

export const store = configureStore({
  reducer: {
    Email: EmailSlice,
    website: website,
    Database: datbaseSlice,
    Subdomain: SubdomainSlice,
    CronJob: CronJob

  },
});


export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch