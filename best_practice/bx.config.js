module.exports = {
  // 必填项，配置 excels 文件名，文件名需要转为 'yyyy.mm' 形式
  // 建议 excels 文件直接放到根目录下
  excels: ['2018.11', '2018.12', '2019.01'],

  // ddkq API config 选项
  // https://github.com/funny-node/ddkq#api
  ddkqOptions: {
    // 设置几点开始即为加班，默认 20
    overtimeStart: 20, 
    // 加班结果返回按照时间正序
    sorting: 'asc' 
  },

  // 所有配置项都会传入 https://github.com/funny-node/zfbzd#getbillsoptions
  zfbzdOptions: {
    // 账单开始时间 格式 yyyy.mm.dd 
    startDate: '2018.11.28',
    // 账单结束时间 格式 yyyy.mm.dd 
    endDate: '2019.1.31',
    // 删选账单该日开始时间
    billStartTime: '16:00',
    // 设置账单价格区间结束值，即删选 [-Infinity, -8] 账单
    maxAmount: '-8',
    // 爬取账单翻页时间
    turnPageDelay: 60000,
    // 模拟点击时间选择器的时间间隔
    clickDatePickerDelay: 1500,
  }
}