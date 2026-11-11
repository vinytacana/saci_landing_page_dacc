// Todos os endereços públicos e ativos editáveis ficam aqui. Caminhos relativos à raiz do site.
export const project = {
  name: 'DACC Station',
  siteUrl: 'https://vinytacana.github.io/saci_landing_page_dacc/',
  logo: 'assets/images/logo-original.jpeg',
  github: 'https://github.com/vinytacana/dacc_station_integration',
  email: '',
  institutional: '',
  repositories: [
    { name: 'Software & integração', slug: 'dacc_station_integration', description: 'O código que conecta a experiência: interface, configurações, execução de jogos e comunicação entre os módulos.', tags: ['C++', 'SDL2', 'Linux'], url: 'https://github.com/vinytacana/dacc_station_integration', icon: 'code' },
    { name: 'Do arquivo à montagem', slug: 'guia-hardware-dacc-station', description: 'Materiais, modelos para impressão 3D e instruções para reproduzir o console e o controle do projeto.', tags: ['Hardware', 'Impressão 3D', 'Documentação'], url: 'https://github.com/daccstation/guia-hardware-dacc-station', icon: 'cube' }
  ],
  // Só inclua materiais publicados e verificados: { title, description, url }.
  resources: [],
  // Fotos/capturas reais: { src, alt, caption, width, height }. Vazio = seção oculta.
  gallery: []
};
