import rest from "restler"

const doGet = (path) => new Promise((resolve) => {
    rest.get(`https://api.scaleway.com${path}`, {
        headers: {
            "X-Auth-Token": global.config.authToken,
        },
    }).on("complete", (res)=>{resolve(res)})
})

export const getAllServers = () => {
    return doGet("/servers")
}

