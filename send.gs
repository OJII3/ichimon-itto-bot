const setFlexMessage = (altText, container) => MESSAGES.push({
  type: "flex",
  altText: altText || "flex message",
  contents: container
});

const setTextMessage = text => MESSAGES.push({
  type: "text", text: text
});

const sendReplyMessage = (messages) => UrlFetchApp.fetch(
  'https://api.line.me/v2/bot/message/reply',
  {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: 'Bearer ' + ACCESS_TOKEN,
      muteHttpexeption: true
    },
    method: 'post',
    payload: JSON.stringify({ replyToken: REPLY_TOKEN, messages: messages ?? MESSAGES })
  }
);
