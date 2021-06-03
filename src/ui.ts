
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling
import 'tippy.js/animations/shift-away.css';
import 'tippy.js/themes/light.css';

import {presets} from './presets.js'

import './ui.css'

document.addEventListener("DOMContentLoaded", function () {

  var selectedPreset = {}
  
  var sidebar = <HTMLInputElement>document.querySelector('.sidebar');
  var custom_name = <HTMLInputElement>document.querySelector('#custom-name');
  var custom_unit = <HTMLInputElement>document.querySelector('#custom-unit');
  var custom_width = <HTMLInputElement>document.querySelector('#custom-width');
  var custom_height = <HTMLInputElement>document.querySelector('#custom-height');
  var custom_button = <HTMLInputElement>document.querySelector('.button-create');
  var custom_button_wrapper = <HTMLInputElement>document.querySelector('.button-create');
  var bleed = <HTMLInputElement>document.querySelector('#bleed');
  var crops = <HTMLInputElement>document.querySelector('#crops-toggle');
  var category_container = <HTMLInputElement>document.querySelector('.misc');


  custom_unit.addEventListener('change', function() {
    if (custom_unit.value == 'inches') {
      custom_width.setAttribute('min', "1")
      custom_width.setAttribute('max', "30")
      custom_width.value = ''
      custom_height.setAttribute('min', "1")
      custom_height.setAttribute('max', "30")
      custom_height.value = ''
  
      bleed.value = "0"
      bleed.setAttribute('step', "0.125")
      bleed.setAttribute('max', "2")
  
      crops.classList.add('disabled')
      crops.value = "0"
  
    }
    if (custom_unit.value == 'mm') {
      custom_width.setAttribute('min', "30")
      custom_width.setAttribute('max', "1000")
      custom_width.value = ''
      custom_height.setAttribute('min', "30")
      custom_height.setAttribute('max', "1000")
      custom_height.value = ''
  
      bleed.value = "0"
      bleed.setAttribute('step', "1")
      bleed.setAttribute('max', "50")
  
      crops.classList.add('disabled')
      crops.value = "off"
  
    }
    var all_presets = document.querySelectorAll('.preset');
    for(let j = 0; j < all_presets.length; j++) {
      if (all_presets[j].classList.contains('preset-hover')) {
        all_presets[j].classList.remove('preset-hover');
      }
    }
  
  });
  
  custom_name.addEventListener('change', function() {
    var all_presets = document.querySelectorAll('.preset');
      for(let j = 0; j < all_presets.length; j++) {
        if (all_presets[j].classList.contains('preset-hover')) {
          all_presets[j].classList.remove('preset-hover');
        }
      }
  });
  
  custom_width.addEventListener('change', function() {
    var all_presets = document.querySelectorAll('.preset');
      for(let j = 0; j < all_presets.length; j++) {
        if (all_presets[j].classList.contains('preset-hover')) {
          all_presets[j].classList.remove('preset-hover');
        }
      }
    if (custom_button_wrapper.classList.contains('button-disabled')) {
      custom_button_wrapper.classList.remove('button-disabled')
      custom_button_wrapper.innerHTML = `<span>Create Document</span>`
    }
    if (custom_width.value == '' || custom_height.value == '') {
      custom_button_wrapper.classList.add('button-disabled')
      custom_button_wrapper.innerHTML = `<span>Please Enter Dimensions</span>`
    }
  });

  custom_height.addEventListener('change', function() {
    var all_presets = document.querySelectorAll('.preset');
      for(let j = 0; j < all_presets.length; j++) {
        if (all_presets[j].classList.contains('preset-hover')) {
          all_presets[j].classList.remove('preset-hover');
        }
      }
    if (custom_button_wrapper.classList.contains('button-disabled')) {
      custom_button_wrapper.classList.remove('button-disabled')
      custom_button_wrapper.innerHTML = `<span>Create Document</span>`
    }
    if (custom_width.value == '' || custom_height.value == '') {
      custom_button_wrapper.classList.add('button-disabled')
      custom_button_wrapper.innerHTML = `<span>Please Enter Dimensions</span>`
    }
  });
  
  bleed.addEventListener('change', function() {
    if (Number(bleed.value) != 0) {
      crops.classList.add('disabled')
      crops.classList.remove('disabled')
    } else {
      crops.classList.add('disabled')
      crops.value = "0"
    }
  });
  
  // Render Presets
  for (let i = 0; i < presets.length; i++) {
    let preset = presets[i];
    let category = preset.category;
    let name = preset.name;
    let icon = preset.icon;
  
    let unit = preset.unit;
    if (unit == 'inches') { var unit_symbol = `"`} else { var unit_symbol = `mm`}
  
    let size_string = preset.width + ' x ' + preset.height + unit_symbol
  
    let width = Number(preset.width)
    let height = Number(preset.height)
  
    let div = document.createElement('div')
    // div.setAttribute('data-name', name)
    // div.setAttribute('data-unit', unit)
    // div.setAttribute('data-width', preset.width)
    // div.setAttribute('data-height', preset.height)
    div.classList.add('preset')
    div.innerHTML = `
      <div class='preset-name-icon'>
        <i class="fas ${icon}"></i>
        <span class='name'>${name}</span>
      </div>
      <span class='size'>${size_string}</span>
      `;
  
    div.onclick = () => {

      // Fill the custom box with preset values.
      custom_name.value = name;
      custom_unit.value = unit;

      if (custom_unit.value == 'inches') {
        custom_width.setAttribute('min', "1")
        custom_width.setAttribute('max', "30")
        custom_width.value = ''
        custom_height.setAttribute('min', "1")
        custom_height.setAttribute('max', "30")
        custom_height.value = ''
    
        bleed.value = "0"
        bleed.setAttribute('step', "0.125")
        bleed.setAttribute('max', "2")
    
        crops.classList.add('disabled')
        crops.value = "0"
    
      }
      if (custom_unit.value == 'mm') {
        custom_width.setAttribute('min', "30")
        custom_width.setAttribute('max', "1000")
        custom_width.value = ''
        custom_height.setAttribute('min', "30")
        custom_height.setAttribute('max', "1000")
        custom_height.value = ''
    
        bleed.value = "0"
        bleed.setAttribute('step', "1")
        bleed.setAttribute('max', "50")
    
        crops.classList.add('disabled')
        crops.value = "off"
    
      }
  

      custom_width.value = String(width);
      custom_height.value = String(height);
      bleed.value = "0";
      crops.classList.add('disabled')
      crops.value = "off"

      
      
  
      var all_presets = document.querySelectorAll('.preset');
      for(let j = 0; j < all_presets.length; j++) {
        if (all_presets[j].classList.contains('preset-hover')) {
          all_presets[j].classList.remove('preset-hover');
        }
      }
  
      div.classList.add('preset-hover');
  
      if (custom_button_wrapper.classList.contains('button-disabled')) {
        custom_button_wrapper.classList.remove('button-disabled')
        custom_button_wrapper.innerHTML = `<span>Create Document</span>`
      }
    
    }
  
    (<HTMLInputElement>category_container).appendChild(div);
  
  }
  
  tippy('.help-dpi', {
          content: `<div style='padding: 4px;'>Figma uses 72 DPI natively - "Letter" at 72 DPI will export as a PDF exactly 8.5 x 11 inches.`,
          animation: 'shift-away',
          hideOnClick: false,
          placement: 'top',
          allowHTML: true,
          theme: 'light'
  });
  
  tippy('.help-pages', {
        content: `<div style='padding: 4px;'>How many pages would you like to create?</div>`,
        animation: 'shift-away',
        hideOnClick: false,
        placement: 'top',
        allowHTML: true,
        theme: 'light'
  });
  
  tippy('.help-orientation', {
        content: `<div style='padding: 4px;'>Default is to use the orientation from the preset, but you may also force the orientation to Portrait or Landscape.</div>`,
        animation: 'shift-away',
        hideOnClick: false,
        placement: 'top',
        allowHTML: true,
        theme: 'light'
  });
  
  tippy('.help-bleed', {
        content: `<div style='padding: 4px;'>Bleed is the area to be "trimmed" from the page so as to have an "edge-to-edge" print. Bleed will increase the document size by the selected amount so it maintains it's intended dimensions.</div>`,
        animation: 'shift-away',
        hideOnClick: false,
        placement: 'top',
        allowHTML: true,
        theme: 'light'
  });
  
  tippy('.help-crops', {
        content: `<div style='padding: 4px;'><strong>Requires a valid bleed value!</strong><br/><br/><strong>Expand Frame to Fit</strong><br/>Bleed frame size will increase so the crop marks are contained in the frame.<br /><br /><strong>Clip Outside Frame</strong><br/>Crop marks will clip outside the bleed frame, and may not be completely visible when exporting.</div>`,
        animation: 'shift-away',
        hideOnClick: false,
        placement: 'top',
        allowHTML: true,
        theme: 'light'
  });
  
  custom_button.addEventListener('click', function (event) {
    var name = custom_name.value;
    var unit = custom_unit.value;
    var width = custom_width.value;
    var height = custom_height.value;
    var dpi = (<HTMLInputElement>document.querySelector('#dpis')).value;
    var pages = (<HTMLInputElement>document.querySelector('#pages')).value;
    selectedPreset = {name: name, unit: unit, width: width, height: height, dpi: dpi, pages: pages, bleed: bleed.value, crops: crops.value}
    
    if (custom_height.value != '' && custom_width.value != '') {
      if (custom_name.value == '') {
        custom_name.value = 'My Document'
      }
      parent.postMessage({ pluginMessage: selectedPreset }, '*')
    }
  });
  
});

