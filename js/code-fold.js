
document.addEventListener("DOMContentLoaded", function () {
  const codeBlocks = document.querySelectorAll(
    ".post-container pre"
  );

  codeBlocks.forEach(function (pre) {
    if (pre.dataset.foldInitialized) return;

    let wrapper = pre.parentElement;

    // Check whether the parent is already a code block wrapper
    const isCodeWrapper = wrapper.matches(
      ".highlight, .highlighter-rouge, figure.highlight"
    );

    // If not, create a dedicated wrapper for this pre
    if (!isCodeWrapper) {
      const newWrapper = document.createElement("div");
      newWrapper.className = "highlight";

      wrapper.insertBefore(newWrapper, pre);
      newWrapper.appendChild(pre);

      wrapper = newWrapper;
    }

    // Count actual rendered lines
    const style = window.getComputedStyle(pre);
    const lineHeight = parseFloat(style.lineHeight);

    if (!Number.isFinite(lineHeight) || lineHeight <= 0) {
      return;
    }
    
    const contentHeight = pre.scrollHeight -
      parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);

    const lineCount = Math.round(contentHeight / lineHeight);

    // Skip folding for code blocks with 5 lines or fewer
    if (lineCount <= 5) {
      return;
    }

    pre.dataset.foldInitialized = "true";
    wrapper.classList.add("code-fold-wrapper");

    // Create toggle button
    const toolbar = document.createElement("div");
    toolbar.className = "code-fold-toolbar";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "code-fold-toggle";
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-label", "Collapse code");
    button.title = "Collapse code";

    const icon = document.createElement("i");
    icon.className = "fa fa-chevron-up";
    icon.setAttribute("aria-hidden", "true");

    button.appendChild(icon);
    toolbar.appendChild(button);

    // Create collapse hint
    const hint = document.createElement("div");
    hint.className = "code-fold-hint";
    hint.textContent = "代码已折叠 · 点击箭头展开";

    // Insert elements
    wrapper.insertBefore(toolbar, pre);
    wrapper.appendChild(hint);

    // Toggle code block
    button.addEventListener("click", function () {
      const isExpanded =
        button.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        const style = window.getComputedStyle(pre);
        const lineHeight = parseFloat(style.lineHeight);
        const paddingTop = parseFloat(style.paddingTop);
        const paddingBottom = parseFloat(style.paddingBottom);

        const firstLineHeight =
          (Number.isFinite(lineHeight) ? lineHeight : 22) +
          paddingTop +
          paddingBottom;

        pre.style.setProperty(
          "--code-fold-height",
          firstLineHeight + "px"
        );
      } else {
        pre.style.removeProperty("--code-fold-height");
      }

      wrapper.classList.toggle("is-collapsed", isExpanded);

      button.setAttribute("aria-expanded", String(!isExpanded));
      button.setAttribute(
        "aria-label",
        isExpanded ? "Expand code" : "Collapse code"
      );

      button.title = isExpanded ? "Expand code" : "Collapse code";

      icon.className = isExpanded
        ? "fa fa-chevron-down"
        : "fa fa-chevron-up";
    });
  });
});
