import axios from 'axios'
export default () => {
  const provider = axios.create({
    baseURL: 'http://localhost:8081'
  })
  return provider
}
