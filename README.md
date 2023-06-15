# Vimeo Scripts

Atenção: este projeto usa o bun ao invés do Node!

Para instalar dependências:

```bash
bun install
```

Feito isso, é necessário criar um arquivo `.env` (existe um `.env.copy` como exemplo no repo) e adicionar o token do Vimeo.

Para rodar algum script:

```bash
bun run scriptName.ts
```

## getAllVideosFromFolder

Esse script pega todos os vídeos de uma pasta, e printa no console log o nome,vimeoId,duration.
Isso é útil para depois atualizarmos na nossa DB.

## addPresetToVideos

Esse script adiciona o preset do codante para todos os vídeos de uma pasta.
