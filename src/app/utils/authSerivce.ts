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

        const authData = {
            authToken,
            restApiToken,
            userId,
            authId,
            issuedAt: Date.now(),
        };

        sessionStorage.setItem("auth", JSON.stringify(authData));

        return authData;
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
    sessionStorage.removeItem("auth");
    window.location.href = "/login";
}

export { loginUser, logoutUser };