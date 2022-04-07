export default function sendSms(phone: string, code: string) {
  // const client = new Client({
  //   accessKeyId: process.env.SMS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.SMS_SECRET_ACCESS_KEY,
  //   region: 'cn-hangzhou',
  // });

  // const params = {
  //   PhoneNumbers: phone,
  //   SignName: '极客学院',
  //   TemplateCode: 'SMS_175875003',
  //   TemplateParam: `{"code": "${code}"}`,
  // };

  // return new Promise((resolve, reject) => {
  //   client.request('SendSms', params, (err, data) => {
  //     if (err) {
  //       reject(err);
  //     } else {
  //       resolve(data);
  //     }
  //   });
  // });
  console.log('sendSms', phone, code);
}
