// Components every page of content/ can use without importing them.
import MDXComponents from "@theme-original/MDXComponents";
import DownloadWindows from "@site/src/components/DownloadWindows";
import Prompt from "@site/src/components/Prompt";
import Shot from "@site/src/components/Shot";
import Terminal from "@site/src/components/Terminal";

export default { ...MDXComponents, DownloadWindows, Prompt, Shot, Terminal };
