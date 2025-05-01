import { createContext, useState, useContext } from 'react';
import axios from 'axios';
const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [details, setDetails] = useState(null);
    
    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/fetch-user-details/${user._id}`,
            {withCredentials: true});
            setDetails(response.data.userDetails);
        } catch (error) {
            setError(error.response.data.message);  
        }
    };


    const login = async (email, password) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`,
                 { email, password },
                 {withCredentials: true}
                );
            setUser(response.data.user);
            fetchUserDetails();
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
         value={{ user, setUser, login, register, logout, error, setError, details, setDetails, fetchUserDetails }}>
        {children}
    </UserContext.Provider>;
};

export function useUser() {
    return useContext(UserContext);
} 