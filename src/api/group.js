import axios from '../utils/axios'


export function getMyGroups () {
  return axios({
    url: `/groups/list/self`,
    method: 'get'
  })
}

