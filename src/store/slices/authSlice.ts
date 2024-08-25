import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User as SupabaseUser } from '@supabase/auth-js'

interface UserMetadata {
  avatar_url?: string
  full_name?: string
  username?: string
}

export interface User extends SupabaseUser {
  user_metadata: UserMetadata
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
}

export const transformSupabaseUser = (supabaseUser: SupabaseUser): User => ({
  ...supabaseUser,
  user_metadata: supabaseUser.user_metadata as UserMetadata,
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
      state.isAuthenticated = Boolean(action.payload)
    },
    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { setUser, clearUser } = authSlice.actions
export default authSlice.reducer