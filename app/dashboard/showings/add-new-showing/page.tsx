"use client";
import AppShell from "@/components/layout/AppShell";
import { useRouter } from "next/navigation";

function AddNewShowing() {
  const router = useRouter();
  return (
    <AppShell>
      {() => (
        <div className="w-full md:w-[80%] mx-auto bg-[#e8e8e82f] my-8 p-4 md:p-8 rounded-lg">
          <form onSubmit={() => {}} className="space-y-8">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-black">
                Add New Showing
              </h1>
              <p className="mt-1 text-xs text-gray-500">
                Specify showing details to add
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    // value={email}
                    // onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="eg. 3 Bedroom Terrace. Ikoyi"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <input
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="eg. Rent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    // value={email}
                    // onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black-500 focus:border-black-500"
                    placeholder="eg. 30"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harvest Cycle
                  </label>
                  <input
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder=""
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Quantity
                  </label>
                  <input
                    type="number"
                    // value={email}
                    // onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black-500 focus:border-black-500"
                    placeholder="eg. 30"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image
                  </label>
                  <input
                    type="file"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder=""
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                type="submit"
                className="w-full bg-white border hover:bg-[#ecececef] text-black font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full bg-black hover:bg-[#000000ef] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Showing
              </button>
            </div>
          </form>
        </div>
      )}
    </AppShell>
  );
}

export default AddNewShowing;
