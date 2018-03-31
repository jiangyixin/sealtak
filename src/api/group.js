import axios from '../utils/axios'


export function getMyGroups () {
  return axios({
    url: `/groups/list/self`,
    method: 'get'
  })
}

export function getGroupInfo(groupId) {
  return axios({
    url: `/groups/${groupId}/info`,
    method: 'get'
  })
}

export function getGroupMembers(groupId) {
  return axios({
    url: `/groups/${groupId}/members`,
    method: 'get'
  })
}

