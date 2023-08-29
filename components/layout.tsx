import Link, { LinkProps } from "next/link";

interface LayoutProps {
  title: string;
  links: {
    href: string;
    label: string;
  }[];
  children: React.ReactNode;
  linkPrefix?: string;
}

export function Layout({ title, links, children, linkPrefix }: LayoutProps) {
  function withPrefix(path: string) {
    return typeof linkPrefix === 'string' ? linkPrefix + path : path;
  }

  return (
    <div>
      <nav className="flex items-center p-4 border-b bg-dark-800 border-b-dark-700">
        <h1 className="mr-4 text-2xl font-semibold">{title}</h1>
        <ul className="flex gap-2">
          {links.map((link) => (
            <li key={link.href + link.label}>
              <LayoutLink href={withPrefix(link.href)}>{link.label}</LayoutLink>
            </li>
          ))}
        </ul>
      </nav>
      <main className="p-4">
        {children}
      </main>
    </div>
  )
}

interface LayoutLinkProps extends LinkProps {
  children: React.ReactNode;
}

function LayoutLink({ href, children, ...rest }: LayoutLinkProps) {
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  )
}