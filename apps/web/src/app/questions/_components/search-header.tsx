function SearchHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        <input
          type="text"
          placeholder="문제 검색..."
          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
        />
      </div>
    </div>
  );
}

export default SearchHeader;
