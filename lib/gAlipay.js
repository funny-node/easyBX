const path = require('path')
const appDir = path.dirname(require.main.filename)
const cfgPath = path.join(appDir, 'bx.config.js')
const { startDate, endDate, zfbzdOptions } = require(cfgPath)
const getBills = require('zfbzd')

/**
* 根据配置文件，获取支付宝账单数据
* @return {Promise<Array<Object>>}
*/
function gAlipay() {
  return new Promise(async resolve => {
    zfbzdOptions.startDate = startDate
    zfbzdOptions.endDate = endDate
    
    const bills = await getBills(zfbzdOptions)
    resolve(bills)
  })
}

module.exports = gAlipay
