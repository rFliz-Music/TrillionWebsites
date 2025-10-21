// Init
import * as engine from "/modules/RenderEngine.js";
import {attach_CurveBehavior} from "/modules/ComponentBehavior.js";
import { DATA, load_data } from './modules/DataLoad.js';



// =======================================================================================
// ================================== SVG CONTAINER ======================================
// =======================================================================================
async function createTimeline(containerId) {
    const container = document.getElementById(containerId);    
  
    // Create SVG element
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");


    // ================================== SVG CONTAINER ======================================
    svg.setAttribute("viewBox", "0 0 150 100"); // logical coordinates
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");     
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.display = "block";
    svg.style.background = "rgb(250 246 239 / 0%)";
    container.appendChild(svg);


    // Container EVENTS
    container.onclick = () => { reset_ui() }

  
    // ====================================== CURVE ======================================
    const curvePoints = {
      p0: { x : 13,  y : 70},
      p1: { x : 25,  y : 10 },
      p2: { x : 120,  y : 90 },
      p3: { x : 130, y : 20 },
    };
  
    // Construct path string
    const pathData = `M${curvePoints.p0.x},${curvePoints.p0.y} C${curvePoints.p1.x},${curvePoints.p1.y} ${curvePoints.p2.x},${curvePoints.p2.y} ${curvePoints.p3.x},${curvePoints.p3.y}`;
  
    // Create dashed path
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", pathData);
    path.setAttribute("stroke", "#444");
    path.setAttribute("stroke-width", "0.3");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-dasharray", "1,3");
    svg.appendChild(path);

    // Attach dynamic behavior
    attach_CurveBehavior(path, curvePoints);

  
// ====================================== ICONS ======================================
    const icon_coords = [];
    const icon_width = 16;
    const icon_height = 16;

    const label_coords = [
      {x: -5, y: 12},
      {x: -7, y: -11},
      {x: -6, y: 12},
      {x: -11, y: -10},
      {x: 0, y: 10},
    ];

    // Subsets of the unit interval upon where the moons are allowed to appear
    const moon_ranges = [
      {low: 0.4, high: 1, offset: 0},
      {low: 0.25, high: 1, offset: 3.25},
      {low: 0.25, high: 1, offset: 0},
      {low: 0.25, high: 1, offset: 3.5},
      {low: 0.25, high: 1, offset: 0.5},
    ]

    const numIcons = 5; 
    const icon_names = ['hand', 'compass', 'cloud', 'chain', 'eye']   
    const icon_urls = ['0_hand.png', '1_compass.png', '2_cloud.png', '3_chain.png', '4_eye.png'];
    const icon_labels = ['1990 ~ 1992', '1994 ~ 1996', '2004 ~ 2006', '2014 ~ 2016', '2023 ~ 2025'];

    
    for (let i = 0; i < numIcons; i++) {

      // where on the parameter space ;)
      const t = i / (numIcons - 1); 

      // Calculate the position for the current node :D
      const pos = engine.cubicBezier(curvePoints.p0, curvePoints.p1, curvePoints.p2, curvePoints.p3, t);      

      // Create a group <g> to contain icon + label + moons
      const g = document.createElementNS(svgNS, "g");

      // Translating the General container for this icon and its 'children'
      g.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
      

      // ==== ICON IMAGE ====
      const icon = document.createElementNS(svgNS, "image");
            icon.setAttribute("class", "icon");
            icon.setAttribute("href", `Icons/${icon_urls[i]}`);
            icon.setAttribute("base_width", icon_width)
            icon.setAttribute("base_height", icon_height)
            icon.setAttribute("width", icon_width);
            icon.setAttribute("height", icon_height);
            icon.setAttribute("x", -icon_width/2);
            icon.setAttribute("y", -icon_height/2);
            icon.setAttribute("active", false)
            icon.style.cursor = 'pointer'
      
      icon_coords.push({ x: pos.x, y: pos.y }); // Store icon coordinates 
      // = = = = = = = = = = =


      // ==== LABEL ====
      const label = document.createElementNS(svgNS, "text");
            label.textContent = icon_labels[i];
            label.setAttribute('class', "icon-label");
            label.setAttribute('transform', `translate(${label_coords[i].x}, ${label_coords[i].y})`);
            label.setAttribute('font-family', "Avenir Next")  
            label.setAttribute("font-size", "14%")   
            label.style.opacity = 0;
      // = = = = = = = = 
      
      
      // ========= MOONS ===========
      const moons = document.createElementNS(svgNS, "g"); 
      const moons_size = 4
      
      const moon_range = ((moon_ranges[i].high - moon_ranges[i].low) * Math.PI*2); // increment size
      const moon_dx = moon_range / 5; // increment size
      let moon_curr = moon_ranges[i].low;

      for (let j = 0; j < (5); j++) {
        const moon_radius = 12;
        const moon_phase = Math.random() * 6; // random phase offset
        
        moon_curr = (moon_curr + moon_dx) // Position on the orbit
        const moon_pos = moon_curr + moon_ranges[i].offset
        
        const moon = document.createElementNS(svgNS, "image");
              moon.setAttribute("class", 'moon')  
              moon.setAttribute("id", `moon_${icon_names[i]}_${j}`)          
              moon.setAttribute("href", `Icons/moon_${j}.png`)              
              moon.setAttribute("width", moons_size);
              moon.setAttribute("height", moons_size);
              moon.setAttribute("x", (Math.sin(moon_pos) * moon_radius) - (moons_size/2));
              moon.setAttribute("y", (Math.cos(moon_pos) * moon_radius) - (moons_size/2));                           
              moon.style.cursor = 'pointer'                 



        function moon_animate(time) {
          const t = time / 1000;
          // Do stuff here;
          const radius_offset = (moon_radius + Math.sin(t + moon_phase) * 1) // Modulate radius
          moon.setAttribute("x", (Math.sin(moon_pos) * radius_offset) - (moons_size/2));
          moon.setAttribute("y", (Math.cos(moon_pos) * radius_offset) - (moons_size/2));
          requestAnimationFrame(moon_animate);        
        }      

        requestAnimationFrame(moon_animate);            


        // Moon Events
        moon.addEventListener("mouseenter", (e) => {        
          moon.setAttribute("width", moons_size * 1.15)         
          moon.setAttribute("height", moons_size * 1.15)                        
        });
        
        moon.addEventListener("mouseleave", (e) => {                      
          moon.setAttribute("width", moons_size)         
          moon.setAttribute("height", moons_size)         
        });



        moon.addEventListener('click', (e) => {
          e.stopPropagation(); 
          document.querySelector("#right-column-container").style.width = "40%";
          

          // Get the relevant moon data array
          const icon_data = DATA.icons[icon_names[i]]["moon_data"]

          document.querySelector("#sidePanel_title").innerHTML = icon_data[j]['title']
          document.querySelector("#sidePanel_subtitle").innerHTML = icon_data[j]['subtitle']
          document.querySelector("#sidePanel_text").innerHTML = icon_data[j]['text']
          document.querySelector("#sidePanel_year").innerHTML = icon_data[j]['year']
          document.querySelector("#sidePanel_embedded").setAttribute('src', icon_data[j]['url'])           
        })
        

        moons.appendChild(moon);
      }
      // = = = = = = = = = = = = = = = 
      

      const baseAngle = 0;      // center rotation
      const amplitude = 15;      // swing range
      const speed = 0.7;           // radians/sec (lower = slower)
      

      // ================= ANIMATION =================
      function animate_icon(time) {
        const t = time / 1000;
        const angle = baseAngle + amplitude * Math.sin(t * speed + i*0.7);
        icon.setAttribute("transform", `rotate(${angle}, ${0}, ${0})`);
        requestAnimationFrame(animate_icon);
      }
      requestAnimationFrame(animate_icon);

      // ================= EVENTS =================  

      // Hover
      icon.addEventListener("mouseenter", (e) => {
        if (icon.getAttribute("active") === "false") {            
          icon.setAttribute('width', icon_width * 1.03)
          icon.setAttribute('height', icon_height * 1.03)
        }                          
        label.style.opacity = 1        
      });
      
      icon.addEventListener("mouseleave", (e) => {            
        // If this is not the currently active node 
        icon.setAttribute('width', icon_width)
        icon.setAttribute('height', icon_height)
        if (icon.getAttribute("active") === "false") {            
          label.style.opacity = 0;         
        }                  
      });


      // On Icon Click
      icon.addEventListener("click", (e) => {
        e.stopPropagation(); // Stop general click from propagating                
        reset_ui()
        
        icon.setAttribute("active", true)

        label.style.opacity = 1;
        document.querySelector("#left-column-bottom-panel").style.height = "30%"; // change era text with
        
        // Turn the moons on!
        for (let n = 0; n < 5; n++) {
          const moon_element = document.querySelector(`#moon_${icon_names[i]}_${n}`);
          moon_element.style.opacity = 1;
        }        
      });


      // Append children to group
      g.appendChild(icon);
      g.appendChild(label);
      g.appendChild(moons);
      svg.appendChild(g);
    }



    // ========= MASKING ========= \\     
    // Create a mask to "cut out" gaps near icons
    const mask = document.createElementNS(svgNS, "mask");
    mask.setAttribute("id", "iconMask");
    svg.appendChild(mask);

    // Full white rectangle = line visible by default
    const fullRect = document.createElementNS(svgNS, "rect");
    fullRect.setAttribute("x", "0");
    fullRect.setAttribute("y", "0");
    fullRect.setAttribute("width", "100%");
    fullRect.setAttribute("height", "100%");
    fullRect.setAttribute("fill", "white");
    mask.appendChild(fullRect);

    // Black circles = hide dashed line under icons
    icon_coords.forEach((icon) => {
      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", icon.x); 
      circle.setAttribute("cy", icon.y );
      circle.setAttribute("r", 8); // radius of the transparent gap
      circle.setAttribute("fill", "black");
      mask.appendChild(circle);
    });

    // Apply mask to the path
    path.setAttribute("mask", "url(#iconMask)");

  }


  function reset_ui() {  
    // Collapse Panels
    document.querySelector("#right-column-container").style.width = "0%";
    document.querySelector("#left-column-bottom-panel").style.height = "0%"; // change era text with
    
    
    // Set All Nodes Inactive
    document.querySelectorAll('.icon').forEach((icon) => {         
      icon.setAttribute('active', false)
    })
  
    // Hide All Moons
    document.querySelectorAll('.moon').forEach((moon) => { moon.style.opacity = 0 })
  
    // Hide All Labels
    document.querySelectorAll(".icon-label").forEach((label) => { 
      label.style.opacity = 0;
    })
  }
  


// === o === o === o === o === o === o === o === o === o === o === o === o === o === o === o === o
// === o === o === o === o === o === o === o === o === o === o === o === o === o === o === o === o
// === o === o === o === o === o === o === o === o === o === o === o === o === o === o === o === o


function IntroPage_create() {
  const container = document.querySelector('#introPage-container')          
  const button = document.querySelector('#introPage_button')

  button.onclick = (e) => {
    console.log("Experience Started")
    document.querySelector("#master-container").style.opacity = 1;
    container.style.opacity = 0;
    container.style.pointerEvents = "none";
  }
  


}













  // =========================
  // Usage
  // =========================  
  document.addEventListener("DOMContentLoaded", async () => {
    // document.querySelector("#master-container").style.visibility = 'hidden'
    await load_data();
    await createTimeline("left-column-top-panel");
    document.querySelector("#master-container").style.opacity = 0
    IntroPage_create()
    // createTimeline("left-column-top-panel");
  });
  


