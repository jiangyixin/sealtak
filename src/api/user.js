import axios from '../utils/axios'


export function getRCToken () {
  return axios({
    url: `/users/token`,
    method: 'get'
  })
}

export function getUserProfile() {
  return axios({
    url: `/users/36100/profile`,
    method: 'get'
  })
}

