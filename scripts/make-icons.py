#!/usr/bin/env python3
"""Gera o conjunto de ícones a partir de assets/doom-source.jpg.

Uso: python3 scripts/make-icons.py   (requer Pillow: pip3 install --user pillow)

Sobre o enquadramento: a máscara não está no centro geométrico da arte, então um
recorte centralizado corta errado — daí as coordenadas explícitas abaixo. O corte
termina logo acima das mãos, que a essa escala viram só ruído.

Tentei antes compor a face sobre o preto do site com vinheta radial, para ganhar
espaço acima da cabeça. Não compensou: a arte de origem já vem rente aos olhos, e
qualquer máscara suave o bastante para esconder as emendas comia metade do rosto.
O recorte quadrado direto não tem emenda nenhuma — o fundo da arte já é preto.

Verificado a 32px (tamanho da aba) lado a lado com os outros enquadramentos: os
olhos vermelhos e as maçãs metálicas continuam distinguíveis, que é o máximo que
uma arte detalhada entrega nesse tamanho.
"""

import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'doom-source.jpg')

# Recorte quadrado na arte original (2048x1152): canto superior esquerdo e lado.
CROP_X, CROP_Y, CROP_SIZE = 599, 0, 800

SIZES = {
    'icon-512.png': 512,          # PWA, e o maior que o manifest referencia
    'icon-192.png': 192,          # PWA
    'apple-touch-icon.png': 180,  # tela de início do iOS
    'favicon-32.png': 32,         # aba do navegador
}


def main():
    if not os.path.exists(SRC):
        raise SystemExit(f'não achei a arte de origem em {SRC}')

    im = Image.open(SRC).convert('RGB')
    box = (CROP_X, CROP_Y, CROP_X + CROP_SIZE, CROP_Y + CROP_SIZE)
    if box[2] > im.width or box[3] > im.height:
        raise SystemExit(f'recorte {box} sai dos limites da arte {im.size}')

    face = im.crop(box)
    for name, size in SIZES.items():
        path = os.path.join(ROOT, name)
        out = face.resize((size, size), Image.LANCZOS)
        # A arte é escura e de gama estreita: 256 cores com dithering ficam
        # indistinguíveis do original e cortam ~60% do peso do arquivo.
        out = out.quantize(colors=256, method=Image.MEDIANCUT,
                           dither=Image.FLOYDSTEINBERG)
        out.save(path, optimize=True)
        print(f'  {name:24} {size}x{size}  {os.path.getsize(path):>7} bytes')


if __name__ == '__main__':
    main()
