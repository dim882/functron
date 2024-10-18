export async function applyCss(dom: ShadowRoot, cssPath: string | undefined, css: string | undefined) {
  const style = document.createElement('style');
  dom.appendChild(style);

  if (cssPath) {
    const loadedCss = await loadCss(cssPath);
    style.textContent = loadedCss ?? '';
  } else {
    style.textContent = css ?? '';
  }
}

async function loadCss(cssFilePath: string) {
  try {
    const response = await fetch(cssFilePath);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.text();
  } catch (error) {
    console.error('Failed to fetch CSS:', error);
  }
}
