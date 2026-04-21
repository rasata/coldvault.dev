#!/usr/bin/env python3
"""
Déobfuscateur statique pour payloads obfusqués (BeaverTail-style et variantes).

POSTURE DEFENSIVE :
  - Ce script ne charge/exécute JAMAIS le code du payload (pas d'eval, pas d'import).
  - Il lit le fichier cible comme TEXTE, extrait les littéraux (tableaux d'octets,
    tableaux de chaînes, constantes), et applique des transformations purement
    déclaratives (XOR, base64, permutations de fragments).

Transformations couvertes :
  - Tableaux d'octets [0xNN, 0xNN, ...] → XOR avec clé configurable
  - Tableau de chaînes ['xxx', 'yyy', ...] → tentative de base64 decode sur chaque entrée
  - Fragments d'IP : chaînes 16/20 chars base64 → permutation a9+a8(+aa) puis decode
  - Identifiants hex littéraux (campaign/payload IDs)
  - Littéraux URL-like (/path, :port)

Usage :
  python3 deobfuscate.py <payload.txt>                            # clé XOR BeaverTail par défaut
  python3 deobfuscate.py --xor-key 70,a0,89,48 <payload.txt>      # clé XOR explicite (hex)
  python3 deobfuscate.py <p1.txt> <p2.txt>                        # multiples payloads

La clé XOR par défaut [0x70, 0xa0, 0x89, 0x48] est celle de BeaverTail ; à ajuster
pour d'autres familles.
"""

import argparse
import base64
import re
import sys
from pathlib import Path

DEFAULT_XOR_KEY = bytes([0x70, 0xA0, 0x89, 0x48])


def parse_xor_key(s: str) -> bytes:
    parts = [p.strip() for p in s.split(",") if p.strip()]
    return bytes(int(p, 16) for p in parts)


def xor_decode(arr, key):
    out = bytearray()
    for i, b in enumerate(arr):
        out.append(b ^ key[i % len(key)])
    try:
        return out.decode("utf-8")
    except UnicodeDecodeError:
        return out.hex()


def extract_byte_arrays(text):
    """Tous les tableaux [0xNN, 0xNN, ...] avec leur offset."""
    pattern = re.compile(r"\[((?:\s*0x[0-9a-fA-F]+\s*,?\s*){2,})\]")
    arrays = []
    for m in pattern.finditer(text):
        nums = re.findall(r"0x[0-9a-fA-F]+", m.group(1))
        arr = [int(n, 16) for n in nums]
        if all(0 <= b <= 0xFF for b in arr) and len(arr) >= 2:
            arrays.append((m.start(), arr))
    return arrays


def extract_string_array(text):
    """Plus grande liste [ 'xxx', 'yyy', ... ] — typiquement la table de chaînes b64."""
    candidates = re.findall(
        r"\[((?:'[^']*'\s*,\s*){20,}(?:'[^']*')?)\]", text
    )
    if not candidates:
        return []
    largest = max(candidates, key=len)
    return re.findall(r"'([^']*)'", largest)


def try_b64_decode(s):
    try:
        padded = s + "=" * (-len(s) % 4)
        decoded = base64.b64decode(padded, validate=False)
        text = decoded.decode("utf-8", errors="strict")
        if all(32 <= ord(c) < 127 or c in "\t\n\r" for c in text):
            return text
    except Exception:
        pass
    return None


def find_ip_candidates(strings):
    out = []
    for s in strings:
        if len(s) < 4:
            continue
        dec = try_b64_decode(s)
        if dec and re.match(r"^[\d.]+$", dec):
            out.append((s, dec))
    return out


def reassemble_ip_chunk(b64_str):
    """Permutation BeaverTail : pour 16 ou 20 chars b64, permute a8[0:8] ↔ a9[8:16]."""
    results = []
    for n in (16, 20):
        if len(b64_str) >= n:
            chunk = b64_str[:n]
            a8 = chunk[0:8]
            a9 = chunk[8:16]
            aa = chunk[16:20] if n >= 20 else ""
            reassembled = a9 + a8 + aa
            dec = try_b64_decode(reassembled)
            if dec:
                results.append((reassembled, dec))
    dec_direct = try_b64_decode(b64_str)
    if dec_direct:
        results.append((b64_str, dec_direct))
    return results


