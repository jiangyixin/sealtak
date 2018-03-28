let msgTypes = {
  private: RongIMLib.ConversationType.PRIVATE
}

/**
 *
 * @param msgType
 * @param targetId
 * @param timestrap // 默认传 null，若从头开始获取历史消息，请赋值为 0 ,timestrap = 0;
 * @param count // 每次获取的历史消息条数，范围 0-20 条，可以多次获取。
 * @param callback
 */
export function getHistoryMsg(msgType, targetId, timestrap = null, count = 20, callback) {
  let conversationtype = msgTypes[msgType]
  RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationtype, targetId, timestrap, count, {
    onSuccess: function(list, hasMsg) {
      callback(list, hasMsg)
    },
    onError: function(error) {
      console.log("GetHistoryMessages,errorcode:" + error);
    }
  });
}

export function senMsg(msgType, targetId, msg, callback) {
  let rcMsg = new RongIMLib.TextMessage(msg)
  let conversationtype = msgTypes[msgType]

  RongIMClient.getInstance().sendMessage(conversationtype, targetId, rcMsg, {
      onSuccess: function (message) {
        //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
        console.log("Send successfully");
        callback(message);
      },
      onError: function (errorCode, message) {
        let info = '';
        switch (errorCode) {
          case RongIMLib.ErrorCode.TIMEOUT:
            info = '超时';
            break;
          case RongIMLib.ErrorCode.UNKNOWN_ERROR:
            info = '未知错误';
            break;
          case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
            info = '在黑名单中，无法向对方发送消息';
            break;
          case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
            info = '不在讨论组中';
            break;
          case RongIMLib.ErrorCode.NOT_IN_GROUP:
            info = '不在群组中';
            break;
          case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
            info = '不在聊天室中';
            break;
          default :
            info = x;
            break;
        }
        console.log('发送失败:' + info);
      }
    }
  );
}
