/**
 * Copyright (c) Stanislav Shishankin
 *
 * This source code is licensed under the MIT license.
 */

import { ViewNode } from ".";
import { TagAttributes, SvgView, HtmlView } from "./view/TagView";

export const html = {
  a: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("a", attributes, childrens),
  abbr: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("abbr", attributes, childrens),
  address: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("address", attributes, childrens),
  area: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("area", attributes, childrens),
  article: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("article", attributes, childrens),
  aside: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("aside", attributes, childrens),
  audio: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("audio", attributes, childrens),
  b: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("b", attributes, childrens),
  base: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("base", attributes, childrens),
  bdi: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("bdi", attributes, childrens),
  bdo: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("bdo", attributes, childrens),
  blockquote: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("blockquote", attributes, childrens),
  body: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("body", attributes, childrens),
  br: (attributes: TagAttributes = {}) => new HtmlView("br", attributes),
  button: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("button", attributes, childrens),
  canvas: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("canvas", attributes, childrens),
  caption: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("caption", attributes, childrens),
  cite: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("cite", attributes, childrens),
  code: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("code", attributes, childrens),
  col: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("col", attributes, childrens),
  colgroup: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("colgroup", attributes, childrens),
  data: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("data", attributes, childrens),
  datalist: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("datalist", attributes, childrens),
  dd: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("dd", attributes, childrens),
  del: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("del", attributes, childrens),
  details: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("details", attributes, childrens),
  dfn: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("dfn", attributes, childrens),
  dialog: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("dialog", attributes, childrens),
  dir: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("dir", attributes, childrens),
  div: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("div", attributes, childrens),
  dl: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("dl", attributes, childrens),
  dt: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("dt", attributes, childrens),
  em: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("em", attributes, childrens),
  embed: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("embed", attributes, childrens),
  fieldset: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("fieldset", attributes, childrens),
  figcaption: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("figcaption", attributes, childrens),
  figure: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("figure", attributes, childrens),
  font: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("font", attributes, childrens),
  footer: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("footer", attributes, childrens),
  form: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("form", attributes, childrens),
  frame: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("frame", attributes, childrens),
  frameset: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("frameset", attributes, childrens),
  h1: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("h1", attributes, childrens),
  h2: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("h2", attributes, childrens),
  h3: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("h3", attributes, childrens),
  h4: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("h4", attributes, childrens),
  h5: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("h5", attributes, childrens),
  h6: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("h6", attributes, childrens),
  head: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("head", attributes, childrens),
  header: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("header", attributes, childrens),
  hgroup: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("hgroup", attributes, childrens),
  hr: (attributes: TagAttributes = {}) => new HtmlView("hr", attributes),
  html: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("html", attributes, childrens),
  i: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("i", attributes, childrens),
  iframe: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("iframe", attributes, childrens),
  img: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("img", attributes, childrens),
  input: (attributes: TagAttributes = {}) => new HtmlView("input", attributes),
  ins: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("ins", attributes, childrens),
  kbd: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("kbd", attributes, childrens),
  label: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("label", attributes, childrens),
  legend: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("legend", attributes, childrens),
  li: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("li", attributes, childrens),
  link: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("link", attributes, childrens),
  main: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("main", attributes, childrens),
  map: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("map", attributes, childrens),
  mark: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("mark", attributes, childrens),
  marquee: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("marquee", attributes, childrens),
  menu: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("menu", attributes, childrens),
  meta: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("meta", attributes, childrens),
  meter: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("meter", attributes, childrens),
  nav: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("nav", attributes, childrens),
  noscript: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("noscript", attributes, childrens),
  object: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("object", attributes, childrens),
  ol: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("ol", attributes, childrens),
  optgroup: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("optgroup", attributes, childrens),
  option: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("option", attributes, childrens),
  output: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("output", attributes, childrens),
  p: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("p", attributes, childrens),
  param: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("param", attributes, childrens),
  picture: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("picture", attributes, childrens),
  pre: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("pre", attributes, childrens),
  progress: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("progress", attributes, childrens),
  q: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("q", attributes, childrens),
  rp: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("rp", attributes, childrens),
  rt: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("rt", attributes, childrens),
  ruby: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("ruby", attributes, childrens),
  s: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("s", attributes, childrens),
  samp: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("samp", attributes, childrens),
  script: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("script", attributes, childrens),
  section: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("section", attributes, childrens),
  select: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("select", attributes, childrens),
  slot: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("slot", attributes, childrens),
  small: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("small", attributes, childrens),
  source: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("source", attributes, childrens),
  span: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("span", attributes, childrens),
  strong: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("strong", attributes, childrens),
  style: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("style", attributes, childrens),
  sub: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("sub", attributes, childrens),
  summary: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("summary", attributes, childrens),
  sup: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("sup", attributes, childrens),
  table: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("table", attributes, childrens),
  tbody: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("tbody", attributes, childrens),
  td: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("td", attributes, childrens),
  template: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("template", attributes, childrens),
  textarea: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("textarea", attributes, childrens),
  tfoot: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("tfoot", attributes, childrens),
  th: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("th", attributes, childrens),
  thead: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("thead", attributes, childrens),
  time: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("time", attributes, childrens),
  title: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("title", attributes, childrens),
  tr: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("tr", attributes, childrens),
  track: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("track", attributes, childrens),
  u: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("u", attributes, childrens),
  ul: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("ul", attributes, childrens),
  var: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("var", attributes, childrens),
  video: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("video", attributes, childrens),
  wbr: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new HtmlView("wbr", attributes, childrens),
};

