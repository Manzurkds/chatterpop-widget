
import { Message } from '../components/ChatWidget/types';

export interface LLMServiceConfig {
  apiKey?: string;
  model?: string;
  apiEndpoint?: string;
}

// Default configuration
const defaultConfig: LLMServiceConfig = {
  model: 'gpt-3.5-turbo', // Default OpenAI model
  apiEndpoint: 'https://api.openai.com/v1/chat/completions',
};

// GraphQL query fragments (would normally be imported)
const articleTeaser = `fragment ArticleTeaser on PageArticle {
  sys {
    id
  }
  title
  subtitle
  slug
  readTime
  metaImage {
    url
    title
    description
  }
}`;

const asset = `fragment Asset on Asset {
  sys {
    id
  }
  title
  description
  url
  width
  height
}`;

const blockImage = `fragment BlockImage on BlockImage {
  sys {
    id
  }
  image {
    title
    description
    url
    width
    height
  }
  caption
}`;

const configNavigationItem = `fragment ConfigNavigationItem on ConfigNavigationItem {
  sys {
    id
  }
  title
  url
  openInNewTab
}`;

const downloadItem = `fragment DownloadItem on DownloadItem {
  sys {
    id
  }
  title
  file {
    url
    title
    description
  }
}`;

const hyperlink = `fragment Hyperlink on Hyperlink {
  sys {
    id
  }
  title
  url
  openInNewTab
}`;

const moduleArticleLinks = `fragment ModuleArticleLinks on ModuleArticleLinks {
  sys {
    id
  }
  title
  articlesCollection {
    items {
      ...ArticleTeaser
    }
  }
}`;

const moduleCallout = `fragment ModuleCallout on ModuleCallout {
  sys {
    id
  }
  title
  variant
  body {
    json
  }
}`;

const moduleImage = `fragment ModuleImage on ModuleImage {
  sys {
    id
  }
  variant
  image {
    ...Asset
  }
  caption
}`;

const moduleSpacerDivider = `fragment ModuleSpacerDivider on ModuleSpacerDivider {
  sys {
    id
  }
  variant
}`;

const universityBodyBlock = `fragment UniversityBodyBlock on UniversityBodyBlock {
  sys {
    id
  }
  __typename
  ... on ModuleArticleLinks {
    ...ModuleArticleLinks
  }
  ... on ModuleCallout {
    ...ModuleCallout
  }
  ... on ModuleImage {
    ...ModuleImage
  }
  ... on ModuleSpacerDivider {
    ...ModuleSpacerDivider
  }
}`;

const accessLevelCollectionField = `accessLevelCollection {
  items {
    sys {
      id
    }
  }
}`;

// Helper function to minify GraphQL queries
const gqlmin = (query: string) => {
  return query.replace(/\s+/g, ' ').trim();
};

// The main GraphQL query
const fetchPageArticleQuery = `
  ${articleTeaser}
  ${asset}
  ${blockImage}
  ${configNavigationItem}
  ${downloadItem}
  ${hyperlink}
  ${moduleArticleLinks}
  ${moduleCallout}
  ${moduleImage}
  ${moduleSpacerDivider}
  ${universityBodyBlock}

  query getArticle($slug: String!, $preview: Boolean) {
    pageArticleCollection(where: { slug: $slug }, limit: 1, preview: $preview) {
      items {
        sys {
          id
        }
        ${accessLevelCollectionField}
        businessModelCollection {
          items {
            sys {
              id
            }
          }
        }
        title
        subtitle
        slug
        parentNavigationItemsCollection(limit: 3) {
          items {
            ...ConfigNavigationItem
            linkedFrom {
              configNavigationItemCollection(limit: 1) {
                items {
                  ...ConfigNavigationItem
                  linkedFrom {
                    configNavigationItemCollection(limit: 1) {
                      items {
                        ...ConfigNavigationItem
                      }
                    }
                  }
                }
              }
            }
          }
        }
        metaImage {
          ...Asset
        }
        updated
        readTime
        relatedArticlesCollection {
          items {
            ...ArticleTeaser
          }
        }
        downloadsCollection {
          items {
            ...DownloadItem
          }
        }
        footnotesCollection {
          items {
            prefix
            body {
              json
              links {
                entries {
                  hyperlink {
                    ...Hyperlink
                  }
                }
              }
            }
          }
        }
        body {
          json
          links {
            entries {
              inline {
                sys {
                  id
                }
                __typename
                ... on BlockImage {
                  ...BlockImage
                }
              }
              hyperlink {
                ...Hyperlink
              }
              block {
                ...UniversityBodyBlock
              }
            }
          }
        }
      }
    }
  }
`;

export class LLMService {
  private config: LLMServiceConfig;

  constructor(config: LLMServiceConfig = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  async sendMessage(message: string, conversationHistory: Message[] = []): Promise<{ reply: string, zalandoData?: any, contentfulData?: any }> {
    // If no API key is provided, fall back to mock API
    if (!this.config.apiKey) {
      console.warn('No API key provided, falling back to mock API');
      return this.mockResponse(message);
    }

    try {
      // Format conversation history for OpenAI API
      const messages = [
        ...conversationHistory.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        { role: 'user', content: message }
      ];

      // Use the proxy server endpoint instead of calling the LLM API directly
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          config: this.config,
          // Pass along the GraphQL query for Contentful
          contentfulQuery: fetchPageArticleQuery
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`API Error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return { 
        reply: data.reply,
        zalandoData: data.zalandoData,
        contentfulData: data.contentfulData
      };
    } catch (error) {
      console.error('Error calling LLM API:', error);
      return { 
        reply: "I'm having trouble connecting to my brain right now. Please try again later." 
      };
    }
  }

  // Fallback to mock API if no API key is provided
  private async mockResponse(message: string): Promise<{ reply: string }> {
    const { mockChatResponse } = await import('./mockApi');
    return mockChatResponse(message);
  }
}

// Export a singleton instance with default configuration
export const defaultLLMService = new LLMService();

// Export a function to create a configured LLM service
export const createLLMService = (config: LLMServiceConfig) => {
  return new LLMService(config);
};
