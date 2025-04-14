export type Comma<T> = T | T[];
export type SpaceComma<T> = T | T[] | T[][];

// Global Property
export type PInherit = "inherit";
export type PInitial = "initial";
export type PRevert = "revert";
export type PRevertLayer = "revert-layer";
export type PUnset = "unset";

export type PGlobal = PInherit | PInitial | PRevert | PRevertLayer | PUnset;
export type PAnimationGlobal = PGlobal;
export type PTransitionGlobal = PGlobal;
export type PColorGlobal = PGlobal;
export type PBoxModelGlobal = PGlobal;
export type PFontGlobal = PGlobal;
export type PPositionGlobal = PGlobal;

//
export type CssTime = `${number}s` | `${number}ms`;
export type CssLengthUnit =
    | "cap"
    | "ch"
    | "em"
    | "ex"
    | "ic"
    | "lh"
    | "rcap"
    | "rch"
    | "rem"
    | "rex"
    | "ric"
    | "rlh"
    | "vh"
    | "vw"
    | "vmax"
    | "vmin"
    | "vb"
    | "vi"
    | "cqw"
    | "cqh"
    | "cqi"
    | "cqb"
    | "cqmin"
    | "cqmax"
    | "px"
    | "cm"
    | "mm"
    | "Q"
    | "in"
    | "pc"
    | "pt";
export type CssLength = `${number}${CssLengthUnit}`;
export type CssPersentage = `${number}%`;
export type CssLengthPersentage = CssLength | CssPersentage;
export type CssTimelineRangeName = "cover" | "contain" | "entry" | "exit" | "entry-crossing" | "exit-crossing";

// Align-*
export type AlignContentBaseKeyword =
    | "normal"
    | "start"
    | "center"
    | "end"
    | "flex-start"
    | "flex-end"
    | "baseline"
    | "first baseline"
    | "last baseline"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | "stretch";

export type AlignContentKeyword =
    | AlignContentBaseKeyword
    | ["safe", AlignContentBaseKeyword]
    | ["unsafe", AlignContentBaseKeyword];

// Align items values
export type AlignItemsSelfPosition = "center" | "start" | "end" | "self-start" | "self-end" | "flex-start" | "flex-end";

export type AlignItemsValue =
    | "normal"
    | "stretch"
    | "anchor-center"
    | "baseline"
    | "first baseline"
    | "last baseline"
    | AlignItemsSelfPosition
    | ["safe", AlignItemsSelfPosition]
    | ["unsafe", AlignItemsSelfPosition];

export type AlignSelfValue =
    | "auto"
    | "normal"
    | "stretch"
    | "baseline"
    | "first baseline"
    | "last baseline"
    | "anchor-center"
    | AlignItemsSelfPosition
    | ["unsafe", AlignItemsSelfPosition]
    | ["safe", AlignItemsSelfPosition];

export type AlignmentBaselineValue =
    | "baseline"
    | "text-bottom"
    | "alphabetic"
    | "ideographic"
    | "middle"
    | "central"
    | "mathematical"
    | "text-top";

// animation-*
// Animation property 関連の型
export type AnimationNameValue = string;
export type AnimationCompositionValue = "replace" | "add" | "accumulate";
export type AnimationDelayValue = CssTime;
export type AnimationDirectionValue = "normal" | "reverse" | "alternate" | "alternate-reverse";
export type AnimationDurationValue = CssTime;
export type AnimationFillModeValue = "none" | "forwards" | "backwards" | "both";
export type AnimationIterationCountValue = `${number}` | "infinite";
export type AnimationPlayStateValue = "running" | "paused";
export type AnimationRangeSingleValue =
    | "normal"
    | CssLengthPersentage
    | CssTimelineRangeName
    | [CssTimelineRangeName, CssLengthPersentage];
export type AnimationRangeValue = AnimationRangeSingleValue | [AnimationRangeSingleValue, AnimationRangeSingleValue];

export type AnimationTimeline = "auto" | "none" | `--${string}` | ScrollParam | ViewParen;
export type ScrollParam =
    | `scroll(${Axis})`
    | `scroll(${Scroller})`
    | `scroll(${Axis} ${Scroller})`
    | `scroll(${Scroller} ${Axis})`;
