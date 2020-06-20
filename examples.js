
let startTime = +new Date
const millis = () => `${+new Date - startTime}`



const myPromises = new Array(25).fill(0).map((x, i) => {
    return (input) => new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(millis(), `${(input || '') + i}`)
            resolve(`${(input || '') + i}`)
        }, 1000)
    })
})

const Sequencer = require('./sequencer')
const sequencer = new Sequencer()


//sequencer.thread(myPromises, { threads: 2 })

const sequence = () => new Promise((resolve, reject) => {
    const ss = new Sequencer()
    ss.sequence(myPromises).then((result) => {
        console.log(millis(), 'DONE:', result)
        resolve()
    }).catch((e) => {
        console.log(millis(), 'FAILED:', e)
        reject()
    })
    setTimeout(ss.finish, 5000) // Finish sequence prematurely on purpose
})
const thread = () => new Promise((resolve, reject) => {
    const ts = new Sequencer()
    ts.thread(myPromises, { threads: 4 }).then((result) => {
        console.log(millis(), 'DONE:', result)
        resolve()
    }).catch((e) => {
        console.log(millis(), 'FAILED:', e)
        reject()
    })
})
const all = () => new Promise((resolve, reject) => {
    const as = new Sequencer()
    as.all(myPromises).then((result) => {
        console.log(millis(), 'DONE:', result)
        resolve()
    }).catch((e) => {
        console.log(millis(), 'FAILED:', e)
        reject()
    })
})

sequencer.sequence([
    sequence,
    thread,
    all
]).then(() => {
    console.log('Finished')
}).catch(e => {
    throw e
})



const myPromises2 = [
    a => new Promise(resolve => {
        setTimeout(() => {
            const out = (a || '') + 'A'
            console.log(out)
            resolve(out)
        }, 1000)
    }),
    a => new Promise(resolve => {
        setTimeout(() => {
            const out = (a || '') + 'B'
            console.log(out)
            resolve(out)
        }, 1000)
    }),
    new Promise(resolve => {
        setTimeout(() => {
            const out = 'C'
            console.log(out)
            resolve(out)
        }, 1000)
    }),
    a => new Promise(resolve => {
        setTimeout(() => {
            const out = (a || '') + 'D'
            console.log(out)
            resolve(out)
        }, 1000)
    }),
    a => new Promise(resolve => {
        setTimeout(() => {
            const out = (a || '') + 'E'
            console.log(out)
            resolve(out)
        }, 1000)
    }),
    5,
    () => console.log('Yey, we got this far!'),
    'test',
    a => new Promise(resolve => {
        setTimeout(() => {
            const out = (a || '') + 'F'
            console.log(out)
            resolve(out)
        }, 1000)
    }),
]



// sequencer.sequence(myPromises2).then(output => {
//     console.log('Finished 2', output)
// }).catch(e => {
//     throw e
// })

// sequencer.thread(myPromises2, { threads: 1 }).then(output => {
//     console.log('Finished 2', output)
// }).catch(e => {
//     throw e
// })