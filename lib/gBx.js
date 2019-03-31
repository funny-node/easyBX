const gExcel = require('./gExcel')
const gAlipay = require('./gAlipay')
const gGenerate = require('./gGenerate')

/**
 * 根据配置文件，获取加班日指定时间指定价格区间消费数据
 */
function gBx() {
  return new Promise(async resolve => {
    // 加班数据
    const overtime_data = gExcel()

    // 消费数据
    const cost_data = await gAlipay()

    // 根据加班数据和消费数据，返回加班日指定时间内指定价格区间账单、指定时间内指定价格区间没消费的加班日、有重复消费的加班日，以及加班日账单 HTML
    const data = gGenerate(overtime_data, cost_data)

    resolve(data)
  })
}

module.exports = gBx