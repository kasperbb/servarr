import Link from "next/link";
import { Icon } from "./ui/icon";

interface SidebarProps {
}

export function Sidebar({ }: SidebarProps) {
  return (
    <aside className="fixed bottom-0 left-0 z-40 w-screen border-r md:w-16 md:h-screen md:top-0 border-r-dark-700">
      <div className="h-full px-3 py-4 overflow-y-auto bg-dark-800">
        <ul className="flex justify-center gap-2 font-medium md:justify-start md:flex-col">
          <li>
            <Link href="/sonarr" className="flex items-center justify-center p-2 text-white rounded-lg hover:bg-dark-700 group">
              <Icon name="sonarr" />
            </Link>
          </li>
          <li>
            <Link href="/radarr" className="flex items-center justify-center p-2 text-white rounded-lg hover:bg-dark-700 group">
              <Icon name="radarr" />
            </Link>
          </li>
          <li>
            <Link href="/qbittorrent" className="flex items-center justify-center p-2 text-white rounded-lg hover:bg-dark-700 group">
              <Icon name="qbitttorrent" />
            </Link>
          </li>
          <li>
            <Link href="/settings" className="flex items-center justify-center p-2 text-white rounded-lg hover:bg-dark-700 group">
              <Icon name="settings" />
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  )
}