import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-1">
          <span className="font-heading text-2xl tracking-tight text-foreground">
            wear<span className="text-accent-foreground">joy</span>
          </span>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            매일의 무드를 완성하는
            <br />
            부드러운 데일리 여성 의류 셀렉트샵
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">쇼핑</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/?category=new" className="hover:text-foreground">
                신상품
              </Link>
            </li>
            <li>
              <Link href="/?category=best" className="hover:text-foreground">
                베스트
              </Link>
            </li>
            <li>
              <Link href="/?category=dress" className="hover:text-foreground">
                원피스
              </Link>
            </li>
            <li>
              <Link href="/?category=outer" className="hover:text-foreground">
                아우터
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">고객센터</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/orders" className="hover:text-foreground">
                주문 조회
              </Link>
            </li>
            <li>
              <span>배송 안내</span>
            </li>
            <li>
              <span>교환 / 반품</span>
            </li>
            <li>
              <Link href="/admin" className="hover:text-foreground">
                관리자
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">고객센터 1599-0000</h4>
          <p className="text-sm leading-relaxed text-muted-foreground">
            평일 10:00 - 17:00
            <br />
            점심 12:30 - 13:30 / 주말·공휴일 휴무
          </p>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © 2026 wearjoy. All rights reserved.
      </div>
    </footer>
  );
}
