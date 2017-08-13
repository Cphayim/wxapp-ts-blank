const colors = require('colors'); // 终端 log 彩色文字
const moment = require('moment'); // 日期格式化

module.exports = {
    getClock(timestamp) {
        return moment(timestamp).format('HH:mm:ss').yellow;
    },
    /**
     * 任务开始时输出
     * @param {string} taskName 任务名称
     * @param {number} currentTime 当前时间戳
     */
    start(taskName = 'default', currentTime = Date.now()) {
        taskName = taskName.cyan;
        console.log(`[${this.getClock(currentTime)}] Starting '${taskName}'...`);
    },
    /**
     * 任务结束时输出
     * @param {string} taskName 任务名称
     * @param {number} currentTime 当前时间戳
     * @param {number} time 耗时时间戳
     */
    finish(taskName = 'default', currentTime = Date.now(), time = 0) {
        // 如果大于等于 1000 毫秒 以秒显示
        if (time >= 1000) {
            time = (time / 1000).toFixed(1) + ' s';
        } else {
            time += ' ms';
        }
        taskName = taskName.cyan;
        time = time.magenta;
        console.log(`[${this.getClock(currentTime)}] Finished '${taskName}' after ${time}`);
    },
    watch(path = 'unknown', type = 'changed', taskName = 'default') {
        path = path.magenta;
        type = type.yellow;
        taskName = taskName.cyan;
        console.log(`[${this.getClock(Date.now())}] File ${path} was ${type}, running '${taskName}' ...`)
    }
}