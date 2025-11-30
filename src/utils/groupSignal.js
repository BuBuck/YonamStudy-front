export const notifyGroupCreated = (newGroup) => {
    const event = new CustomEvent("groupCreated", { detail: newGroup });
    window.dispatchEvent(event);
};

export const onGroupCreated = (callback) => {
    const handler = (e) => callback(e.detail);

    window.addEventListener("groupCreated", handler);

    return () => window.removeEventListener("groupCreated", handler);
};
