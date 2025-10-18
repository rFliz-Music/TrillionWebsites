// =========================
// Timeline Renderer
// =========================
import * as engine from "/modules/RenderEngine.js";
import { attach_IconBehavior, attach_CurveBehavior } from "/modules/ComponentBehavior.js";


function createTimeline(containerId) {
    const container = document.getElementById(containerId);
    let ACTIVE_ICON = 'hand';
  
    // Create SVG element
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");



    // Responsive setup
    svg.setAttribute("viewBox", "0 0 150 100"); // logical coordinates
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");     
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.display = "block";
    svg.style.background = "rgb(250 246 239 / 0%)";


    container.appendChild(svg);
    // Clicks ANYWHERE on the TIMELINE
    container.onclick = () => {
        document.querySelector('#top-row-right-panel').style.width = "0%"      

        // TURN THE MOONS OFF
        for (let n = 0; n < 5; n++) {
          const moon_element = document.querySelector(`#moon_${ACTIVE_ICON}_${n}`);
          moon_element.style.opacity = 0;
        }

    }

  

    // ====================================== CURVE ======================================
    const curvePoints = {
      p0: { x : 10,  y : 70},
      p1: { x : 20,  y : 20 },
      p2: { x : 120,  y : 70 },
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
      {low: 0.25, high: 1, offset: 0},
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
            icon.setAttribute("href", `Icons/${icon_urls[i]}`);
            icon.setAttribute("width", icon_width);
            icon.setAttribute("height", icon_height);
            icon.setAttribute("x", -icon_width/2);
            icon.setAttribute("y", -icon_height/2);
      
      icon_coords.push({ x: pos.x, y: pos.y }); // Store icon coordinates 
      // = = = = = = = = = = =


      // ==== LABEL ====
      const label = document.createElementNS(svgNS, "text");
            label.textContent = icon_labels[i];
            label.setAttribute('class', "icon-label");
            label.setAttribute('transform', `translate(${label_coords[i].x}, ${label_coords[i].y})`);
            label.setAttribute('font-family', "Avenir Next")  
            label.setAttribute("font-size", "14%")   
            label.setAttribute("visibility", "hidden")
      // = = = = = = = = 
      
      
      // ========= MOONS ===========
      const moons = document.createElementNS(svgNS, "g"); 
      const moons_size = 8
      
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
              moon.setAttribute("href", `Icons/moon_${0}.png`)              
              moon.setAttribute("width", moons_size);
              moon.setAttribute("height", moons_size);
              moon.setAttribute("x", (Math.sin(moon_pos) * moon_radius) - (moons_size/2));
              moon.setAttribute("y", (Math.cos(moon_pos) * moon_radius) - (moons_size/2));                           
            
              
              function moon_animate(time) {
                const t = time / 1000;
                // Do stuff here;
                const radius_offset = (moon_radius + Math.sin(t + moon_phase) * 1) // Modulate radius
                moon.setAttribute("x", (Math.sin(moon_pos) * radius_offset) - (moons_size/2));
                moon.setAttribute("y", (Math.cos(moon_pos) * radius_offset) - (moons_size/2));
                requestAnimationFrame(moon_animate);
              }      
              requestAnimationFrame(moon_animate);            
              
              moons.appendChild(moon)
      }
      // = = = = = = = = = = = = = =  

      // attach_IconBehavior(icon, 0, 0, i*0.7, label, icon_names[i]); // Attach all behavior (animation, events
      const baseAngle = 0;      // center rotation
      const amplitude = 15;      // swing range
      const speed = 0.7;           // radians/sec (lower = slower)
      

      // ================= ANIMATION =================
      function animate(time) {
        const t = time / 1000;
        const angle = baseAngle + amplitude * Math.sin(t * speed + i*0.7);
        icon.setAttribute("transform", `rotate(${angle}, ${0}, ${0})`);
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);

      // ================= EVENTS =================  

        // Optional event handlers
        icon.addEventListener("mouseenter", () => {
          label.setAttribute("visibility", "visible")
        });
      
        icon.addEventListener("mouseleave", () => {
          label.setAttribute("visibility", "hidden")
        });


      icon.addEventListener("click", (e) => {

        ACTIVE_ICON = icon_names[i]

        e.stopPropagation(); // Stop general click from propagating
        console.log("Clicked Icon");
        // document.querySelector("#top-row-right-panel").style.width = "30%";
        
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
      circle.setAttribute("cx", icon.x); // small offset to match icon center
      circle.setAttribute("cy", icon.y );
      circle.setAttribute("r", 8); // radius of the transparent gap
      circle.setAttribute("fill", "black");
      mask.appendChild(circle);
    });

    // Apply mask to the path
    path.setAttribute("mask", "url(#iconMask)");

  }
  


  // =========================
  // Usage
  // =========================
  window.onload = () => {  
    createTimeline("top-row-left-panel");    
  };
  


// Returns a randomized distribution of 
  // function createMoonPositions()