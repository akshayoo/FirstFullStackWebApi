from passlib.hash import pbkdf2_sha256

def to_hash(password : str) -> str:
    return pbkdf2_sha256.hash(password)

def varify_hash(password : str, saved_hash : str) -> bool:
    return pbkdf2_sha256.verify(password, saved_hash)


def decode_csv_bytes(contents: bytes) -> str:
    for enc in ("utf-8-sig", "utf-8", "cp1252", "latin-1"):
        try:
            return contents.decode(enc)
        except UnicodeDecodeError:
            continue
    return contents.decode("latin-1")