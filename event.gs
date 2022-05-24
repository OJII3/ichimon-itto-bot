
/*
メッセージの種類
  answer, @Pass, @File:       次のindexを取得
  @Back, @Display, @Tip, @Check   今のindexをそのまま
  @Reset               indexは3(初期値)に設定
  @Menu, @ResetMenu    indexは使わない
*/

let An = ""; // answer 4  (), {}[]
let Aa1 = ""; // alternative 5  (), /
let Aa2 = ""; // addition 6 
let Ae = ""; // example sentence
let At = ""; // tips 7
let Tf = ""; // ⭕️❌ 8~
let Qu = ""; // question 3
let Qn = ""; // question number 0
let Qi = ""; // question img url 2
let Qo = 0;  // question option count 1


const messageEvent = () => {
  setAppearance();
  setFontSize();
  if (Umsg.match(/^@Appearance/)) {
    Ufile.appearance = Umsg.replace(/@Appearance:\s/,"");
    setAppearance();
    setSettingCangedMessage("外観モードを変更しました");
    sendReplyMessage();
    setUserFile(Uid, Ufile);
    return;
  }else if(Umsg.match(/^@FontSize:/)) {
    Ufile.fontSize = Umsg.replace(/^@FontSize:\s/,"")
    setFontSize();
    setSettingCangedMessage("文字サイズを変更しました");
    sendReplyMessage();
    setUserFile(Uid, Ufile);
    return;
  } else if (Umsg === "@Ranking") {
    setRankingMessage();
    sendReplyMessage();
    return;
  } else if (Umsg === "@Menu") {
    setMenuMessage();
    sendReplyMessage();
    return;
  } else if (Umsg.match(/^@ResetMenu$/)) {
    QaFile = getQaFile(Ufile.currentQaFile);
    if (!QaFile) {
      setTextMessage("存在しないファイルです");
      setMenuMessage();
      sendReplyMessage();
      return;
    }
    if (Umsg === "@ResetMenu") {
      const userIndex = getUserIndex(Uid);
      setResetMessage(...(getTfCount(userIndex)), Ufile.currentQaFile);
    } else {
      const userIndex = getUserIndex(Uid);
      Qn = Umsg.replace(/^@ToggleCheck:\s/,"");
      At = toggleTf(userIndex);
      setQaFile(Ufile.currentQaFile, QaFile);
      setTipsMessage("toggleCheck");
    }
    sendReplyMessage();
    return;
  } else {
    if (Umsg.match(/^@Test:/)) {
      const qaFileName = Umsg.replace(/^@Test:\s/,"");
      const testFileName = "Test_" + Uid;
      const qaFile = getQaFile(qaFileName);
      const testFile = shuffleArray(qaFile);
      setQaFile(testFileName, testFile);
      Ufile.currentQaFile = testFileName;
      Ufile.currentIndex = 3;
      setDescriptionMessage("ランダムモードのデータは"+ qaFileName +"のものに変更されました。");
    }
    const qaFileName = Umsg.match(/^@File:/)? Umsg.replace(/^@File:\s/,""): Ufile.currentQaFile;
    QaFile = getQaFile(qaFileName);
    if (!QaFile) {
      setTextMessage("存在しないファイルです");
      setMenuMessage();
      sendReplyMessage();
      return true;
    }
    const userIndex = getUserIndex(Uid);
    let currentIndex = 3;
    currentIndex = Umsg.match(/^@File/) ? 2 : Ufile.currentIndex;
    if(Umsg.match(/^[^@]|^@Pass$/)){
      An = ""+QaFile[currentIndex][4];
      Aa1 = ""+QaFile[currentIndex][5];
      Aa2 = ""+QaFile[currentIndex][6];
      Ae = ""+QaFile[currentIndex][7];
      At = QaFile[currentIndex][8] ? "@Tips: "+QaFile[currentIndex][0] : false;
      Tf = checkTf(currentIndex, userIndex);
      setAnswerMessage();
    }else if(Umsg.match(/^@File|^@Back$/)){
      setDescriptionMessage("" +QaFile[1][3]);
    } else if (Umsg.match(/^@Tips:\s/)) {
      Qn = Umsg.replace(/^@Tips:\s/,"");
      At = getTips();
      setTipsMessage("tips");
    } else if(Umsg.match(/^@ToggleCheck:/)) {
      const userIndex = getUserIndex(Uid);
      Qn = Umsg.replace(/^@ToggleCheck:\s/,"");
      At = toggleTf(userIndex);
      setQaFile(Ufile.currentQaFile, QaFile);
      setTipsMessage("toggleCheck");
    }
    const nextIndex = getNextIndex(currentIndex, userIndex);
    Qn = ""+QaFile[nextIndex][0];
    Qo =   +QaFile[nextIndex][1];
    Qi = ""+QaFile[nextIndex][2];
    Qu = ""+QaFile[nextIndex][3];
    setQuestionMessage();
    sendReplyMessage();
    Ufile.currentQaFile = qaFileName;
    Ufile.currentIndex = nextIndex;
    setUserFile(Uid, Ufile);
    setQaFile(qaFileName, QaFile);
  }
}

