import { createComponent, Nav, Ul, Li, A } from "@/main";
import { navigation } from "@site/config/site.config";
import { SVGIcon } from "../element/SVGIcon";

export const Navigation = createComponent(() => 
    Nav({},
        Ul({}, 
            Li({ class: "text" }, A({ href: "/blog"}, "BLOG")),
            ...navigation.map((item) => Li({}, 
                A({ href: item.url, target: "__blank" }, 
                    SVGIcon({ name: item.icon })
                )
            ))
        )
    )
);
