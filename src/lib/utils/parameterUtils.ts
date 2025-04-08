
import React from 'react';

/**
 * Extracts parameters from text by finding words that start with $
 * @param text The text to extract parameters from
 * @returns Array of unique parameter names (without the $ prefix)
 */
export const extractParametersFromText = (text: string): string[] => {
  if (!text) return [];
  
  // Match words that start with $ and are followed by letters, numbers, or underscores
  const parameterRegex = /\$([a-zA-Z0-9_]+)/g;
  const matches = text.match(parameterRegex);
  
  if (!matches) return [];
  
  // Remove the $ prefix and return unique parameters
  const parameters = matches.map(match => match.substring(1));
  return [...new Set(parameters)];
};

/**
 * Highlights parameters in text by wrapping them in a span element
 * @param text The text to highlight parameters in
 * @returns The text with parameters highlighted
 */
export const highlightParameters = (text: string): React.ReactNode[] => {
  if (!text) return [];
  
  const parts = text.split(/(\$[a-zA-Z0-9_]+)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('$')) {
      return React.createElement('span', { 
        key: index, 
        className: "bg-blue-100 text-blue-800 px-1 rounded" 
      }, part);
    }
    return part;
  });
};
