// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ItemuseScreen = () => {
//   const [boardList, setList] = useState([
//     {
//       id: "",
//       title: "",
//       content: "",
//       createdOn: "",
//     },
//   ]);

//   useEffect(() => {
//     axios
//       .get("/boards")
//       .then((res) => setList(res.data))
//       .catch((error) => console.log(error));
//   });

//   return (
//     <>
//       <h1 className="text-gray-900 text-3xl title-font font-medium my-10 grid place-items-center">
//         사용 후기
//       </h1>
//       {dummyData.map((board) => {
//         return (
//           <div className="p-4 items-center justify-center w-[680px] rounded-xl group sm:flex space-x-6 bg-white bg-opacity-50 shadow-xl hover:rounded-2xl my-3">
//             <img
//               className="mx-auto block w-4/12 h-40 rounded-lg"
//               alt="art cover"
//               loading="lazy"
//               src="img/sad_gosung.jpg"
//             />
//             <div className="sm:w-8/12 pl-0 p-5">
//               <div className="space-y-2">
//                 <div className="space-y-4">
//                   <h4 className="text-xl font-bold text-cyan-900 text-justify">
//                     {board.title}
//                   </h4>
//                   <p>{board.content}</p>
//                 </div>
//                 <div className="flex items-center space-x-4 justify-between">
//                   <div className="flex gap-3 space-y-1">
//                     <span className="text-sm font-bold">{board.user}</span>
//                   </div>
//                   <div className=" px-3 py-1 rounded-lg flex space-x-2 flex-row"></div>
//                   <div className="text-grey-500 flex flex-row space-x-1  my-4">
//                     <svg
//                       stroke="currentColor"
//                       fill="none"
//                       stroke-width="0"
//                       viewBox="0 0 24 24"
//                       height="1em"
//                       width="1em"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                         stroke-width="2"
//                         d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                       ></path>
//                     </svg>
//                     <p className="text-xs">{board.createdOn}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </>
//   );
// };

// export default ItemuseScreen;

// const dummyData = [
//   {
//     id: 1,
//     title: "테스트 글1 제목입니다.",
//     content: "제가 최곱니다.",
//     user: "우니1",
//     createdOn: "2023-05-23",
//   },
//   {
//     id: 2,
//     title: "테스트 글2 제목입니다.",
//     content: "제가 최곱니다.",
//     user: "우니2",
//     createdOn: "2023-05-23",
//   },
//   {
//     id: 3,
//     title: "테스트 글3 제목입니다.",
//     content: "제가 최곱니다.",
//     user: "우니3",
//     createdOn: "2023-05-23",
//   },
// ];
export {};
