# scw-update-firewall
A simple Node.js script that can be used as a service on a Debian-based Scaleway server to update the firewall.

scw-update-firewall uses the API to fetch all servers and filters a specific tag, only servers with this tag will be able to access the listed ports in the configuration file.