export type ViewParen =
    | `view(${Axis})`
    | `view(${ViewTimelineInsetValue})`
    | `view(${Axis} ${ViewTimelineInsetValue})`
    | `view(${ViewTimelineInsetValue} ${Axis})`;
export type Scroller = "root" | "nearest" | "self";
export type Axis = "block" | "inline" | "x" | "y";
export type ViewTimelineInsetValue =
    | ViewTimelineInsetSingleValue
    | `${ViewTimelineInsetSingleValue} ${ViewTimelineInsetSingleValue}`;
export type ViewTimelineInsetSingleValue = "auto" | CssLengthPersentage;

export type AnimationTimingFunctionValue = LinearEasingFunction | CubicBezierEasingFunction | StepEasingFunction;
export type LinearEasingFunction = "linear" | Linear;
export type CubicBezierEasingFunction = "ease" | "ease-in" | "ease-out" | "ease-in-out" | CubicBezier;
export type StepEasingFunction = "step-start" | "step-end" | Steps;
export type Linear = `linear(${string})`;
export type CubicBezier = `cubic-bezier(${string})`;
export type Steps = `steps(${string})`;

export type AnimationValue =
    | CssTime
    | AnimationTimingFunctionValue
    | AnimationIterationCountValue
    | AnimationDirectionValue
    | AnimationFillModeValue
    | AnimationPlayStateValue
    | AnimationKeyframesName;

export type AnimationKeyframesName = "none" | string;

export type AppearanceValue =
    | "none"
    | "auto"
    | "base"
    | "searchfield"
    | "textarea"
    | "checkbox"
    | "radio"
    | "menulist"
    | "listbox"
    | "meter"
    | "progress-bar"
    | "button"
    | "textfield"
    | "menulist-button"
    | "base";

// Background-*
// Background-attachment
export type BackgroundAttachmentValue = "fixed" | "local" | "scroll";

// Background-blend-mode
export type BackgroundBlendModeValue =
    | "normal"
    | "multiply"
    | "screen"
    | "overlay"
    | "darken"
    | "lighten"
    | "color-dodge"
    | "color-burn"
    | "hard-light"
    | "soft-light"
    | "difference"
    | "exclusion"
    | "hue"
    | "saturation"
    | "color"
    | "luminosity";

// Background-clip
export type BackgroundClipValue = "border-box" | "padding-box" | "content-box" | "text";

// Background-color
export type ColorValue =
    | "currentcolor"
    | "transparent"
    | "rgb"
    | "rgba"
    | "hsl"
    | "hsla"
    | "hwb"
    | "lch"
    | "oklch"
    | "lab"
    | "oklab"
    | "color"
    | "color-mix"
    | string; // For named colors, hex values, etc.

// Background-image
export type ImageValue =
    | "none"
    | `url(${string})`
    | LinearGradient
    | RadialGradient
    | ConicGradient
    | RepeatingLinearGradient
    | RepeatingRadialGradient
    | RepeatingConicGradient;

export type LinearGradient = `linear-gradient(${string})`;
export type RadialGradient = `radial-gradient(${string})`;
export type ConicGradient = `conic-gradient(${string})`;
export type RepeatingLinearGradient = `repeating-linear-gradient(${string})`;
export type RepeatingRadialGradient = `repeating-radial-gradient(${string})`;
export type RepeatingConicGradient = `repeating-conic-gradient(${string})`;

// Background-origin
export type BackgroundOriginValue = "border-box" | "padding-box" | "content-box";

// Background-position
export type PositionKeyword = "top" | "right" | "bottom" | "left" | "center";
export type BackgroundPositionValue =
    | PositionKeyword
    | CssLengthPersentage
    | [PositionKeyword | CssLengthPersentage]
    | [PositionKeyword | CssLengthPersentage, PositionKeyword | CssLengthPersentage]
    | [PositionKeyword, CssLengthPersentage]
    | [CssLengthPersentage, PositionKeyword];

