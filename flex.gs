
const bubbleSize = "mega";

const searchBox = text => `https://www.google.com/search?q=${Utilities.base64Encode(text.replace(/\s|　|\\n|(|)|[|]|-|/g, "%20").replace(/≒|cf\.|>|"|'|`/g, ""))}`;

const messageAction = (text, label) => {
  const output = {
    type: 'action',
    action: {
      type: 'message',
      text: text,
    }
  };
  label ? output.action.label = label : '';
  return output;
};

const setRankingMessage = () => {
  const ranking = getRanking();
  const index = ranking.indexOf(Ufile.score || 0);
  const rankingTexts = [];

  for (let i = 0; i <= 4; i++) {
    rankingTexts.push({
      type: "text",
      text: `${i + 1}位 ${+ranking[i] || 0}問`
    });
    rankingTexts[i].text += i === index ? " あなた" : " ***";
  }
  const container = {
    type: "bubble",
    size: "kilo",
    header: {
      type: "box",
      layout: "vertical",
      backgroundColor: HeaderBgColor,
      contents: [{
        type: "text",
        text: " ランキング",
        color: "#ffffff",
        weight: "bold"
      }]
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [{
        type: "text",
        text: "月間正解数ランキング"
      }, ...rankingTexts, {
        type: "text",
        text: `あなたの順位: ${index + 1}位`
      }]
    }
  };
  MESSAGES.push({
    type: "flex",
    altText: "ランキング",
    contents: container,
    quickReply: {
      items: [
        messageAction('@Back', '問題に戻る'),
        messageAction('@Menu', 'メニュー')
      ]
    }
  });
};

const setTipsMessage = type => {
  const container = {
    type: "bubble",
    size: bubbleSize,
    body: {
      type: "box",
      layout: "vertical",
      backgroundColor: BgColor,
      spacing: "md",
      contents: [
        {
          type: "text",
          text: type === "tips" ? `${Qn} 解説` : type === "toggleCheck" ? `${Qn} 変更` : Qn,
          color: FontColor2,
          size: "xs",
          weight: "bold"
        },
        {
          type: "text",
          text: At.replace(/\\n/g, "\n"),
          color: FontColor1,
          size: "sm",
          wrap: true,
          action: {
            type: "postback",
            data: "@Back",
            displayText: At.replace(/\\n/g, "\n")
          }
        }
      ]
    }
  };
  MESSAGES.push({
    type: "flex",
    altText: "解説",
    contents: container,
    quickReply: {
      items: [
        messageAction('@Back', '問題に戻る'),
        messageAction('@Menu', 'メニュー')
      ]
    }
  })
};

const setSettingCangedMessage = (text = "設定を変更しました") => {
  const container = {
    type: "bubble",
    size: bubbleSize,
    body: {
      type: "box",
      layout: "vertical",
      backgroundColor: BgColor,
      contents: [{
        type: "text",
        text: text,
        color: FontColor1,
        size: FontSize,
        wrap: true
      }]
    }
  }
  MESSAGES.push({
    type: "flex",
    altText: text,
    contents: container,
    quickReply: {
      items: [
        messageAction('@Back', '問題に戻る'),
        messageAction('@Menu', 'メニュー')
      ]
    }
  })
}

const setQuestionMessage = () => {
  const container = {
    type: "bubble",
    size: bubbleSize,
    hero: {
      type: "image",
      url: Qi,
      size: "full",
      aspectMode: "fit",
      aspectRatio: "3:2",
      margin: "none",
      action: {
        type: "uri",
        uri: Qi
      }
    },
    body: {
      type: "box",
      layout: "horizontal",
      backgroundColor: BgColor,
      paddingAll: "xl",
      contents: [
        {
          flex: 0,
          type: "text",
          text: `${Qn} `,
          size: "xs",
          weight: "bold",
          gravity: "center",
          color: FontColor2,
          action: {
            type: "message",
            text: `@ToggleCheck: ${Qn}`
          }
        },
        {
          type: "box",
          layout: "vertical",
          contents: []
        }
      ]
    }
  };

  if (!Qi) {
    delete container.hero
  }
  if (Qu) {
    container.body.contents[1].contents.push({
      type: "text",
      text: ` ${Qu.replace(/\\n/g, "\n")}`,
      size: FontSize,
      wrap: true,
      color: FontColor1,
      action: {
        type: "uri",
        uri: ""+searchBox(Qu)
      }
    })
  }
  if (Qo) {
    const options = {
      type: "box",
      layout: "horizontal",
      contents: []
    };
    for (let i = 0; i < Qo; i++) {
      options.contents.push({
        type: "text",
        text: "" + (i + 1),
        size: "sm",
        color: LinkFontColor,
        align: "center",
        action: {
          type: "message",
          text: "" + (i + 1)
        }
      })
    }
    container.body.contents[1].contents.push(options);
  }

  MESSAGES.push({
    type: "flex",
    altText: `問${Qn} ${Qu.replace(/\\n/g, " ")}`,
    contents: container,
    quickReply: {
      items: [
        messageAction('@Pass', 'パス'),
        messageAction('@ResetMenu', 'リセット'),
        messageAction('@Menu', 'メニュー'),
        messageAction('@Pass', 'パス')
      ]
    }
  });
};

const setAnswerMessage = () => {
  An = !An || An === "" ? "解答データがありません" : An;
  Aa1 = Aa1 ? ` [${Aa1}]` : "";
  const container = {
    type: "bubble",
    size: bubbleSize,
    body: {
      type: "box",
      layout: "vertical",
      backgroundColor: BgColor,
      paddingAll: "xl",
      contents: [{
        type: "text",
        text: `${Tf} ${An.replace(/\{|\}/g, "").replace(/\\n/g, "\n")}${Aa1.replace(/\\n/g, '\n')}`,
        size: FontSize,
        color: "#ff0055",
        wrap: true,
         action: {
           type: "postback",
           data: "@Back",
           displayText: searchBox(An.replace(/\{|\}/g, "") +Aa1)
        }
      }]
    }
  };

  if (Aa2) {
    container.body.contents.push({
      type: "text",
      text: Aa2.replace(/\\n/g, "\n"),
      size: "sm",
      wrap: true,
      color: FontColor1,
      action: {
         type: "postback",
         data: "@Back",
         displayText: searchBox(Aa2)
      }
    });
  }
  if (Ae) {
    container.body.contents.push({
      type: "text",
      text: Ae.replace(/\\n/g, "\n"),
      size: "sm",
      wrap: true,
      color: FontColor1,
      action: {
         type: "postback",
         data: "@Back",
         dislayText: searchBox(Ae)
      }
    });
  }
  if (At) {
    container.body.contents.push({
      type: "text",
      text: "解説",
      size: "sm",
      color: LinkFontColor,
      align: "end",
      action: {
        type: "message",
        text: At
      }
    });
  }
  setFlexMessage(Tf, container)
}

const buttonShape = (labal, text_or_uri = labal, type = "postback", data = text_or_uri) => {
  const obj = {
    type: "box",
    layout: "vertical",
    cornerRadius: "xl",
    backgroundColor: BgColor,
    borderColor: FontColor1,
    borderWidth: "normal",
    paddingAll: "xs",
    contents: [{
      type: "text",
      text: labal,
      color: FontColor1,
      size: FontSize,
      align: "center",
      gravity: "center",
      action: {
        type: type === "uri" ? "uri" : "postback",
        uri: text_or_uri,
        displayText: text_or_uri,
        data: data
      }
    }]
  };
  if (type === "uri") {
    delete obj.contents[0].action.data
    delete obj.contents[0].action.displayText
  } else {
    delete obj.contents[0].action.uri
  }
  return obj;
};

const setMenuMessage = () => {
  const container = {
    type: "carousel",
    contents: []
  };
  for (let i = 0; i < SSIDS.length; i++) {
    const qaFileNames = getQaFileNames(SSIDS[i]);
    const qaFiles = [];
    for (const qaFileName of qaFileNames) {
      qaFiles.push({
        type: "text",
        text: qaFileName,
        color: LinkFontColor,
        size: FontSize,
        action: {
          type: "message",
          text: `@File: ${qaFileName}`
        }
      });
    }
    container.contents.push({
      type: "bubble",
      size: "kilo",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: HeaderBgColor,
        contents: [{
          type: "text",
          text: `メニュー${i + 1}`,
          weight: "bold",
          color: "#ffffff",
          size: FontSize
        }]
      },
      body: {
        type: "box",
        layout: "vertical",
        backgroundColor: BgColor,
        contents: qaFiles
      }
    });
  }
  container.contents.push({
    type: "bubble",
    size: "kilo",
    header: {
      type: "box",
      layout: "vertical",
      backgroundColor: HeaderBgColor,
      contents: [{
        type: "text",
        text: "その他",
        size: FontSize,
        weight: "bold",
        color: "#ffffff"
      }]
    },
    body: {
      type: "box",
      layout: "vertical",
      backgroundColor: BgColor,
      spacing: "sm",
      contents: [
        {
          type: "text",
          text: "外観モード",
          size: "xs",
          color: FontColor2
        },
        {
          type: "box",
          layout: "horizontal",
          spacing: "sm",
          contents: [
            {
              type: "box",
              layout: "vertical",
              cornerRadius: "xl",
              backgroundColor: "#ffffff",
              borderColor: FontColor1,
              borderWidth: "normal",
              paddingAll: "xs",
              contents: [{
                type: "text",
                text: "ライト",
                color: "#303030",
                size: FontSize,
                align: "center",
                gravity: "center",
                action: {
                  type: "message",
                  text: "@Appearance: light"
                }
              }]
            },
            {
              type: "box",
              layout: "vertical",
              cornerRadius: "xl",
              backgroundColor: "#303030",
              borderColor: FontColor1,
              borderWidth: "normal",
              paddingAll: "xs",
              contents: [{
                type: "text",
                text: "ダーク",
                color: "#ffffff",
                size: FontSize,
                align: "center",
                gravity: "center",
                action: {
                  type: "message",
                  text: "@Appearance: dark"
                }
              }]
            }
          ]
        },
        {
          type: "text",
          text: "ランダムモード",
          size: "xs",
          color: FontColor2
        },
        {
          ...buttonShape("再開する", "@File: Test_" + Uid)
        },
        {
          type: "text",
          text: "暗算トレーニング",
          size: "xs",
          color: FontColor2
        },
        buttonShape("開く", "https://liff.line.me/1656132008-Zdna4EqE", "uri"),
        {
          type: "text",
          text: "利用状況",
          color: FontColor2,
          size: "xs"
        },
        buttonShape("ランキングを表示", "@Ranking"),
        {
          type: "text",
          text: "文字サイズ",
          color: FontColor2,
          size: "xs",
        },
        {
          type: "box",
          layout: "horizontal",
          spacing: "sm",
          contents: [
            {
              ...buttonShape("極小", "@FontSize: xs")
            },
            {
              ...buttonShape("小", "@FontSize: sm")
            },
            {
              ...buttonShape("中", "@FontSize: md")
            },
            {
              ...buttonShape("大", "@FontSize: lg")
            }
          ]
        }
      ]
    }
  });
  MESSAGES.push({
    type: "flex",
    altText: "メニュー",
    contents: container,
    quickReply: {
      items: [messageAction('@Back', '問題に戻る')]
    }
  });
};

const setDescriptionMessage = description => {
  const container = {
    type: "bubble",
    size: bubbleSize,
    body: {
      type: "box",
      layout: "vertical",
      backgroundColor: BgColor,
      contents: []
    }
  };
  container.body.contents.push({
    type: "text",
    text: description.replace(/\\n/g, "\n"),
    size: "sm",
    color: FontColor1,
    wrap: true
  });
  setFlexMessage(description.replace(/\\n/g, " "), container);
};

const setResetMessage = (tfCount, fullCount, currentFileName) => {
  const contents = {
    type: "flex",
    altText: "正誤記録をリセットしますか？",
    contents: {
      type: "bubble",
      size: "kilo",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: HeaderBgColor,
        contents: [{
          type: "text",
          text: "リセットメニュー",
          weight: "bold",
          color: "#ffffff"
        }]
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        backgroundColor: BgColor,
        contents: [
          {
            type: "text",
            text: currentFileName,
            color: FontColor1,
            size: "sm"
          },
          {
            type: "text",
            text: "正誤記録をリセットしますか？",
            color: FontColor1,
            size: "sm"
          },
          {
            type: "text",
            text: `現在の正解数　${tfCount}問/${fullCount}問`,
            color: FontColor1,
            size: "sm"
          }
        ]
      }
    },
    quickReply: {
      items: [
        messageAction('@Back', 'いいえ'),
        messageAction('@Reset', 'はい'),
        messageAction(`@Test: ${Ufile.currentQaFile}`, 'ランダムモード')
      ]
    }
  };
  if (Ufile.currentQaFile === `Test_${Uid}`) {
    contents.quickReply.items.splice(2, 1);
  }
  MESSAGES.push(contents);
};
