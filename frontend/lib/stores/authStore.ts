import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import { createClient } from '../supabase/client'
import type { UserRole } from '../supabase/types'

interface AuthState {
  user: User | null
  role: UserRole | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setRole: (role: UserRole | null) => void
  setIsLoading: (isLoading: boolean) => void
  clearAuth: () => void
  fetchRole: (userId?: string) => Promise<UserRole | null>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  role: null,
  isLoading: true,

  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setIsLoading: (isLoading) => set({ isLoading }),

  clearAuth: () =>
    set({
      user: null,
      role: null,
      isLoading: false,
    }),

  fetchRole: async (userId?: string) => {
    try {
      const supabase = createClient()
      const targetUserId = userId || get().user?.id

      if (!targetUserId) {
        set({ role: null })
        return null
      }

      // Check user metadata first if available
      const currentUser = get().user
      if (currentUser?.user_metadata?.role) {
        const metaRole = currentUser.user_metadata.role as UserRole
        if (metaRole === 'platform_admin' || metaRole === 'place_incharge') {
          set({ role: metaRole })
        }
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', targetUserId)

      if (error || !data || data.length === 0) {
        const existingRole = get().role || 'user'
        set({ role: existingRole })
        return existingRole
      }

      const roles = data.map((r: any) => r.role)
      let resolvedRole: UserRole = 'user'
      if (roles.includes('platform_admin')) {
        resolvedRole = 'platform_admin'
      } else if (roles.includes('place_incharge')) {
        resolvedRole = 'place_incharge'
      }

      set({ role: resolvedRole })
      return resolvedRole
    } catch (err) {
      console.error('Failed to fetch user role:', err)
      const existingRole = get().role || 'user'
      set({ role: existingRole })
      return existingRole
    }
  },

  initialize: async () => {
    try {
      set({ isLoading: true })
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        set({ user })
        await get().fetchRole(user.id)
      } else {
        set({ user: null, role: null })
      }
    } catch (err) {
      console.error('Auth store initialization error:', err)
      set({ user: null, role: null })
    } finally {
      set({ isLoading: false })
    }
  },
}))

export const useRole = (): UserRole | null => useAuthStore((state) => state.role)