def extract_hex_literals(text):
    return re.findall(r"'([0-9a-f]{10,16})'", text)


def scan_payload(path: Path, xor_key: bytes):
    data = path.read_text(errors="replace")
    print("=" * 72)
    print(f"ANALYSE: {path}  ({len(data)} caractères)")
    print(f"XOR key: [{', '.join(f'0x{b:02x}' for b in xor_key)}]")
    print("=" * 72)

    # 1. Tableaux d'octets → XOR
    print(f"\n[1] TABLEAUX D'OCTETS XORés")
    seen = set()
    for offset, arr in extract_byte_arrays(data):
        if len(arr) < 2 or len(arr) > 64:
            continue
        key = tuple(arr)
        if key in seen:
            continue
        seen.add(key)
        decoded = xor_decode(arr, xor_key)
        print(
            f"  @{offset:5d}  n={len(arr):2d}  "
            f"[{', '.join(f'0x{b:02x}' for b in arr)}]"
        )
        print(f"           --> {decoded!r}")

    # 2. Tableau de chaînes
    strings = extract_string_array(data)
    print(f"\n[2] TABLEAU DE CHAÎNES -- {len(strings)} entrées")

    if strings:
        # 3. Fragments d'IP (décodage direct base64 → numérique)
        print("\n[3] FRAGMENTS IP/NUMÉRIQUES (b64 decode direct)")
        for s, dec in find_ip_candidates(strings):
            print(f"    {s!r:30s}  --b64-->  {dec!r}")

        # 4. Chaînes b64 décodables avec caractères URL
        print("\n[4] AUTRES CHAÎNES BASE64 DÉCODABLES")
        for s in strings:
            if len(s) < 4:
                continue
            dec = try_b64_decode(s)
            if (
                dec
                and dec != s
                and len(dec) >= 2
                and dec.isprintable()
                and (any(ch in dec for ch in "/:.") or re.match(r"^[A-Za-z_]+$", dec))
            ):
                print(f"    {s!r:20s} --b64--> {dec!r}")

        # 5. IP réassemblée (permutation)
        print("\n[5] CANDIDATS IP RÉASSEMBLÉS (permutation a9+a8+aa)")
        ip_like = re.compile(r"^\d{1,3}(\.\d{1,3}){3}\.?$")
        for s in strings:
            if len(s) >= 16:
                for reassembled, dec in reassemble_ip_chunk(s):
                    if ip_like.match(dec) or (
                        re.match(r"^[\d.]+$", dec) and dec.count(".") >= 2
                    ):
                        print(f"    {s!r} -> {reassembled!r}")
                        print(f"      => {dec!r}")

    # 6. Identifiants hex (campaign IDs)
    print("\n[6] IDENTIFIANTS HEX (campaign/payload ID candidates)")
    for h in extract_hex_literals(data):
        print(f"    {h!r}")

    # 7. Littéraux URL-like
    print("\n[7] LITTÉRAUX URL-LIKE")
    printed = set()
    for lit in re.findall(r"'([^']{2,20})'", data):
        if lit in printed:
            continue
        if (
            re.search(r"^[/:?#@&=][\w\-./]*$", lit)
            or re.match(r"^:\d{2,5}$", lit)
            or re.match(r"^/\w+/?$", lit)
        ):
            print(f"    {lit!r}")
            printed.add(lit)

    print()


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("payloads", nargs="+", help="Fichier(s) payload à analyser")
    ap.add_argument(
        "--xor-key",
        default=None,
        help="Clé XOR en hex séparé par virgules, ex. 70,a0,89,48 (défaut BeaverTail)",
    )
    args = ap.parse_args()

    key = parse_xor_key(args.xor_key) if args.xor_key else DEFAULT_XOR_KEY

    for p in args.payloads:
        path = Path(p)
        if not path.exists():
            print(f"⚠ introuvable : {p}", file=sys.stderr)
            continue
        scan_payload(path, key)


if __name__ == "__main__":
    main()
