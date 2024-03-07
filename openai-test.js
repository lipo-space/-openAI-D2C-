let apikey = null;

function setApikey(key) {
    apikey = key;
}

function getApikey() {
    return apikey;
}

module.exports = {
    setApikey,
    getApikey
};