import axios from '../utils/axios'


export function getFriend () {
  return axios({
    url: `/friend`,
    method: 'get'
  })
}

