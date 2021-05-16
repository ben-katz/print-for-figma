// This shows the HTML page in "ui.html".
figma.showUI(__html__);

//Set the size of the plugin window.
figma.ui.resize(800, 405)

figma.ui.onmessage = preset => {

  const nodes: SceneNode[] = [];

  // Grab the given DPI from the message.
  const dpi = preset.dpi

  // We use DPMM under the hood for higher accuracy of rounding etc. 
  const dpmm = (preset.dpi/2.54237288136) * 0.1

  // Set default document name if none is given.
  const doc_name = preset.name != "" ? preset.name : 'My Document'

  // Loop through to create pages of the document.
  for (let i = 0; i < preset.pages; i++) {

    // Create the highest-level frame of the document. 
    // If no bleed is given, this will be the only frame created.
    const frame = figma.createFrame();

    // Check if crop marks are enabled.
    var crop_space = 0;
    var crops = false;
    if (preset.crops != 'off') {
      crops = true;
    }
    // we only need to increase frame size in expand-to-fit mode.
    if (preset.crops == 'on-expand') {
      crop_space = 0.25 * dpi;
    }

    // Calculate the outer frame size. 
    // If no bleed is given, the given dimensions will be unaffected.
    var frameWidth = (preset.width*dpmm) + 2*preset.bleed*dpmm + (crop_space*2)
    var frameHeight = (preset.height*dpmm) + 2*preset.bleed*dpmm + (crop_space*2)
    
    if (preset.unit == 'inches') {
      frameWidth = (preset.width*dpi) + 2*preset.bleed*dpi + (crop_space*2)
      frameHeight = (preset.height*dpi) + 2*preset.bleed*dpi + (crop_space*2)
    }

    // Size the outer frame based on previous calculations.
    frame.resizeWithoutConstraints(frameWidth, frameHeight)

    // Center the outer frame in the viewport.
    frame.x = (figma.viewport.center.x - frameWidth / 2) + (i*frameWidth*1.10)
    frame.y = figma.viewport.center.y - frameHeight / 2

    // Give the outer frame a solid white fill.
    frame.fills = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}];

    // Name the outer frame.
    frame.name = `${doc_name} @${dpi}dpi (Page ${i + 1})`;

    // Disable clipping on the outer frame.
    frame.clipsContent = false;

    // Check if bleed is enabled:
    // We already added the bleed to the total document size in the lines above, so we only need to add the child frame or not.
    if (preset.bleed != 0) {

      if (preset.unit == 'inches') {
        var bleedPixels = preset.bleed * dpi
      } else {
        var bleedPixels = preset.bleed * dpmm
      }
      
      // Calculate printable area guide positions
      // also used to position crop marks if enabled.
      var x1 = bleedPixels + crop_space
      var x2 = frameWidth - bleedPixels - crop_space
      var y1 = bleedPixels + crop_space
      var y2 = frameHeight - bleedPixels - crop_space
      
      // Add the guides to the outer frame.
      frame.guides = [{axis: 'X', offset: x1}, {axis: 'X', offset: x2}, {axis: 'Y', offset: y1}, {axis: 'Y', offset: y2}];

      // Create the inner frame ("printable area")
      const bleedFrame = figma.createFrame();
      bleedFrame.resizeWithoutConstraints(frameWidth - (bleedPixels*2) - (crop_space*2), frameHeight - (bleedPixels*2) - (crop_space*2))
      bleedFrame.name = `Visible Area`;
      bleedFrame.clipsContent = false;
      bleedFrame.x = bleedPixels + crop_space;
      bleedFrame.y = bleedPixels + crop_space;
      bleedFrame.constraints = {horizontal: "CENTER", vertical: "CENTER"}
      //bleedFrame.strokes = [{type: 'SOLID', color: {r: 0.9, g: 0.1, b: 0.55}}];
      //bleedFrame.strokeWeight = 0.5;
      //bleedFrame.strokeAlign = "OUTSIDE"

      // Crop Marks
      if (crops) {
        // Calculate bleed guide positions
        var bx1 = crop_space
        var bx2 = frameWidth - crop_space
        var by1 = crop_space
        var by2 = frameHeight - crop_space

        // Add the updated guides to the outer frame.
        frame.guides = [
          {axis: 'X', offset: x1}, {axis: 'X', offset: x2}, {axis: 'Y', offset: y1}, {axis: 'Y', offset: y2},
          {axis: 'X', offset: bx1}, {axis: 'X', offset: bx2}, {axis: 'Y', offset: by1}, {axis: 'Y', offset: by2}
        ];

        const tlh = figma.createLine()
        tlh.strokeWeight = 0.5
        tlh.strokes = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
        tlh.resize(18, 0);
        frame.appendChild(tlh)
        tlh.x = 0;
        if (preset.crops == 'on-clip') {
          tlh.x = 0 - bleedPixels*2;
        }
        tlh.y = y1;

        const tlv = figma.createLine()
        tlv.rotation = -90
        tlv.strokeWeight = 0.5
        tlv.strokes = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
        tlv.resize(18, 0);
        frame.appendChild(tlv)
        tlv.x = x1;
        tlv.y = 0;
        if (preset.crops == 'on-clip') {
          tlv.y = 0 - bleedPixels*2;
        }

        const tl = figma.group([tlh, tlv], frame)
        tl.name = `Top Left`

        const trh = figma.createLine()
        trh.strokeWeight = 0.5
        trh.strokes = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
        trh.resize(18, 0);
        frame.appendChild(trh)
        trh.x = bx2;
        if (preset.crops == 'on-clip') {
          trh.x = x2 + bleedPixels;
        }
        trh.y = y1

        const trv = figma.createLine()
        trv.rotation = -90
        trv.strokeWeight = 0.5
        trv.strokes = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
        trv.resize(18, 0);
        frame.appendChild(trv)
        trv.x = x2;
        trv.y = 0;
        if (preset.crops == 'on-clip') {
          trv.y = 0 - bleedPixels*2;
        }

        const tr = figma.group([trh, trv], frame)
        tr.name = `Top Right`

        const blh = figma.createLine()
        blh.strokeWeight = 0.5
        blh.strokes = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
        blh.resize(18, 0);
        frame.appendChild(blh)
        blh.x = 0;
        if (preset.crops == 'on-clip') {
          blh.x = 0 - bleedPixels*2;
        }
        blh.y = y2;

        const blv = figma.createLine()
        blv.rotation = -90
        blv.strokeWeight = 0.5
        blv.strokes = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
        blv.resize(18, 0);
        frame.appendChild(blv)
        blv.x = x1;
        blv.y = by2;
        if (preset.crops == 'on-clip') {
          blv.y = y2 + bleedPixels;
        }

        const bl = figma.group([blh, blv], frame)
        bl.name = `Bottom Left`
        
        const brh = figma.createLine()
        brh.strokeWeight = 0.5
        brh.strokes = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
        brh.resize(18, 0);
        frame.appendChild(brh)
        brh.x = bx2;
        if (preset.crops == 'on-clip') {
          brh.x = x2 + bleedPixels;
        }
        brh.y = y2;

        const brv = figma.createLine()
        brv.rotation = -90
        brv.strokeWeight = 0.5
        brv.strokes = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}]
        brv.resize(18, 0);
        frame.appendChild(brv)
        brv.x = x2;
        brv.y = by2;
        if (preset.crops == 'on-clip') {
          brv.y = y2 + bleedPixels;
        }

        const br = figma.group([brh, brv], frame)
        br.name = `Bottom Right`
        
        const marks = figma.group([tr, tl, br, bl], frame)
        marks.name = `Crop Marks`
        marks.locked = true;

      }

      // Add our inner frame to the outer frame.
      frame.appendChild(bleedFrame)

    }

    // add the document page to the figma page.
    figma.currentPage.appendChild(frame);
    nodes.unshift(frame);
  }

  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
  figma.notify('Document Created!')

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  //figma.closePlugin();
};
