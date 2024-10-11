export default function lightenColor(hex, percent) {
    hex = hex.replace(/^#/, '');
  
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
  
    r = Math.min(255, r + Math.floor((255 - r) * percent));
    g = Math.min(255, g + Math.floor((255 - g) * percent));
    b = Math.min(255, b + Math.floor((255 - b) * percent));
    const newHex = `#${(r.toString(16)).padStart(2, '0')}${(g.toString(16)).padStart(2, '0')}${(b.toString(16)).padStart(2, '0')}`;
    
    return newHex;
}