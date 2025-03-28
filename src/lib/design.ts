export type ColorValue = number; // rgb
export type SizeValue = number; // rem

export type ColorSet = {
    default: ColorValue;
    light?: ColorValue;
    dark?: ColorValue;
};

export type MainColorSet = {
    primary: ColorSet;
    secondary: ColorSet;
    accent: ColorSet;
    background: ColorSet;
    text: ColorSet;
};

export type SubColorSet = {
    success: ColorValue;
    error: ColorValue;
    warning: ColorValue;
    info: ColorValue;
};

export type ColorRule = {
    main: MainColorSet;
    sub: SubColorSet;
};

export type SizeRem = {
    tiny: SizeValue;
    small: SizeValue;
    medium: SizeValue;
    large: SizeValue;
    xlarge: SizeValue;
    x2large: SizeValue;
    x3large: SizeValue;
};

export type SizeRule = {
    root: number; // pixel
    font: Partial<SizeRem>;
    spacing: Partial<SizeRem>;
};

export type DesignRule = {
    color: ColorRule;
    size: SizeRule;
};

export const default_design_rule: DesignRule = {
    color: {
        main: {
            primary: { default: 0x3f51b5 },
            secondary: { default: 0x21ba45 },
            accent: { default: 0xff4081 },
            text: { default: 0x303030 },
            background: { default: 0xf0f0f0 },
        },
        sub: {
            success: 0x21ba45,
            error: 0xdb2828,
            warning: 0xf2711c,
            info: 0x31ccec,
        },
    },
    size: {
        root: 18,
        font: {},
        spacing: {},
    },
};

export type DesignRuleScaling = {
    color: ColorScaling;
    size: {
        font: SizeScaling;
        spacing: SizeScaling;
    };
};

type ColorScaling = {
    light: number;
    dark: number;
};

type SizeScaling = {
    tiny: number;
    small: number;
    medium: number;
    large: number;
    xlarge: number;
    x2large: number;
    x3large: number;
};

export const default_design_rule_scaling: DesignRuleScaling = {
    color: {
        light: 1.2,
        dark: 0.8,
    },
    size: {
        font: {
            tiny: 0.75,
            small: 0.875,
            medium: 1,
            large: 1.125,
            xlarge: 1.25,
            x2large: 1.5,
            x3large: 2,
        },
        spacing: {
            tiny: 0.25,
            small: 0.5,
            medium: 1,
            large: 1.25,
            xlarge: 1.5,
            x2large: 2,
            x3large: 4,
        },
    },
};

export function generateDesignRule(
    rule: Partial<DesignRule>,
    scale: Partial<DesignRuleScaling> = {},
): Required<DesignRule> {
    const initial_scale: DesignRuleScaling = { ...default_design_rule_scaling, ...scale };
    const initial_rule: DesignRule = JSON.parse(JSON.stringify({ ...default_design_rule, ...rule }));

    initial_rule.color.main.primary = interpolate(
        initial_rule.color.main.primary,
        initial_rule.color.main.primary.default,
        initial_scale.color,
    );
    initial_rule.color.main.secondary = interpolate(
        initial_rule.color.main.secondary,
        initial_rule.color.main.secondary.default,
        initial_scale.color,
    );
    initial_rule.color.main.accent = interpolate(
        initial_rule.color.main.accent,
        initial_rule.color.main.accent.default,
        initial_scale.color,
    );
    initial_rule.color.main.text = interpolate(
        initial_rule.color.main.text,
        initial_rule.color.main.text.default,
        initial_scale.color,
    );
    initial_rule.color.main.background = interpolate(
        initial_rule.color.main.background,
        initial_rule.color.main.background.default,
        initial_scale.color,
    );

    initial_rule.size.font = interpolate(initial_rule.size.font, initial_rule.size.root, initial_scale.size.font);
    initial_rule.size.spacing = interpolate(
        initial_rule.size.spacing,
        initial_rule.size.root,
        initial_scale.size.spacing,
    );

    return initial_rule;
}

export function interpolate<T extends Record<string, number>, S extends Record<string, number>>(
    values: Partial<T>,
    main_val: number,
    scale: S,
): T {
    const inter = JSON.parse(JSON.stringify(values));
    for (const key of Object.keys(scale)) {
        if (inter[key] === undefined) {
            inter[key] = main_val * scale[key];
        }
    }
    return inter;
}
