import { createContext, useState, useContext } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [details, setDetails] = useState(null);
    const[loading,setLoading] = useState(false);
    
    const [alerts,setAlerts] = useState([]);
    const [justLoggedOut,setJustLoggedOut] = useState(false);

    const fetchUserDetails = async (userId ) => {
        if(!userId){
            userId = user._id;
        }
        try {
            console.log(user,'on fetchUserDetails');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/fetch-user-details/${userId}`,
            {withCredentials: true});
            console.log(response.data.userDetails,'on fetchUserDetails');
            setDetails(response.data.userDetails);
        } catch (error) {
            setError(error.response.data.message);  
        }
    };

    const fetchAlerts = async (userId) => {
        try {
            if(!userId){    
                userId = user._id;
            }
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/fetch-AI-alerts/${userId}`,
                {withCredentials: true});
            setAlerts(response.data.alerts);
            console.log(response.data.alerts,'on fetchAlerts');
        } catch (error) {
            setError(error.response.data.message);
        }
    }
    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`,
                 { email, password },
                 {withCredentials: true}
                );
            console.log(response.data.user,'on login');
            setUser(response.data.user);
            await fetchUserDetails(response.data.user._id);
            await fetchAlerts(response.data.user._id);
            // if(user._id) navigate('/home');
        } catch (error) {
            setError(error.response.data.message);
        }
        finally{
            setLoading(false);
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
            await axios.post(`${import.meta.env.VITE_API_URL}/api/logout`,
                 {withCredentials: true}
                );
            console.log('logged out');
            setUser(null);
            setJustLoggedOut(true);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return <UserContext.Provider 
         value={{ user, setUser, login, register, logout, error, setError, 
         alerts,setAlerts,details, setDetails, fetchUserDetails, loading, justLoggedOut }}>
        {children}
    </UserContext.Provider>;
};

export function useUser() {
    return useContext(UserContext);
} 