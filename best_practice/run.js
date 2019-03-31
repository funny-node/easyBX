const { gExcel, gAlipay, gGenerate } = require('easybx')
const fs = require('fs')

;(async function() {
  const overtime_data = gExcel()
  fs.writeFileSync(path.join(__dirname, './dingding.json'), JSON.stringify(overtime_data))
  console.log('加班日数据解析完毕，保存在 dingding.json 文件中')
  console.log('--------------------')
  
  const cost_data = await gAlipay()
  fs.writeFileSync(path.join(__dirname, './alipay.json'), JSON.stringify(cost_data))
  console.log('指定时间 & 指定单日消费时间 & 指定价格区间支付宝账单获取完毕，保存在 alipay.json 文件中')
  console.log('--------------------')

  const { overtime_data_no_cost, overtime_data_repeat_cost, html } = gGenerate(overtime_data, cost_data)
  console.log('加班数据结合支付宝账单数据分析完毕！')
  console.log('以下日子你加班了但是支付宝没有消费记录：')
  console.log(overtime_data_no_cost)
  console.log('--------------------')
  console.log('以下加班日你有重复的消费记录：')
  console.log(overtime_data_repeat_cost)
  console.log('--------------------')
  fs.writeFileSync(path.join(__filename, './result.html'), html)
  console.log('生成账单 HTML 完成，保存在 result.html 文件中')
  console.log('--------------------')
  console.log('程序成功运行完毕！')
})()