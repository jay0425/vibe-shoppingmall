import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number | string;
};

const paths = {
  arrow: 'M5 12h14M13 5l7 7-7 7',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
  chart: 'M4 19V5M4 19h16M8 15l3-3 3 2 5-7',
  checkCircle: 'M9 12l2 2 4-5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  chevronLeft: 'M15 18l-6-6 6-6',
  chevronRight: 'M9 18l6-6-6-6',
  clipboard: 'M9 4h6M9 2h6v4H9zM6 5H4v17h16V5h-2',
  close: 'M18 6 6 18M6 6l12 12',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  heart:
    'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z',
  image: 'M4 5h16v14H4zM8 13l2-2 4 4 2-2 4 4M8 9h.01',
  layout: 'M4 5h16v14H4zM4 10h16M10 10v9',
  menu: 'M4 6h16M4 12h16M4 18h16',
  minus: 'M5 12h14',
  package: 'M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8',
  pencil: 'M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4',
  plus: 'M12 5v14M5 12h14',
  search: 'M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z',
  shoppingBag: 'M6 7h12l1 14H5L6 7zM9 7a3 3 0 0 1 6 0',
  store: 'M4 10h16l-2-6H6l-2 6zM5 10v10h14V10M9 20v-6h6v6',
  trash: 'M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14',
  truck:
    'M3 7h11v10H3zM14 10h4l3 3v4h-7zM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  user: 'M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  users:
    'M16 21a6 6 0 0 0-12 0M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21a6 6 0 0 0-5-5.9M17 3a4 4 0 0 1 0 8',
} as const;

function createIcon(path: string) {
  return function Icon({ size = 24, strokeWidth = 2, className, ...props }: IconProps) {
    return (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        viewBox="0 0 24 24"
        width={size}
        {...props}
      >
        <path d={path} />
      </svg>
    );
  };
}

export const ArrowRight = createIcon(paths.arrow);
export const ArrowUpRight = createIcon('M7 17 17 7M7 7h10v10');
export const Bell = createIcon(paths.bell);
export const CheckCircle2 = createIcon(paths.checkCircle);
export const ChevronLeft = createIcon(paths.chevronLeft);
export const ChevronRight = createIcon(paths.chevronRight);
export const ClipboardList = createIcon(paths.clipboard);
export const Eye = createIcon(paths.eye);
export const Heart = createIcon(paths.heart);
export const ImagePlus = createIcon(`${paths.image} ${paths.plus}`);
export const LayoutDashboard = createIcon(paths.layout);
export const Menu = createIcon(paths.menu);
export const Minus = createIcon(paths.minus);
export const Package = createIcon(paths.package);
export const Pencil = createIcon(paths.pencil);
export const Plus = createIcon(paths.plus);
export const PlusCircle = createIcon(`${paths.checkCircle} ${paths.plus}`);
export const Search = createIcon(paths.search);
export const ShoppingBag = createIcon(paths.shoppingBag);
export const Store = createIcon(paths.store);
export const Trash2 = createIcon(paths.trash);
export const TrendingUp = createIcon(paths.chart);
export const Truck = createIcon(paths.truck);
export const User = createIcon(paths.user);
export const Users = createIcon(paths.users);
export const X = createIcon(paths.close);
