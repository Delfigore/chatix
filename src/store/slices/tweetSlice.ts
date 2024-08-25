import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Tweet {
  id: string
  content: string
  user_id: string
  created_at: string
  likes: number
  retweets: number
  user: {
    username: string
    avatar_url: string
  }
}

interface TweetState {
  tweets: Tweet[]
}

const initialState: TweetState = {
  tweets: [],
}

const tweetSlice = createSlice({
  name: 'tweets',
  initialState,
  reducers: {
    setTweets: (state, action: PayloadAction<Tweet[]>) => {
      state.tweets = action.payload
    },
    addTweet: (state, action: PayloadAction<Tweet>) => {
      state.tweets.unshift(action.payload)
    },
    updateTweet: (state, action: PayloadAction<Tweet>) => {
      const index = state.tweets.findIndex((tweet) => tweet.id === action.payload.id)
      if (index !== -1) {
        state.tweets[index] = action.payload
      }
    },
  },
})

export const { setTweets, addTweet, updateTweet } = tweetSlice.actions
export default tweetSlice.reducer