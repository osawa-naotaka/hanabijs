const ws = new WebSocket(`ws://${location.host}/reload`);
ws.onmessage = (event) => {
    console.log("reloader message:", event.data);
    if (event.data === "reload") {
        location.reload();
    }
};
