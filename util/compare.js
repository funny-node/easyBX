const path = require('path')
const appDir = path.dirname(require.main.filename)
const cfgPath = path.join(appDir, 'bx.config.js')
const { sorting = 'desc'} = require(cfgPath)

/**
 * 根据加班数据和消费数据，删选加班日消费数据、没消费数据的加班日以及有重复消费的加班日数据
 * @param {Array<Object>} overtime_data 
 * @param {Array<Object>} cost_data 
 */
function compare(overtime_data, cost_data) {
  // 加班日的消费记录
  let cost_data_overtime = []

  // 加班日但是没有消费记录的日期数据
  const overtime_data_no_cost = []

  // 有重复消费的加班日
  const overtime_data_repeat_cost = []

  // 遍历加班日，寻找该日消费记录
  overtime_data.forEach(item => {
    let { format } = item

    // 加班日 2019-02-16 这样的格式
    let overtime_date = format
    
    // 删选该日的消费数据（消费金额以及账单时间区间已经根据 zfbzd 过滤，所以删选当天的即可）
    let cost_data_overtime_all = cost_data.filter(cost_detail => {
      return cost_detail.date === overtime_date 
    })

    if (cost_data_overtime_all.length) {
      cost_data_overtime.push(...cost_data_overtime_all)
      // 该天的消费数据大于 2 条
      if (cost_data_overtime_all.length >= 2) {
        overtime_data_repeat_cost.push(overtime_date)
      }
    } else { // 该天加班了，但是没有消费
      overtime_data_no_cost.push(overtime_date)
    }
  })

  cost_data_overtime = reorder(cost_data_overtime, sorting)

  return {
    cost_data_overtime,
    overtime_data_no_cost,
    overtime_data_repeat_cost
  }
}

/**
 * 将数据根据日期升序或者降序排列
 * @param {Array} ret 
 * @param {String} sorting 
 */
function reorder(ret, sorting) {
  if (sorting === 'asc') { // 升序
    ret.sort((a, b) => a.timestamp - b.timestamp)
  } else if (sorting === 'desc') { // 降序
    ret.sort((a, b) => b.timestamp - a.timestamp)
  } else {
    throw new Error('参数错误')
  }
  
  return ret
}

module.exports = compare
