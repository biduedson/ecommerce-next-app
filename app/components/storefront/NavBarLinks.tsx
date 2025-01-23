import Link from "next/link";

export const navBarLinks = [
  {
    id: 0,
    name: "Home",
    href: "/",
  },
  {
    id: 1,
    name: "All Products",
    href: "/products/all",
  },
  {
    id: 2,
    name: "Men",
    href: "/products/men",
  },
  {
    id: 3,
    name: "Women",
    href: "/products/Women",
  },
];

const NavBarLinks = () => {
  return (
    <div className="hidden md:flex justify-center items-center gap-x-4 ml-8">
      {navBarLinks.map((item) => (
        <Link href={item.href} key={item.id} className="font-medium">
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default NavBarLinks;
