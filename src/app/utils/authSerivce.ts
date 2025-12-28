import { getCustomerId } from '@/services/userService';
import axios from 'axios';

const API_URL = "https://wcsstestserver.azurewebsites.net/api/v1/token";

const loginUser = async (username: string, password: string) => {
    try {
        const response = await axios.post(
            API_URL,
            {
                username: username,
                password: password,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )

        const {
            authToken,
            userId,
            authId,
            token: restApiToken,
        } = response.data;

        // Store only what frontend needs
        localStorage.setItem("authToken", authToken);
        localStorage.setItem("userId", userId);
        localStorage.setItem("authId", authId);

        await getCustomerId(userId);

        if (restApiToken) {
            localStorage.setItem("restApiToken", restApiToken);
        }


        // if (response.data.authToken) {
        //     localStorage.setItem('token', response.data.authToken);
        //     // document.cookie = `user=${response.data.authToken}; path=/; max-age=20`;
        // }
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error);
            console.log("Login API error:", error.response?.data || error.message);
        }
        else {
            console.log("Unexpected error: ", error);
        }
        throw error;
    }
}

const logoutUser = async () => {
    console.log("Logging out...");
    localStorage.clear();
    sessionStorage.clear();
}

export { loginUser, logoutUser };