# easybx

简化报销流程，可根据钉钉打卡记录获取加班日数据，爬取支付宝获取加班日支付宝消费数据，并生成账单

其实现原理可分为以下步骤：

1. 根据钉钉打卡表获取加班日期数据
2. 爬取支付宝账单，需设置账单起始日期、单日账单时间区间以及账单价格区间
3. 根据 1、2 两步骤获取的结果，筛选加班日指定账单时间区间以及账单价格区间的消费数据，并分析得到加班日消费数据
4. **数据需要肉眼查别是否是你需要的数据**

## Install

```bash
$ npm install easybx
```

## Usage

项目根目录下创建 `bx.config.js` 文件，该文件需要导出一个配置对象：

```js
module.exports = {
  sorting: 'desc',
  excels: [],
  ddkqOptions: {},
  zfbzdOptions: {}
}
```

一次性运行：

```js
const { gBx } = require('easybx')

;(async function() {
  let data = await gBx()
})()
```

程序更加可控的分阶段运行：

```js
const { gExcel, gAlipay, gGenerate } = require('easybx')

;(async function() {
  const overtime_data = gExcel()
  const cost_data = await gAlipay()
  const data = gGenerate(overtime_data, cost_data)
})()
```

## bx.config.js 配置项

### sorting

选填

* `sorting` `{String}` 可设置加班日消费数据（即 `cost_data_overtime` 数据）返回顺序
  * `'desc'` 默认值，默认时间倒序返回，生成的 HTML 也是根据时间倒序排列
  * `'asc'` 正序返回

### excels

**必填**

即 [ddqk.getTimeOver](https://github.com/funny-node/ddkq#gettimeoverexcels-config) 的 `excels` 选项配置，具体说明可以看 [这里](https://github.com/funny-node/ddkq#gettimeallexcels-config)

**注意 excels 时间区间应该包含了报销区间**，报销区间配置见 `zfbzdOptions`

### ddkqOptions

选填

即 [ddqk.getTimeOver](https://github.com/funny-node/ddkq#gettimeoverexcels-config) API 的 `config` 选项配置，具体配置项可以看 [这里](https://github.com/funny-node/ddkq#gettimeallexcels-config)，以及对于 `getTimeOver` 的一个 [额外的配置项](https://github.com/funny-node/ddkq#gettimeoverexcels-config)

### zfbzdOptions

**必填**

即 [zfbzd](https://github.com/funny-node/zfbzd#getbillsoptions) 的配置项

几个重要的配置：

* `zfbzdOptions` `{Object}`
  * `startDate` `{String}` 必填，报销开始时间区间，格式为 `yyyy.mm.dd`
  * `endDate` `{String}` 必填，报销结束时间区间，格式为 `yyyy.mm.dd`
  * `billStartTime` `{String}` 必填，单天账单报销开始区间（即会抓取该时间开始到 24:00 的账单）格式 `hh:mm`（默认报销结束时间 `24:00`，不需要手动设置）
  * `maxAmount` `{Number}` 必填，报销价格区间上限，即会抓取 `[-Infinity, maxAmount]` 价格区间的账单，即假设晚饭最低消费 maxAmount

**`zfbzdOptions.startDate` 和 `zfbzdOptions.endDate` 即该次报销的时间区间，注意该时间区间应该是 `excels` 所包含的时间区间的子集**

## API

### gExcel

根据 `bx.config.js` 配置，获取加班日数据

* return: `{Array<Object>}`

返回数据格式同 [ddkq](https://github.com/funny-node/ddkq#gettimeallexcels-config)

### gAlipay

根据 `bx.config.js` 配置，获取指定时间区间、指定单日时间区间、指定价格区间的账单信息

* return: `<Promise<Array<Object>>>`

返回数据格式同 [zfbzd](https://github.com/funny-node/zfbzd#getbillsoptions)

### gGenerate(overtime_data, cost_data)

根据加班日数据和支付宝消费数据，分析得到加班日消费数据、没消费数据的加班日数组、有重复消费数据的加班日数组以及加班日消费清单的 HTML 字符串

* `overtime_data` `{Array<Object>}` 加班数据，即 `gExcel` 的返回值
* `cost_data` `{Array<Object>}` 消费数据，即 `gAlipay` 返回值
* return: `{Object}` 
  * `cost_data_overtime` `{Array}` 加班日消费数据
  * `overtime_data_no_cost` `{Array}` 没消费数据的加班日数组
  * `overtime_data_repeat_cost` `{Array}` 有重复消费数据的加班日数组
  * `html` `{String}` 加班日消费清单的 HTML 字符串

### gBx

综合了 `gExcel`、`gAlipay` 以及 `gGenerate`

* return: `<Promise<Object>>` 

返回数据格式同 `gGenerate` API

## 最佳实践

根据我自己的使用经验，整理了一套用于报销的 [最佳实践](https://github.com/funny-node/easybx/tree/master/best_practice)，可直接拿来使用

需要修改的部分为：

1. `excels` **最佳实践建议放在根目录下**，数组值和 excel 文件名一一对应，格式 `yyyy.mm`
2. 修改 `zfbzdOptions.startDate` 和 `zfbzdOptions.endDate`，即该次报销区间（注意报销区间应该是 `excels` 时间区间的子集）
3. 修改 `zfbzdOptions.billStartTime`，默认返回全部时间段账单，修改该值可以缩小返回账单时间段，我将其设置为 16:00，即假设晚饭的消费时间不会早于 16:00
4. 修改 `zfbzdOptions.maxAmount`，设置账单价格区间上限，默认会返回全部价格的账单。我将其设置为 -8，即假设晚饭的消费不会少于 8 块

That's easy! 其他使用最佳实践提供的默认值即可

最后运行 run.js 即可

## 局限性

1. 可能有加班日但是并没有获取到消费信息，程序会在控制台打印这些日期
2. 可能在加班日会有重复消费，程序会在控制台打印这些日期
3. 有些加班日的消费数据可能并不是你需要的数据，需要手动判断
4. 无法解决第二天凌晨才点晚饭的情况，因为账单只会筛选当天

## thanks to puppeteer

* [Try Puppeteer](https://try-puppeteer.appspot.com/)
* [文档](https://pptr.dev/) / [中文文档](https://zhaoqize.github.io/puppeteer-api-zh_CN/)

## License

MIT
