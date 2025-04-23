import {jwtDecode} from 'jwt-decode'

const GetUserId = () => {
    const token = sessionStorage.getItem('token')
    if (!token) {
        return null
    } 

    try {
        const decodedToken = jwtDecode(token)
        return decodedToken.id || decodedToken.userId 
    } catch (error) {
        console.error('failed to decode token', error)
        return null
    }
};

export default GetUserId;