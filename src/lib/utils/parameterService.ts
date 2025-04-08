
import { extractParametersFromText, highlightParameters } from './parameterUtils';
import { Parameter, ParameterType, ParameterValue } from '@/types/parameter';

/**
 * Parameter service for handling parameter operations
 */
export const parameterService = {
  /**
   * Extract parameters from text and convert them to Parameter objects
   * @param text Text to extract parameters from
   * @param defaultType Default parameter type
   * @returns Array of Parameters
   */
  extractParameters(text: string, defaultType: ParameterType = 'string'): Parameter[] {
    const paramNames = extractParametersFromText(text);
    
    return paramNames.map(name => ({
      name,
      type: defaultType,
      description: `Parameter for ${name}`,
      defaultValue: ''
    }));
  },
  
  /**
   * Validate parameter values against their types
   * @param parameterValue Parameter value to validate
   * @returns Boolean indicating if valid
   */
  validateParameterValue(parameterValue: ParameterValue): boolean {
    const { parameter, value } = parameterValue;
    
    switch (parameter.type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'date':
        return value instanceof Date && !isNaN(value.getTime());
      case 'email':
        return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'url':
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      default:
        return true;
    }
  },
  
  /**
   * Serialize parameters to JSON
   * @param parameters Array of parameters
   * @returns JSON string
   */
  serializeParameters(parameters: Parameter[]): string {
    return JSON.stringify(parameters, null, 2);
  },
  
  /**
   * Parse parameters from JSON
   * @param json JSON string
   * @returns Array of parameters
   */
  parseParameters(json: string): Parameter[] {
    if (!json || json === '[]') return [];
    
    try {
      return JSON.parse(json);
    } catch (error) {
      console.error('Error parsing parameters:', error);
      return [];
    }
  },
  
  /**
   * Replace parameters in text with their values
   * @param text Text containing parameters
   * @param parameterValues Parameter values
   * @returns Text with parameters replaced
   */
  replaceParametersInText(text: string, parameterValues: Record<string, any>): string {
    if (!text) return '';
    
    return text.replace(/\$([a-zA-Z0-9_]+)/g, (match, paramName) => {
      return parameterValues[paramName] !== undefined ? parameterValues[paramName] : match;
    });
  },
  
  /**
   * Highlight parameters in text
   * @param text Text to highlight parameters in
   * @returns React nodes with highlighted parameters
   */
  highlightParameters: highlightParameters
};
