// // Header.tsx
// import React, { useState, useEffect } from "react";

// const HeaderPublic: React.FC = () => {
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <header className={`fixed w-full transition-all duration-300 z-50 ${
//       scrolled ? "bg-white/90 backdrop-blur-sm shadow-sm py-2" : "bg-transparent py-4"
//     }`}>
//       <div className="container mx-auto px-4 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <img
//             src="/logoApp2.jpg"
//             alt="Los Arturos Logo"
//             className="h-10 w-10 rounded-full object-cover border border-gray-200"
//           />
//           <h1 className={`font-light tracking-wide ${scrolled ? "text-black" : "text-black"}`}>
//             <span className="font-medium">Absences</span> by Los Arturos
//           </h1>
//         </div>

//         <nav className="hidden md:block">
//           <ul className="flex items-center gap-6">
//             <li>
//               <a href="#" className="text-gray-700 hover:text-black transition-colors">
//                 Dashboard
//               </a>
//             </li>
//             <li>
//               <a href="#" className="text-gray-700 hover:text-black transition-colors">
//                 About
//               </a>
//             </li>
//             <li>
//               <button className="px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors">
//                 Login
//               </button>
//             </li>
//           </ul>
//         </nav>

//         <button className="md:hidden text-black">
//           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//         </button>
//       </div>
//     </header>
//   );
// };

// export default HeaderPublic ;
