import credentials from './credentials';

const endpoint_login = '/jwt/create/';
const endpoint_register = 'users/';

const login = (username, password) => credentials.post(endpoint_login, { username, password });
const register = (username, password) => credentials.post(endpoint_register, {username, password});

export default 
{
    login,
    register,
}