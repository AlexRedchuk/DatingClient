import axios from "axios";

const datingBase = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL
})

export default datingBase;