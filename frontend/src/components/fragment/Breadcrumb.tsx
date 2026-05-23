import { Link } from "react-router-dom";

interface BreadcrumbProps {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

const Breadcrumb = ({ title, breadcrumbItems }: BreadcrumbProps) => {
  return (
    <div className="flex justify-between items-center">
      <p className="text-xl font-semibold text-black">{title}</p>
      <nav
        className="flex text-gray-700 rounded-lg bg-transparent"
        aria-label="Breadcrumb"
      >
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="inline-flex items-center">
              {index !== 0 && (
                <svg
                  className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              )}

              {index === breadcrumbItems.length - 1 ? (
                <span className="text-sm font-medium text-gray-400">
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.url}
                  className="text-sm font-medium text-gray-400 hover:text-primary"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
