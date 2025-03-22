import type { HRootPageFn, Repository } from "hanabijs";
import page from "../components/page";
import { site } from "../config";

export default function Root(repo: Repository): HRootPageFn<void> {
    const Page = page(repo);

    return async () => Page(site);
}
