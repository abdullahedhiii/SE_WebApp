import { createContext, useState, useContext } from 'react';
import axios from 'axios';
const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`,
                 { email, password },
                 {withCredentials: true}
                );
            setUser(response.data.user);
            console.log(response.data.user,'on login');
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`,
                 { name, email, password, role },
                 {withCredentials: true}
                );
            setUser(response.data.user);
            console.log(response.data.user,'on register');
        } catch (error) {
            setError(error.response.data.message);
        }
    };

  
    const logout = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/logout`,
                 {withCredentials: true}
                );
            setUser(null);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return <UserContext.Provider 
         value={{ user, setUser, login, register, logout, error, setError }}>
        {children}
    </UserContext.Provider>;
};

export function useUser() {
    return useContext(UserContext);
} 