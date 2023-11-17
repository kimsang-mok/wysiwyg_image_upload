import { remark } from "remark";
// import remarkHtml from "remark-html/lib";

import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";

export function htmlToMarkdown(htmlText) {
  const file = remark()
    .use(rehypeParse, { emitParseErrors: true, duplicateAttribute: false })
    .use(rehypeRemark)
    .use(remarkStringify)
    .processSync(htmlText);

  return String(file);
}

// Example usage:
const htmlContent = "<p><strong>Hello</strong> world!</p>";
const markdownContent = htmlToMarkdown(htmlContent);
console.log(markdownContent);
