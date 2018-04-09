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

export function applyFriend(form) {
  return axios({
    url: `/friends/apply`,
    method: 'post',
    data: {
      friendUserId: form.friendUserId,
      applyReason: form.applyReason,
      remark: form.remark,
      applyFrom: form.applyFrom,
      fromRemark: form.fromRemark
    }
  })
}

