import { configureStore } from '@reduxjs/toolkit';
import EmailSlice from './slice/EmailSlice'
import website from './slice/websiteSlice' 
export const store = configureStore({
  reducer: {
    Email: EmailSlice,
    website: website,
  },
});


export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch