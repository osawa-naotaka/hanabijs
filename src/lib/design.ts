import { MIX_BLACK, MIX_WHITE } from "./stylerules";

export type ColorValue = string; // rgb
export type SizeValue = number; // rem

export type ColorSet = {
    default: ColorValue;
    light?: ColorValue;
    dark?: ColorValue;
};

export type MainColorSet<C extends Required<ColorSet> | ColorSet> = {
    primary: C;
    secondary: C;
    accent: C;
    background: C;
    text: C;
};

export type SubColorSet = {
    success: ColorValue;
    error: ColorValue;
    warning: ColorValue;
    info: ColorValue;
};

export type ColorRule<C extends Required<ColorSet> | ColorSet> = {
    main: MainColorSet<C>;
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

export type SizeRule<S extends SizeRem | Partial<SizeRem>> = {
    root: number; // pixel
    font: S;
    spacing: S;
    width: S;
};

export type DesignRule<S extends SizeRem | Partial<SizeRem>, C extends Required<ColorSet> | ColorSet> = {
    color: ColorRule<C>;
    size: SizeRule<S>;
};

export type RequiredDesignRule = DesignRule<SizeRem, Required<ColorSet>>;
export type PartialDesignRule = DesignRule<Partial<SizeRem>, ColorSet>;

export const default_design_rule: PartialDesignRule = {
    color: {
        main: {
            primary: { default: "#3f51b5" },
            secondary: { default: "#21ba45" },
            accent: { default: "#ff4081" },
            text: { default: "#303030" },
            background: { default: "#f0f0f0" },
        },
        sub: {
            success: "#21ba45",
            error: "#db2828",
            warning: "#f2711c",
            info: "#31ccec",
        },
    },
    size: {
        root: 18,
        font: {},
        spacing: {},
        width: {},
    },
};

export type DesignRuleScaling<
    C extends ColorScaling | Partial<ColorScaling>,
    S extends SizeScaling | Partial<SizeScaling>,
> = {
    color: C;
    size: {
        font: S;
        spacing: S;
        width: S;
    };
};

type ColorScaling = {
    light: string;
    dark: string;
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

export type PartialDesignRuleScaling = DesignRuleScaling<Partial<ColorScaling>, Partial<SizeScaling>>;
export type RequiredDesignRuleScaling = DesignRuleScaling<ColorScaling, SizeScaling>;

export const default_design_rule_scaling: RequiredDesignRuleScaling = {
    color: {
        light: "90%",
        dark: "90%",
    },
    size: {
        // under 1rem = 18px
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
        width: {
            tiny: 24, // 480px
            small: 40, // 720px
            medium: 53, // 960px
            large: 66, // 1200px
            xlarge: 80, // 1440px
            x2large: 88, // 1600px
            x3large: 106, // 1920px
        },
    },
};

export function generateDesignRule(rule: PartialDesignRule, scale: RequiredDesignRuleScaling): RequiredDesignRule {
    const initial_scale = Object.assign({}, default_design_rule_scaling, scale);
    const initial_rule = { ...default_design_rule, ...rule };

    const primary = mixColor(initial_rule.color.main.primary, scale.color);
    const secondary = mixColor(initial_rule.color.main.secondary, scale.color);
    const accent = mixColor(initial_rule.color.main.accent, scale.color);
    const text = mixColor(initial_rule.color.main.text, scale.color);
    const background = mixColor(initial_rule.color.main.background, scale.color);

    const font = interpolate(initial_rule.size.font, initial_rule.size.root, initial_scale.size.font);
    const spacing = interpolate(initial_rule.size.spacing, initial_rule.size.root, initial_scale.size.spacing);
    const width = interpolate(initial_rule.size.width, initial_rule.size.root, initial_scale.size.width);

    return {
        color: {
            main: { primary, secondary, accent, text, background },
            sub: initial_rule.color.sub,
        },
        size: { font, spacing, width, root: initial_rule.size.root },
    };
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

export function mixColor(value: ColorSet, scale: ColorScaling): Required<ColorSet> {
    return {
        default: value.default,
        light: value.light || MIX_WHITE(value.default)(scale.light),
        dark: value.dark || MIX_BLACK(value.default)(scale.dark),
    };
}
