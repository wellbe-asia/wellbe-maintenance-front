import axios from 'axios'

axios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    // ** Hook
    if (error.code && error.code == 'ERR_NETWORK') {
      return Promise.reject({ data: null, message: 'Network Error' })
    }
    switch (error.response?.status) {
      case 404:
        return Promise.reject({ data: { message: 'Network Error' }, status: 404 })
      default:
        return Promise.reject(error.response)
    }
  }
)

export default axios
