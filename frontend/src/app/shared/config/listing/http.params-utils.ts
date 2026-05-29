import { HttpParams } from "@angular/common/http";
import { ListQuery } from "./listing.dto";

export function toHttpParams(Q: ListQuery): HttpParams {
  let p = new HttpParams()
    .set("page", String(Q.page))
    .set("size", String(Q.size));
  if (Q.sortBy) p = p.set("sortBy", Q.sortBy);
  if (Q.sortOrder) p = p.set("sortOrder", Q.sortOrder);

  const F = Q.filters ?? {};
  Object.entries(F).forEach(([key, value]) => {
    p = p.set(key, String(value));
  });
  return p;
}
