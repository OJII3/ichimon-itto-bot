
/*
問題ファイル　はシート名をキーにしてキャッシュに保存
ユーザーファイル　はユーザーIDをキーにしてキャッシュに保存

以外リロード用

問題データ名　は配列にしてssIdをキーにプロパティに保存
ユーザーID は配列にして"userIds"をキーにキャッシュに保存
*/

const setAppearance = () => {
  const appearance = Ufile.appearance || "light";
  if (appearance === "light") {
    BgColor = "#ffffff";
    HeaderBgColor = "#00ccef";
    FontColor1 = "#444444";
  } else if (appearance === "dark") {
    BgColor = "#303030";
    FontColor1 = "#ffffff";
    HeaderBgColor = "#001040";
  }
};

const setFontSize = () => {
  FontSize = Ufile.fontSize;
};

const upload = ssId => {
  const ss = SpreadsheetApp.openById(ssId);
  const sheets = ss.getSheets();
  const sheetNames = []; // qaFileNames
  for (const sheet of sheets) {
    const sheetName = sheet.getName();
    if (!sheetName.match(/^template$|\.ign$/)) {
      const qaFile = sheet.getDataRange().getValues();
      setQaFile(sheetName, qaFile);
      sheetNames.push(sheetName);
    }
  }
  // qaFileNames
  setQaFileNames(ssId, sheetNames);
};

const pp = () => P.setProperty('MAIN_SSID', '1OU1FSJYrw6M_5_cJmvE6ePOTkKpEHW5Ix2bkUG_5T4o');

const uploadSSIDS = () => {
  const ss_id = "1OU1FSJYrw6M_5_cJmvE6ePOTkKpEHW5Ix2bkUG_5T4o";
  const sheet_of_sheetsList = SpreadsheetApp.openById(ss_id).getSheetByName("sheetList");
  const values = sheet_of_sheetsList.getDataRange().getValues();
  const ssids = [];
  const sheet_names = [];
  for (const row of values) {
    if (row[0].match(/^https:\/\/docs/)) {
      ssids.push(row[1]);
      sheet_names.push(row[2]);
    }
  }
  P.setProperty("SSIDS", JSON.stringify(ssids));
  return sheet_names;
}

const ttt = () => console.log(P.getProperty("SSIDS"));

const reloadCache = () => {
  // ユーザーファイルのリロード
  const userIds = getUserIds();
  for (const userId of userIds) {
    if (userId !== "userId") {
      setUserFile(userId, getUserFile(userId));
      const testFile = C.get("Test_" + userId);
      if (testFile) {
        C.put("Test_" + userId, testFile, 21600);
      }
    }
  }
  setUserIds(userIds); // ユーザーIDリストもリロード
  // 問題データもリロード
  for (const ssId of SSIDS) {
    const qaFileNames = getQaFileNames(ssId);
    for (const qaFileName of qaFileNames) {
      setQaFile(qaFileName, getQaFile(qaFileName));
    }
  }
}

const getUserFile = userId => {
  // ユーザーのファイルが無かったら作成
  let userFileText = C.get(userId); // JSONパースしないままのデータ
  if (!userFileText) {
    userFile = {
      userName: "",
      mode: "qa",
      currentQaFile: "LEAP₁₀₀₁₋₁₁₀₀",
      currentIndex: 3,
      appearance: "light",
      fontSize: "md",
      score: 0
    };
    setUserFile(userId, userFile);
    const userIds = getUserIds();
    if (userIds.indexOf(userId) === -1) {
      userIds.push(userId);
      setUserIds(userIds);
    }
  } else {
    userFile = JSON.parse(userFileText);
  }
  return userFile;
};

const deleteUserFile = userId => {
  C.remove(userId);
  const userIds = getUserIds();
  const userIdIndex = userIds.indexOf(userId);
  if (userIdIndex !== -1) {
    userIds.splice(userIdIndex, 1);
    setUserIds(userIds);
  }
};

const deleteAllUserFiles = () => {
  const userIds = getUserIds();
  C.removeAll(userIds);
  setUserIds();
};

const setQaFileNames = (ssId, qaFileNames) => P.setProperty(ssId, JSON.stringify(qaFileNames));

const getQaFileNames = (ssId) => JSON.parse(P.getProperty(ssId));

const getQaFile = (qaFileName) => JSON.parse(C.get(qaFileName));

const setQaFile = (qaFileName, qaFile) => C.put(qaFileName, JSON.stringify(qaFile), 21600);

const setUserFile = (userId, userFile) => C.put(userId, JSON.stringify(userFile), 21600);

const getUserIds = () => JSON.parse(C.get("userIds"));

const setUserIds = (userIds) => C.put("userIds", JSON.stringify(userIds || ["userId"]), 21600);

const copyArray = (array) => JSON.parse(JSON.stringify(array));

const shuffleArray = (array) => {
  array = copyArray(array);
  for (let i = array.length - 1; i >= 3; i--) {
    const j = Math.floor(Math.random() * (i - 2)) + 3;
    // let temp = array[i];
    // array[i] = array[j];
    // array[j] = temp;
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array;
};

const getRanking = userId => {
  const userIds = getUserIds();
  const scores = userIds.map(userId => {
    const userFile = getUserFile(userId);
    return userFile.score || 0;
  });
  return scores.sort((a, b) => b - a);
};

const resetRankingScore = () => {
  const userIds = getUserIds();
  for (const userId of userIds) {
    const userFile = getUserFile(userId);
    userFile.score = 0;
    setUserFile(userId, userFile);
  }
};

const writeErrorLog = (error) => {
  const ssId = P.getProperty('MAIN_SSID');
  const worksheet = SpreadsheetApp.openById(ssId).getSheetByName('ErrorLog');
  worksheet.appendRow([new Date(), ''+error])
  return;
}

