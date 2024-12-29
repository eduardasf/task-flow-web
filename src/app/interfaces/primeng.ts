export class PageEvent {
  first?: number;
  rows: number | undefined;
  page: number | undefined;
  pageCount: number | undefined;
  total: number | undefined;
  globalFilter?: string | null | undefined;
  status?: string;

  constructor(init?: Partial<PageEvent>) {
    Object.assign(this, init);
  }
}
