import axios from '../utils/axios'


export function getMyFriends (params) {
  return axios({
    url: `/friends`,
    method: 'get',
    params: {
      applyStatus: params.applyStatus
    }
  })
}

export function getFriendInfo (params) {
  return axios({
    url: `/users/${params.userId}/profile`,
    method: 'get',
    params: {
      groupId: params.groupId
    }
  })
}

