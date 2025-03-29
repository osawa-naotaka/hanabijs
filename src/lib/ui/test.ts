
type ButtonAttributeName =
    | "common"
    | "button_attr1"
    | "button_attr2";
type ButtonAttribute = Record<ButtonAttributeName, string>;

type LinkAttributeName =
    | "common"
    | "link_attr1"
    | "link_attr2";
type LinkAttribute = Record<LinkAttributeName, string>;

type AttributeMap = {
    button: ButtonAttribute;
    link: LinkAttribute;
}

type Tag = "button" | "link";

type ReturnValue<K> = (attr: AttributeMap[K & keyof AttributeMap]) => {
    tag: Tag;
    attr: AttributeMap[K & keyof AttributeMap];
}

function semantic<K extends Tag>(tag: K): ReturnValue<K> {
    return (attr: AttributeMap[K & keyof AttributeMap]) => ({ tag, attr });
}

export function hLinkedButton(): ReturnValue<"link"> {
    return () => semantic("button");
}


export function hButton(
    prop: Partial<HButtonProperty> = {},
): HComponentFn<Partial<ButtonAttribute>> {
    const HButton = semantic("button");

    return (attribute) => HButton(attribute);
}
