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
        if (response.data.authToken) {
            localStorage.setItem('token', response.data.authToken);
            document.cookie = `user=${response.data.authToken}; path=/; max-age=20`;
        }
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
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}

export { loginUser, logoutUser };

// export default loginUser;