import { createRequire } from 'module'
import MasterServer from './Server'

const create_require = createRequire(require('url').pathToFileURL(__filename).toString())
const http = create_require('http')

const { Server } = create_require('socket.io')

const port = 9001

const requestListener = (req: any, res: any) => {
    res.writeHead(200)
}

const server = http.createServer(requestListener)
const io = new Server(server, { cors: { origin: '*' } })

let master = new MasterServer(io, port)
master.initialize()

server.listen(port, () => {
    console.log(`Server is running on :${port}`)
})
