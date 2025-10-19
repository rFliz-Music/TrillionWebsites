// =============================
// Icon Behavior
// =============================

// export function attach_IconBehavior(icon, cx, cy, phase = 0, label, name) {
//   const baseAngle = 0;      // center rotation
//   const amplitude = 15;      // swing range
//   const speed = 0.7;           // radians/sec (lower = slower)
  

//   // ================= ANIMATION =================
//   function animate(time) {
//     const t = time / 1000;
//     const angle = baseAngle + amplitude * Math.sin(t * speed + phase);
//     icon.setAttribute("transform", `rotate(${angle}, ${cx}, ${cy})`);
//     requestAnimationFrame(animate);
//   }
//   requestAnimationFrame(animate);

//   // ================= EVENTS =================  

//     // Optional event handlers
//     icon.addEventListener("mouseenter", () => {
//       label.setAttribute("visibility", "visible")
//     });
  
//     icon.addEventListener("mouseleave", () => {
//       label.setAttribute("visibility", "hidden")
//     });


//   icon.addEventListener("click", (e) => {
//     e.stopPropagation(); // Stop general click from propagating
//     console.log("Clicked Icon");
//     document.querySelector("#left-column-bottom-panel").style.width = "30%";
    
//     for (let n = 0; n < 5; n++) {
//       const moon_element = document.querySelector(`#moon_${name}_${n}`);
//       moon_element.style.opacity = 1;
//     }
    
//   });
// }



// ====================================================================================
// ====================================================================================
// ====================================================================================


// ==================== CURVE BEHAVIOR ====================
export function attach_CurveBehavior(path, basePoints) {
        const amplitude = 0.7;   // how much to wiggle vertically
        const speed = 1.5;       // oscillation speed
        const phaseOffsets = [0, 1.3, 2.1, 3.7]; // each point moves slightly out of phase
      
  
        function updatePath(t) {
          const wiggle = (p, i) => ({
            x: p.x,
            y: p.y + Math.sin(t * speed + phaseOffsets[i]) * amplitude,
          });
        
          const pts = [
            wiggle(basePoints.p0, 0),
            wiggle(basePoints.p1, 1),
            wiggle(basePoints.p2, 2),
            wiggle(basePoints.p3, 3),
          ];
        
          const pathData = `M${pts[0].x},${pts[0].y} C${pts[1].x},${pts[1].y} ${pts[2].x},${pts[2].y} ${pts[3].x},${pts[3].y}`;
          path.setAttribute("d", pathData);
        }


        function animate(time) {
          const t = time / 1000;
          updatePath(t);
          requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
      
        // Optional event handlers
        path.addEventListener("mouseenter", () => {
          path.setAttribute("stroke", "#666");
        });
      
        path.addEventListener("mouseleave", () => {
          path.setAttribute("stroke", "#444");
        });
      
        path.addEventListener("click", () => {
          console.log("Timeline clicked!");
        });
      }









// =============================
// Curved Label
// =============================

// function createCurvedLabel(text, radius = 10, fontSize = 3) {
//   const svgNS = "http://www.w3.org/2000/svg";
//   const xlinkNS = "http://www.w3.org/1999/xlink";

//   // Create main SVG element
//   const svg = document.createElementNS(svgNS, "svg");
//   svg.setAttribute("width", radius * 2 + fontSize * 2);
//   svg.setAttribute("height", radius + fontSize * 2);
//   svg.style.overflow = "visible";

//   // Create unique path ID
//   const pathId = `curvedPath_${Math.random().toString(36).substr(2, 9)}`;

//   // Create a simple top-half arc path
//   const startX = fontSize;
//   const startY = radius;
//   const endX = radius * 2 + fontSize;
//   const endY = radius;

//   const arcPath = document.createElementNS(svgNS, "path");
//   // Quadratic Bezier for gentle smile curve
//   arcPath.setAttribute(
//       "d",
//       `M${startX},${startY} Q${radius + fontSize},${startY + radius} ${endX},${endY}`
//   );
//   arcPath.setAttribute("id", pathId);
//   arcPath.setAttribute("fill", "transparent");

//   svg.appendChild(arcPath);

//   // Create text element
//   const textEl = document.createElementNS(svgNS, "text");
//   const textPath = document.createElementNS(svgNS, "textPath");
//   textPath.setAttributeNS(xlinkNS, "xlink:href", `#${pathId}`);
//   textPath.setAttribute("startOffset", "50%");
//   textPath.setAttribute("text-anchor", "middle");
//   textPath.setAttribute("dominant-baseline", "middle");
//   textPath.textContent = text;

//   textEl.appendChild(textPath);
//   textEl.setAttribute("font-size", fontSize);
//   textEl.setAttribute("fill", "#333");

//   svg.appendChild(textEl);

//   return svg;
// }