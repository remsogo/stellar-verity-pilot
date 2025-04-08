
/**
 * Parameter types for the application
 */

/**
 * Base parameter interface
 */
export interface Parameter {
  name: string;
  type: ParameterType;
  description?: string;
  defaultValue?: any;
}

/**
 * Supported parameter types
 */
export type ParameterType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date' | 'email' | 'url';

/**
 * Parameter value interface - represents a parameter with its value
 */
export interface ParameterValue {
  parameter: Parameter;
  value: any;
}

/**
 * Parameter group interface - for organizing parameters
 */
export interface ParameterGroup {
  id: string;
  name: string;
  description?: string;
  parameters: Parameter[];
}

/**
 * Parameter context interface - defines where parameters are used
 */
export interface ParameterContext {
  id: string;
  type: 'test_case' | 'test_suite' | 'test_plan' | 'system' | 'project';
  entityId?: string;
  parameters: ParameterValue[];
}
