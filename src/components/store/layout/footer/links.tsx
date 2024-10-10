import { SubCategory } from "@prisma/client";
import Link from "next/link";

export default function Links({ subs }: { subs: SubCategory[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-4 mt-5 text-sm">
      {/* SubCategories */}
      <div className="spcae-y-4">
        <h1 className="text-lg font-bold">Find it Fast</h1>
        <ul className="flex flex-col gap-y-1">
          {subs.map((sub) => (
            <Link key={sub.id} href={`/browse?subCategory=${sub.url}`}>
              <li>
                <span>{sub.name}</span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
      {/* Profile links */}
      <div className="space-y-4 md:mt-10">
        <ul className="flex flex-col gap-y-1">
          {footer_links.slice(0, 6).map((link) => (
            <Link href={link.link}>
              <li>
                <span>{link.title}</span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
      <div className="space-y-4">
        <h1 className="text-lg font-bold">Customer care</h1>
        <ul className="flex flex-col gap-y-1">
          {footer_links.slice(6).map((link) => (
            <Link href={link.link}>
              <li>
                <span>{link.title}</span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
      {/* Customer care */}
    </div>
  );
}
const footer_links = [
  {
    title: "About",
    link: "/about",
  },
  {
    title: "Contact",
    link: "/contact",
  },
  {
    title: "Wishlist",
    link: "/profile/wishlist",
  },
  {
    title: "Compare",
    link: "/compare",
  },
  {
    title: "FAQ",
    link: "/faq",
  },
  {
    title: "Store Directory",
    link: "/profile",
  },
  {
    title: "My Account",
    link: "/profile",
  },
  {
    title: "Track your Order",
    link: "/track-order",
  },
  {
    title: "Customer Service",
    link: "/customer-service",
  },
  {
    title: "Returns/Exchange",
    link: "/returns-exchange",
  },
  {
    title: "FAQs",
    link: "/faqs",
  },
  {
    title: "Product Support",
    link: "/product-support",
  },
];
