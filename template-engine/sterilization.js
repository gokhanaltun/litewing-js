export default function escape(input) {
    if (input == null) return '';

    // 1) String'e çevir
    let s = String(input);

    // 2) Unicode normalize et (bypass karakterleri temizler)
    s = s.normalize('NFC');

    // 3) HTML entity'leri decode et (saldırganın encode ederek bypass etmesini önler)
    s = s.replace(/&#(\d+);?/g, (_, code) => String.fromCharCode(code));
    s = s.replace(/&#x([0-9a-fA-F]+);?/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

    // 4) Encode et (sadece HTML text node için uygun)
    return s
        .replace(/&/g, "&amp;") // önce ampersand!
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
