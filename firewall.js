import fs from "fs"
import * as scaleway from "./components/scaleway/api.js"
const exec = require('child_process').exec;

let etcdPoweredIPs = []

const checkServers = async () => {
    const servers = (await scaleway.getAllServers()).servers

    const currentEtcdPoweredIPs = []

    for (let server of servers) {
        if (server.tags.indexOf(global.config.tag) !== -1) {
            server.private_ip && currentEtcdPoweredIPs.push(server.private_ip)
            server.public_ip && currentEtcdPoweredIPs.push(server.public_ip.address)
        }
    }

    if (currentEtcdPoweredIPs.toString() !== etcdPoweredIPs.toString()) {
        let rules = ""
        // allow
        for (let ip of currentEtcdPoweredIPs) {
            for (let port of global.config.ports) {
                rules += `### tuple ### allow any ${port} 0.0.0.0/0 any ${ip} in\n`
                rules += `-A ufw-user-input -p tcp --dport ${port} -s ${ip} -j ACCEPT\n`
                rules += `-A ufw-user-input -p udp --dport ${port} -s ${ip} -j DROP\n\n`
            }
        }

        // allow loopback
        for (let port of global.config.ports) {
            rules += `### tuple ### allow any ${port} 0.0.0.0/0 any 127.0.0.1 in\n`
            rules += `-A ufw-user-input -p tcp --dport ${port} -s 127.0.0.1 -j ACCEPT\n`
            rules += `-A ufw-user-input -p udp --dport ${port} -s 127.0.0.1 -j DROP\n\n`
        }

        // deny
        for (let port of global.config.ports) {
            rules += `### tuple ### deny any ${port} 0.0.0.0/0 any 0.0.0.0/0 in\n`
            rules += `-A ufw-user-input -p tcp --dport ${port} -j DROP\n`
            rules += `-A ufw-user-input -p udp --dport ${port} -j DROP\n\n`
        }


        etcdPoweredIPs = currentEtcdPoweredIPs
        const rulesFile = fs.readFileSync("/lib/ufw/user.rules", "utf8")
        const rulesLines = rulesFile.split("\n")

        const startLine = rulesLines.indexOf("### RULES ###")
        const endLine = rulesLines.indexOf("### END RULES ###")

        rulesLines.splice(startLine + 1, (endLine - startLine) - 1, rules)

        fs.writeFileSync("/lib/ufw/user.rules", rulesLines.join("\n"))
        exec("ufw reload", console.log)
        console.log("Firewall updated")
    }

}
setInterval(checkServers, 5000)
