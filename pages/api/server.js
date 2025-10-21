import axios from 'axios';

const serverTagsConfig = {
    'server1': {
        Tag_1: "MODDED",
        Tag_2: "236 DEV",
        Stat_Style: {
            Background: "#E6AA04",
            Border: "#E6AA04",
            Color: "#FFFFFF"
        },
        Progress_Color: {
            Start: "#E6AA04",
            End: "#E6AA04"
        }
    },
    'server2': {
        Tag_1: "MODDED",
        Tag_2: "177 DEV",
        Stat_Style: {
            Background: "#FF6B35",
            Border: "#FF6B35",
            Color: "#FFFFFF"
        },
        Progress_Color: {
            Start: "#FF6B35",
            End: "#FF6B35"
        }
    },
    'server3': {
        Tag_1: "COMBAT",
        Tag_2: "236 DEV",
        Stat_Style: {
            Background: "#8B0000",
            Border: "#8B0000",
            Color: "#FFFFFF"
        },
        Progress_Color: {
            Start: "#8B0000",
            End: "#8B0000"
        }
    },
    'server4': {
        Tag_1: "MODDED",
        Tag_2: "PVP",
        Stat_Style: {
            Background: "#4CAF50",
            Border: "#4CAF50",
            Color: "#FFFFFF"
        },
        Progress_Color: {
            Start: "#4CAF50",
            End: "#4CAF50"
        }
    }
};

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const response = await axios.get('https://calypsoproject.gamestores.app/api/v1/widgets.monitoring');
        if (response.data.result === 'success') {
            const apiData = response.data.data;
            const servers = {};
            apiData.servers.forEach((server, index) => {
                const serverKey = `server${index + 1}`;
                const serverConfig = serverTagsConfig[serverKey] || {
                    Tag_1: "MODDED",
                    Tag_2: "PVP",
                    Stat_Style: {
                        Background: "#E6AA04",
                        Border: "#E6AA04",
                        Color: "#FFFFFF"
                    },
                    Progress_Color: {
                        Start: "#E6AA04",
                        End: "#E6AA04"
                    }
                };
                servers[serverKey] = {
                    Name: server.name,
                    Players: server.players,
                    MaxPlayers: server.playersMax,
                    Queue: server.playersInQueue,
                    Tag_1: serverConfig.Tag_1,
                    Tag_2: serverConfig.Tag_2,
                    Stat_Style: serverConfig.Stat_Style,
                    Progress_Color: serverConfig.Progress_Color,
                    Connect: server.connect,
                    IP: server.ip,
                    Port: server.port
                };
            });
            res.status(200).json(servers);
        } else {
            throw new Error('API returned an error');
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.toString() });
    }
}
