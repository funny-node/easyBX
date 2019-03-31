const compare = require('./../util/compare')
const generateHTML = require('./../util/generate_html')

/**
 * 根据加班数据和消费数据，返回加班日指定时间内指定价格区间账单、指定时间内指定价格区间没消费的加班日、有重复消费的加班日，以及加班日账单 HTML
 * @param {Array<Object>} overtime_data 
 * @param {Array<Object>} cost_data 
 */
function gGenerate(overtime_data, cost_data) {
  // 将加班数据和消费数据进行对比，筛选出加班日的消费等数据
  let { 
    cost_data_overtime, 
    overtime_data_no_cost, 
    overtime_data_repeat_cost 
  } = compare(overtime_data, cost_data)

  // 生成可供打印的 HTML 代码
  let html = generateHTML(cost_data_overtime)

  return {
    cost_data_overtime,
    overtime_data_no_cost,
    overtime_data_repeat_cost,
    html
  }
}

module.exports = gGenerate
