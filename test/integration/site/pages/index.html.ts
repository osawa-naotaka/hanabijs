import type { HRootPageFn, Store } from "zephblaze/core";
import page from "../components/page";
import { site } from "../config";

export default function Root(store: Store): HRootPageFn<void> {
    const Page = page(store);

    return async () => Page(site);
}