// Background-position-x
export type BackgroundPositionXValue =
    | PositionKeyword
    | CssLengthPersentage
    | ["center"]
    | ["right"]
    | ["left"]
    | ["left" | "right", CssLengthPersentage];

// Background-position-y
export type BackgroundPositionYValue =
    | PositionKeyword
    | CssLengthPersentage
    | ["center"]
    | ["top"]
    | ["bottom"]
    | ["top" | "bottom", CssLengthPersentage];

// Background-repeat
export type BackgroundRepeatSingleValue = "repeat" | "no-repeat" | "space" | "round";

export type BackgroundRepeatValue =
    | BackgroundRepeatSingleValue
    | "repeat-x"
    | "repeat-y"
    | [BackgroundRepeatSingleValue]
    | [BackgroundRepeatSingleValue, BackgroundRepeatSingleValue];

// Background-size
export type BackgroundSizeSingleValue = "auto" | CssLengthPersentage;

export type BackgroundSizeValue =
    | "cover"
    | "contain"
    | BackgroundSizeSingleValue
    | [BackgroundSizeSingleValue]
    | [BackgroundSizeSingleValue, BackgroundSizeSingleValue];

// Background (shorthand property)
export type BackgroundValue =
    | "none"
    | ColorValue
    | ImageValue
    | BackgroundRepeatValue
    | BackgroundAttachmentValue
    | BackgroundPositionValue
    | BackgroundSizeValue
    | BackgroundOriginValue
    | BackgroundClipValue;

// Main CSS Properties type
export type Properties = {
    // A
    align_content: AlignContentKeyword | PGlobal;
    align_items: AlignItemsValue | PGlobal;
    align_self: AlignSelfValue | PGlobal;
    alignment_baseline: AlignmentBaselineValue | PGlobal;
    all: PGlobal;
    anchor_name: Comma<string>;
    animation: SpaceComma<AnimationValue> | PAnimationGlobal;
    animation_composition: Comma<AnimationCompositionValue> | PAnimationGlobal;
    animation_delay: Comma<AnimationDelayValue> | PAnimationGlobal;
    animation_direction: Comma<AnimationDirectionValue> | PAnimationGlobal;
    animation_duration: Comma<AnimationDurationValue> | PAnimationGlobal;
    animation_fill_mode: Comma<AnimationFillModeValue> | PAnimationGlobal;
    animation_iteration_count: Comma<AnimationIterationCountValue> | PAnimationGlobal;
    animation_name: Comma<string> | PAnimationGlobal;
    animation_play_state: Comma<AnimationPlayStateValue> | PAnimationGlobal;
    animation_range: Comma<AnimationRangeValue> | PAnimationGlobal;
    animation_range_end: Comma<AnimationRangeSingleValue> | PAnimationGlobal;
    animation_range_start: Comma<AnimationRangeSingleValue> | PAnimationGlobal;
    animation_timeline: Comma<AnimationTimeline> | PAnimationGlobal;
    animation_timing_function: Comma<AnimationTimingFunctionValue> | PAnimationGlobal;
    appearance: AppearanceValue | PGlobal;
    aspect_ratio: "auto" | `${number}` | `${number}/${number}`;

    // B
    background: SpaceComma<BackgroundValue> | PGlobal;
    background_attachment: Comma<BackgroundAttachmentValue> | PGlobal;
    background_blend_mode: Comma<BackgroundBlendModeValue> | PGlobal;
    background_clip: Comma<BackgroundClipValue> | PGlobal;
    background_color: ColorValue | PColorGlobal;
    background_image: Comma<ImageValue> | PGlobal;
    background_origin: Comma<BackgroundOriginValue> | PGlobal;
    background_position: Comma<BackgroundPositionValue> | PGlobal;
    background_position_x: Comma<BackgroundPositionXValue> | PGlobal;
    background_position_y: Comma<BackgroundPositionYValue> | PGlobal;
    background_repeat: Comma<BackgroundRepeatValue> | PGlobal;
    background_size: Comma<BackgroundSizeValue> | PGlobal;
};
