import moment from "moment"
import "moment/locale/ja"

moment.locale("ja")

exports.handler = function (event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: moment().format()
  })
}
