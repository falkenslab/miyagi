// Components every page of content/ can use without importing them.
import MDXComponents from "@theme-original/MDXComponents";
import DownloadApp from "@site/src/components/DownloadApp";
import Prompt from "@site/src/components/Prompt";
import Shot from "@site/src/components/Shot";
import Terminal from "@site/src/components/Terminal";

export default { ...MDXComponents, DownloadApp, Prompt, Shot, Terminal };
