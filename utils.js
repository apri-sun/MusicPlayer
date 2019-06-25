const e = function(selector) {
    return document.querySelector(selector)
}

const es = function(selector) {
    return document.querySelectorAll(selector)
}

const bindEvent = function(selector, event, callback) {
    let ele = e(selector)
    ele.addEventListener(event, callback)
}

const bindEvents = function(selector, event, callback) {
    let eles = es(selector)
    for(let i of eles) {
        i.addEventListener(event, callback)
    }
}

// 通过 id 获取到 name
const getMusicName = function(ele) {
    let s = e('source')
    var number = ele.firstElementChild.innerText
    s.dataset.musicId = number
    for(let i of musicList){
        if(i.id == number){
            return i.name
        }
    }
}

// 停止唱片滚动
const stopRotate = function() {
    var CD = e('.main-body-music-img')
    // 加上 img-rotate 类
    CD.classList.remove('img-rotate')
}

// 通过 name 改变当前播放的歌曲
const sourceChagne = function(name) {
    let s = e('source')
    let path = `static/music/${name}.mp3`
    s.src = path
    // 重新加载音乐,但是不会开始放
    let au = s.parentNode 
    au.load()
    // 重新加载 time
    musicTimeAdd()
    // 给 audio 加一个属性 autoplay ,使唱片开始播放
    au.setAttribute('autoplay','autoplay')
    // 进度条开始滚动
    resetScrollAutoGo()
    startScrollAutoGo()
    // 底部歌曲时间开始滚动
    timeReset()
    timeStart()
    // 让唱片转动起来
    startRotate()
    // 将播放按钮改为暂停按钮
    e('.start-pause').src = 'static/img/pause.png'
}

// 将唱片滚动起来
const startRotate = function() {
    var CD = e('.main-body-music-img')
    // 加上 img-rotate 类
    CD.classList.add('img-rotate')
}

// 获得当前正在播放的歌曲的序号
var getNumber = function() {
    var s = e('source')
    // 获得 id 
    return s.dataset.musicId
}

// 将序号向前推一位
const leftNumber = function(n, ml) {
    var n = parseInt(n)
    if(n - 1 == 0) {
        return ml
    } else {
        return n - 1
    }
}

// 将序号向后推一位
const rightNumber = function(n, ml) {
    var n = parseInt(n)
    if(n + 1 == ml + 1) {
        return 1
    } else {
        return n + 1
    }
}

// 将音乐总时间添加到进度条
const musicTimeAdd = function() {
    var s = e('source')
    var p = e('.end-time')
    // 开始加载这一次的前，先将之前的时间清空
    p.innerText = ''
    var id = s.dataset.musicId
    for(let i of musicList) {
        if(i.id == id) {
            var time = `${i.long}`
            p.insertAdjacentHTML("beforeend", time)
        }
    }
}

// 播放上一首
const goToForward = function() {
    // 获得当前正在播放的歌曲的序号
    let ml = musicList.length
    let n = getNumber()
    // 将序号向前推一位
    let ln = leftNumber(n, ml)
    let s = e('source')
    s.dataset.musicId = ln
    for(let i of musicList){
        if(i.id == ln){
            sourceChagne(i.name)
        }
    }
}

// 将分，秒的转化完成
var m = 0
var s = 0
var ms = 0
var time = 0

// 将时间格式化
var timer = function() {
    var str =[]
    ms += 200
    if(ms >= 1000) {
        ms = 0
        s += 1
    }
    if(s >= 60) {
        s = 0
        m += 1
    }
    str = `${addZero(m)}:${addZero(s)}`
    let st = e('.start-time')
    st.innerText = str
}

// 时间开始
var timeStart =function() {
    // 设置一个定时器 200ms 一次
    time = setInterval(timer, 200)
}

// 时间暂停
var timeStop = function() {
    clearInterval(time)
}

// 时间重置
var timeReset = function() {
    clearInterval(time);
    h=m=s=ms=0;
}

// 补零操作
const addZero = function(num) {
    if(num < 10) {
        return '0'+num
    } else {
        return ''+num
    }
}

// 将当前播放了的时间转换为秒数
const nowToSecond = function() {
    return m * 60 + s
}

//将总时间转换为秒数
const allToSecond = function() {
    var at = e('.end-time').innerText
    var s = at.split(':')
    var mt = parseInt(s[0] * 60)
    var st = parseInt(s[1])
    return mt + st
}

// 进度条每秒自动向前的长度
const secondGo = function() {
    // 获取到音乐总时间
    // 将时间转换为总秒数
    var ats = allToSecond()
    // 每 200ms 前进长度为 总长 * （0.2 / 音乐总时间）
    var sl = e('.progress-bar-scroll').offsetWidth
    var bl = e('.progress-bar-button').offsetWidth
    var al = sl - bl
    return al * (0.2 / ats)
}

var leftBar = 0
var sag = 0

// 让进度条向前移动
const scrollAutoGo = function() {
    var bar = e('.progress-bar-button')
    var forward = e('.progress-progress-forward')
    // 获取到每秒向前的长度
    var sg = secondGo()
    leftBar += sg
    bar.style.left = leftBar + 'px'
    forward.style.width = leftBar + 'px'
}

// 开始移动
const startScrollAutoGo = function() {
    sag = setInterval(scrollAutoGo, 200)
}

// 停止移动
const stopScrollAutoGo = function() {
    clearInterval(sag)
}

// 重置移动
const resetScrollAutoGo = function() {
    leftBar = 0
    clearInterval(sag)
}

// 通过传入当前长度，返回该跳转到的秒数
const jumpToSecond = function(long) {
    var sl = e('.progress-bar-scroll').offsetWidth
    var bl = e('.progress-bar-button').offsetWidth
    var al = sl - bl
    var at = allToSecond()
    leftBar = long/al*at
    return long/al*at
}

//播放下一首(列表循环)
const goToNext = function() {
    // 获得当前正在播放的歌曲的序号
    let ml = musicList.length
    let n = getNumber()
    // 将序号向后推一位
    let rn = rightNumber(n, ml)
    let s = e('source')
    s.dataset.musicId = rn
    for(let i of musicList){
        if(i.id == rn){
            sourceChagne(i.name)
        }
    }
}

// 播放当前歌曲（单曲循环）
const goToSelf = function() {
    // 获得当前正在播放的歌曲的序号
    let n = getNumber()
    let s = e('source')
    s.dataset.musicId = n
    for(let i of musicList){
        if(i.id == n){
            sourceChagne(i.name)
        }
    }
}

// 随机播放
const goToRadom = function(musicList) {
    var r = parseInt(Math.random() * 10)
    var n = musicList.length
    var m = r % n + 1
    let s = e('source')
    s.dataset.musicId = m
    for(let i of musicList){
        if(i.id == m){
            sourceChagne(i.name)
        }
    }
}

// 判断播放方式
const playWay = function() {
    var ele = e('.end-status').firstElementChild
    return ele.dataset.endStatus
}

// 当歌曲放完时的反应
const endStatus =function() {
    var au = e('audio')
    if(au.ended == true) {
        // 判断播放方式
        var num = playWay()
        if(num == 1){
            goToNext()
            console.log('1')
        }
        if(num == 2){
            goToSelf()
            console.log('2')
        }
        if(num == 3){
            goToNext()
            console.log('3')
        }
    }
}
