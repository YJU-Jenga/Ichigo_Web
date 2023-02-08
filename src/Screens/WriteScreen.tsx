import React from "react";

export default function WriteScreen() {
  return (
    <form>
      <div className="min-h-screen md:px-20 pt-6 border">
        <div className=" bg-white rounded-md px-6 py-10 max-w-2xl mx-auto">
          <h1 className="text-center text-2xl font-bold text-gray-500 mb-10">
            글쓰기
          </h1>
          <div className="space-y-4">
            <div>
              <label className="text-lx">제목</label>
              <input
                type="text"
                placeholder="title"
                id="title"
                className="ml-2 outline-none py-1 px-2 text-md border-2 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-2 text-lg">글</label>
              <textarea
                id="description"
                // cols="30"
                // rows="10"
                placeholder="whrite here.."
                className="w-full font-serif border-2 p-4 text-gray-600 outline-none rounded-md"
              ></textarea>
            </div>
            <button className=" px-6 py-2 mx-auto block rounded-md text-lg font-semibold text-indigo-100 bg-indigo-600  ">
              글 쓰기
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
