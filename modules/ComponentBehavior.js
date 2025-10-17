// =============================
// IconBehavior.js
// =============================
export function attachIconBehavior(icon, cx, cy, phase = 0) {
        const baseAngle = 0;      // center rotation
        const amplitude = 10;      // swing range
        const speed = 1;        // radians/sec (lower = slower)
      
        function animate(time) {
          const t = time / 1000;
          const angle = baseAngle + amplitude * Math.sin(t * speed + phase);
          icon.setAttribute("transform", `rotate(${angle}, ${cx}, ${cy})`);
          requestAnimationFrame(animate);
        }
      
        requestAnimationFrame(animate);
      
        // placeholder events
        icon.addEventListener("mouseenter", () => {});

        icon.addEventListener("mouseleave", () => {});

        icon.addEventListener("click", (e) => {
          console.log("Clicked Icon")
          e.stopPropagation(); // 🧱 Prevents the click from bubbling to the container          
          document.querySelector("#top-row-right-panel").style.width = "30%";                   
        });
      }


// =============================
// IconBehavior.js
// =============================
// export function attachIconBehavior(svg, iconElement, labelText, cx, cy, phase = 0) {
//   const baseAngle = 0;      // center rotation
//   const amplitude = 10;     // swing range
//   const speed = 1;          // radians/sec (lower = slower)

//   // === Create label ===
//   const svgNS = "http://www.w3.org/2000/svg";
//   const group = document.createElementNS(svgNS, "g");

//   // Move icon inside its group
//   iconElement.remove(); 
//   group.appendChild(iconElement);

//   // Create arc path for label
//   const arcId = `label-arc-${Math.random().toString(36).substr(2, 8)}`;
//   const arcRadius = 10;
//   const arcPath = document.createElementNS(svgNS, "path");
//   arcPath.setAttribute("id", arcId);

//   const startAngle = -Math.PI / 2 - 0.8;
//   const endAngle = -Math.PI / 2 + 0.8;
//   const x1 = cx + arcRadius * Math.cos(startAngle);
//   const y1 = cy + arcRadius * Math.sin(startAngle);
//   const x2 = cx + arcRadius * Math.cos(endAngle);
//   const y2 = cy + arcRadius * Math.sin(endAngle);
//   const d = `M ${x1},${y1} A ${arcRadius},${arcRadius} 0 0,1 ${x2},${y2}`;

//   arcPath.setAttribute("d", d);
//   arcPath.setAttribute("fill", "none");
//   arcPath.setAttribute("stroke", "none");
//   group.appendChild(arcPath);

//   const label = document.createElementNS(svgNS, "text");
//   const textPath = document.createElementNS(svgNS, "textPath");
//   textPath.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#${arcId}`);
//   textPath.textContent = labelText;
//   label.appendChild(textPath);
//   label.setAttribute("class", "icon-label");
//   label.style.opacity = 0;
//   label.style.transition = "opacity 0.3s ease";
//   label.style.fontSize = "3px";
//   label.style.fontFamily = "sans-serif";
//   label.style.fill = "#222";
//   group.appendChild(label);

//   // Add group to SVG
//   svg.appendChild(group);

//   // === Animation loop ===
//   function animate(time) {
//     const t = time / 1000;
//     const angle = baseAngle + amplitude * Math.sin(t * speed + phase);
//     iconElement.setAttribute("transform", `rotate(${angle}, ${cx}, ${cy})`);
//     requestAnimationFrame(animate);
//   }
//   requestAnimationFrame(animate);

//   // === Events ===
//   group.addEventListener("mouseenter", () => {
//     label.style.opacity = 1;
//   });

//   group.addEventListener("mouseleave", () => {
//     label.style.opacity = 0;
//   });

//   group.addEventListener("click", (e) => {
//     e.stopPropagation(); // Prevent parent click
//     console.log(`Clicked icon: ${labelText}`);
//     document.querySelector("#top-row-right-panel").style.width = "30%";
//   });
// }










// ====================================================================================
// ====================================================================================
// ====================================================================================


// ==================== CURVE BEHAVIOR ====================
export function attachCurveBehavior(path, basePoints) {
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



