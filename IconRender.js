// =========================
// Timeline Renderer
// =========================
import * as engine from "/modules/RenderEngine.js";
import { attachIconBehavior, attachCurveBehavior } from "/modules/ComponentBehavior.js";


function createTimeline(containerId) {
    const container = document.getElementById(containerId);
  
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
    container.onclick = () => {
        document.querySelector('#top-row-right-panel').style.width = "0%"      
    }

  

    // ====================================== CURVE ======================================
    const curvePoints = {
      p0: { x : 10,  y : 90},
      p1: { x : 20,  y : 20 },
      p2: { x : 120,  y : 70 },
      p3: { x : 140, y : 20 },
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
    attachCurveBehavior(path, curvePoints);

  
  
  
    // ====================================== ICONS ======================================
    const icon_coords = [];
    let icon_width = 15
    let icon_height = 15
    // Create markers 
      const numIcons = 5;    
      const icon_urls = ['0_coffee.png', '1_compass.png', '2_cloud.png', '3_chain.png', '4_eye.png']
      const icon_labels = ['coffee', 'compass', 'cloud', 'chain', 'eye']
      for (let i = 0; i < numIcons; i++) {
        const t = i / (numIcons - 1);
        const pos = engine.cubicBezier(curvePoints.p0, curvePoints.p1, curvePoints.p2, curvePoints.p3, t);
  
        // Tangent vector  to the curve
        const angle = engine.cubicTangent(curvePoints.p0, curvePoints.p1, curvePoints.p2, curvePoints.p3, t);
    
  
        // if <image> instead:
        const icon = document.createElementNS(svgNS, "image");      
        icon.setAttribute("href", `Icons/${icon_urls[i]}`);
        icon.setAttribute("width", icon_width);
        icon.setAttribute("height", icon_height);
        icon.setAttribute("x", pos.x - 12);
        icon.setAttribute("y", pos.y - 12);
        // Center the icon
        let icon_position = {
          x : pos.x,
          y : pos.y
        };
  
        icon_coords.push(icon_position)
  
        icon.setAttribute("x", pos.x - icon_width / 2);
        icon.setAttribute("y", pos.y - icon_height / 2);
        
    
        // Attach independent animation and events
        attachIconBehavior(icon, pos.x, pos.y, i * 0.7);
        // attachIconBehavior (svg, icon, icon_labels[i], pos.x, pos.y, i * 0.7);



        svg.appendChild(icon);
      }
      // ================================================================================  
    
  


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
    // createTimeline("top-row-right-panel");
  };
  