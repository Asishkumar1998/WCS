import axios from '@/lib/axios';

export const getUser = async () => {
    const response = await axios.get('/user');
    return response.data;
};
