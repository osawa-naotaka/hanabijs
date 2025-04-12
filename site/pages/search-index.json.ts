import { getAllMarkdowns } from "@/server";
import { postFmSchema, posts_dir } from "@site/config/site.config";
import { LinearIndex, StaticSeekError, createIndex, indexToObject } from "staticseek";

export default async function createSearchIndex(): Promise<string> {
    const posts = await getAllMarkdowns(posts_dir, postFmSchema);
    const index = createIndex(LinearIndex, posts, {
        key_fields: ["slug", "data"],
        search_targets: ["data.title", "content"],
    });
    if (index instanceof StaticSeekError) throw index;
    return JSON.stringify(indexToObject(index));
}
