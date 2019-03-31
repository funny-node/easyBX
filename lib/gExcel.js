const path = require('path')
const appDir = path.dirname(require.main.filename)
const cfgPath = path.join(appDir, 'bx.config.js')
const { excels, ddkqOptions } = require(cfgPath)
const { getTimeOver } = require('ddkq')

/**
 * 根据配置文件，获取加班日期数据
 * @return {Array<Object>}
 */
function gExcel() {
  const list = getTimeOver(excels, ddkqOptions)
  return list
}

module.exports = gExcel
