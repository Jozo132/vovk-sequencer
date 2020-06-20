// @ts-check
'use strict'

const shuffle = input => { let output = input.map(x => x); let currentIndex = output.length, temporaryValue, randomIndex; while (currentIndex !== 0) { randomIndex = Math.floor(Math.random() * currentIndex); currentIndex -= 1; temporaryValue = output[currentIndex]; output[currentIndex] = output[randomIndex]; output[randomIndex] = temporaryValue; } return output; }
//const uniqueId = length => { const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; const L = length > 0 ? length : 8; let output = ''; for (let i = 0; i < L; i++) output += characters.charAt(Math.floor(Math.random() * characters.length)); return output; }

const isPromise = p => p && Object.prototype.toString.call(p) === "[object Promise]"
const isFunction = f => f && {}.toString.call(f) === '[object Function]'

/**@param {any} p
 * @param {any} [input]
 */
const solvePromise = (p, input) => Promise.resolve(isFunction(p) ? p(input) : p)

class Sequencer {
    constructor() {
        this.stopped = false;
    }
    /**@param {any[]} promises 
     * @param {{ input?: any; rejectStop?: boolean; random?: boolean }} [options]
     */
    sequence = (promises, options) => new Promise((resolve, reject) => {
        const { input, rejectStop, random } = options || {}
        if (random) promises = shuffle(promises)
        const len = promises.length
        let i = 0
        const RESULTS = new Array(len).fill(undefined)
        const solveNext = input => {
            if (i >= len || this.stopped) {
                resolve(RESULTS)
                return
            }
            const index = i;
            solvePromise(promises[i++], input).then(res => {
                RESULTS[index] = res
                solveNext(res)
            }).catch(e => {
                RESULTS[index] = e
                if (rejectStop) reject(e); else solveNext(e)
            })
        }
        solveNext(input)
    })
    /**@param {any[]} promises
     * @param {{ threads: number; input?: any; rejectStop?: boolean; random?: boolean; }} [options]
     */
    thread = (promises, options) => new Promise((resolve, reject) => {
        const { threads, input, rejectStop, random } = options || {}
        if (random) promises = shuffle(promises)
        const len = promises.length
        let i = 0
        const RESULTS = new Array(len).fill(undefined)
        const maxThreads = threads > 0 ? threads : 1
        let runningThreads = 0
        const solveNext = input => {
            if (i >= len && runningThreads === 0 || this.stopped) {
                resolve(RESULTS)
                return
            }
            while (runningThreads < maxThreads && i < len) {
                runningThreads++;
                const index = i
                solvePromise(promises[i++], input).then(res => {
                    runningThreads--;
                    RESULTS[index] = res
                    solveNext(res)
                }).catch(e => {
                    runningThreads--;
                    RESULTS[index] = e
                    if (rejectStop) reject(e); else solveNext(e)
                })
            }
        }
        solveNext(input)
    })
    /**@param {any[]} promises 
     * @param {{ input?: any }} [options]
     */
    all = (promises, options) => {
        const { input } = options || {}
        if (promises.length > 0 || this.stopped) {
            const working = promises.map(p => solvePromise(p, input))
            return Promise.all(working)
        } else
            return new Promise(x => x)
    }
    finish = () => this.stopped = true
}

module.exports = Sequencer