import { create } from 'apisauce';

const apiClient = create
({
    baseURL: 'http://192.168.1.191:8000/auth'
});

export default apiClient;