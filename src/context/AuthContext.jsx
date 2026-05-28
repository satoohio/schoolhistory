import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => {
          if (!r.ok) {
            throw new Error('Token invalid')
          }
          return r.json()
        })
        .then(data => { 
          if (data) setUser(data)
          setAuthError(null)
        })
        .catch((err) => {
          console.warn('Auth check failed:', err.message)
          setAuthError('Не удалось проверить авторизацию')
          logout()
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  function login(token, userData) {
    localStorage.setItem('token', token)
    setToken(token)
    setUser(userData)
    setAuthError(null)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const authFetch = async (url, opts = {}) => {
    const response = await fetch(url, {
      ...opts,
      headers: { ...opts.headers, Authorization: `Bearer ${token}` },
    })
    
    if (response.status === 401 || response.status === 403) {
      logout()
      throw new Error('Unauthorized')
    }
    
    return response
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      logout, 
      authFetch, 
      isAdmin: user?.role === 'admin',
      authError 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
