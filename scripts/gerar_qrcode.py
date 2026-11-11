#!/usr/bin/env python3
"""Gera PNG e SVG do QR code de uma URL fornecida, sem acessar serviços externos."""
import argparse
from pathlib import Path
from urllib.parse import urlsplit


def public_url(value):
    try:
        parsed = urlsplit(value)
        if parsed.scheme not in ('http', 'https') or not parsed.hostname:
            raise ValueError
        if parsed.username or parsed.password or any(c.isspace() for c in value):
            raise ValueError
        parsed.port  # Valida porta, quando informada.
    except ValueError:
        raise argparse.ArgumentTypeError('Informe uma URL HTTP(S) completa, sem espaços ou credenciais.')
    return value


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('url', type=public_url, help='URL definitiva do site publicado (inclua https://).')
    parser.add_argument('--saida', type=Path, default=Path('output/qr-dacc-station'),
                        help='Caminho-base sem extensão (padrão: output/qr-dacc-station).')
    parser.add_argument('--forcar', action='store_true', help='Permitir sobrescrever arquivos de saída existentes.')
    args = parser.parse_args()
    try:
        import qrcode
        from qrcode.image.svg import SvgPathFillImage
        from PIL import Image  # Verificação antecipada da dependência PNG.
    except ImportError:
        parser.exit(1, 'Dependência ausente. Instale com: python3 -m pip install "qrcode[pil]"\n')
    base = args.saida
    if base.suffix.lower() in ('.png', '.svg'):
        base = base.with_suffix('')
    outputs = [Path(str(base) + suffix) for suffix in ('.png', '.svg')]
    if not args.forcar and any(path.exists() for path in outputs):
        parser.error('Uma saída já existe. Use outro --saida ou --forcar para substituir.')
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_Q, box_size=16, border=4)
    qr.add_data(args.url)
    qr.make(fit=True)
    try:
        base.parent.mkdir(parents=True, exist_ok=True)
        qr.make_image(fill_color='black', back_color='white').save(outputs[0])
        qr.make_image(image_factory=SvgPathFillImage).save(outputs[1])
    except OSError as error:
        parser.exit(1, f'Não foi possível salvar os arquivos: {error}\n')
    print(f'Destino codificado: {args.url}')
    for path in outputs:
        print(f'Gerado: {path.resolve()}')
    print('Use o PNG ou SVG no slide, preservando a margem branca e a proporção quadrada.')
    print('Antes da apresentação, escaneie com um celular e confirme a abertura da página publicada.')


if __name__ == '__main__':
    main()
