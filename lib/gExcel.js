const path = require('path')
const appDir = path.dirname(require.main.filename)
const cfgPath = path.join(appDir, 'bx.config.js')
const { excels, ddkqOptions, startDate, endDate } = require(cfgPath)
const { getTimeOver } = require('ddkq')

/**
 * 根据配置文件，获取加班日期数据
 * @return {Array<Object>}
 */
function gExcel() {
  // 根据 excel 获取加班日数据
  let list = getTimeOver(excels, ddkqOptions)

  // 根据程序设定的报销时间区间进行过滤
  const startTimestamp = +new Date(`${startDate} 00:00`)
  const endTimestamp = +new Date(`${endDate} 24:00`)
  
  return list.filter(item => {
    return item.timestamp >= startTimestamp && item.timestamp <= endTimestamp
  })
}

module.exports = gExcel
