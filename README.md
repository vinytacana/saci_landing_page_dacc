# DACC Station · Landing page

Site estático de apresentação do console acadêmico DACC Station, desenvolvido no contexto do Departamento de Ciência da Computação da Universidade Federal de Rondônia (UNIR). O site apresenta o projeto, a integração entre hardware e software, a equipe e os repositórios. Não se apresenta como portal institucional da universidade.

HTML, CSS e JavaScript modular, sem dependências de runtime, build, backend, rastreamento ou serviços externos de fontes.

## Publicação

Repositório: https://github.com/vinytacana/saci_landing_page_dacc

URL prevista do GitHub Pages: https://vinytacana.github.io/saci_landing_page_dacc/

Em **Settings → Pages**, selecione **Deploy from a branch → main → / (root)**. Os arquivos estáticos ficam na raiz, sem build. A URL acima depende da ativação do Pages; publicação ainda não confirmada.

## Execução e validação

```sh
python3 -m http.server 8000
python3 scripts/validate.py
```

Abra `http://localhost:8000`. Equipe e contatos ficam em `data/team.js`; links e galeria em `data/project.js`.

## QR code da apresentação

```sh
python3 scripts/gerar_qrcode.py "https://vinytacana.github.io/saci_landing_page_dacc/"
```

Gera PNG e SVG em `output/`, pasta ignorada pelo Git. Dependência: `python3 -m pip install -r scripts/requirements-qr.txt`. Confirme que a página publicada abre antes de usar o QR code na apresentação.
