from passlib.hash import pbkdf2_sha256

def to_hash(password : str) -> str:
    return pbkdf2_sha256.hash(password)

def varify_hash(password : str, saved_hash : str) -> bool:
    return pbkdf2_sha256.verify(password, saved_hash)
