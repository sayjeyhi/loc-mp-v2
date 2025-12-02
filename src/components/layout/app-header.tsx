export function AppHeader() {
  return (
    <div>
      <h1 className="font-normal ">
        Hello, QA Galia test
      </h1>

      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-500 -mt-1 ">
        <span className="text-xs">
          Account Number : <span>A1394592</span>
        </span>

        <span className="opacity-80"> - </span>

        <span className="text-xs">Account Status:</span>

        <div className="flex items-center gap-2 px-2 py-0.5 border bg-gray-100 border-gray-200 rounded-full">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs font-medium">Active</span>
        </div>
      </div>
    </div>
  );
}

