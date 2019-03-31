const ejs = require('ejs')
const fs = require('fs')
const path = require('path')

/**
 * 根据 cost_data 生成消费 HTML
 */
module.exports = cost_data => {
  const bill_ejs = fs.readFileSync(path.join(__dirname, './../views/bill.ejs'), 'utf-8')
  const result_ejs = fs.readFileSync(path.join(__dirname, './../views/result.ejs'), 'utf-8')

  let html_table = ejs.render(bill_ejs, { cost_data })
  let html_result = ejs.render(result_ejs, { html_table })
  
  return html_result
} 
