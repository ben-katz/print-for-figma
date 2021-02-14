// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(442, 660);
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = preset => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    const nodes = [];
    const dpi = preset.dpi;
    const dpmm = (preset.dpi / 2.54237288136) * 0.1;
    const doc_name = preset.name != "" ? preset.name : 'My Document';
    function clone(val) {
        return JSON.parse(JSON.stringify(val));
    }
    for (let i = 0; i < preset.pages; i++) {
        const frame = figma.createFrame();
        var frameWidth = (preset.width * dpmm) + 2 * preset.bleed * dpmm;
        var frameHeight = (preset.height * dpmm) + 2 * preset.bleed * dpmm;
        if (preset.unit == 'inches') {
            frameWidth = (preset.width * dpi) + 2 * preset.bleed * dpi;
            frameHeight = (preset.height * dpi) + 2 * preset.bleed * dpi;
        }
        frame.resizeWithoutConstraints(frameWidth, frameHeight);
        frame.x = (figma.viewport.center.x - frameWidth / 2) + (i * frameWidth * 1.10);
        frame.y = figma.viewport.center.y - frameHeight / 2;
        frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        frame.name = `${doc_name} @${dpi}dpi (Page ${i + 1})`;
        // Check if bleed is enabled:
        // We already added the bleed to the total document size in the lines above, so we only need to add the child frame or not.
        if (preset.bleed != 0) {
            if (preset.unit == 'inches') {
                var bleedPixels = preset.bleed * dpi;
            }
            else {
                var bleedPixels = preset.bleed * dpmm;
            }
            var x1 = bleedPixels;
            var y1 = bleedPixels;
            var x2 = frameWidth - bleedPixels;
            var y2 = frameHeight - bleedPixels;
            frame.guides = [{ axis: 'X', offset: x1 }, { axis: 'X', offset: x2 }, { axis: 'Y', offset: y1 }, { axis: 'Y', offset: y2 }];
            const bleedFrame = figma.createFrame();
            bleedFrame.resizeWithoutConstraints(frameWidth - (bleedPixels * 2), frameHeight - (bleedPixels * 2));
            bleedFrame.name = `Visible Area`;
            //bleedFrame.strokes = [{type: 'SOLID', color: {r: 0.9, g: 0.1, b: 0.55}}];
            //bleedFrame.strokeWeight = 0.5;
            //bleedFrame.strokeAlign = "OUTSIDE"
            bleedFrame.clipsContent = false;
            frame.layoutMode = "VERTICAL";
            frame.primaryAxisAlignItems = "CENTER";
            frame.counterAxisAlignItems = "CENTER";
            frame.paddingLeft = bleedPixels;
            frame.paddingRight = bleedPixels;
            frame.paddingTop = bleedPixels;
            frame.paddingBottom = bleedPixels;
            frame.appendChild(bleedFrame);
        }
        figma.currentPage.appendChild(frame);
        nodes.unshift(frame);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
    figma.notify('Document Created!');
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    //figma.closePlugin();
};
