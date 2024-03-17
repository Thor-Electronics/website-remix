// import { useState } from "react";

// export const CurvedSlider = () => {
//   const [value, setValue] = useState<number>(24);

//   const handleValueChange = e => {
//     const newValue = parseInt(e.target.value, 10);
//     setValue(newValue);
//     // todo: other logics
//   };

//   return (
//     <div className="curved-slider-container">
//       <svg className="slider-curve">
//         {/* <!-- Outer frame of the thermostat --> */}
//         {/* <rect
//           x="10"
//           y="10"
//           width="80"
//           height="80"
//           rx="10"
//           ry="10"
//           fill="#f0f0f0"
//         /> */}

//         {/* <!-- Curved slider track --> */}
//         <path
//           d="M20 50 C30 30, 70 30, 80 50"
//           stroke="#007bff"
//           strokeWidth="2"
//           fill="none"
//         />

//         {/* <!-- Slider handle (adjust position based on temperature value) --> */}
//         <circle cx="50" cy="50" r="4" fill="#007bff" />

//         {/* <!-- Temperature display --> */}
//         <text x="50" y="80" textAnchor="middle" fontSize="12" fill="#333">
//           {value}°C
//         </text>
//       </svg>
//       <input
//         type="range"
//         name="value"
//         min={10}
//         max={32}
//         value={value}
//         onChange={handleValueChange}
//         className="slider"
//       />

//       <div className="value">{value}Celsius</div>
//     </div>
//   );
// };
