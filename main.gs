/*
バージョンアップ時は特にいじる必要なし
SSIDS[9]まで追加可能

使い始めにアクセストークンのセット、アップロード、ユーザーIDsのセット
リロードの時間トリガー設定

setAccessToken() -> doGet()upload() * each sheet -> setUserIds()
*/

const P = PropertiesService.getScriptProperties();
const C = CacheService.getScriptCache();
const ACCESS_TOKEN = P.getProperty("ACCESS_TOKEN");
const MESSAGES = []; // up to 5 message objects


let Ufile = {};
let QaFile = [[]];
let REPLY_TOKEN = "replyToken";
let Uid = "userId";
let Umsg = "user message";
let BgColor = "#ffffff";
let FontColor1 = "#000000";
let FontColor2 = "#888888";
let LinkFontColor = "#7030ff";
let HeaderBgColor = "#00ccef";
let FontSize = "md";

const SSIDS = JSON.parse(P.getProperty("SSIDS"));

const doPost = e => {
  const event = JSON.parse(e.postData.contents).events[0];
  REPLY_TOKEN = event.replyToken || "no_replyToken"
  try {
    const s = event.source;
    const st = s.type;
    Uid = st === "group" ? s.groupId : st === "room" ? s.roomId : s.userId;
    Ufile = getUserFile(Uid);
    if (event.type === "message") {
      Umsg = event.message.text || "#no_text";
      messageEvent();
    } else if (event.type === "postback") {
      Umsg = event.postback.data || "#no_text";
      messageEvent();
    } else if (event.type.match(/^follow$|^join$/)) {
      setMenuMessage();
      setTextMessage("メニューから選んでタップして下さい。");
      sendReplyMessage();
    } else if (event.type.match(/^unfollow$|^leave$/)) {
      deleteUserFile(Uid);
    }
  } catch(error) {
    setTextMessage("エラーが発生しました。\n\n" + error );
    setTextMessage("一旦ブロックすることで直る可能性があります。それでも直らない場合はご連絡ください\nhttps://lin.ee/p1l9oXU");
    sendReplyMessage();
  }
};

const doGet = e => {
  const type = e.parameter.type || "form";
  if (type === "upload") {
    const sheet_number = e.parameter.sheet_number || "0";
    const ssId = SSIDS[+sheet_number];
    upload(ssId);
    return ContentService.createTextOutput(`Successfully uploaded data from sheet[${sheet_number}]`);
  } else if (type === "uploadSSIDS") {
    const new_sheet_names = uploadSSIDS();
    return ContentService.createTextOutput(`List of sheets is now like this:\n${new_sheet_names.join("\n")}`);
  } else if (type === "form") {
    const html = HtmlService.createTemplateFromFile("form").evaluate()
      .addMetaTag("viewport", "width=device-width, initial-scale=1")
      .setTitle("get request menu | ichimon-ittoubot");
      return html;
  } else {
    return ContentService.createTextOutput("Baaaaaad request!")
  }
};

const include = filename => HtmlService.createHtmlOutputFromFile(filename).getContent();

const getMyUrl = () => ContentService.createTextOutput(P.getProperty('my_url')).getContent();
