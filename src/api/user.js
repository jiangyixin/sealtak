import axios from '../utils/axios'


export function getRCToken () {
  return axios({
    url: `/users/token`,
    method: 'get'
  })
}

