export async function applyCss(dom: ShadowRoot, cssPath: string, css: string) {
  const style = document.createElement('style');
  dom.appendChild(style);
  style.textContent = cssPath ? await loadCss(cssPath) : css;
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
