import { build } from "@/cli/build";
import type { HNode, Repository } from "@/main";
import { generateStatic as static3 } from "@site/pages/index.html";
import { generateStatic as static1 } from "@site/pages/posts/[id].html";
import { generateStatic as static2 } from "@site/pages/tags/[tag].html";

export type PageList =
    | ((repo: Repository) => Promise<{
          css_js_path: string;
          pages: Promise<{
              node: HNode;
              path: string;
          }>[];
      }>)
    | ((repo: Repository) => Promise<{
          css_js_path: string;
          pages: {
              node: HNode;
              path: string;
          }[];
      }>);

export const static_list: PageList[] = [static1, static2, static3];

await build(static_list);
