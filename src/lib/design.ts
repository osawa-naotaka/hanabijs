export type ColorValue = [number, number, number]; // rgb
export type SizeValue = string; // rem or other value
export type BrightnessValue = string; // persentage (color mix to black or white)

export type ColorSet = {
    primary: ColorValue;
    secondary: ColorValue;
    accent: ColorValue;
    background: ColorValue;
    text: ColorValue;
    success: ColorValue;
    error: ColorValue;
    warning: ColorValue;
    info: ColorValue;
};

export type BrightnessSet = {
    lightest: BrightnessValue;
    light: BrightnessValue;
    dark: BrightnessValue;
    darkest: BrightnessValue;
};

export type ColorRule = {
    category: ColorSet;
    brightness: BrightnessSet;
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
    line_height: number;
    font: S;
    spacing: S;
    width: S;
};

export type DesignRule = {
    color: {
        category: ColorSet;
        brightness: BrightnessSet;
    };
    size: {
        font: SizeRem;
        spacing: SizeRem;
        width: SizeRem;
    };
    font: {
        family: string[];
        base_size: string;
        line_height: string;
    };
};

export const default_design_rule: DesignRule = {
    color: {
        category: {
            primary: [63, 81, 181], // #3f51b5
            secondary: [33, 186, 69], // #21ba45
            accent: [255, 64, 129], // #ff4081
            text: [48, 48, 48], // #303030
            background: [240, 240, 240], // #f0f0f0
            success: [33, 186, 69], // #21ba45
            error: [219, 40, 40], // #db2828
            warning: [242, 113, 28], // #f2711c
            info: [49, 204, 236], // #31ccec
        },
        brightness: {
            lightest: "60%",
            light: "80%",
            dark: "80%",
            darkest: "60%",
        },
    },
    size: {
        font: {
            tiny: "0.75rem",
            small: "0.875rem",
            medium: "1rem",
            large: "1.125rem",
            xlarge: "1.25rem",
            x2large: "1.5rem",
            x3large: "2rem",
        },
        spacing: {
            tiny: "0.25rem",
            small: "0.5rem",
            medium: "1rem",
            large: "1.25rem",
            xlarge: "1.5rem",
            x2large: "2rem",
            x3large: "4rem",
        },
        width: {
            tiny: "450px", // 25rem
            small: "540px", // 30rem
            medium: "720px", // 40rem
            large: "960px", // 53rem
            xlarge: "1200px", // 66rem
            x2large: "1440px", // 80rem
            x3large: "1600px", // 88rem
        },
    },
    font: {
        family: ['"Helvetica Neue"', "Arial", "sans-serif"],
        base_size: "18px",
        line_height: "1.8",
    },
};