export const svg = {
  a: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("a", attributes, childrens),
  animate: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("animate", attributes, childrens),
  animateMotion: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("animateMotion", attributes, childrens),
  animateTransform: (
    attributes: TagAttributes = {},
    childrens: ViewNode[] = []
  ) => new SvgView("animateTransform", attributes, childrens),
  circle: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("circle", attributes, childrens),
  clipPath: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("clipPath", attributes, childrens),
  defs: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("defs", attributes, childrens),
  desc: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("desc", attributes, childrens),
  ellipse: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("ellipse", attributes, childrens),
  feBlend: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("feBlend", attributes, childrens),
  feColorMatrix: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("feColorMatrix", attributes, childrens),
  feComponentTransfer: (
    attributes: TagAttributes = {},
    childrens: ViewNode[] = []
  ) => new SvgView("feComponentTransfer", attributes, childrens),
  feComposite: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("feComposite", attributes, childrens),
  feConvolveMatrix: (
    attributes: TagAttributes = {},
    childrens: ViewNode[] = []
  ) => new SvgView("feConvolveMatrix", attributes, childrens),
  feDiffuseLighting: (
    attributes: TagAttributes = {},
    childrens: ViewNode[] = []
  ) => new SvgView("feDiffuseLighting", attributes, childrens),
  feDisplacementMap: (
    attributes: TagAttributes = {},
    childrens: ViewNode[] = []
  ) => new SvgView("feDisplacementMap", attributes, childrens),
  feDistantLight: (
    attributes: TagAttributes = {},
    childrens: ViewNode[] = []
  ) => new SvgView("feDistantLight", attributes, childrens),
  feDropShadow: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("feDropShadow", attributes, childrens),
  feFlood: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("feFlood", attributes, childrens),
  feFuncA: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("feFuncA", attributes, childrens),
  feFuncB: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("feFuncB", attributes, childrens),
  feFuncG: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("feFuncG", attributes, childrens),
  feFuncR: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("feFuncR", attributes, childrens),
  feGaussianBlur: (
    attributes: TagAttributes = {},
    childrens: ViewNode[] = []
  ) => new SvgView("feGaussianBlur", attributes, childrens),
  feImage: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("feImage", attributes, childrens),
  feMerge: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("feMerge", attributes, childrens),
  feMergeNode: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("feMergeNode", attributes, childrens),
  feMorphology: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("feMorphology", attributes, childrens),
  feOffset: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("feOffset", attributes, childrens),
  fePointLight: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("fePointLight", attributes, childrens),
  feSpecularLighting: (
    attributes: TagAttributes = {},
    childrens: ViewNode[] = []
  ) => new SvgView("feSpecularLighting", attributes, childrens),
  feSpotLight: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("feSpotLight", attributes, childrens),
  feTile: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("feTile", attributes, childrens),
  feTurbulence: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("feTurbulence", attributes, childrens),
  filter: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("filter", attributes, childrens),
  foreignObject: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("foreignObject", attributes, childrens),
  g: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("g", attributes, childrens),
  image: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("image", attributes, childrens),
  line: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("line", attributes, childrens),
  linearGradient: (
    attributes: TagAttributes = {},
    childrens: ViewNode[] = []
  ) => new SvgView("linearGradient", attributes, childrens),
  marker: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("marker", attributes, childrens),
  mask: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("mask", attributes, childrens),
  metadata: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("metadata", attributes, childrens),
  mpath: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("mpath", attributes, childrens),
  path: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("path", attributes, childrens),
  pattern: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("pattern", attributes, childrens),
  polygon: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("polygon", attributes, childrens),
  polyline: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("polyline", attributes, childrens),
  radialGradient: (
    attributes: TagAttributes = {},
    childrens: ViewNode[] = []
  ) => new SvgView("radialGradient", attributes, childrens),
  rect: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("rect", attributes, childrens),
  script: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("script", attributes, childrens),
  set: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("set", attributes, childrens),
  stop: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("stop", attributes, childrens),
  style: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("style", attributes, childrens),
  svg: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("svg", attributes, childrens),
  switch: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("switch", attributes, childrens),
  symbol: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("symbol", attributes, childrens),
  text: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("text", attributes, childrens),
  textPath: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("textPath", attributes, childrens),
  title: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("title", attributes, childrens),
  tspan: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("tspan", attributes, childrens),
  use: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("use", attributes, childrens),
  view: (attributes: TagAttributes = {}, childrens: ViewNode[] = []) =>
    new SvgView("view", attributes, childrens),
};
