import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Vectorly Docs',
  tagline: 'Internal documentation portal',
  favicon: 'img/favicon.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docs.vectorly-slovakia.sk',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  organizationName: 'xNovakb',
  projectName: 'vectorly-docs',

  onBrokenLinks: 'throw',

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'sk'],
    localeConfigs: {
      en: {label: 'English'},
      sk: {label: 'Slovenčina'},
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      logo: {
        alt: 'Vectorly',
        src: 'img/logo-navy.png',
        srcDark: 'img/logo-white.png',
      },
      items: [
        {
          to: '/internal-operations/server-architecture',
          position: 'left',
          label: 'Internal Operations',
        },
        {
          to: '/study-materials/kotlin/kotlin-fundamentals/basics/what-is-kotlin',
          position: 'left',
          label: 'Study Materials',
        },
        {
          to: '/clients/mbm-group/overview',
          position: 'left',
          label: 'Clients',
        },
        {
          href: 'https://vectorly-slovakia.sk',
          label: 'vectorly-slovakia.sk',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Internal Operations', to: '/internal-operations/server-architecture'},
            {label: 'Study Materials', to: '/study-materials/kotlin/kotlin-fundamentals/basics/what-is-kotlin'},
            {label: 'Clients', to: '/clients/mbm-group/overview'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Vectorly s.r.o.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
