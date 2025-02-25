import axios from 'axios';
export default axios.create({
     baseURL: process.env.NODE_ENV === 'production' ? '' : `http://localhost/backend-inv/public/api/`
})