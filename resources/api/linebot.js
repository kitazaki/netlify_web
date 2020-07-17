'use strict';
const line = require('@line/bot-sdk');
const crypto = require('crypto');

const client = new line.Client({ channelAccessToken: process.env.ACCESSTOKEN });

exports.handler = (event, context) => {

    let signature = crypto.createHmac('sha256', process.env.CHANNELSECRET).update(event.body).digest('base64');
    let checkHeader = (event.headers || {})['X-Line-Signature'];
    console.log(event.headers);
    console.log(event.body);
    let body = JSON.parse(event.body);
    const events = body.events;
    console.log(events);

    if (signature === checkHeader) {
        events.forEach(async (event) => {

            let message;

            switch (event.type) {
                case "message":
                    message = messageFunc(event);
                    break;
                /*case "follow":
                    message = followFunc(event);
                    break;*/
                /*case "postback":
                    message = postbackFunc(event);
                    break;*/
            }

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
        });
    }

    else {
        console.log('署名認証エラー');
    }
};

const messageFunc = (e) => {

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
    } else if (userMessage == "おはよう") {
        message = {
            type: "text",
            text: "Good Morning!!"
        };
    }

    console.log(`メッセージ：${userMessage}`);

    return message;
};
