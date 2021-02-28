
async function newWindow() {

    const viewOptions = {
        url: "https://www.yahoo.com",
        name: "view-yahoo"
    };
    await fin.Platform.getCurrentSync().createView(viewOptions, fin.me.identity);
}


async function closeAllViews() {
    windowIdentity = (await fin.me.getCurrentWindow()).identity;
    const platform = fin.Platform.getCurrentSync();
    platform.closeView({
        uuid: windowIdentity.uuid,
        name: "aol-view"
        
    })
}


async function doSomething() {
    let windowIdentity;
    if (fin.me.isWindow) {
        windowIdentity = fin.me.identity;
    } else if (fin.me.isView) {
        windowIdentity = (await fin.me.getCurrentWindow()).identity;
    } else {
        throw new Error('Not running in a platform View or Window');
    }
    
    const platform = fin.Platform.getCurrentSync();
    
    platform.createView({
        name: 'test_view',
        url: 'https://developers.openfin.co/docs/platform-api'
    }, windowIdentity).then(console.log);
}




async function direct() {
    windowIdentity = (await fin.me.getCurrentWindow()).identity;

    // get a view
    const view = fin.View.wrapSync({uuid : windowIdentity.uuid, name: 'aol-view'});

    // try something here
    view.navigate("https://comma.ai");

}


async function reparentWindow() {
    let windowIdentity;
    if (fin.me.isWindow) {
        windowIdentity = fin.me.identity;
    } else if (fin.me.isView) {
        windowIdentity = (await fin.me.getCurrentWindow()).identity;
    } else {
        throw new Error('Not running in a platform View or Window');
    }

    let platform = fin.Platform.getCurrentSync();
    let viewOptions = {
        name: 'example_view',
        url: 'https://example.com'
    };
    // a new view will now show in the current window
    await platform.createView(viewOptions, windowIdentity);

    const view = fin.View.wrapSync({ uuid: windowIdentity.uuid, name: 'yahoo_view' });
    // reparent `example_view` when a view in the new window is shown
    view.on('shown', async () => {
        let viewIdentity = { uuid: windowIdentity.uuid, name: 'example_view'};
        let target = {uuid: windowIdentity.uuid, name: 'aol-view'};
        platform.createView(viewOptions, target);
    });

    // create a new window
    await platform.createWindow({
        name: "test_win",
        layout: {
            content: [
                {
                    type: 'stack',
                    content: [
                        {
                            type: 'component',
                            componentName: 'view',
                            componentState: {
                                name: 'yahoo_view',
                                url: 'https://yahoo.com'
                            }
                        }
                    ]
                }
            ]
        }
    }).then(console.log);
}