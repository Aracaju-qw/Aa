
import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Função auxiliar para limpar a resposta da IA antes do Parse
const safeParse = (text: string) => {
  try {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Erro no parse do JSON:", e, text);
    throw new Error("Resposta da IA em formato inválido");
  }
};

export const generateSermonOutline = async (topic: string, theme: string, reference?: string) => {
  const prompt = `
    Aja como um renomado teólogo e pregador exegético. Crie um sermão completo baseado no assunto "${topic}", tema "${theme}" e na referência "${reference || 'Sugerir uma apropriada'}".
    
    ESTRUTURA:
    1. PREPARAÇÃO (Versículos), 2. EXEGESE, 3. HERMENÊUTICA, 4. NARRAÇÃO DRAMÁTICA, 5. TEMA, 6. GANCHO, 7. QUEBRA-GELO, 8. INTRODUÇÃO, 9. CORPO (3 PONTOS), 10. CONCLUSÃO.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { thinkingConfig: { thinkingBudget: 4000 } }
  });
  return response.text;
};

export const getBibleChapter = async (book: string, chapter: string, version: string) => {
  const prompt = `Retorne o texto integral do livro ${book}, capítulo ${chapter}, na versão ${version}. 
  Retorne em JSON: book, chapter, version, verses (array de {number, text}), summary.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          book: { type: Type.STRING },
          chapter: { type: Type.STRING },
          version: { type: Type.STRING },
          verses: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: { number: { type: Type.INTEGER }, text: { type: Type.STRING } } 
            } 
          },
          summary: { type: Type.STRING }
        }
      }
    }
  });
  return safeParse(response.text);
};

export const getSpecificVerseText = async (book: string, reference: string) => {
  const prompt = `Retorne o texto bíblico exato para a passagem: ${book} ${reference}. 
  Use a versão Almeida Corrigida Fiel (ACF). 
  Retorne em JSON: { "text": "texto integral aqui", "reference": "${book} ${reference}" }.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          reference: { type: Type.STRING }
        },
        required: ["text", "reference"]
      }
    }
  });
  return safeParse(response.text);
};

export const getBiblicalDeepDive = async (reference: string) => {
  const prompt = `Realize uma imersão exegética profunda na passagem bíblica: "${reference}".
  O resultado deve ser um JSON estruturado seguindo exatamente estes 5 pontos:
  1. Contexto Introdutório (Autor, Data, Destinatários).
  2. Contexto Histórico e Geográfico (Cenário Político, Geografia).
  3. Contexto Cultural e Arqueológico (Costumes, Descobertas).
  4. Análise Literária (Gênero, Estrutura).
  5. Análise Linguística e Teológica (Palavras-chave em Grego/Hebraico, Temas Centrais, Relação com o Cânon).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reference: { type: Type.STRING },
          intro: {
            type: Type.OBJECT,
            properties: {
              author: { type: Type.STRING },
              dating: { type: Type.STRING },
              recipients: { type: Type.STRING }
            }
          },
          histGeo: {
            type: Type.OBJECT,
            properties: {
              politics: { type: Type.STRING },
              geography: { type: Type.STRING }
            }
          },
          cultArch: {
            type: Type.OBJECT,
            properties: {
              customs: { type: Type.STRING },
              archaeology: { type: Type.STRING }
            }
          },
          literary: {
            type: Type.OBJECT,
            properties: {
              genre: { type: Type.STRING },
              structure: { type: Type.STRING }
            }
          },
          lingTheo: {
            type: Type.OBJECT,
            properties: {
              keywords: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT, 
                  properties: { term: { type: Type.STRING }, lang: { type: Type.STRING }, meaning: { type: Type.STRING } } 
                } 
              },
              themes: { type: Type.STRING },
              canon: { type: Type.STRING }
            }
          }
        },
        required: ["reference", "intro", "histGeo", "cultArch", "literary", "lingTheo"]
      }
    }
  });
  return safeParse(response.text);
};

