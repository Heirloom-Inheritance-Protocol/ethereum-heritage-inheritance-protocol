export interface NavItem {
  name: string;
  link: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { name: "Home", link: "/" },
  { name: "Inherit", link: "/inherit" },
  { name: "Received/Vault", link: "/received-vault" },
  { name: "Dashboard", link: "/dashboard" },
];
