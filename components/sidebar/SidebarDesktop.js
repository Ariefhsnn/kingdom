import Link from "next/link";

const SidebarDesktop = (props) => {
  let { sidebar, setSideBar, images, header, children } = props;

  const handleShow = () => {
    setSideBar(!sidebar);
  };
  return (
    <>
      <div className="relative group-hover:w-full">
        <aside className="fixed z-50 hidden md:flex hover:w-full max-w-xs transform transition-all duration-700 ease-in-out inset-y-0 shadow-lg lg:flex-shrink-0 bg-[#324158] w-full">
          <div className="w-full mb-6 flex flex-col overflow-y-auto">
            {/* Logo section */}
            <div className="sticky top-0 z-40 bg-transparent px-6 py-3.5 flex flex-items transform transition-all duration-700 ease-in-out">
              <Link href="/">
                <a className="w-full">
                  <div className="mt-5 flex items-center gap-5">
                    <div className="h-[60px] w-[60px] bg-black rounded-full"></div>
                    <div className="flex flex-col text-white">
                      <p className="text-sm font-bold uppercase"> gb </p>
                      <p className=" text-3xl font-bold"> connect </p>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
            <ul className="mt-6 leading-10">{children}</ul>
          </div>
        </aside>
        <div
          onClick={handleShow}
          className={`${
            sidebar &&
            "fixed z-40 inset-0 bg-black bg-opacity-40 transition-opacity duration-100 transform opacity-100"
          }`}
        ></div>
      </div>
    </>
  );
};
export default SidebarDesktop;
