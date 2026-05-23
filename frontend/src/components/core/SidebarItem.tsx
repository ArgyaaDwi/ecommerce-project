import { useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { SidebarContext } from "./Sidebar";

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  url: string;
}

export default function SidebarItem({ icon, text, url }: SidebarItemProps) {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(
      "SidebarItem must be used within a SidebarContext.Provider",
    );
  }

  const { pathname } = useLocation();
  const isActive = pathname === url;

  return (
    <li className="my-1">
      <Link
        to={url}
        className={`relative flex items-center py-2 px-3
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${
            isActive
              ? "bg-primary text-white"
              : "hover:bg-indigo-50 text-gray-600"
          }
        `}
      >
        {icon}
        <span className="ml-3">{text}</span>
      </Link>
    </li>
  );
}
