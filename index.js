#!/usr/bin/env node

const http = require('http')
const proxy = require('proxy')

const youtubeBlocker = (req, res) => {
    const hostname = (src => {
        const tmp = src.includes('://') ? (new URL(src)).hostname : src
        return tmp.split(':')[0]
    })(req.url)
    if (/.*(youtube|googlevideo)\.com$/.test(hostname)) {
        console.log(`request to "${hostname}" was blocked.`)
        res.writeHead(503);
        res.end()
        return true
    }
}

const server = proxy(http.createServer(), {
    shouldInterruptRequest: youtubeBlocker,
    shouldInterruptConnect: youtubeBlocker
})

server.listen(8888, () => {
    console.log(`HTTP(S) proxy server listening on port ${server.address().port}`)
})
