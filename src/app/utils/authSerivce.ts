import axios from 'axios';
import { LEGACY_PORTAL_LOGIN_URL, buildApiUrl } from "@/constants/api";

const API_URL = buildApiUrl("token");
const SSO_EXCHANGE_URL = buildApiUrl("auth/exchange-customer-handoff");

type RawAuthResponse = {
    authToken?: string;
    userId?: string | number;
    authId?: string | number;
    token?: string;
    userAuth?: {
        authToken?: string;
        userId?: string | number;
        authId?: string | number;
        token?: string;
    };
};

const buildAuthData = (responseData: RawAuthResponse) => {
    const payload = responseData?.userAuth ?? responseData ?? {};
    const authData = {
        authToken: payload.authToken || "",
        restApiToken: payload.token || "",
        userId: payload.userId != null ? String(payload.userId) : "",
        authId: payload.authId != null ? String(payload.authId) : "",
        issuedAt: Date.now(),
    };

    if (!authData.authToken || !authData.restApiToken || !authData.userId) {
        throw new Error("Invalid authentication response");
    }

    return authData;
};

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

        const authData = buildAuthData(response.data);

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

const loginWithHandoffCode = async (code: string) => {
    if (!code) {
        throw new Error("Missing handoff code");
    }

    const response = await axios.post(
        SSO_EXCHANGE_URL,
        { code },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    const authData = buildAuthData(response.data);
    sessionStorage.setItem("auth", JSON.stringify(authData));
    return authData;
};

const logoutUser = async () => {
    console.log("Logging out...");
    sessionStorage.removeItem("auth");
    window.location.href = LEGACY_PORTAL_LOGIN_URL;
}

export { loginUser, loginWithHandoffCode, logoutUser };

