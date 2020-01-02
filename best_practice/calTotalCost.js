let sum = 0
document.querySelectorAll('.amount-pay').forEach(item => {
  let val = +item.innerHTML.replace(/-/, '').trim()
  sum += val >= 20 ? 20 : val 
})
console.log(sum)
