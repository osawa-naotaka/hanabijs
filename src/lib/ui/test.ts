type ButtonAttributeName = "common" | "button_attr1";
type ButtonAttribute = Record<ButtonAttributeName, string>;

type LinkAttributeName = "common" | "link_attr1";
type LinkAttribute = Record<LinkAttributeName, string>;

type AttributeMap = {
    button: ButtonAttribute;
    link: LinkAttribute;
};

type Tag = "button" | "link";

type ReturnValFn<T> = (argument: T) => Value<T>;

type Value<T> = {
    tag: Tag;
    attr: T;
};

function semantic<K extends Tag>(tag: K): ReturnValFn<Partial<AttributeMap[K]>> {
    return (attr: Partial<AttributeMap[K]>) => ({ tag, attr });
}

export function generate(): ReturnValFn<Partial<LinkAttribute>> {
    return semantic("button");
}
