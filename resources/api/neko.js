'use strict';
const line = require('@line/bot-sdk');
const crypto = require('crypto');
const Gyazo = require('gyazo-api');
const gyazoclient = new Gyazo('77da4f4d21966ad1ab497efb11406122094bbf245292d7a886cd1f60e13786a6');

const client = new line.Client({ channelAccessToken: process.env.ACCESSTOKEN });

exports.handler = (event, context) => {

    let signature = crypto.createHmac('sha256', process.env.CHANNELSECRET).update(event.body).digest('base64');
    let checkHeader = (event.headers || {})['x-line-signature'];
    console.log(event.headers);
    console.log(event.body);
    let body = JSON.parse(event.body);
    const events = body.events;
    console.log(events);

    if (signature === checkHeader) {
//    if (signature !== checkHeader) {
        events.forEach(async (event) => {

            let message;

            switch (event.type) {
                case "message":
                    message = await messageFunc(event);
                    console.log(message);
                    client.replyMessage(body.events[0].replyToken, message).then((response) => {
                      let lambdaResponse = {
                        statusCode: 200,
                        headers: { "X-Line-Status": "OK" },
                        body: '{"result":"completed"}'
                      };
                      context.succeed(lambdaResponse);
                    }).catch((err) => console.log(err));
                    break;
                /*case "follow":
                    message = followFunc(event);
                    break;*/
                /*case "postback":
                    message = postbackFunc(event);
                    break;*/
            }
/*
            if (message != undefined) {
                client.replyMessage(body.events[0].replyToken, message)
                    .then((response) => {
                        let lambdaResponse = {
                            statusCode: 200,
                            headers: { "X-Line-Status": "OK" },
                            body: '{"result":"completed"}'
                        };
                        context.succeed(lambdaResponse);
                    }).catch((err) => console.log(err));
            }
*/
        });
    }

    else {
        console.log('署名認証エラー');
    }
};

const messageFunc = async (e) => {

    if (e.message.type != "text") {
        console.log("テキストではないメッセージが送られてきました");
        return;
    }

    const userMessage = e.message.text;

    let message;
    message = {
        type: "text",
        text: userMessage
    };

    if (userMessage == "こんにちは") {
        message = {
            type: "text",
            text: "Hello World"
        };
        return message;
    } else if (userMessage == "おはよう") {
        message = {
            type: "text",
            text: "Good Morning!!"
        };
        return message;
    } else if (userMessage == "え") {
        message = { type: "image", originalContentUrl: "https://i.gyazo.com/c837f8892589d7120c6a74a6c9441c4e.jpg", previewImageUrl: "https://i.gyazo.com/c837f8892589d7120c6a74a6c9441c4e.jpg" };
        console.log(message);
        return message;
    } else if (userMessage == "ねこ") {
        await gyazoclient.list().then((res) => {
          const gyazoimgUrl = res.data[0].url;
          console.log(gyazoimgUrl);
          message = { type: "image", originalContentUrl: gyazoimgUrl, previewImageUrl: gyazoimgUrl };
          console.log(message);
        }).catch((err) => {
          console.log(err);
          message = {
            type: "text",
            text: "Fail"
          };
        });
        return message;
    } else {
        console.log(`メッセージ：${userMessage}`);
        return message;
    }
};
