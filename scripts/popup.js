const uaCheckbox = document.getElementById("uaCheckbox");
const uaSelection = document.getElementById("uaSelection");

/*
let rules;

chrome.declarativeNetRequest.getDynamicRules(data => {
    rules = data;
});
*/

// Get the checkbox status from chrome storage
chrome.storage.sync.get(['uaSpoof'], function (result) {
    uaCheckbox.checked = result.uaSpoof;
});

function setUa() {
    const rule = {
        addRules: [
            {
                id: 1,
                priority: 1,
                action: {
                    type: "modifyHeaders",
                    requestHeaders: [
                        {
                            header: "user-agent",
                            operation: "set",
                            value: uaSelection.value,
                        },
                    ],
                },
                condition: {
                    urlFilter: "*",
                    resourceTypes: ["main_frame"],
                },
            },
        ],
    };

    chrome.declarativeNetRequest.updateDynamicRules(rule);
    chrome.storage.sync.set({ 'uaSpoof': true }, function () {
        console.log('User-Agent is spoofed');
    });
}

function unSetUa() {
    const rule = {
        removeRuleIds: [1]
    };

    chrome.declarativeNetRequest.updateDynamicRules(rule);
    chrome.storage.sync.set({ 'uaSpoof': false }, function () {
        console.log('User-Agent is not spoofed');
    });
}

uaCheckbox.addEventListener("change", function () {
    if (this.checked) {
        setUa();
    } else {
        unSetUa();
    }
});