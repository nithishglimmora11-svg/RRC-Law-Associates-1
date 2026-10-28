with open('style.css', 'rb') as f:
    raw = f.read()

target = b'''.nav-link-custom {
    color: #ffffff !important;
    text-decoration: none;
    font-weight: 500;
    margin: 0 15px;
    transition: color 0.3s;
}'''

target_crlf = target.replace(b'\n', b'\r\n')

replacement = b'''.nav-link-custom {
    color: #ffffff !important;
    text-decoration: none;
    font-weight: 500;
    margin: 0 15px;
    white-space: nowrap !important;
    transition: color 0.3s;
}

@media (min-width: 992px) and (max-width: 1240px) {
    .nav-link-custom {
        margin: 0 8px !important;
        font-size: 0.92rem !important;
        white-space: nowrap !important;
    }
    .header .btn-gold {
        padding: 8px 14px !important;
        font-size: 0.85rem !important;
        white-space: nowrap !important;
    }
}'''

replacement_crlf = replacement.replace(b'\n', b'\r\n')

if target_crlf in raw:
    raw = raw.replace(target_crlf, replacement_crlf, 1)
    with open('style.css', 'wb') as f:
        f.write(raw)
    print("Successfully updated style.css (CRLF)")
elif target in raw:
    raw = raw.replace(target, replacement, 1)
    with open('style.css', 'wb') as f:
        f.write(raw)
    print("Successfully updated style.css (LF)")
else:
    print("Target not found in style.css!")

