import { ReactElement } from "react";
import {
  TbBrandCoinbase,
  TbBrandCpp,
  TbBrandCSharp,
  TbBrandPython,
  TbBrandGolang,
  TbBrandSwift,
} from "react-icons/tb";
import { DiRuby } from "react-icons/di";
import { BiLogoPhp } from "react-icons/bi";
import { TbBrandKotlin } from "react-icons/tb";
import { FaRust } from "react-icons/fa";
import { DiHaskell } from "react-icons/di";
import { BsMarkdown } from "react-icons/bs";
import { GrJava } from "react-icons/gr";
import { CiFileOn } from "react-icons/ci";
import { SiTypescript, SiJavascript } from "react-icons/si";

interface ILanguageIcons {
  [key: string]: ReactElement;
}

const languageIcons: ILanguageIcons = {
  c: <TbBrandCoinbase color="#A8B9CC" size={"14px"} />, // C 언어의 전통적인 색상
  cpp: <TbBrandCpp color="#00599C" size={"14px"} />, // C++ 언어의 전통적인 색상
  cs: <TbBrandCSharp color="#178600" size={"14px"} />, // C# 언어의 전통적인 색상
  java: <GrJava color="#007396" size={"14px"} />, // Java 언어의 전통적인 색상
  js: <SiJavascript color="#F7DF1E" size={"14px"} />, // JavaScript 언어의 전통적인 색상
  ts: <SiTypescript color="#3178C6" size={"14px"} />, // TypeScript 언어의 공식 색상
  py: <TbBrandPython color="#3776AB" size={"14px"} />, // Python 언어의 공식 색상
  rb: <DiRuby color="#D91404" size={"14px"} />, // Ruby 언어의 공식 색상
  php: <BiLogoPhp color="#777BB4" size={"14px"} />, // PHP 언어의 공식 색상
  swift: <TbBrandSwift color="#F05138" size={"14px"} />, // Swift 언어의 공식 색상
  kt: <TbBrandKotlin color="#7F52FF" size={"14px"} />, // Kotlin 언어의 공식 색상
  go: <TbBrandGolang color="#00ADD8" size={"14px"} />, // Go 언어의 공식 색상
  rs: <FaRust color="#000000" size={"14px"} />, // Rust 언어의 공식 색상 (일반적으로 검정색 사용)
  hs: <DiHaskell color="#5D4F85" size={"14px"} />, // Haskell 언어의 전통적인 색상
  md: <BsMarkdown color="#000000" size={"14px"} />, // Markdown의 일반적인 색상 (검정색)
};

interface ILangExtension {
  [key: string]: string;
}

const getLanguageIcon = (language: string): ReactElement => {
  return languageIcons[language] || <CiFileOn />;
};

const languageExtension: ILangExtension = {
  c: "c",
  cpp: "cpp",
  cs: "csharp",
  java: "java",
  js: "javascript",
  ts: "typescript",
  py: "python",
  rb: "ruby",
  php: "php",
  swift: "swift",
  kt: "kotlin",
  go: "go",
  rs: "rust",
  hs: "haskell",
  md: "markdown",
};

export const getLangExtension = (language: string) => {
  return languageExtension[language];
};

export default getLanguageIcon;
