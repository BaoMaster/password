// export class ApiResult<T = any> {
//     status: number;
//     message?: string;
//     data: T;
//   }

var OkResult = class OkResult {
  constructor(message = null, data = null) {
    this.status = 200;
    this.message = message;
    this.data = data;
  }
};
module.exports.OkResult = OkResult;

var BadRequestResult = class BadRequestResult {
  constructor(message = null, data = null, status = null) {
    this.status = status || 400;
    this.message = message;
    this.data = data;
  }
};
module.exports.BadRequestResult = BadRequestResult;
