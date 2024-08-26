import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tweet, TweetState } from '@/types';

const initialState: TweetState = {
  tweets: [],
};

export const tweetSlice = createSlice({
  name: 'tweets',
  initialState,
  reducers: {
    setTweets: (state, action: PayloadAction<Tweet[]>) => {
      state.tweets = action.payload;
    },
    addTweet: (state, action: PayloadAction<Tweet>) => {
      state.tweets.unshift(action.payload);
    },
    updateTweet: (state, action: PayloadAction<Tweet>) => {
      const index = state.tweets.findIndex(tweet => tweet.id === action.payload.id);
      if (index !== -1) {
        state.tweets[index] = action.payload;
      }
    },
    removeTweet: (state, action: PayloadAction<string>) => {
      state.tweets = state.tweets.filter(tweet => tweet.id !== action.payload);
    },
  },
});

export const { setTweets, addTweet, updateTweet, removeTweet } = tweetSlice.actions;

export default tweetSlice.reducer;