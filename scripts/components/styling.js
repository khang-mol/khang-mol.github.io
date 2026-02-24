export function styleCodeblock() {
  // Not necessary anymore with dedent()
  // const code = document.querySelectorAll("pre code");
  // [...code].forEach(element => element.textContent = element.textContent.replace(/^\n/,''));
  
  function dedent(str) {
    const lines = str.split('\n');
  
    // Remove empty lines at start/end
    while (lines.length && lines[0].trim() === '') lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
  
    // Find minimum indentation
    // const indentLengths = lines
    //   .filter(line => line.trim() !== '') // ignore empty lines
    //   .map(line => line.match(/^\s*/)[0].length);
    // const minIndent = Math.min(...indentLengths);
    const minIndent = lines[0].match(/^\s+/)[0].length;
  
    // Remove minIndent spaces from start of each line
    const dedented = lines.map(line => line.slice(minIndent)).join('\n');
  
    return dedented;
  };
            
  const codeElement = document.querySelectorAll('pre code');
  [...codeElement].forEach(element => element.textContent = dedent(element.textContent));
};
