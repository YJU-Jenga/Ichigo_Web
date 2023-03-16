const AddComment = () => {
  return (
    <div className="flex mx-auto items-center justify-center shadow-lg mt-56 mb-4 max-w-lg">
      <form className="w-full max-w-xl bg-white rounded-lg px-4 pt-2">
        <div className="flex flex-wrap -mx-3 mb-6">
          <h2 className="px-4 pt-3 pb-2 text-gray-800 text-lg">
            댓글 작성하기
          </h2>
          <div className="w-full md:w-full px-3 mb-2 mt-2">
            <textarea
              className="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
              name="body"
              placeholder="댓글을 입력해 주세요"
              required
            ></textarea>
          </div>
          <div className="w-full md:w-full flex items-start px-3">
            <div className="-mr-1">
              <input
                type="submit"
                className="bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
                value="작성"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddComment;
