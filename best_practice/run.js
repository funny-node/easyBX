const { gExcel, gAlipay, gGenerate } = require('easybx')
const { 
  startDate, 
  endDate, 
  zfbzdOptions: {
    billStartTime,
    maxAmount,
  }
} = require('./bx.config.js')
const fs = require('fs')
const path = require('path')

;(async function() {
  const overtime_data = gExcel()
  fs.writeFileSync(path.join(__dirname, './dingding.json'), JSON.stringify(overtime_data))
  console.log(`报销区间 [${startDate}, ${endDate}] 的加班日统计完毕，保存在 dingding.json 文件中！`)
  console.log('------------------------------------------------------------')
  
  const cost_data = await gAlipay()
  fs.writeFileSync(path.join(__dirname, './alipay.json'), JSON.stringify(cost_data))
  console.log(`报销区间 [${startDate}, ${endDate}] & 单日时间区间 [${billStartTime}, 24:00] & 指定价格区间 [-Infinity, ${maxAmount}] 支付宝账单获取完毕，保存在 alipay.json 文件中！`)
  console.log('------------------------------------------------------------')

  const { overtime_data_no_cost, overtime_data_repeat_cost, html } = gGenerate(overtime_data, cost_data)
  console.log('以下日子你加班了但是支付宝没有消费记录：')
  console.log(overtime_data_no_cost)
  console.log('------------------------------------------------------------')
  console.log('以下加班日你有重复的消费记录：')
  console.log(overtime_data_repeat_cost)
  console.log('------------------------------------------------------------')
  fs.writeFileSync(path.join(__dirname, './result.html'), html)
  console.log('生成账单 HTML 完成，保存在 result.html 文件中')
  console.log('------------------------------------------------------------')
  console.log('程序成功运行完毕！')
})()