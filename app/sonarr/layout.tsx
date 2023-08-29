import { Layout } from "@/components/layout";
import Link, { LinkProps } from "next/link";

export default function SonarrLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout
      title="Sonarr"
      linkPrefix="/sonarr"
      links={[
        { href: '/series', label: 'Series' },
        { href: '/calendar', label: 'Calendar' },
      ]}
    >
      {children}
    </Layout>
  )
}

interface SonarrLinkProps extends LinkProps {
  children: React.ReactNode;
}

function SonarrLink({ href, children, ...rest }: SonarrLinkProps) {
  return (
    <Link href={'/sonarr' + href} {...rest}>
      {children}
    </Link>
  )
}