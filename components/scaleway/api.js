import rest from "restler"

const doGet = (region, path) => new Promise((resolve) => {
    rest.get(`https://cp-${region}.scaleway.com${path}`, {
        headers: {
            "X-Auth-Token": global.config.authToken,
        },
    }).on("complete", (res)=>{resolve(res)})
})

export const getAllServers = (region) => {
    return doGet(region, "/servers")
}

