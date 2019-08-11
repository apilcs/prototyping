import Typography from "typography";
import deYoungTheme from "typography-theme-de-young";

deYoungTheme.headerFontFamily = [
  "Alegreya Sans",
  "KaiTi",
  "楷体",
  "STKaiti",
  "华文楷体"
];
deYoungTheme.bodyFontFamily = [
  "Alegreya",
  "Microsoft YaHei New",
  "Microsoft Yahei",
  "微软雅黑",
  "宋体",
  "SimHei",
  "STXihei",
  "华文细黑"
];
const typography = new Typography(deYoungTheme);

export const { scale, rhythm, options } = typography;
export default typography;
