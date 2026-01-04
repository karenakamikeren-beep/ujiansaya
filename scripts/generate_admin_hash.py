import bcrypt

# Generate bcrypt hash for "ADMIN123"
password = "ADMIN123"
salt = bcrypt.gensalt(rounds=10)
hashed = bcrypt.hashpw(password.encode('utf-8'), salt)

print(f"Password: {password}")
print(f"Bcrypt Hash: {hashed.decode('utf-8')}")