export const generateSpeech = async (text: string) => {
  const cleanText = text.replace(/<[^>]*>?/gm, '');
  const prompt = `Leia com voz inspiradora de pregador: ${cleanText.substring(0, 3000)}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Puck' },
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const getBiblicalCommentary = async (passage: string) => {
  const prompt = `Forneça um comentário exegético profundo e detalhado para a passagem bíblica: "${passage}". 
  Certifique-se de preencher todos os campos com rigor acadêmico e profundidade teológica.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          passage: { type: Type.STRING },
          analysis: { type: Type.STRING },
          historicalContext: { type: Type.STRING },
          theologicalInsights: { type: Type.STRING },
          practicalApplication: { type: Type.STRING },
          intertextuality: { type: Type.STRING },
          suggestedOutline: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["passage", "analysis", "historicalContext", "theologicalInsights", "practicalApplication", "intertextuality", "suggestedOutline"]
      }
    }
  });
  return safeParse(response.text);
};

export const getBiblicalBiography = async (character: string) => {
  const prompt = `Realize uma pesquisa biográfica profunda do personagem bíblico: "${character}". 
  Retorne informações de contexto histórico, cultural e mundial da época dele. 
  Liste também as principais passagens bíblicas (apenas Livro e Referência cap:ver).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          historicalContext: { type: Type.STRING },
          culturalContext: { type: Type.STRING },
          worldContext: { type: Type.STRING },
          references: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: { 
                book: { type: Type.STRING }, 
                reference: { type: Type.STRING } 
              } 
            } 
          },
        },
        required: ["name", "historicalContext", "culturalContext", "worldContext", "references"]
      }
    }
  });
  return safeParse(response.text);
};

export const translateBiblical = async (text: string, direction: string) => {
  const prompt = `Analise linguisticamente: "${text}" na direção ${direction}.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          translated: { type: Type.STRING },
          transliteration: { type: Type.STRING },
          morphology: { type: Type.STRING },
          lexicalRoot: { type: Type.STRING },
          meanings: { type: Type.STRING },
          exegesis: { type: Type.STRING },
          hermeneutics: { type: Type.STRING },
          biblicalExamples: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT, 
              properties: { verse: { type: Type.STRING }, context: { type: Type.STRING } } 
            } 
          },
          thematicConcordance: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["original", "translated", "morphology", "lexicalRoot"]
      }
    }
  });
  
  return safeParse(response.text);
};

export const universalSearch = async (query: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: query,
    config: { tools: [{ googleSearch: {} }] },
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const theologicalLookup = async (term: string) => {
  const prompt = `Defina exaustivamente o termo teológico: "${term}". 
  Forneça etimologia, definição clara, desenvolvimento histórico (como o conceito evoluiu), visões opostas ou debates, e a fundamentação bíblica. 
  NÃO repita o termo desnecessariamente.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING },
          etymology: { type: Type.STRING },
          definition: { type: Type.STRING },
          historicalDevelopment: { type: Type.STRING },
          opposingViews: { type: Type.STRING },
          biblicalFoundation: { type: Type.STRING },
        },
        required: ["term", "etymology", "definition", "historicalDevelopment", "opposingViews", "biblicalFoundation"]
      }
    }
  });
  return safeParse(response.text);
};

export const portugueseDictionaryLookup = async (word: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Dicionário para a palavra: ${word}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          definition: { type: Type.STRING },
          etymology: { type: Type.STRING },
          class: { type: Type.STRING },
          synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
          antonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
          examples: { type: Type.ARRAY, items: { type: Type.STRING } },
          notes: { type: Type.STRING },
        }
      }
    }
  });
  return safeParse(response.text);
};

export const getBiblicalTimeline = async (reference: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Cronologia para: ${reference}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            period: { type: Type.STRING },
            event: { type: Type.STRING },
            description: { type: Type.STRING },
            globalHistory: { type: Type.STRING },
            reference: { type: Type.STRING },
          }
        }
      }
    }
  });
  return safeParse(response.text);
};
