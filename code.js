// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(680, 730);
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = preset => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    const nodes = [];
    const dpi = preset.dpi;
    const dpmm = (preset.dpi / 2.54237288136) * 0.1;
    for (let i = 0; i < preset.pages; i++) {
        const frame = figma.createFrame();
        var frameWidth = preset.width * dpmm;
        var frameHeight = preset.height * dpmm;
        if (preset.unit == 'inches') {
            frameWidth = preset.width * dpi;
            frameHeight = preset.height * dpi;
        }
        frame.resizeWithoutConstraints(frameWidth, frameHeight);
        frame.x = (figma.viewport.center.x - frameWidth / 2) + (i * frameWidth * 1.10);
        frame.y = figma.viewport.center.y - frameHeight / 2;
        frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        frame.name = `Page ${i + 1} (${preset.name} @${dpi}dpi)`;
        figma.currentPage.appendChild(frame);
        nodes.unshift(frame);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    //figma.closePlugin();
};