const checkTf = (currentIndex, userIndex) => {

  // (省略可), {ここは}[代替可], 別解(Aa1)は/で複数

  Tf = "❌";
  const answers = [
    An.replace(/\{|\} ?\[.*?\]/g, ''),
    An.replace(/\{.*?\} ?\[|\]/g, ''),
    ...(Aa1.match(/^.*?\/|\/.*?\/|\/.*?$|^.*$/g, '') || ['@Pass']).map(elem => elem.replace(/^\/|\/$/g, ''))
  ];
  
  for (const answer of answers) {
    const processedAnswer = answer
      .replace(/\s|　|～|〜|~|…|\.\.\./g, '')
      .replace(/‘|’/g,"'")
      .replace(/“|”/g,'"')
      .replace(/\\n/g,"")
      .replace(/₂/g,"2")
      .replace(/₃/g,"3")
      .replace(/₄/g,"4")
      .replace(/₅/g,"5")
      .replace(/₆/g,"6");
    const userProccessedAnswer = Umsg.match(/^[のをとがに]$|^[\s|　|～|〜|~|…|\.\.\.]*$/) ?
      Umsg :
      Umsg
        .replace(/\s|　|～|〜|~|…|\.\.\./g, '')
        .replace(/‘|’/g,"'")
        .replace(/“|”/g,'"')
        .replace(/\\n/g,"")
        .replace(/₂/g,"2")
        .replace(/₃/g,"3")
        .replace(/₄/g,"4")
        .replace(/₅/g,"5")
        .replace(/₆/g,"6")
        .replace(/^の|^を|^と|^が|^に/, '');
      
    if (processedAnswer.replace(/\(|\)/g, '').replace(/^の|^を|^と|^が|^に/, '') === userProccessedAnswer) {
      Tf = '⭕️';
    } else if (processedAnswer.replace(/\(.*?\)|（.*?）/g, '').replace(/^の|^を|^と|^が|^に/, '') === userProccessedAnswer) {
      Tf = '⭕️';
    }
  }

  if(Tf === "⭕️") {
    QaFile[currentIndex][userIndex] = "t";
    Ufile.score += 1;
  }
  return Tf;
}

const getTfCount = userIndex => {
  let tfCount = 0;
  for (let i = 3; i < QaFile.length; i++) {
    if (QaFile[i][userIndex] === "t") {
      tfCount += 1;
    }
  }
  return [tfCount, QaFile.length-3];
}

const getTips = () => {
  for (let i = 3; i < QaFile.length; i++) {
    if ((''+QaFile[i][0]) === (''+Qn)) {
      At = "" + QaFile[i][8];
      return At;
    }
  }
  return Ufile.currentQaFile + "には存在しない問題です。";
};

const toggleTf = userIndex => {
  for (let i = 3; i < QaFile.length; i++) {
    if (QaFile[i][0] === Qn) {
      Tf = "" + QaFile[i][userIndex] === "t" ? "f" : "t";
      QaFile[i][userIndex] = Tf;
      const check = Tf === "t" ? "⭕️" : "❌";
      return "問題番号 " + Qn + " の正誤を" + check + "へ変更しました"
    }
  }
  return Ufile.currentQaFile + "には存在しない問題です。";
};

const resetTf = userIndex => {
  for (let i = 3; i < QaFile.length; i++) {
    QaFile[i][userIndex] = "f";
  }
};

const getUserIndex = userId => {
  let userIndex = QaFile[2].indexOf(userId);
  if (userIndex === -1) {
    userIndex = QaFile[2].length;
    QaFile[2].push(userId);
    for(i=0; i<QaFile.length; i++){
      QaFile[i].push("f");
    }
  }
  return userIndex;
};

const getNextIndex = (currentIndex, userIndex) => {
  // この関数でリセットも担当する(リセット関数を実行)
  if (Umsg.match(/^[^@]|^@Pass$|^@File:/)) {
    //　今の位置から次を探す
    for (let i = currentIndex + 1; i < QaFile.length; i++) {
      if (QaFile[i][userIndex] === "f") {
        return i;
      }
    }
    // 見つからなければ初期位置から探す
    for (let i = 3; i < currentIndex + 1; i++) {
      if (QaFile[i][userIndex] === "f") {
        return i;
      }
    }
    // それでもなければリセットして初期位置
    resetTf(userIndex);
    return 3;
  } else if (Umsg.match(/^@Reset$/)) {
    resetTf(userIndex);
    return 3;
  } else { // @Back, @Tip
    return currentIndex;
  }
};
