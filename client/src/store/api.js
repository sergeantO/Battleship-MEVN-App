import axios from 'axios'
export default () => {
  return axios.create({
    baseURL: 'http://localhost:8081',
    headers: {
      'authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
}
