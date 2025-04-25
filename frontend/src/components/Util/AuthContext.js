import React, {createContext, useState, useContext, useEffect} from 'react'

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const token = sessionStorage.getItem('token')
        if (token) {
            setIsAuthenticated(true)
        }
    }, []);

    const login = (token) => {
        sessionStorage.setItem('token', token)
        setIsAuthenticated(true)
    }

    const logout = (token) => {
        sessionStorage.removeItem('token', token)
        setIsAuthenticated(false)
    }


    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
};